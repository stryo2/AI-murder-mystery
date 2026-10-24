// The player questions a character.
//
//   POST /api/interrogate          whole reply as JSON (scripts, evals)
//   POST /api/interrogate/stream   reply streamed as it is written (the chat UI)
//   GET  /api/interrogate/history  the conversation so far, to restore the chat after a reload
//
// Both POST routes: validate -> lock the conversation -> load history -> build the character's
// system prompt -> callModel -> save the turn -> reply.

import { Router, type Request, type Response } from 'express';
import type {
  ApiError,
  ConversationMessage,
  HistoryResponse,
  InterrogateRequest,
  InterrogateResponse,
  InterrogateStreamEvent,
} from '@mystery/shared';
import { caseData } from '../data/case';
import { buildSystemPrompt } from '../engine/promptBuilder';
import { callModel, LlmError, type ChatMessage } from '../llm';
import {
  appendTurn,
  getHistory,
  getVerdict,
  MAX_MESSAGES_IN_PROMPT,
  SESSION_ID,
  tryLock,
  unlock,
} from '../sessions/sessionStore';

const MAX_QUESTION_LENGTH = 1000;

export const interrogateRouter = Router();

interrogateRouter.post('/', async (req, res) => {
  const turn = startTurn(req, res);
  if (!turn) return;
  try {
    const reply = await turn.run();
    res.json({ characterId: turn.characterId, reply } satisfies InterrogateResponse);
  } catch (err) {
    if (turn.abort.signal.aborted) return; // nobody left to answer
    const { status, error } = playerFacingError(err);
    sendError(res, status, error);
  } finally {
    turn.release();
  }
});

// Newline-delimited JSON: one InterrogateStreamEvent per line. Simpler for the client to read
// than Server-Sent Events, and works with POST (the browser's EventSource only does GET).
interrogateRouter.post('/stream', async (req, res) => {
  const turn = startTurn(req, res);
  if (!turn) return;

  res.status(200);
  res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no'); // stop proxies (e.g. nginx) holding the stream back
  res.flushHeaders();
  const send = (event: InterrogateStreamEvent) => res.write(JSON.stringify(event) + '\n');

  try {
    const reply = await turn.run((text) => send({ type: 'text', text }));
    send({ type: 'done', reply });
  } catch (err) {
    // Headers are already sent, so errors travel as an event, not an HTTP status.
    if (!turn.abort.signal.aborted) send({ type: 'error', error: playerFacingError(err).error });
  } finally {
    turn.release();
    res.end();
  }
});

interrogateRouter.get('/history', (req, res) => {
  const { sessionId, characterId } = req.query;
  if (typeof sessionId !== 'string' || !SESSION_ID.test(sessionId)) {
    return sendError(res, 400, '"sessionId" is missing or invalid');
  }
  if (typeof characterId !== 'string') {
    return sendError(res, 400, '"characterId" must be a string');
  }
  const characterError = checkCharacter(characterId);
  if (characterError) return sendError(res, characterError.status, characterError.error);

  const messages: ConversationMessage[] = getHistory(sessionId, characterId).map((m) => ({
    from: m.role === 'user' ? 'player' : 'suspect',
    text: m.content,
  }));
  res.json({ characterId, messages } satisfies HistoryResponse);
});

// ---------------------------------------------------------------------------------------------

/**
 * Validates the request and takes the conversation lock. Sends the error response itself and
 * returns null if the request can't go ahead. Otherwise the caller must call release().
 */
function startTurn(req: Request, res: Response) {
  const fail = (status: number, error: string) => {
    sendError(res, status, error);
    return null;
  };

  const parsed = parseRequest(req.body);
  if (typeof parsed === 'string') return fail(400, parsed);
  const { sessionId, characterId, question, shownEvidenceIds } = parsed;

  const characterError = checkCharacter(characterId);
  if (characterError) return fail(characterError.status, characterError.error);

  const knownEvidence = new Set(caseData.evidence.map((e) => e.id));
  const unknown = shownEvidenceIds.filter((id) => !knownEvidence.has(id));
  if (unknown.length) return fail(400, `Unknown evidence: ${unknown.join(', ')}`);

  if (getVerdict(sessionId)) return fail(409, 'The case is closed.');

  // One question at a time per suspect, or two replies could be saved in the wrong order.
  if (!tryLock(sessionId, characterId)) {
    return fail(409, 'They are still answering your last question.');
  }

  // If the player closes the tab mid-request, stop waiting on (and paying for) the model.
  // res 'close' without a finished response means the client went away.
  const abort = new AbortController();
  res.on('close', () => {
    if (!res.writableFinished) abort.abort();
  });

  return {
    characterId,
    abort,
    release: () => unlock(sessionId, characterId),
    /** Asks the model and saves the turn. Pass onText to stream. Returns the full reply. */
    async run(onText?: (text: string) => void): Promise<string> {
      const history: ChatMessage[] = getHistory(sessionId, characterId).slice(
        -MAX_MESSAGES_IN_PROMPT,
      );
      const result = await callModel({
        tag: `interrogate:${characterId}`,
        system: buildSystemPrompt(caseData, characterId, { shownEvidenceIds }),
        messages: [...history, { role: 'user', content: question }],
        temperature: 0.8,
        signal: abort.signal,
        onText,
      });
      const reply = result.text.trim();
      // Saved only after a full reply, so a failed or cancelled call leaves no half-turn.
      appendTurn(sessionId, characterId, question, reply);
      return reply;
    },
  };
}

/** Provider messages stay in the server log; the player gets something readable. */
function playerFacingError(err: unknown): { status: number; error: string } {
  console.error('[interrogate]', err);
  if (err instanceof LlmError && err.opts.status === 429) {
    return { status: 503, error: 'The suspects need a moment. Try again shortly.' };
  }
  return { status: 502, error: 'The suspect could not answer right now. Try again.' };
}

function sendError(res: Response, status: number, error: string) {
  res.status(status).json({ error } satisfies ApiError);
}

function checkCharacter(characterId: string): { status: number; error: string } | null {
  const character = caseData.characters.find((c) => c.id === characterId);
  if (!character) return { status: 404, error: `Unknown character "${characterId}"` };
  if (character.type === 'victim') {
    return { status: 400, error: `${character.name} cannot be questioned` };
  }
  return null;
}

/** Returns the cleaned request, or an error message for a 400. */
function parseRequest(body: unknown): Required<InterrogateRequest> | string {
  if (!body || typeof body !== 'object') return 'Expected a JSON body';
  const {
    sessionId,
    characterId,
    question,
    shownEvidenceIds = [],
  } = body as Record<string, unknown>;

  if (typeof sessionId !== 'string' || !SESSION_ID.test(sessionId)) {
    return '"sessionId" is missing or invalid';
  }
  if (typeof characterId !== 'string' || !characterId) return '"characterId" must be a string';
  if (typeof question !== 'string' || !question.trim()) {
    return '"question" must be a non-empty string';
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return `"question" must be at most ${MAX_QUESTION_LENGTH} characters`;
  }
  if (!Array.isArray(shownEvidenceIds) || !shownEvidenceIds.every((id) => typeof id === 'string')) {
    return '"shownEvidenceIds" must be an array of strings';
  }
  return { sessionId, characterId, question: question.trim(), shownEvidenceIds };
}
