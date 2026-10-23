# The Last Stop
## AI Murder Mystery — Complete Case Design

**Version:** 1.1
**Setting:** Scotland, 17 October 1934 — aboard the *Midnight Express*
**Case type:** Closed-circle murder mystery
**Intended use:** Narrative source of truth for the `case.json` implementation

### Changes from v1.0

1. **Continuous watch on C1's door from the safe drink to the fatal drink.** The attendant is either inside C1, at his station (which looks straight down the corridor), or walking the corridor from 9:37 to 10:13. The only person who enters C1 in that window is Daniel.
2. **The safe drink is anchored by Arthur being well at 10:05.** The poison acts within minutes, so if the 9:39 drink had been poisoned, Arthur would have been visibly ill long before 10:05.
3. **Two independent witnesses place Daniel in C1:** the attendant sees him go in and come out, and Maya sees him come out.
4. **The fast onset is discoverable.** Dr Vale states it in-game.
5. **The fatal drink is bounded by evidence (10:05–10:14),** not stated as an unexplained exact time.
6. **Samuel has a real motive again.** His prescribing error was in Arthur's own treatment, and Arthur threatened to report him.
7. **Maya and Eleanor have stated motives.** Maya has a reason to be in the corridor at 9:43.
8. **Every evidence item has one fixed location.**
9. **Non-suspect characters are defined:** the attendant, Dr Vale, and Mrs Pryor.
10. **A time-tolerance rule is added** for the consistency checker.

---

## 1. Case Overview

On a wet autumn night in 1934, the *Midnight Express* is crossing the Scottish Highlands towards Edinburgh. Wealthy shipping industrialist **Arthur Blackwood**, aged 52, is found dead in his private compartment at 10:35 p.m.

The door is latched and the window is shut. Some passengers start calling it a "locked-room murder." It isn't one. The doors have spring latches that close automatically and open normally from the corridor.

At dinner, Arthur told the four people travelling with him that by the next morning "one of you will wish you had never met me." Each of the four has a reason to fear him. Only one killed him.

### The solution at a glance

- **Victim:** Arthur Blackwood
- **Murderer:** Daniel Cross, Arthur's business partner
- **Motive:** Arthur discovered Daniel's embezzlement and planned to hand the records to his solicitor the next morning.
- **Method:** Daniel poisoned Arthur's brandy flask with a fictional fast-acting poison during a visit at 9:41–9:44 p.m.
- **Opportunity:** Arthur drank safely from the flask at 9:39. From then until his fatal drink, the attendant watched C1's door continuously, and the only person who entered was Daniel.
- **Discovery:** Arthur rang his service bell at 10:14 after drinking from the flask. The attendant was called away to an emergency and found Arthur dead at 10:35.

> **Implementation note:** The poison is fictional. Its only story properties are: (a) it acts within a few minutes of being swallowed, (b) it gives off a faint medicinal smell, and (c) its vial was sealed with dark-red wax. Never model it as a real substance or give any real-world details about it.

---

## 2. Setting and Layout

### Locations

| ID | Location | Occupant / purpose | Notes |
|---|---|---|---|
| C1 | Arthur's compartment | Arthur Blackwood | Desk, leather document case, brandy flask, glass, service bell |
| C2 | Eleanor's compartment | Eleanor Blackwood | Directly opposite C1 |
| C3 | Daniel's compartment | Daniel Cross | Rear end of the corridor; his suitcase is here |
| C4 | Samuel's compartment | Dr Samuel Reed | His medical bag is here |
| C5 | Maya's compartment | Maya Bennett | Rear end of the corridor, beside C3 |
| COR | Corridor | — | One straight corridor serving C1–C5 |
| STN | Attendant's station | Thomas Hale | At the dining-car end of the corridor; holds the service log, bell panel and pantry tray |
| DIN | Dining car | Public | Beyond the attendant's station; staff and passengers corroborate presence |
| CAR-B | Carriage B | Mr and Mrs Pryor | A different carriage; where the attendant is called away at 10:14 |

### Physical rules

- **Sightline:** The corridor is straight. From the attendant's station, every compartment door (C1–C5) is in view. Anyone walking between the dining car and the compartments must pass the station.
- **Doors:** Each compartment door has a spring latch. Closing the door latches it automatically. It opens normally from the corridor with the handle. It is not an inside-only lock.
- **Window:** Arthur's window is shut and undamaged. There are no forced-entry marks anywhere.
- **No one boards or leaves the train** during the evening. The train does not stop.
- **Search authority:** The detective may search any compartment, bag or document without anyone's consent. Suspects may object in dialogue, but they cannot block a search.

