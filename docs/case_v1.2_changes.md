# The Last Stop — v1.2 Change List

**Applies to:** `the_last_stop_case_v1.1.md`
**Status:** Proposed. Each change has a default decision; override any you disagree with before applying.

Changes are ordered by severity. **A** = fixes a solvability hole, **B** = fills data the character models need, **C** = framing and small fixes.

---

## A. Solvability fixes

### A1. Prove Arthur was already poisoned by 10:14

**Problem:** The corridor is unwatched from 10:14 to 10:35. Nothing proves the fatal drink came before 10:14, so a player can argue that Eleanor or Samuel poisoned the flask at 10:15. Dr Vale's death window (10:15–10:25) fits that theory.

**Change:** Add three independent signs that Arthur was in distress at 10:14.

1. **Bell log (E3):** The 10:14 entry reads *"C1 — rang repeatedly."* The C1 indicator buzzed three or four times in quick succession, not once.
2. **Mrs Pryor:** She was standing at the station at 10:14 and says *"The little panel kept buzzing and buzzing, but I'm afraid I insisted he come with me."*
3. **Eleanor (new concealment):** At about 10:14 she heard a cry and a heavy thud from C1. After their argument she assumed he was in a temper, and she chose not to go. She is ashamed of this and hides it at first.
   - Stance: `conceal`.
   - Admits it if shown the bell log entry "rang repeatedly", or if asked directly whether she heard anything from C1 after 10:00 (on the second asking, or if pressed).
   - Once she admits it, she is visibly shaken and more forthcoming.
4. **Body position (E2 / Hale at 10:35):** Arthur is on the floor beside the bell push, and the glass is upright on the desk.

**Deduction update (Step 2):** The repeated bell, Mrs Pryor, Eleanor's thud and Dr Vale's "within minutes" all put the fatal drink in **10:05–10:14**. Anything after 10:14 is irrelevant, because Arthur was already dying.

**New consistency condition:** *Arthur is in visible distress by 10:14, shown by at least two independent sources.*

---

### A2. Clear Hale and decide whether he can be accused

**Problem:** Hale's testimony clears everyone, but nothing clears Hale. He was alone with Arthur and the flask at 9:37–9:40 and alone in the corridor from 9:44 to 10:05.

**Decision (default):** Hale **cannot be named** on the accusation screen; the four suspects are the only choices. In dialogue he can still be questioned about his own movements. The case gives the player enough to dismiss him:

- **No motive:** Hale has worked for the railway for 14 years and had never met Arthur before tonight. Nothing in any evidence connects them.
- **His round is corroborated:** Eleanor (9:52) and Samuel (9:56) each saw him in the corridor with the linen trolley. Maya saw him at the station at 9:43 and 9:47. Daniel passed him at 9:48.
- **Arthur was awake and present** for Hale's entire 9:37–9:40 visit, and was well at 10:05.
- **No link to the poison:** The vial (E8) is in Daniel's suitcase, and its wax matches the flask cap (E2).

**Add to Section 8:** a row for Hale marked "Witness, not accusable", listing the clearance above.

---

### A3. Close the 9:40–9:41 watch gap

**Problem:** Daniel gets into C1 because Hale's back is turned. That same moment would let Eleanor cross from C2, which breaks condition #4 ("watched without a gap").

**Change:** Fix the corridor layout and make the latch audible.

- **Layout, from the station end:** C1 and C2 face each other closest to the station, about three paces away. C4 is in the middle. C3 and C5 face each other at the rear end. (This replaces the vaguer layout in Section 2.)
- **Physical rule (new):** Every spring latch gives a loud metallic click when a door opens or closes. Hale's ear is trained to it.
- **Hale's account (revised):** *"From Mr Blackwood's door to my station is three paces. I had my back to the corridor for perhaps two seconds. No door clicked behind me. The first click I heard was C3's, and that's why I looked up. I saw Mr Cross walk up the corridor and go into C1."*
- **Daniel's belief stays the same:** he saw Hale's back walking away and assumed he wasn't seen.

---

### A4. Fix Maya seeing Daniel without being noticed

**Problem:** Under the new layout, C5 is at the rear facing C3. If Maya were standing in the corridor at 9:44, Daniel would be walking straight towards her, so "he does not notice her" fails.

**Change:** At 9:43 Maya goes into C5 and pushes the door to without latching it, because she means to be quick. At 9:44, through the gap, she sees Daniel come out of C1 and walk down to C3. He sees only a door ajar, not her.
- Hale's account is unchanged: "9:43 Maya goes into C5."

---

### A5. Hale's full log before 9:37

