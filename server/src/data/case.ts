// The one place that loads case.json, typed. Week 3 replaces this with a database read.
import type { CaseData } from '@mystery/shared';
import caseJson from './case.json' with { type: 'json' };

export const caseData = caseJson as unknown as CaseData;

checkSceneItems(caseData);
checkSolution(caseData);

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

/** Fail at startup if the solution points at an unknown character or exhibit. */
function checkSolution(data: CaseData) {
  const { solution } = data;
  const characters = new Set(data.characters.map((c) => c.id));
  const evidence = new Set(data.evidence.map((e) => e.id));
  for (const id of [solution.culpritId, ...Object.keys(solution.cleared)]) {
    if (!characters.has(id)) throw new Error(`case.json: solution names unknown character "${id}"`);
  }
  for (const ids of Object.values(solution.accusation.grading)) {
    for (const id of ids) {
      if (!evidence.has(id)) throw new Error(`case.json: grading uses unknown evidence "${id}"`);
    }
  }
}
