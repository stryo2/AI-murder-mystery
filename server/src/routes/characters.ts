// GET /api/characters: the people the player can question.
// Fields are picked one by one so a secret can never ride along with the whole object.
// (reasonForTravel is left out on purpose: Samuel's mentions the letter, Maya's her plan.)

import { Router } from 'express';
import type { CharacterSummary } from '@mystery/shared';
import { caseData } from '../data/case';
import { toTwelveHourTimes } from '../engine/promptBuilder';

export const charactersRouter = Router();

charactersRouter.get('/', (_req, res) => {
  const body: CharacterSummary[] = caseData.characters.flatMap((c) =>
    c.type === 'victim'
      ? []
      : [
          {
            id: c.id,
            name: c.name,
            role: c.role,
            type: c.type,
            age: c.age,
            statement: c.initialStatement && toTwelveHourTimes(c.initialStatement),
          },
        ],
  );
  res.json(body);
});
