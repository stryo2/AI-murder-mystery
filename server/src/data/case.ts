// The one place that loads case.json, typed. Week 3 replaces this with a database read.
import type { CaseData } from '@mystery/shared';
import caseJson from './case.json' with { type: 'json' };

export const caseData = caseJson as unknown as CaseData;