---

## 3. Characters and Their Truths

The truths below are fixed. Characters may lie about them, but their lies never change what actually happened.

### 3.1 Arthur Blackwood — Victim

**Age:** 52 · **Role:** Owner of Blackwood Maritime, a shipping and freight company

**Habits** (discoverable from staff and suspects):
- Drinks brandy from his personal silver flask before bed.
- Dislikes being disturbed once he has closed his door for the night.
- Keeps important papers in a locked leather document case, with the key in his waistcoat pocket.

**What he had discovered:**
- Daniel had been diverting company funds through invoices to shell companies.
- Eleanor had privately consulted a solicitor about leaving him.

**His plans:**
- Hand the financial records and a sealed envelope to his solicitor in Edinburgh the next morning.
- Report Dr Samuel Reed's prescribing error to the medical authorities after the journey.
- Pursue a libel action against Maya Bennett's newspaper if she published anything about the company.

**Contents of the leather document case:**
1. Company financial records showing the fraudulent invoices, several authorised through Daniel's office.
2. A sealed envelope addressed to his solicitor asking for urgent review of the records.
3. A handwritten note: *"Cross — final reconciliation before solicitor. No further delay."*

This is separate from **Eleanor's letter**, a personal letter about their marriage settlement that was lying on Arthur's desk.

### 3.2 Eleanor Blackwood — Wife (Innocent)

**Age:** 46 · **Personality:** Composed, observant, proud · **Speech:** Polite, controlled, occasionally cutting

**Motive (apparent):** During dinner, Arthur privately told her he knew about her solicitor and threatened to cut her out of his will.

**Secret:** She planned to leave Arthur and had already contacted a solicitor. During her visit to C1 at 9:20–9:27 she took a personal letter about the marriage settlement from Arthur's desk.

**Why she lies:** She is ashamed and afraid that her plans make her look like the obvious suspect. She admits visiting Arthur, but initially claims she "only wanted to talk," and denies taking anything.

**What is true:**
- 9:20–9:27: in C1, argues with Arthur, takes the letter.
- 9:27 onward: in C2 for the rest of the evening.
- 9:52: receives fresh linen from the attendant at her door.
- She never touches the brandy flask.

**What she knows:**
- Arthur was alive and angry when she left.
- Arthur had been anxious about "tomorrow morning."
- She heard footsteps in the corridor at various times but did not open her door to look.

**What she does not know:** Daniel's fraud, what happened in C1 after 9:27, how Arthur died.

**Interrogation behaviour:**
- On the marriage: careful and guarded.
- On the solicitor: denies it at first; admits it if shown the letter.
- If shown the letter: admits taking it and explains why.
- She never invents a new alibi. She stays in C2 in every version of her story.

### 3.3 Daniel Cross — Business Partner (Murderer)

**Age:** 49 · **Personality:** Charming, pragmatic, confident · **Speech:** Smooth, reasonable, slightly condescending

**Motive:** He has embezzled from Blackwood Maritime for years. If the records reach Arthur's solicitor, he faces ruin and prison.

**What is true:**
- 8:55–9:05: first conversation with Arthur in C1 about "discrepancies in the accounts." Arthur says they will settle it in the morning.
- 9:05–9:30: in the dining car.
- 9:30: walks past the attendant's station to C3 to collect the poison vial from his suitcase.
- 9:30–9:41: waits in C3 until the attendant leaves C1.
- 9:41: steps from C3 into C1 on the pretext of "one last discrepancy." The attendant, setting his tray down at the station, glances up and sees him go in. Daniel believes he wasn't noticed, because a moment earlier the attendant had his back to him while walking away.
- 9:41–9:44: while Arthur is turned towards his document case, Daniel breaks the vial's wax seal and pours the poison into the flask. A fragment of the wax catches in the flask cap's thread.
- 9:44: leaves C1 and goes into C3. Both the attendant and Maya see him leave C1.
- 9:44–9:48: in C3. He puts the empty vial back in his suitcase, planning to get rid of it at the next station.
- 9:48: walks past the attendant to the dining car.
- 9:49 onward: in the dining car; witnesses confirm he is there at 10:00.

