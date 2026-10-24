// The accusation that ends the game.
//
//   GET  /api/accusation?sessionId=   this game's verdict, or null
//   POST /api/accusation              accuse someone (once per game); returns the verdict
//
// The player may only back the accusation with exhibits they have actually found.

import { Router, type Response } from 'express';
import type { AccusationRequest, AccusationStatus, ApiError, Verdict } from '@mystery/shared';
import { caseData } from '../data/case';
import { gradeAccusation } from '../engine/verdict';
import { getSearchedItems, getVerdict, SESSION_ID, setVerdict } from '../sessions/sessionStore';

export const accusationRouter = Router();

accusationRouter.get('/', (req, res) => {
  const { sessionId } = req.query;
  if (typeof sessionId !== 'string' || !SESSION_ID.test(sessionId)) {
    return sendError(res, 400, '"sessionId" is missing or invalid');
  }
  res.json({ verdict: getVerdict(sessionId) ?? null } satisfies AccusationStatus);
});

accusationRouter.post('/', (req, res) => {
  const body = (req.body ?? {}) as Partial<Record<keyof AccusationRequest, unknown>>;
  const { sessionId, culpritId } = body;
  if (typeof sessionId !== 'string' || !SESSION_ID.test(sessionId)) {
    return sendError(res, 400, '"sessionId" is missing or invalid');
  }
  if (getVerdict(sessionId)) return sendError(res, 409, 'You have already made your accusation.');

  const culprit = caseData.characters.find((c) => c.id === culpritId);
  if (!culprit?.accusable) return sendError(res, 400, 'Choose one of the suspects to accuse.');

  const found = foundEvidence(sessionId);
  const exhibits: (string | null)[] = [];
  for (const key of ['motiveEvidenceId', 'opportunityEvidenceId', 'meansEvidenceId'] as const) {
    const id = body[key] ?? null;
    if (id !== null && (typeof id !== 'string' || !found.has(id))) {
      return sendError(res, 400, 'You can only point to evidence you have found.');
    }
    exhibits.push(id);
  }
  const [motiveEvidenceId = null, opportunityEvidenceId = null, meansEvidenceId = null] = exhibits;

  const verdict: Verdict = gradeAccusation(caseData, {
    culpritId: culprit.id,
    motiveEvidenceId,
    opportunityEvidenceId,
    meansEvidenceId,
  });
  setVerdict(sessionId, verdict);
  res.json(verdict);
});

/** Evidence ids the player has turned up by searching, in this game. */
function foundEvidence(sessionId: string): Set<string> {
  const searched = getSearchedItems(sessionId);
  return new Set(
    caseData.sceneItems.filter((i) => searched.has(i.id)).flatMap((i) => i.evidenceIds),
  );
}

function sendError(res: Response, status: number, error: string) {
  res.status(status).json({ error } satisfies ApiError);
}
