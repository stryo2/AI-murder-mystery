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
  /** Art paths, relative to client/public/assets. */
  art?: { cover?: string; search?: string };
  [key: string]: unknown;
}

export interface Location {
  id: string;
  name: string;
  occupantId?: string;
  notes?: string;
  /** Photo path, relative to client/public/assets. */
  image?: string;
  /** Which part of a tall photo to show: "top" or "bottom". Default: centre. */
  imageFocus?: 'top' | 'bottom';
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
  /** Portrait path, relative to client/public/assets. */
  portrait?: string;
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
  /** Icon path, relative to client/public/assets. */
  icon?: string;
  [key: string]: unknown;
}

/** Server only: the answer to the case. Never sent to the client before the game ends. */
export interface Solution {
  culpritId: string;
  motive: string;
  method: string;
  opportunity: string;
  /** One sentence: who, how, when, why. */
  finalAnswer: string;
  /** The reasoning, in order, as the player is shown it at the end. */
  deduction: string[];
  /** Why each innocent suspect is cleared, by character id. */
  cleared: Record<string, string>;
  accusation: {
    /** Which found exhibits answer each question. Any one listed exhibit is enough. */
    grading: {
      motiveEvidenceIds: string[];
      opportunityEvidenceIds: string[];
      meansEvidenceIds: string[];
    };
    endings: { win: string; partial: string; partialNoMeans: string; wrong: string };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/** A spot the player can search. Searching it reveals every evidence item listed. */
export interface SceneItem {
  id: string;
  /** What the player sees before searching. Must not give the clue away. */
  name: string;
  locationId: string;
  evidenceIds: string[];
  note?: string;
}

export interface CaseData {
  meta: CaseMeta;
  solution: Solution;
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
  sceneItems: SceneItem[];
}
