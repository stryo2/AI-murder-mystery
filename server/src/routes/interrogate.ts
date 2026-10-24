// POST /api/interrogate: the player asks one character one question.
// Validate input -> load this conversation's history -> build the character's system prompt
// -> callModel with history + question -> save the turn -> reply.
//
// GET /api/interrogate/history?sessionId=..&characterId=..: the conversation so far, so the
// page can show exactly what the suspect remembers after a reload.

import { Router } from 'express';
import type {
  ApiError,
  ConversationMessage,
  HistoryResponse,
  InterrogateRequest,
  InterrogateResponse,
} from '@mystery/shared';
import { caseData } from '../data/case';
import { buildSystemPrompt } from '../engine/promptBuilder';
import { callModel, LlmError } from '../llm';
import {
  appendTurn,
  getHistory,
  MAX_MESSAGES_IN_PROMPT,
  tryLock,
  unlock,
} from '../sessions/conversationStore';

const MAX_QUESTION_LENGTH = 1000;
const SESSION_ID = /^[A-Za-z0-9-]{8,64}$/;

export const interrogateRouter = Router();

interrogateRouter.post('/', async (req, res) => {
  const sendError = (status: number, error: string) =>
    res.status(status).json({ error } satisfies ApiError);

  const parsed = parseRequest(req.body);
  if (typeof parsed === 'string') return sendError(400, parsed);
  const { sessionId, characterId, question, shownEvidenceIds } = parsed;

  const characterError = checkCharacter(characterId);
  if (characterError) return sendError(characterError.status, characterError.error);

  const knownEvidence = new Set(caseData.evidence.map((e) => e.id));
  const unknown = shownEvidenceIds.filter((id) => !knownEvidence.has(id));
  if (unknown.length) return sendError(400, `Unknown evidence: ${unknown.join(', ')}`);

  // One question at a time per suspect, or two replies could be saved in the wrong order.
  if (!tryLock(sessionId, characterId)) {
    return sendError(409, 'They are still answering your last question.');
  }

  // If the player closes the tab mid-request, stop waiting on (and paying for) the model.
  // res 'close' without a finished response means the client went away.
  const abort = new AbortController();
  res.on('close', () => {
    if (!res.writableFinished) abort.abort();
  });

  try {
    const history = getHistory(sessionId, characterId).slice(-MAX_MESSAGES_IN_PROMPT);
    const result = await callModel({
      tag: `interrogate:${characterId}`,
      system: buildSystemPrompt(caseData, characterId, { shownEvidenceIds }),
      messages: [...history, { role: 'user', content: question }],
      temperature: 0.8,
      signal: abort.signal,
    });
    const reply = result.text.trim();
    // Saved only after a reply, so a failed or cancelled call leaves no half-turn behind.
    appendTurn(sessionId, characterId, question, reply);
    res.json({ characterId, reply } satisfies InterrogateResponse);
  } catch (err) {
    if (abort.signal.aborted) return; // nobody left to answer
    console.error('[interrogate]', err);
    // Don't pass provider messages to the player; they're in the server log.
    if (err instanceof LlmError && err.opts.status === 429) {
      return sendError(503, 'The suspects need a moment. Try again shortly.');
    }
    sendError(502, 'The suspect could not answer right now. Try again.');
  } finally {
    unlock(sessionId, characterId);
  }
});

interrogateRouter.get('/history', (req, res) => {
  const { sessionId, characterId } = req.query;
  if (typeof sessionId !== 'string' || !SESSION_ID.test(sessionId)) {
    return res.status(400).json({ error: '"sessionId" is missing or invalid' } satisfies ApiError);
  }
  if (typeof characterId !== 'string') {
    return res.status(400).json({ error: '"characterId" must be a string' } satisfies ApiError);
  }
  const characterError = checkCharacter(characterId);
  if (characterError) {
    return res
      .status(characterError.status)
      .json({ error: characterError.error } satisfies ApiError);
  }

  const messages: ConversationMessage[] = getHistory(sessionId, characterId).map((m) => ({
    from: m.role === 'user' ? 'player' : 'suspect',
    text: m.content,
  }));
  res.json({ characterId, messages } satisfies HistoryResponse);
});

function checkCharacter(characterId: string): { status: number; error: string } | null {
  const character = caseData.characters.find((c) => c.id === characterId);
  if (!character) return { status: 404, error: `Unknown character "${characterId}"` };
  if (character.type === 'victim')
    return { status: 400, error: `${character.name} cannot be questioned` };
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
