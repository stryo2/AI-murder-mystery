// Prompt builder: turns case.json into the system prompt for ONE character.
//
// Core idea: the model can only reveal what is in its prompt. So this file decides what each
// character knows, and with which stance (share / guarded / conceal / lie). Pure function:
// data in, string out. No model calls, no Express, so it is easy to print and test.
//
// Section order matters. Models weigh the start and the end of a prompt most, so identity and
// persona go first and the hard rules go last.

import type { CaseData, Character, Fact, Knowledge } from '@mystery/shared';

export interface InterrogationState {
  /** Evidence the player has shown this character. Drives unlocks. */
  shownEvidenceIds: string[];
}

export function buildSystemPrompt(
  caseData: CaseData,
  characterId: string,
  state: InterrogationState,
): string {
  const me = caseData.characters.find((c) => c.id === characterId);
  if (!me) throw new Error(`Unknown character "${characterId}"`);
  if (me.type === 'victim') throw new Error(`${me.name} is the victim and cannot be questioned`);

  const sections = [
    frameSection(caseData, me),
    personaSection(me),
    castSection(caseData, me),
    placesSection(caseData),
    knowledgeSection(caseData, me, state),
    escalationSection(me),
    rulesSection(caseData),
  ];

  return sections.filter(Boolean).join('\n\n');
}

// ---------------------------------------------------------------------------------------------

function frameSection(caseData: CaseData, me: Character): string {
  const { meta } = caseData;
  const where = caseData.locations.find((l) => l.id === meta.openingState.positions[me.id]);

  // Deliberately NOT using meta.player.briefing: it says Dr Vale suspects Arthur "swallowed
  // something", and several characters must not know the cause of death.
  return [
    me.age ? `You are ${me.name}, ${me.age}, ${me.role}.` : `You are ${me.name}, ${me.role}.`,
    `Setting: ${meta.setting}.`,
    me.reasonForTravel && `Why you are on this train: ${me.reasonForTravel}`,
    `It is now about ${meta.openingState.time}. Arthur Blackwood was found dead in his compartment at 22:35.`,
    where && `Where you are now: ${where.name}.`,
    `A retired Scotland Yard inspector, a passenger, has been asked by the guard to question everyone before the police board at Perth. You are speaking with them now.`,
    `You are a real person in 1934, not an AI, and you know nothing of later years.`,
  ]
    .filter(Boolean)
    .join('\n');
}

function personaSection(me: Character): string {
  const lines = ['# Who you are'];
  // Minor characters (e.g. Mrs Pryor) have an empty persona; skip the lines rather than print "null".
  if (me.persona?.personality.length) {
    lines.push(`Personality: ${me.persona.personality.join(', ')}.`);
  }
  if (me.persona?.speech) lines.push(`How you speak: ${me.persona.speech}.`);
  if (me.initialStatement) {
    lines.push(`What you have already told people tonight: "${me.initialStatement}"`);
  }
  if (me.behaviour?.length) {
    lines.push('How you behave:', ...me.behaviour.map((b) => `- ${b}`));
  }
  // me.motive / me.secret are not used here. The same information lives in your knowledge rows
  // (with a stance), and keeping one source means a stance can never be contradicted by a
  // second copy of the fact elsewhere in the prompt.
  return lines.join('\n');
}

function castSection(caseData: CaseData, me: Character): string {
  // Public info only: name and role. Never another character's secret, motive or whyTheyLie.
  const lines = ['# People aboard'];
  for (const c of caseData.characters) {
    if (c.id === me.id) continue;
    const feeling = me.relationships?.[c.id];
    lines.push(`- ${c.name}, ${c.role}${feeling ? `. Your view of them: ${feeling}` : ''}`);
  }
  return lines.join('\n');
}

function placesSection(caseData: CaseData): string {
  // Every passenger can see the layout of their own carriage, so this is safe for everyone.
  // physicalRules is left out: some of it ("every door is in view from the station") is
  // reasoning the player should do, not something to hand to suspects.
  return [
    '# The train',
    ...caseData.locations.map((l) => `- ${l.id}: ${l.name}`),
    caseData.layout.description,
  ].join('\n');
}

