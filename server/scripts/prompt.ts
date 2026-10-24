// Print a character's system prompt, and optionally ask them one question.
//
//   npm run prompt -w server -- daniel                     print Daniel's prompt
//   npm run prompt -w server -- daniel E3,E7               ...after being shown E3 and E7
//   npm run prompt -w server -- daniel - "Did you go back?" ask a question (no evidence shown)
//   npm run prompt -w server -- --leaks                    leak check for every character

import type { CaseData } from '@mystery/shared';
import caseJson from '../src/data/case.json' with { type: 'json' };
import { buildSystemPrompt } from '../src/engine/promptBuilder';
import { callModel } from '../src/llm';

const caseData = caseJson as unknown as CaseData;
const [characterId = 'daniel', evidenceArg = '-', question] = process.argv.slice(2);

if (characterId === '--leaks') {
  // A fact's statement may only appear in the prompt of a character with a knowledge row for it.
  let problems = 0;
  for (const c of caseData.characters) {
    if (c.type === 'victim') continue;
    const known = new Set(
      caseData.knowledge.filter((k) => k.characterId === c.id).map((k) => k.factId),
    );
    const prompt = buildSystemPrompt(caseData, c.id, {
      shownEvidenceIds: caseData.evidence.map((e) => e.id), // worst case: everything unlocked
    });
    for (const f of caseData.facts) {
      if (!known.has(f.id) && prompt.includes(f.statement)) {
        console.log(`LEAK  ${c.id} sees ${f.id}`);
        problems++;
      }
    }
    console.log(`${c.id.padEnd(8)} ${known.size} facts, ~${Math.round(prompt.length / 4)} tokens`);
  }
  console.log(problems ? `\n${problems} leak(s)` : '\nNo leaks.');
  process.exit(problems ? 1 : 0);
}

const shownEvidenceIds = evidenceArg === '-' ? [] : evidenceArg.split(',');
const system = buildSystemPrompt(caseData, characterId, { shownEvidenceIds });

if (!question) {
  console.log(system);
  console.log(`\n--- ~${Math.round(system.length / 4)} tokens`);
} else {
  const res = await callModel({
    tag: `prompt:${characterId}`,
    system,
    messages: [{ role: 'user', content: question }],
    temperature: 0.8,
  });
  console.log(`\n${characterId}: ${res.text}`);
}
