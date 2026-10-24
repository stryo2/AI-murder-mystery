// TypeScript shape of server/src/data/case.json. Only the fields code reads are strict;
// the rest are typed loosely so the JSON can grow without breaking the build.

export type Stance = 'share' | 'guarded' | 'conceal' | 'lie';

export interface CaseMeta {
  id: string;
  title: string;
  version: string;
  setting: string;
  synopsis: string;
  openingState: { time: string; positions: Record<string, string>; notes: string[] };
  [key: string]: unknown;
}

export interface Location {
  id: string;
  name: string;
  occupantId?: string;
  notes?: string;
}

export interface EscalationStep {
  level: number;
  trigger: string;
  behaviour: string;
}

export interface Character {
  id: string;
  name: string;
  age: number | null;
  type: 'victim' | 'suspect' | 'witness';
  accusable: boolean;
  role: string;
  isCulprit?: boolean;
  summary?: string;
  reasonForTravel?: string;
  persona?: { personality: string[]; speech: string | null };
  motive?: string;
  secret?: string;
  whyTheyLie?: string;
  initialStatement?: string;
  behaviour?: string[];
  /** For checks and evals only. Never put this in a prompt: the list itself names the secrets. */
  mustNotKnow?: string[];
  relationships?: Record<string, string>;
  escalationLadder?: EscalationStep[];
}

export interface Fact {
  id: string;
  kind: string;
  statement: string;
  eventId?: string;
  /** Known to the engine only; no character may ever be told it. */
  engineOnly?: boolean;
}

export interface Unlock {
  evidenceIds: string[];
  /** "any" = one of the listed items is enough. Default: all of them. */
  mode?: 'any' | 'all';
  /** A non-evidence condition, in plain English, that the model has to judge itself. */
  alsoWhen?: string;
}

export interface Knowledge {
  characterId: string;
  factId: string;
  stance: Stance;
  /** The false version, for stance "lie". */
  lie?: string;
  /** null = never unlocks. Missing = nothing to unlock (share / guarded). */
  unlock?: Unlock | null;
  /** How to behave once unlocked. */
  onReveal?: string;
  /** Extra direction on how the character uses this fact. */
  note?: string;
}

export interface Evidence {
  id: string;
  name: string;
  locationId: string;
  foundIn: string;
  contents: string[];
  revealsFactIds: string[];
  proves: string;
  doesNotProve: string;
  redHerring: boolean;
  [key: string]: unknown;
}

export interface CaseData {
  meta: CaseMeta;
  solution: Record<string, unknown>;
  locations: Location[];
  physicalRules: string[];
  characters: Character[];
  events: Record<string, unknown>[];
  facts: Fact[];
  knowledge: Knowledge[];
  evidence: Evidence[];
  rules: { global: string[]; stances: Record<Stance, string>; [key: string]: unknown };
  openQuestions: string[];
  layout: { description: string; orderFromStation: string[][] };
}
