// GET /api/characters: the people the player can question.
// Fields are picked one by one so a secret can never ride along with the whole object.

import { Router } from 'express';
import type { CharacterSummary } from '@mystery/shared';
import { caseData } from '../data/case';

export const charactersRouter = Router();

charactersRouter.get('/', (_req, res) => {
  const body: CharacterSummary[] = caseData.characters.flatMap((c) =>
    c.type === 'victim' ? [] : [{ id: c.id, name: c.name, role: c.role, type: c.type }],
  );
  res.json(body);
});