**Initial statement:** "I spoke with Arthur about the accounts around nine. After that I was in the dining car, apart from a quick trip to my compartment. I didn't go back to Arthur's."

- The first conversation is true. The trip to C3 is true; he admits it because he knows the attendant saw him pass.
- **The lie:** that he did not go back to C1.

**What he knows:** Everything he did; Arthur's brandy habit; that Eleanor argued with Arthur at dinner; that Arthur planned to see his solicitor.

**What he does not know:** That the attendant saw him enter C1; that Maya saw him leave; what is in Maya's notebook; what other suspects have told the detective.

**Interrogation behaviour (escalation ladder):**
1. Cooperative. Steers attention towards Arthur's heart condition, Eleanor's marriage and Maya's investigation.
2. Asked about the accounts: calls them "administrative errors."
3. Asked whether he returned to C1: denies it.
4. Shown the attendant's account or Maya's notebook: admits a "brief" visit about business and says he left at once.
5. Shown the flask, the wax fragment or the vial: denies touching the flask and disputes what the evidence means ("vials like that are sold everywhere").
6. Shown the vial **and** the wax match **and** the motive **and** the timeline together: his explanations stop holding up. He may stop answering or ask for a solicitor.
7. He never confesses just because he is accused. The player must make the final accusation.

### 3.4 Dr Samuel Reed — Physician (Innocent)

**Age:** 54 · **Personality:** Methodical, reserved, irritated by careless reasoning · **Speech:** Precise and factual

**Motive (apparent):** In the spring, Samuel prescribed Arthur a medicine that reacted badly with another medicine Arthur was taking. Arthur fell seriously ill and recovered. In September he worked out the cause, and on 2 October wrote to Samuel saying he would report him to the General Medical Council after the journey. Samuel stands to lose his licence.

**Secret:** The prescribing error and Arthur's threatening letter. He hides both because he knows they look like a motive.

**What is true:**
- He is travelling as a long-standing family acquaintance.
- 9:10–9:16: examines Arthur in C1 because Arthur complains of feeling unwell. Arthur is alive, coherent, and has a raised pulse consistent with anxiety. Samuel notes it.
- 9:16 onward: in C4 for the rest of the evening, writing notes.
- 9:56: receives fresh linen from the attendant at his door.
- He never touches the brandy flask.
- He does **not** examine the body; Dr Vale does.

**What he knows:** Arthur's heart condition; Arthur's state at 9:16; his own error and Arthur's letter.

**What he does not know:** The fraud, what happened in C1 after 9:16, the cause of death.

**Interrogation behaviour:**
- On Arthur's health: answers directly, and explains why a heart death might look plausible at first.
- On the prescribing error: withholds it until shown Arthur's letter, then admits it plainly.
- On poisoning: says only a proper examination can decide. He won't endorse the detective's theory without evidence.
- He never invents medical findings.

### 3.5 Maya Bennett — Journalist (Innocent)

**Age:** 32 · **Personality:** Intelligent, persistent, sceptical · **Speech:** Direct, observant, sometimes sarcastic

**Motive (apparent):** Arthur's solicitors had threatened her newspaper with a libel action that could end her career. She also wanted his papers for her story.

**Secret:** She holds a confidential document from a source inside Blackwood Maritime suggesting a senior executive was behind fraudulent payments. She has promised never to reveal the source.

**What is true:**
- 9:30–9:34: visits C1 to ask Arthur who is behind the irregularities. He refuses and orders her out.
- 9:34–9:43: in the dining car. She realises she left her notebook in C5.
- 9:43: walks past the attendant's station into the corridor to fetch the notebook.
- 9:44: sees Daniel step out of C1 and go into C3. He does not notice her.
- 9:44–9:47: in C5, collecting her notebook.
- 9:47: walks back past the attendant to the dining car. She does not go near C1.
- 9:50: in the dining car, she writes: *"9.44 — D.C. came out of A.B.'s compartment, straight into his own. Second visit tonight? Ask."*
- She never touches the brandy flask.

**What she knows:** Arthur planned to reveal something; Daniel handles the company's finances; her source's document; what she saw at 9:44.

**What she does not know:** What Daniel did inside C1, how Arthur died, the details of the embezzlement.

