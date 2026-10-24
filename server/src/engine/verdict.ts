// Grades an accusation against the case solution. Pure function: data in, verdict out.
//
// The player names a culprit and backs the accusation with three found exhibits: one for the
// motive, one for the opportunity, one for the means. Grading:
//   wrong culprit                          -> "wrong"
//   right culprit, all three exhibits fit  -> "win"
//   right culprit, anything missing        -> "partial" (and the verdict says what was missing)

import type { CaseData, Verdict } from '@mystery/shared';
import { toTwelveHourTimes } from './promptBuilder';

export interface Accusation {
  culpritId: string;
  motiveEvidenceId: string | null;
  opportunityEvidenceId: string | null;
  meansEvidenceId: string | null;
}

export function gradeAccusation(caseData: CaseData, accusation: Accusation): Verdict {
  const { solution } = caseData;
  const { grading, endings } = solution.accusation;
  const nameOf = (id: string) => caseData.characters.find((c) => c.id === id)?.name ?? id;
  const fits = (picked: string | null, accepted: string[]) =>
    picked !== null && accepted.includes(picked);

  let outcome: Verdict['outcome'];
  let headline: string;
  const missing: string[] = [];

  if (accusation.culpritId !== solution.culpritId) {
    outcome = 'wrong';
    headline = endings.wrong;
  } else {
    const hasMeans = fits(accusation.meansEvidenceId, grading.meansEvidenceIds);
    if (!fits(accusation.motiveEvidenceId, grading.motiveEvidenceIds)) missing.push('the motive');
    if (!fits(accusation.opportunityEvidenceId, grading.opportunityEvidenceIds)) {
      missing.push('the opportunity');
    }
    if (!hasMeans) missing.push('the physical link to the crime');

    outcome = missing.length ? 'partial' : 'win';
    if (outcome === 'win') headline = endings.win;
    // Only the physical evidence missing gets the case's own "would not stand up" ending.
    else if (missing.length === 1 && !hasMeans) headline = endings.partialNoMeans;
    else headline = endings.partial;
  }

  return {
    outcome,
    headline,
    accusedName: nameOf(accusation.culpritId),
    missing,
    truth: {
      culpritName: nameOf(solution.culpritId),
      finalAnswer: toTwelveHourTimes(solution.finalAnswer),
      deduction: solution.deduction.map(toTwelveHourTimes),
    },
    cleared: Object.entries(solution.cleared).map(([id, reason]) => ({
      name: nameOf(id),
      reason: toTwelveHourTimes(reason),
    })),
  };
}