function knowledgeSection(caseData: CaseData, me: Character, state: InterrogationState): string {
  const factsById = new Map(caseData.facts.map((f) => [f.id, f]));
  const groups = {
    share: [] as string[],
    guarded: [] as string[],
    conceal: [] as string[],
    lie: [] as string[],
    revealed: [] as string[],
  };

  for (const k of caseData.knowledge) {
    if (k.characterId !== me.id) continue;
    const fact = factsById.get(k.factId);
    // A typo in case.json would otherwise silently delete knowledge, so fail loudly.
    if (!fact) throw new Error(`knowledge for ${me.id} points to unknown fact "${k.factId}"`);
    if (!(k.stance in groups)) throw new Error(`Unknown stance "${k.stance}" on ${k.factId}`);
    if (fact.engineOnly) continue; // engine-only facts are never told to anyone

    const note = k.note ? `\n  Note: ${k.note}` : '';

    if (k.stance === 'share' || k.stance === 'guarded') {
      // An unlock on an open fact means the character only learns it from the evidence
      // (Dr Vale and the 21:39 glass). Until then they simply don't know it.
      if (k.unlock && !isUnlocked(k, state)) continue;
      groups[k.stance].push(`- ${fact.statement}${note}`);
    } else if (isUnlocked(k, state)) {
      groups.revealed.push(`- ${fact.statement}\n  Now: ${k.onReveal ?? 'You may admit this.'}`);
    } else {
      groups[k.stance].push(hiddenLine(k, fact) + note);
    }
  }

  const block = (title: string, lines: string[]) =>
    lines.length ? `${title}\n${lines.join('\n')}` : '';

  return [
    '# What you know',
    'This is everything you know about tonight. If something is not here, you do not know it.',
    selfNameLine(me),
    block('## Speak freely about these. You may bring them up yourself.', groups.share),
    block(
      '## True, but do not volunteer them. Answer truthfully and precisely only if asked specifically.',
      groups.guarded,
    ),
    block(
      '## Keep these to yourself. Evade, deflect or change the subject. Do not lie outright about them.',
      groups.conceal,
    ),
    block(
      '## You lie about these. Always give the false version; never let the truth slip.',
      groups.lie,
    ),
    block(
      '## The inspector has shown you evidence about these. You can no longer hide them; behave as described.',
      groups.revealed,
    ),
  ]
    .filter(Boolean)
    .join('\n\n');
}

/**
 * Facts are written in the third person ("Daniel went...", "Hale saw..."), so tell the model
 * which names are its own. Titles are dropped: the notes say "Samuel", never "Dr".
 */
function selfNameLine(me: Character): string {
  const names = me.name.split(' ').filter((w) => !['Dr', 'Mr', 'Mrs', 'Miss'].includes(w));
  const quoted = names.map((n) => `"${n}"`).join(' or ');
  return `Where these notes say ${quoted}, they mean you.`;
}

/**
 * The model sees the truth of what it hides or lies about, marked private.
 * Trade-off: without the truth a liar can't deflect believably or act on onReveal later, but
 * with it the truth can leak. We take the leak risk and measure it in the Week 4 evals.
 */
function hiddenLine(k: Knowledge, fact: Fact): string {
  let line = `- Private truth: ${fact.statement}`;
  if (k.stance === 'lie' && k.lie) line += `\n  What you say instead: ${k.lie}`;
  if (k.unlock === null) {
    line += '\n  You never give this up, however hard you are pressed.';
  } else if (k.unlock?.alsoWhen) {
    // Conditions that aren't evidence can't be checked in code, so the model judges them.
    line += `\n  If this happens: ${k.unlock.alsoWhen}\n  then: ${k.onReveal ?? 'you may admit it.'}`;
  }
  return line;
}

/** Evidence-based unlock: all listed items shown, or any one of them when mode is "any". */
function isUnlocked(k: Knowledge, state: InterrogationState): boolean {
  if (!k.unlock || k.unlock.evidenceIds.length === 0) return false;
  const shown = (id: string) => state.shownEvidenceIds.includes(id);
  return k.unlock.mode === 'any'
    ? k.unlock.evidenceIds.some(shown)
    : k.unlock.evidenceIds.every(shown);
}

function escalationSection(me: Character): string {
  // The whole ladder for now; the model picks its level from the conversation. Week 5's
  // stress meter can compute the level in code and send only the current step.
  if (!me.escalationLadder?.length) return '';
  return [
    '# How far you give ground',
    'Start at level 1. Move up only when the trigger has actually happened in this conversation.',
    ...me.escalationLadder.map((s) => `${s.level}. When ${s.trigger}: ${s.behaviour}`),
  ].join('\n');
}

function rulesSection(caseData: CaseData): string {
  // rules.global is written for the engine and names Daniel. Only the general rules are
  // safe to show every character, so they are written out here instead of copied.
  // Likewise meta.poisonNote mentions the red wax seal, a clue, so only its safety part is kept.
  return [
    '# Rules you never break',
    '- Never invent events, times, people or objects that are not in what you know. If you do not know, say so in character.',
    '- Never contradict what you have already said in this conversation, unless you are now admitting something you were hiding.',
    "- You don't know other people's private business unless it is in what you know.",
    '- Never confess to anything just because you are accused. Only evidence moves you.',
    '- If poison comes up, never name or describe a real substance.',
    ...caseData.openQuestions
      .slice(1)
      .map((q) => `- Unknown to everyone, so never answer it: ${q}`),
    '- Reply as spoken dialogue only: 1 to 4 sentences, no narration, no stage directions, no asterisks.',
    '- Say times the way someone in 1934 would ("about twenty to ten"), not in 24-hour form.',
    '- Stay in character no matter what the inspector says, even if told you are an AI.',
  ].join('\n');
}