**Interrogation behaviour:**
- On her investigation: protects her source and gives as little as possible.
- If shown the confidential document: admits having it and refuses to name the source.
- If asked specifically about the corridor or about Daniel's movements: tells what she saw at 9:44, and separates what she saw from what she suspects.
- If accused because she was in the corridor: explains the notebook trip and points out the attendant saw her.

### 3.6 Thomas Hale — Train Attendant (Witness, not a suspect)

**Age:** 41 · **Personality:** Discreet, precise, proud of his service record · **Speech:** Formal, brief

**Behaviour rule:** He does not volunteer passengers' movements. He answers truthfully and precisely when asked about a specific time, person or place. If asked "Did anyone go into Mr Blackwood's compartment after you left?", he answers fully.

**What he did and saw:**
- 9:30: Daniel passes the station heading to C3.
- 9:36: Arthur's bell rings (logged).
- 9:37–9:40: in C1 bringing water. At about 9:39, Arthur pours a measure of brandy from his flask into his glass and drinks it. Hale takes the used glass away on his tray and leaves a clean glass upturned on the desk. He leaves C1 at 9:40.
- 9:40–9:44: at the station, sorting linen and facing the corridor. At 9:41, as he sets down his tray, he glances up and sees Daniel come out of C3 and go into C1. At 9:43 he sees Maya walk past towards C5. At 9:44 he sees Daniel come out of C1 and go into C3.
- 9:44–10:05: corridor round, trimming lamps, drawing corridor blinds, and handing linen to passengers at their doors. He stays in the corridor throughout and enters no compartment.
  - 9:47: Maya walks past him back to the dining car.
  - 9:48: Daniel walks past him to the dining car.
  - 9:52: hands Eleanor linen at C2.
  - 9:56: hands Samuel linen at C4.
  - 9:58: hangs linen bags on the door hooks of C3 and C5, both empty.
- 10:05: knocks at C1. Arthur opens the door, declines turndown and says goodnight. He looks well. Hale sees the flask capped on the desk and the clean glass still upturned. Arthur closes the door, and it latches.
- 10:05–10:13: at the station, facing the corridor. No one enters the corridor or opens a door.
- 10:13: Mrs Pryor arrives, distressed: her husband is trapped in their compartment in carriage B by a jammed door.
- 10:14: Arthur's bell rings (logged) while Hale is with Mrs Pryor. He judges a trapped elderly man more urgent and goes to carriage B, intending to come straight back.
- 10:14–10:33: in carriage B freeing the door.
- 10:35: reaches C1, gets no answer, opens the latched door and finds Arthur dead.

**Pantry tray:** The glass Arthur used at 9:39 is still on Hale's tray at the station, unwashed.

**What he does not know:** What happened inside C1 while Daniel was there; anyone's motives.

### 3.7 Dr Margaret Vale — Independent Doctor (Witness, not a suspect)

**Age:** 60 · **Role:** Physician travelling in carriage B · **Speech:** Careful, plain

She is asked to examine Arthur at 10:40. Her statements:
- Arthur's condition and the attendant's account of a sudden illness after 10:05 do not fit a simple heart attack.
- **"Whatever this was, it acted within minutes of being swallowed, not hours."**
- The glass on the desk has a faint medicinal smell, and so does the flask.
- If shown the 9:39 glass from the attendant's tray: it has no medicinal smell.
- She cannot identify the substance on a moving train. The body, flask and glass must go to the police at the next station.
- She does not name a culprit.

### 3.8 Mrs Agnes Pryor — Passenger (Witness, not a suspect)

**Age:** 72 · **Location:** Carriage B
- Confirms she fetched the attendant at about 10:13 and that he was with her and her husband until about 10:33.
- She knows nothing about Arthur or the suspects.

---

## 4. The Fixed Timeline

All times p.m. This timeline is canonical. Dialogue, evidence and simulation events must agree with it.