**Problem:** Hale says nothing before 9:30, and he doesn't log Maya's 9:30 visit at all. Yet everyone going between the dining car and the compartments must pass him.

**Change:** Hale serves coffee in the dining car from 8:30 to 8:48. He is **at the station from 8:48 to 9:37** and sees:

| Time | Hale sees |
|---|---|
| 8:50 | Arthur, Eleanor and Samuel pass to C1, C2 and C4 |
| 8:55 | Daniel passes and goes into C1 |
| 9:05 | Daniel comes out of C1 and passes back to the dining car |
| 9:08 | Arthur steps out of C1 and knocks at C4 (asking Samuel to look at him) |
| 9:10 | Samuel goes into C1 with his bag |
| 9:16 | Samuel comes out of C1 and returns to C4 |
| 9:20 | Eleanor crosses from C2 into C1 |
| 9:20–9:27 | Raised voices from C1, a woman's and Mr Blackwood's |
| 9:27 | Eleanor comes out of C1 and goes straight into C2 |
| 9:30 | Daniel passes the station and goes into C3 |
| 9:31 | Maya passes the station and goes into C1 |
| 9:34 | Maya comes out of C1 and passes back to the dining car, "looking furious" |
| 9:36 | C1 bell |

**Knock-on changes:**
- Maya's visit becomes **9:31–9:34** (was 9:30–9:34).
- **Maya's knowledge (new):** At 9:31 she saw Daniel's back as he went into C3. At about 8:50 she overheard Daniel say in the dining car that he would "see Arthur about the accounts." That is why her note says *"Second visit tonight?"*
- **Daniel's knowledge (new):** From C3 he heard a woman's voice in C1 at about 9:31 and guessed it was Maya. He can use this to deflect suspicion onto her.
- **Samuel's trigger is now explained:** Arthur came to his door at 9:08.

---

## B. Data the character models need

### B1. Complete timeline for every character, 8:30–10:50

Add a per-character table so no model has to improvise where it was. All other times stay as in v1.1. New or changed rows only:

| Character | Time | Where / what |
|---|---|---|
| Arthur | 8:50 | DIN → C1 |
| Arthur | 9:08 | Knocks at C4, returns to C1 |
| Eleanor | 8:50–9:20 | C2, alone (unverified, and nothing depends on it) |
| Eleanor | ~10:14 | Hears a cry and a thud from C1; does not go (A1) |
| Eleanor | 10:35 | Opens her door at Hale's call |
| Samuel | 8:50–9:08 | C4, writing notes |
| Samuel | 10:35 | Comes to his door at Hale's call; offers to help; Hale refuses (see B4) |
| Maya | 8:30–9:31 | DIN, writing (steward confirms) |
| Maya | 9:47–10:45 | DIN |
| Daniel | 9:49–10:45 | DIN (steward confirms; he orders a whisky at ~9:50) |
| Hale | 8:30–8:48 | DIN, serving coffee |
| Hale | 10:35–10:40 | Finds Arthur; keeps C1 shut; sends for Dr Vale |
| All | 10:50 | Game starts (see C1) |

### B2. Why everyone is on this train

Section 1 says "the four people travelling with him." Replace this with:

- **Purpose of the trip:** Arthur is going to Edinburgh for a Blackwood Maritime board meeting and to see his solicitor, Mr Ross, the next morning.
- **Eleanor:** Travels as his wife, as she always does.
- **Daniel:** Is attending the board meeting. He has been Arthur's partner for 11 years.
- **Samuel:** Arthur invited him personally, saying they would "discuss the matter of my letter on the way." Samuel came hoping to talk Arthur out of reporting him. This becomes part of Samuel's secret.
- **Maya:** She is **not** in Arthur's party. She booked C5 on purpose to corner him. At coffee she sat down at his table uninvited, which is why she heard the 8:45 threat.

### B3. Relationships matrix

Add one line per pair so each model has a fixed opinion of the others:

| | Eleanor | Daniel | Samuel | Maya |
|---|---|---|---|---|
| **Eleanor →** | — | Polite; thinks he flatters Arthur | Trusts him; old family friend | Contempt: "that newspaper woman" |
| **Daniel →** | Courteous; privately thinks she's unhappy and useful as a suspect | — | Cordial, distant | Wary; knows she's digging into the company |
| **Samuel →** | Fond of her, protective | Finds him slippery | — | Indifferent; dislikes the press |
| **Maya →** | Curious about her | Her prime suspect for the fraud (she never says why) | Thinks he's hiding something | — |

### B4. Why Samuel doesn't examine the body

