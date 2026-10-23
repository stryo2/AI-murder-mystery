# AI Murder Mystery — Detailed Roadmap

**Pace:** 2–3 hours/day · **Start:** Sat, Oct 24, 2026 · **Interview-ready checkpoint:** Sun, Nov 29, 2026 · **Launch:** Sun, Dec 20, 2026

Each week has a goal, a day-by-day task list, and a **Done when** checklist. Don't move to the next week until the checklist passes. If a week slips, cut from Phase 3, never from Phase 2.

---

## Week 0 — Write the case (Oct 24–25, weekend)

**Goal:** One complete, logically airtight case on paper before any code.

**Sat, Oct 24 — The truth**
- [ ] Pick culprit, motive, method (e.g. partner poisons the owner's tea at 9:40 to stop an embezzlement exposure)
- [ ] Write the true timeline: where all 5 people (victim + 4 suspects) were every ~10 min from 9:00 to 10:00
- [ ] List locations: each cabin, dining car, corridor, vestibule, attendant's station

**Sun, Oct 25 — Secrets and clues**
- [ ] Give each suspect a secret and a reason to lie (at least 2 innocents should lie about something unrelated)
- [ ] Write 6–8 pieces of evidence; for each, note which fact it reveals and where it's found
- [ ] **Solvability check by hand:** for every innocent, which clue clears them? Does every clue stay consistent with the culprit?
- [ ] Write a short persona for each suspect: voice, temperament, how they deflect

**Done when:** a friend reads your notes and can solve it with only the evidence list.

---

## Phase 1 — Playable MVP (Weeks 1–2)

### Week 1 — One suspect talking (Oct 26 – Nov 1)

**Goal:** Chat with one suspect who stays in character.

| Day | Tasks |
|---|---|
| Mon | Repo setup: Node + TypeScript + Express, Vite + React, ESLint/Prettier, `.env`. Pick LLM provider and get an API key |
| Tue | Convert the case into `case.json` (characters, facts, events, evidence, knowledge with stance per fact) |
| Wed | LLM wrapper: one `callModel()` function with logging, timeout, retry, and model name as a parameter |
| Thu | Prompt builder: persona + that suspect's knowledge slice + stances → system prompt. `POST /interrogate` endpoint |
| Fri | Basic chat UI: message list, input box, suspect name at the top |
| Sat | Conversation history per suspect (in memory for now). Streaming replies |
| Sun | Buffer / catch-up. Play it yourself and write down every bad reply |

**Done when:**
- [ ] You can ask the partner 15 questions and he never admits guilt or forgets his alibi without pressure
- [ ] Every LLM call is logged (prompt, response, tokens, latency)

### Week 2 — Full game loop (Nov 2–8)

**Goal:** Something friends can play start to finish.

| Day | Tasks |
|---|---|
| Mon | All 4 suspects; suspect picker cards in the UI |
| Tue | Inspect: list of scene items; clicking one reveals its evidence. Track discovered evidence per session |
| Wed | Accuse screen: pick culprit + motive + evidence → win/lose with an explanation of what really happened |
| Thu | Notebook panel (player's own notes) + evidence board (discovered items) |
| Fri | Deploy: frontend on Vercel, backend on Railway/Render |
| Sat | Playtest with 3–5 friends. Watch them play if you can |
| Sun | Write `playtest-1.md`: every contradiction, leak, confusing moment, and how long each game took |

**Done when:**
- [ ] At least 3 people have finished a game
- [ ] You have a written list of real contradictions (this is your "before" evidence)

---

## Phase 2 — The real engine (Weeks 3–5) · *the resume version*

### Week 3 — World state in Postgres (Nov 9–15)

**Goal:** Truth lives in the database; the model only performs it.

| Day | Tasks |
|---|---|
| Mon | Design the Prisma schema yourself: `cases, characters, locations, events, facts, knowledge, claims, evidence, sessions, messages` |
| Tue | Migrations + seed script that loads `case.json` into Postgres |
| Wed | Rewrite the prompt builder to read from the DB; every suspect sees only their knowledge slice |
| Thu | Structured output: model returns `{ reply, claims: [{ statement, factId?, time?, location? }] }`. Validate with Zod; retry on invalid JSON |
| Fri | Claims ledger: save every claim; feed a suspect's past claims back into their prompt |
| Sat | Sessions: each playthrough gets its own claims and history, so games don't leak into each other |
| Sun | Buffer. Re-run your playtest-1 problems and see which ones are already fixed |

**Done when:**
- [ ] Restarting the server doesn't lose a game
- [ ] Every reply produces a valid, stored claims list

### Week 4 — Consistency checker + evals (Nov 16–22)

**Goal:** Catch accidental contradictions before the player sees them, and measure it.

| Day | Tasks |
|---|---|
| Mon | **Build the eval suite first:** 20–30 scripted interrogations (same question 3 ways, bluffing about fake evidence, rapid timeline questions, asking about another suspect's secret) |
| Tue | Eval runner script: replays every script, counts contradictions and leaks, prints a report. **Record the baseline (your X%)** |
| Wed | Deterministic checks: does a new claim's time/location clash with the character's past claims or the true timeline? |
| Thu | Rules: a claim that contradicts the truth is allowed only if stance = `lie`; otherwise regenerate. Allowed lies get written to the ledger as commitments |
| Fri | LLM judge for fuzzy pairs ("near the dining car" vs "in my cabin"); cheap model, yes/no + reason |
| Sat | Decide the deterministic-vs-LLM boundary; log which path caught each problem |
| Sun | Re-run evals. Write down the new numbers and what changed |

**Done when:**
- [ ] Eval runner gives contradiction rate and leak rate in one command
- [ ] Contradiction rate is measurably lower than baseline

### Week 5 — Pressure, memory, a living world (Nov 23–29)

**Goal:** Suspects crack under real evidence and act while you're not watching.

| Day | Tasks |
|---|---|
| Mon | Stress meter (0–100): rises when caught in a contradiction or shown relevant evidence; shown on the suspect card |
| Tue | Cracking: if stress > threshold **and** presented evidence disproves a claim, the character may revise, partially admit, or slip. Add "confront with evidence" to the UI |
| Wed | Memory: summarize older conversation turns; keep summary + last N messages in the prompt. Measure token savings |
| Thu | Redis + BullMQ: a simulation tick every few player actions. Each character picks an action from their goals |
| Fri | Director: resolves actions against world rules and writes new `events` (e.g. culprit hides the handkerchief, so the evidence moves) |
| Sat | Final eval run (**your Y%**). Second playtest with new friends |
| Sun | **Checkpoint:** README with architecture diagram, numbers, and a demo GIF. Update your resume bullet |

**Done when:**
- [ ] The resume bullet has real X% → Y% numbers
- [ ] The README explains "why truth lives in the DB" in under a minute of reading
- [ ] You can explain every core file without notes

---

## Phase 3 — Extras (Weeks 6–8)

### Week 6 — Generated, verified-solvable cases (Nov 30 – Dec 6)

| Day | Tasks |
|---|---|
| Mon | Handwrite case #2 using only data, no code changes (proves the engine is general) |
| Tue | Generator step 1: pick setting, cast, culprit, motive, method |
| Wed | Generator step 2: build a consistent true timeline |
| Thu | Generator step 3: derive evidence from the timeline |
| Fri | **Solver (write it yourself):** for each suspect, check whether they are consistent with all discoverable clues. Exactly one must survive; otherwise adjust the clues and retry |
| Sat | Generator step 4: LLM writes personas and descriptions from the verified structure |
| Sun | Generate 20 cases; record solvability rate before and after retries. Play 2 of them |

### Week 7 — Multiplayer (Dec 7–13)

| Day | Tasks |
|---|---|
| Mon | Socket.io setup; create/join a room by code |
| Tue | Shared world state per room; interrogations broadcast to everyone |
| Wed | Private notebook per player; room chat |
| Thu | Concurrency: queue or lock per suspect so two simultaneous questions don't corrupt history |
| Fri | Redis pub/sub so rooms work across server instances |
| Sat | Accusation vote + group win/lose |
| Sun | Multiplayer playtest with 3–4 friends |

### Week 8 — Cost, polish, launch (Dec 14–20)

| Day | Tasks |
|---|---|
| Mon | Model tiering: cheap model for the checker and background actions, strong model for confrontations |
| Tue | Prompt caching for personas; token budget per game with a graceful cutoff |
| Wed | UI polish: intro screen, case briefing, sound/visual feedback when someone cracks |
| Thu | Analytics: solve rate, session length, cost per game |
| Fri | Package for itch.io / CrazyGames; landing page with screenshots |
| Sat | Launch; post to friends and relevant communities |
| Sun | Final README update with player data. Retro: what you'd do differently |

---

## Rules for the whole project

1. **Write the core yourself:** schema, prompt builder, consistency checker, solver. Use Claude Code for UI, routes, Socket.io boilerplate, migrations, test scaffolding.
2. **Measure before you fix.** Every behaviour change gets an eval run before and after.
3. **Week 5 is the hard checkpoint.** If December gets busy, stop there; the project is already interview-ready.
4. **Keep a dev log** (one line per day). It becomes your interview stories.
