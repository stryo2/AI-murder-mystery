// Searching the train.
//
//   GET  /api/scene?sessionId=   every searchable spot, grouped by place, with what this game
//                                has already found
//   POST /api/scene/search       search one spot; returns what it turned up
//
// Evidence is only sent once its spot has been searched, and only the fields the player may
// read (never proves / doesNotProve / redHerring / revealsFactIds, which are spoilers).

import { Router, type Response } from 'express';
import type {
  ApiError,
  Evidence,
  EvidenceView,
  SceneItem,
  SceneItemView,
  SceneResponse,
  SearchResponse,
} from '@mystery/shared';
import { caseData } from '../data/case';
import { toTwelveHourTimes } from '../engine/promptBuilder';
import { getSearchedItems, markSearched, SESSION_ID } from '../sessions/sessionStore';

export const sceneRouter = Router();

sceneRouter.get('/', (req, res) => {
  const { sessionId } = req.query;
  if (typeof sessionId !== 'string' || !SESSION_ID.test(sessionId)) {
    return sendError(res, 400, '"sessionId" is missing or invalid');
  }
  const searched = getSearchedItems(sessionId);

  // Places in case order; a place with nothing to search is left out.
  const locations = caseData.locations.flatMap((place) => {
    const items = caseData.sceneItems.filter((i) => i.locationId === place.id);
    if (!items.length) return [];
    return [{ id: place.id, name: place.name, items: items.map((i) => view(i, searched)) }];
  });
  res.json({ locations } satisfies SceneResponse);
});

sceneRouter.post('/search', (req, res) => {
  const { sessionId, itemId } = (req.body ?? {}) as Record<string, unknown>;
  if (typeof sessionId !== 'string' || !SESSION_ID.test(sessionId)) {
    return sendError(res, 400, '"sessionId" is missing or invalid');
  }
  if (typeof itemId !== 'string') return sendError(res, 400, '"itemId" must be a string');
  const item = caseData.sceneItems.find((i) => i.id === itemId);
  if (!item) return sendError(res, 404, `Nothing called "${itemId}" to search`);

  markSearched(sessionId, item.id); // searching twice is harmless
  res.json(view(item, getSearchedItems(sessionId)) satisfies SearchResponse);
});

// ---------------------------------------------------------------------------------------------

const evidenceById = new Map(caseData.evidence.map((e) => [e.id, e]));

function view(item: SceneItem, searched: Set<string>): SceneItemView {
  const isSearched = searched.has(item.id);
  return {
    id: item.id,
    name: item.name,
    searched: isSearched,
    evidence: isSearched ? item.evidenceIds.map((id) => evidenceView(evidenceById.get(id)!)) : [],
  };
}

function evidenceView(e: Evidence): EvidenceView {
  return {
    id: e.id,
    name: toTwelveHourTimes(e.name),
    foundIn: toTwelveHourTimes(e.foundIn),
    contents: e.contents.map(toTwelveHourTimes),
  };
}

function sendError(res: Response, status: number, error: string) {
  res.status(status).json({ error } satisfies ApiError);
}
