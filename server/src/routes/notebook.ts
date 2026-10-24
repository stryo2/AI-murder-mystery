// The player's notebook: free text, one per game.
//
//   GET /api/notebook?sessionId=   the notes so far
//   PUT /api/notebook              replace them (the client saves as the player types)

import { Router, type Response } from 'express';
import type { ApiError, NotebookResponse } from '@mystery/shared';
import { getNotes, SESSION_ID, setNotes } from '../sessions/sessionStore';

/** Plenty for a game's notes, small enough that a flood can't exhaust memory. */
export const MAX_NOTES_LENGTH = 20_000;

export const notebookRouter = Router();

notebookRouter.get('/', (req, res) => {
  const { sessionId } = req.query;
  if (typeof sessionId !== 'string' || !SESSION_ID.test(sessionId)) {
    return sendError(res, 400, '"sessionId" is missing or invalid');
  }
  res.json({ text: getNotes(sessionId) } satisfies NotebookResponse);
});

notebookRouter.put('/', (req, res) => {
  const { sessionId, text } = (req.body ?? {}) as Record<string, unknown>;
  if (typeof sessionId !== 'string' || !SESSION_ID.test(sessionId)) {
    return sendError(res, 400, '"sessionId" is missing or invalid');
  }
  if (typeof text !== 'string') return sendError(res, 400, '"text" must be a string');
  if (text.length > MAX_NOTES_LENGTH) {
    return sendError(res, 400, `Notes can be at most ${MAX_NOTES_LENGTH} characters`);
  }
  setNotes(sessionId, text);
  res.json({ text } satisfies NotebookResponse);
});

function sendError(res: Response, status: number, error: string) {
  res.status(status).json({ error } satisfies ApiError);
}
