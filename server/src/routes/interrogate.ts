// POST /api/interrogate: the player asks one character one question.
// Validate input -> build that character's system prompt -> callModel -> reply.
// No conversation history yet (roadmap: Week 1 Saturday), so each question stands alone.

import { Router } from 'express';
import type { ApiError, InterrogateRequest, InterrogateResponse } from '@mystery/shared';
import { caseData } from '../data/case';
import { buildSystemPrompt } from '../engine/promptBuilder';
import { callModel, LlmError } from '../llm';

const MAX_QUESTION_LENGTH = 1000;

export const interrogateRouter = Router();

interrogateRouter.post('/', async (req, res) => {
  const sendError = (status: number, error: string) =>
    res.status(status).json({ error } satisfies ApiError);

  const parsed = parseRequest(req.body);
  if (typeof parsed === 'string') return sendError(400, parsed);
  const { characterId, question, shownEvidenceIds } = parsed;

  const character = caseData.characters.find((c) => c.id === characterId);
  if (!character) return sendError(404, `Unknown character "${characterId}"`);
  if (character.type === 'victim') return sendError(400, `${character.name} cannot be questioned`);

  const knownEvidence = new Set(caseData.evidence.map((e) => e.id));
  const unknown = shownEvidenceIds.filter((id) => !knownEvidence.has(id));
  if (unknown.length) return sendError(400, `Unknown evidence: ${unknown.join(', ')}`);

  // If the player closes the tab mid-request, stop waiting on (and paying for) the model.
  // res 'close' without a finished response means the client went away.
  const abort = new AbortController();
  res.on('close', () => {
    if (!res.writableFinished) abort.abort();
  });

  try {
    const result = await callModel({
      tag: `interrogate:${characterId}`,
      system: buildSystemPrompt(caseData, characterId, { shownEvidenceIds }),
      messages: [{ role: 'user', content: question }],
      temperature: 0.8,
      signal: abort.signal,
    });
    res.json({ characterId, reply: result.text.trim() } satisfies InterrogateResponse);
  } catch (err) {
    if (abort.signal.aborted) return; // nobody left to answer
    console.error('[interrogate]', err);
    // Don't pass provider messages to the player; they're in the server log.
    if (err instanceof LlmError && err.opts.status === 429) {
      return sendError(503, 'The suspects need a moment. Try again shortly.');
    }
    sendError(502, 'The suspect could not answer right now. Try again.');
  }
});

/** Returns the cleaned request, or an error message for a 400. */
function parseRequest(body: unknown): Required<InterrogateRequest> | string {
  if (!body || typeof body !== 'object') return 'Expected a JSON body';
  const { characterId, question, shownEvidenceIds = [] } = body as Record<string, unknown>;

  if (typeof characterId !== 'string' || !characterId) return '"characterId" must be a string';
  if (typeof question !== 'string' || !question.trim())
    return '"question" must be a non-empty string';
  if (question.length > MAX_QUESTION_LENGTH) {
    return `"question" must be at most ${MAX_QUESTION_LENGTH} characters`;
  }
  if (!Array.isArray(shownEvidenceIds) || !shownEvidenceIds.every((id) => typeof id === 'string')) {
    return '"shownEvidenceIds" must be an array of strings';
  }
  return { characterId, question: question.trim(), shownEvidenceIds };
}