**Change:** At 10:35 Samuel comes to his door and offers to examine Arthur. Hale refuses: railway rules say a doctor outside the party must be called, and he has just met Dr Vale during the carriage B incident. Samuel is offended, which gives him something to grumble about in dialogue. Rule 6 of the timeline integrity rules now has a stated reason.

### B5. Dining-car steward (new witness)

**Fergus Lamont, dining-car steward (witness, not a suspect).** Formal, observant, slow to gossip.
- Confirms Maya in DIN at 8:30–9:31, 9:34–9:43 and 9:47 onward.
- Confirms Daniel in DIN at 9:05–9:30 and 9:49 onward. At about 9:50 Daniel ordered a whisky and "seemed in very good spirits."
- At about 8:50 he overheard Daniel tell Maya, "If you'll excuse me, I must see Arthur about the accounts."
- Knows nothing about what happened in the corridor.

**Mr Pryor** stays a background character and cannot be questioned. His wife speaks for both of them.

### B6. Daniel's cover details

- **"One last discrepancy":** A double-billed Leith dock-fee invoice, which Daniel calls "a clerk's error, I wanted Arthur to see the correction before the board." The invoice is real, and it is one of the fraudulent ones in E4.
- **Why he kept the vial:** C3's window latch is stiff and won't open; the service log notes *"C3 window latch stiff — reported 8:40"* (added to E3). From 9:44 to 10:05 Hale is in the corridor, so Daniel can't reach a corridor window or the vestibule without passing him. He decides carrying it is riskier than leaving it hidden, and plans to drop it in Edinburgh.

### B7. Eleanor's letter (E5) — who wrote it

**Change:** E5 is a letter **from Eleanor's solicitor, Mr Graham of Edinburgh, to Eleanor.** It sets out settlement terms if she leaves Arthur. That afternoon Arthur found it in her luggage and kept it, which is how he knew about the solicitor at dinner. At 9:20 she took it back from his desk.

---

## C. Framing and small fixes

### C1. The detective and the opening state

- **Who the player is:** A retired Scotland Yard inspector travelling in carriage B. After the death, the train guard asks them to look into it before the police take over.
- **Time pressure:** Police will board at Perth, around 12:30 a.m. **Default for v1: no hard timer.** The arrival is only flavour; a timer can come later.
- **Opening state at 10:50:**
  - The four suspects are told to stay in their own compartments.
  - Hale watches the corridor from the station.
  - Dr Vale and Mrs Pryor are in carriage B.
  - The steward is in DIN.
  - C1 is shut and untouched apart from Dr Vale's examination.
- **Opening briefing (what the player is told):** Arthur Blackwood was found dead in C1 at 10:35, and Dr Vale suspects he swallowed something. The four people in his corridor are named. The player may question anyone and search anything.
- **E7 location:** "On Maya's person: the satchel she carries" (was "with her in the dining car").

### C2. Arthur's glass habit

Add to Arthur's habits: **He always pours brandy into a glass and never drinks from the flask's neck.** Hale, Eleanor and Daniel all know this. Without it, the clean upturned glass at 10:05 proves nothing.

### C3. Dr Vale's wording

Replace *"the attendant's account of a sudden illness after 10:05"* with **"a man seen well at 10:05 and dead by 10:35."**

### C4. Winning without the vial

**Rule:** A full win requires E8. E8 is never destroyed and can always be found (in C3, or on Daniel's coat after the simulation rule fires).
- Naming Daniel with the right motive and opportunity but without E8 counts as a **partial solve**. The ending text is: *"You have the right man, but the case would not stand up in court."*

### C5. Update the summary tables

Apply the changes above to these sections:
- **Section 4 timeline:** Add Hale's 8:48–9:37 sightings, Maya at 9:31, the repeated bell, Eleanor's thud and 10:35–10:50.
- **Section 5 evidence:** E3 gets the repeated-bell entry and the C3 window note. E5 gets its authorship. E7 gets its new location.
- **Section 6 statements:** Eleanor's row adds her 10:14 concealment.
- **Section 7 deduction:** Step 2 adds the 10:14 distress proof. Step 3 adds the latch rule.
- **Section 8 solvability:** Add a row for Hale.
- **Section 9 knowledge boundaries:** Add rows for the steward and the new knowledge for Maya, Daniel and Eleanor.
- **Version header:** Add a "Changes from v1.1" list.

---

## New consistency conditions to add

13. Arthur is in visible distress by 10:14, shown by at least two independent sources.
14. Every door opening or closing in the corridor between 9:39 and 10:13 is either seen or heard by Hale.
15. Every passage past the station between 8:48 and 10:13 appears in Hale's account.
16. Daniel never sees Maya between 9:43 and 9:47.
17. Hale cannot be accused, and nothing in the case gives him a motive.