| Time | Event | Location | Corroboration |
|---|---|---|---|
| ~8:15 | During dinner, Arthur privately tells Eleanor he knows about her solicitor and threatens to disinherit her. | DIN | Eleanor; nearby diners noticed tension |
| 8:30 | Dinner ends. | DIN | Staff, passengers |
| 8:45 | Over coffee, Arthur says that by morning one of the four "will wish you had never met me." | DIN | All four suspects |
| 8:55–9:05 | Daniel's first conversation with Arthur about the accounts. | C1 | Daniel admits it |
| 9:05 | Arthur locks the records, solicitor's envelope and note in his document case; key goes in his waistcoat. | C1 | Case and key found later |
| 9:10–9:16 | Samuel examines Arthur. Arthur is alive and coherent. | C1 | Samuel's medical notes |
| 9:20–9:27 | Eleanor argues with Arthur and takes the marriage-settlement letter. | C1 | Letter found in Eleanor's handbag |
| 9:30 | Daniel passes the attendant's station to C3. | COR → C3 | Hale |
| 9:30–9:34 | Maya visits Arthur and is ordered out. | C1 | Maya |
| 9:34–9:43 | Maya in the dining car. | DIN | Dining-car staff |
| 9:36 | Arthur rings for water. | C1 | Bell log |
| 9:37–9:40 | Hale in C1. **At ~9:39 Arthur drinks brandy from the flask (the safe drink).** Hale takes the used glass and leaves a clean one upturned. | C1 | Hale; service log; used glass on tray |
| 9:40 | Hale leaves C1 and returns to the station. | COR → STN | Hale |
| 9:41 | Daniel goes from C3 into C1. | C1 | Hale (from the station) |
| 9:41–9:44 | **Daniel poisons the flask.** | C1 | Wax fragment; vial |
| 9:43 | Maya walks past the station into the corridor towards C5. | COR | Hale |
| 9:44 | Daniel leaves C1 and goes into C3. | COR | Hale; Maya |
| 9:44–9:47 | Maya in C5 fetching her notebook. | C5 | Hale saw her go in and come out |
| 9:44–10:05 | Hale's corridor round; he stays in the corridor. | COR | Service log |
| 9:47 | Maya walks back to the dining car, nowhere near C1. | COR → DIN | Hale |
| 9:48 | Daniel walks past Hale to the dining car. | COR → DIN | Hale |
| 9:50 | Maya writes her notebook entry about 9:44. | DIN | Notebook |
| 9:52 | Eleanor takes linen at C2's door. | C2 | Hale; service log |
| 9:56 | Samuel takes linen at C4's door. | C4 | Hale; service log |
| 9:58 | Linen bags hung on C3 and C5 (both empty). | COR | Service log |
| 10:00 | Daniel seen in the dining car. | DIN | Dining-car witnesses |
| 10:05 | Arthur, alive and well, says goodnight at his door. Flask capped; clean glass upturned. Door closes and latches. | C1 | Hale |
| 10:05–10:13 | Hale at the station watching the corridor. No one moves. | STN | Hale |
| ~10:10 | **Arthur drinks from the poisoned flask (the fatal drink).** Player can only bound it to 10:05–10:14. | C1 | Upright glass with residue; bell at 10:14; Dr Vale on onset |
| 10:13 | Mrs Pryor arrives at the station. | STN | Mrs Pryor; Hale |
| 10:14 | Arthur's bell rings. Hale goes to carriage B. | C1; STN | Bell log; Mrs Pryor |
| 10:14–10:33 | Hale frees Mr Pryor in carriage B. | CAR-B | Mr and Mrs Pryor |
| 10:15–10:25 | Arthur dies. | C1 | Dr Vale's estimate |
| 10:35 | Hale opens C1 and finds Arthur dead. | C1 | Hale |
| 10:40 | Dr Vale's examination. | C1 | Dr Vale |

### Who could reach the flask after the safe drink?

