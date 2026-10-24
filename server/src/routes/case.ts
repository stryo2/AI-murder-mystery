// GET /api/case: the briefing the player reads before the investigation starts.
// Fields are picked one by one, like the characters route: nothing from the solution, facts or
// knowledge may reach the client.

import { Router } from 'express';
import type { CaseBriefing } from '@mystery/shared';
import { assetUrl } from '../data/assets';
import { caseData } from '../data/case';
import { toTwelveHourTimes } from '../engine/promptBuilder';

interface PlayerMeta {
  role: string;
  briefing: string;
}

export const caseRouter = Router();

caseRouter.get('/', (_req, res) => {
  const { meta } = caseData;
  const player = meta.player as PlayerMeta;
  const body: CaseBriefing = {
    title: meta.title,
    setting: meta.setting,
    // Already written in 12-hour time; converting again gives "10:35 a.m. p.m.".
    synopsis: meta.synopsis,
    playerRole: player.role,
    briefing: toTwelveHourTimes(player.briefing),
    coverImage: assetUrl(meta.art?.cover),
  };
  res.json(body);
});
