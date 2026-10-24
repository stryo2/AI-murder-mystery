// The one place that loads case.json, typed. Week 3 replaces this with a database read.
import type { CaseData } from '@mystery/shared';
import caseJson from './case.json' with { type: 'json' };

export const caseData = caseJson as unknown as CaseData;

checkSceneItems(caseData);

/** Fail at startup, not mid-game, if a scene item points at something that doesn't exist. */
function checkSceneItems(data: CaseData) {
  const places = new Set(data.locations.map((l) => l.id));
  const evidence = new Set(data.evidence.map((e) => e.id));
  const ids = new Set<string>();
  for (const item of data.sceneItems) {
    if (ids.has(item.id)) throw new Error(`case.json: duplicate scene item "${item.id}"`);
    ids.add(item.id);
    if (!places.has(item.locationId)) {
      throw new Error(
        `case.json: scene item "${item.id}" is in unknown place "${item.locationId}"`,
      );
    }
    for (const id of item.evidenceIds) {
      if (!evidence.has(id)) {
        throw new Error(`case.json: scene item "${item.id}" holds unknown evidence "${id}"`);
      }
    }
  }
}