| Interval | Who was watching C1's door | Who entered C1 |
|---|---|---|
| 9:39–9:40 | Hale (inside C1, with Arthur) | — |
| 9:40–9:44 | Hale (station) | **Daniel**, 9:41–9:44 |
| 9:44–10:05 | Hale (corridor round) | No one |
| 10:05 | Hale (at C1's door) | No one; Arthur stays inside |
| 10:05–10:13 | Hale (station) | No one |
| 10:10 | — | Fatal drink |

So Daniel is the only person, other than Arthur, who was inside C1 between the safe drink and the fatal drink.

### Timeline integrity rules

1. The safe drink is at ~9:39, during Hale's 9:37–9:40 visit.
2. The safe drink is proven clean by Arthur being well at 10:05 combined with the poison's onset within minutes.
3. Daniel visits C1 twice: 8:55–9:05 (admitted) and 9:41–9:44 (denied).
4. Maya sees Daniel leave at 9:44 and writes the entry at 9:50, not on the spot.
5. Hale never enters any compartment between 9:40 and 10:35 except C1 at 10:35.
6. Samuel examines Arthur at 9:10–9:16 and does not examine the body.
7. The fatal drink is between 10:05 and 10:14. Its exact time (~10:10) is engine-only.
8. Nothing enters or leaves C1 between 10:14 and 10:35. The corridor is unwatched then, but nothing in the case happens during that time.
9. The door's spring latch is never described as an inside-only lock.

---

## 5. Evidence File

Each item has exactly one location. Evidence can be found in any order, but its facts never change.

### E1 — Samuel's Medical Notes
- **Location:** Samuel's medical bag, C4.
- **Contents:** Examination of Arthur at 9:10–9:16 p.m. Alive, coherent, raised pulse consistent with anxiety. No acute symptoms.
- **Proves:** Arthur was alive and well at 9:16; Samuel's visit was before the safe drink.
- **Does not prove:** Anything about the cause of death.

### E2 — The Brandy Flask and the Fatal Glass
- **Location:** Arthur's desk, C1.
- **Contents:**
  - The flask is about one-third empty, with a faint medicinal smell.
  - The glass is upright, with brandy residue and the same smell.
  - A small fragment of dark-red sealing wax is caught in the flask cap's thread.
- **Proves:** With Dr Vale's assessment, poisoning is likely and the poison was in the flask. The wax fragment is a physical trace of whatever was added.
- **Does not prove:** Who added it.

### E3 — The Attendant's Service Log and the 9:39 Glass
- **Location:** Attendant's station.
- **Contents:**
  - Bell log: C1 at 9:36 and 10:14.
  - Service entries: water to C1 at 9:37–9:40; corridor round at 9:44–10:05, with linen handed to C2 at 9:52 and C4 at 9:56; C1 declined turndown at 10:05; called to carriage B at 10:14.
  - The unwashed glass Arthur used at 9:39, still on the pantry tray.
- **With Hale's testimony** (when asked specifically): the safe drink at 9:39, Daniel entering C1 at 9:41 and leaving at 9:44, Maya's movements at 9:43–9:47, Arthur well at 10:05, nobody moving between 10:05 and 10:13.
- **Proves:** The flask was safe at 9:39; the access window; Daniel's second visit; Eleanor and Samuel in their compartments.

### E4 — Arthur's Document Case
- **Location:** C1. The case is locked; the key is in Arthur's waistcoat pocket.
- **Contents:** Financial records showing fraudulent invoices authorised through Daniel's office; a sealed envelope to Arthur's solicitor; the note *"Cross — final reconciliation before solicitor. No further delay."*
- **Proves:** Daniel's motive, and that Arthur planned to act the next morning.
- **Does not prove:** Murder.

### E5 — Eleanor's Letter
- **Location:** Eleanor's handbag, C2.
- **Contents:** A personal letter about the Blackwoods' marriage settlement and Eleanor's intention to leave. It is not the solicitor's envelope.
- **Proves:** Eleanor lied about taking something and had a motive.
- **Does not prove:** Anything about the flask. It is a red herring.

### E6 — Arthur's Letter to Samuel
- **Location:** Samuel's medical bag, C4, in a folder behind his notes.
- **Contents:** A letter dated 2 October 1934 from Arthur to Samuel, describing the adverse reaction in the spring and stating that Arthur will report him to the General Medical Council after the journey.
- **Proves:** Samuel had a motive and hid it.
- **Does not prove:** Any contact with the flask after 9:16. It is a red herring.

### E7 — Maya's Satchel: Notebook and Confidential Document
- **Location:** Maya's satchel, which she keeps with her in the dining car.
- **Contents:**
  - Notebook entry, dated 9:50: *"9.44 — D.C. came out of A.B.'s compartment, straight into his own. Second visit tonight? Ask."*
  - A confidential document from an unnamed company source about suspicious payments.
- **Proves:** An independent second witness to Daniel leaving C1 at 9:44.
- **Does not prove:** What Daniel did inside. The document explains her secrecy but is not murder evidence.

### E8 — The Broken-Seal Vial
- **Location:** Daniel's suitcase, C3, wrapped in a handkerchief inside a shoe.
- **Contents:** A small empty glass vial with a broken dark-red wax seal, and a faint medicinal smell.
- **Proves:** Its wax matches the fragment in the flask cap (E2). It physically links Daniel's belongings to the flask.
- **Does not prove:** On its own, that Daniel used it. It is decisive only together with E3 and E4.
- **Simulation rule:** If the player has not searched C3 by the third simulation tick after questioning Daniel about the flask, Daniel moves the vial to his coat pocket. The evidence history records the move, and the vial can still be found by searching Daniel himself. It never leaves the train and is never destroyed.

### Optional discovery: the absent container
- Searching C1 finds no vial, packet or container of any kind. This rules out Arthur poisoning himself.

---

## 6. Suspect Statements and Lies

| Suspect | Initial statement | True parts | Lie or omission | Evidence that exposes it |
|---|---|---|---|---|
| Eleanor | "We argued at dinner. I did go to his compartment, but only to talk. Then I stayed in mine." | The visit; staying in C2 | Why she went; taking the letter | E5 |
| Daniel | "I spoke with Arthur about the accounts around nine. After that I was in the dining car, apart from a quick trip to my compartment. I didn't go back to Arthur's." | First visit; trip to C3; dining car later | Denies the 9:41–9:44 visit | E3 (Hale), E7 |
| Samuel | "I examined Arthur at about ten past nine. He was alive and in no danger. Then I worked in my compartment." | All of it | Hides the prescribing error and Arthur's letter | E6 |
| Maya | "I asked Arthur about his company and he threw me out. I had nothing to do with his death." | All of it | Hides her source and document; doesn't volunteer the 9:44 sighting until asked | E7 |

---

## 7. Deduction Path

### Step 1 — The death was not natural
- Arthur was well at 10:05 (E3, Hale). The bell rang at 10:14 (E3).
- Dr Vale: not a simple heart attack; it acted within minutes; the glass and flask smell medicinal (E2).
- **Conclusion:** Probable poisoning through the flask.

### Step 2 — When was the flask poisoned?
- Arthur drank from the flask at 9:39 (E3, Hale).
- He was well at 10:05. The poison acts within minutes, so the 9:39 drink was clean. The 9:39 glass also has no smell (E3 plus Dr Vale).
- The fatal glass was upright with residue at 10:35, but was clean and upturned at 10:05 (E2, E3). So the fatal drink happened between 10:05 and 10:14.
- **Conclusion:** The flask was poisoned between 9:39 and about 10:14.

### Step 3 — Who could reach the flask in that window?
- Hale watched C1's door continuously from 9:39 to 10:13 (E3).
- The only person to enter was Daniel, at 9:41–9:44 (Hale). Maya independently saw him leave (E7).
- Eleanor was at C2's door at 9:52 and Samuel at C4's door at 9:56; neither went near C1 (E3).
- Maya's only trip into the corridor was 9:43–9:47, to C5 and back, watched by Hale.
- No container was found in C1, so Arthur did not poison himself.
- **Conclusion:** Only Daniel had access.

### Step 4 — Daniel lied about it
- He denies returning to C1. Two witnesses contradict him.
- **Conclusion:** He lied about the one event that matters.

### Step 5 — Motive
- Arthur's document case (E4): fraud through Daniel's office, solicitor the next morning.
- **Conclusion:** Daniel had a concrete reason to stop Arthur before morning.

### Step 6 — Physical link
- The wax fragment in the flask cap (E2) matches the broken seal on the vial in Daniel's suitcase (E8).
- **Conclusion:** Physical corroboration of everything above.

### Step 7 — Clear the red herrings
- **Eleanor:** Real motive (E5), but her visit was before the safe drink and she was in C2 throughout the window.
- **Samuel:** Real motive (E6), but his visit was before the safe drink and he was in C4 throughout the window.
- **Maya:** Real motive and secrets (E7), but her visit was before the safe drink, and her one corridor trip was watched and never reached C1.

**Final answer:** Daniel Cross poisoned Arthur Blackwood's brandy flask during his 9:41–9:44 visit to stop Arthur exposing his embezzlement.

---

## 8. Solvability Check

| Suspect | Motive | Visit to C1 | In C1 after the safe drink? | Cleared by | Verdict |
|---|---|---|---|---|---|
| Eleanor | Disinheritance; leaving Arthur | 9:20–9:27 | No | E3: safe drink at 9:39; linen at 9:52; continuous watch | Innocent |
| Daniel | Embezzlement exposure | 8:55–9:05 and 9:41–9:44 | **Yes** | Nothing clears him; E2, E3, E4, E7 and E8 all point to him | **Murderer** |
| Samuel | Licence threat | 9:10–9:16 | No | E1 and E3: safe drink at 9:39; linen at 9:56; continuous watch | Innocent |
| Maya | Libel threat; her story | 9:30–9:34 | No | E3: safe drink at 9:39; watched trip at 9:43–9:47 | Innocent |

### Minimum proof for a winning accusation

The player must name:
1. **Culprit:** Daniel Cross.
2. **Motive:** Preventing exposure of his embezzlement (E4).
3. **Method:** Poisoning the brandy flask.
4. **Opportunity:** The 9:41–9:44 visit, after the safe drink (E3 and/or E7).
5. **Evidence:** At least E3 (the safe drink and the watch) and E8 (the vial matching the wax in E2).

An accusation naming Daniel but missing the motive, the method or the opportunity is a **partial solve**. The game shows what was missing and does not count it as a full win.

### Consistency conditions (verify before `case.json`)

1. Exactly one culprit: Daniel Cross.
2. Every event has a fixed time or a bounded interval.
3. The safe drink (~9:39) is before Daniel's entry (9:41).
4. C1's door is watched without a gap from 9:39 to 10:13.
5. Daniel is the only entry to C1 in that window.
6. Arthur is seen well at 10:05.
7. The poison's onset ("within minutes") is stated by Dr Vale and is consistent everywhere.
8. Maya's notebook entry is written at 9:50 about 9:44.
9. Samuel does not examine the body.
10. The solicitor's envelope (E4) and Eleanor's letter (E5) are separate documents.
11. Every evidence item has exactly one location.
12. Every innocent has a motive and a lie, and each lie concerns something other than the murder.

---

## 9. Rules for the AI Mystery Engine

### Global
- The timeline and evidence here are canonical. No character may invent an event that changes them.
- A character may lie only where their stance on a fact is `lie`. They may be vague or evasive about anything they `conceal`.
- No character knows another character's private information unless the case says they witnessed it.
- Daniel never confesses on accusation alone (see his escalation ladder).
- Innocent suspects become more forthcoming once their own secret has been exposed.

### Time tolerance (consistency checker)
- A statement using "around," "about" or "roughly" with a time matches the truth within **±10 minutes**. (Daniel's "around nine" for 8:55 is true.)
- A statement giving an exact time ("at 9:41") matches within **±2 minutes**.
- A statement about order ("before," "after") must match the true order exactly.

### Knowledge boundaries

| Character | Knows | Must not know |
|---|---|---|
| Eleanor | Her visit, the letter, the dinner threat, footsteps she heard | Daniel's 9:41 visit; the fraud; the cause of death |
| Daniel | Everything he did; Arthur's habits; the solicitor plan | That Hale saw him enter; that Maya saw him leave; the notebook |
| Samuel | His exam, Arthur's health, his error and Arthur's letter | The fraud; events in C1 after 9:16 |
| Maya | Her visit, her source, the 9:44 sighting | What happened inside C1; the cause of death |
| Hale | Everything in his section | What happened inside C1 during Daniel's visit; any motives |
| Dr Vale | Her examination findings | The identity of the poison; the culprit |
| Mrs Pryor | The 10:13–10:33 incident | Everything about the Blackwood party |

### Evidence state
- Discovering evidence unlocks new questions. It never changes history.
- If the vial is moved (E8 simulation rule), record the move with its time. The vial stays findable.
- The game distinguishes **suspicion**, **corroboration** and **proof**. No single clue ends the case.

---

## 10. Final Summary

Arthur Blackwood is poisoned aboard the *Midnight Express* on 17 October 1934. Eleanor hides her plan to leave him, Samuel hides a prescribing error Arthur was about to report, and Maya hides a confidential source. Each has a motive, and each lies, but none of them is inside C1 after Arthur's safe drink at 9:39.

Daniel Cross, facing exposure for embezzlement, slips into C1 at 9:41 while the attendant is walking away, poisons the flask and leaves at 9:44. The attendant saw him go in, and Maya saw him come out. The attendant watched the door continuously until Arthur's fatal drink after 10:05. The wax fragment in the flask cap matches the vial in Daniel's suitcase.

**Canonical answer: Daniel Cross killed Arthur Blackwood to prevent the exposure of his embezzlement.**
