# The Last Stop

## AI Murder Mystery — Complete Case Design

**Version:** 1.2
**Setting:** Scotland, 17 October 1934 — aboard the _Midnight Express_
**Case type:** Closed-circle murder mystery
**Intended use:** Narrative source of truth for `server/src/data/case.json`

### Changes from v1.1

1. **Arthur is proven to be dying by 10:14.** The bell log marks the 10:14 ring as "rang repeatedly", Mrs Pryor saw the panel buzzing, Eleanor heard a cry and a thud, and the body lies beside the bell push. The unwatched 10:14–10:35 window no longer matters.
2. **Hale is cleared and cannot be accused.** He has no motive, his round is corroborated, and nothing links him to the poison.
3. **The 9:40 watch gap is closed.** The corridor layout is fixed (C1 and C2 three paces from the station), and every spring latch clicks loudly. Hale heard only C3's latch.
4. **Maya watches Daniel through her unlatched C5 door,** so Daniel never sees her.
5. **Hale's full log from 8:48 to 9:37** covers every passage past the station. Maya's visit moves to 9:31–9:34.
6. **Complete timelines** for every character from 8:30 to 10:50.
7. **Why everyone is on the train,** and a relationships matrix. Maya is not in Arthur's party.
8. **Samuel doesn't examine the body because Hale refuses him.**
9. **New witness:** Fergus Lamont, the dining-car steward.
10. **Daniel's cover story** (a Leith dock-fee invoice) and **why he kept the vial** (stiff window latch; Hale in the corridor).
11. **Eleanor's letter (E5)** is from her solicitor, Mr Graham.
12. **The detective, the opening state and the briefing** are defined.
13. **Arthur always pours into a glass;** Dr Vale's wording is fixed; winning requires E8.
14. **Consistency conditions 13–17** are added.

---

## 1. Case Overview

On a wet autumn night in 1934, the _Midnight Express_ is crossing the Scottish Highlands towards Edinburgh. Wealthy shipping industrialist **Arthur Blackwood**, aged 52, is found dead in his private compartment at 10:35 p.m.

The door is latched and the window is shut. Some passengers start calling it a "locked-room murder." It isn't one. The doors have spring latches that close automatically and open normally from the corridor.

Over coffee, Arthur told the four people at his table that by the next morning "one of you will wish you had never met me." Each of the four has a reason to fear him. Only one killed him.

### The solution at a glance

- **Victim:** Arthur Blackwood
- **Murderer:** Daniel Cross, Arthur's business partner
- **Motive:** Arthur discovered Daniel's embezzlement and planned to hand the records to his solicitor, Mr Ross, the next morning.
- **Method:** Daniel poisoned Arthur's brandy flask with a fictional fast-acting poison during a visit at 9:41–9:44 p.m.
- **Opportunity:** Arthur drank safely from the flask at 9:39. From then until his fatal drink, the attendant watched C1's door continuously, and the only person who entered was Daniel.
- **Discovery:** At 10:14 Arthur, already dying, rang his service bell repeatedly and collapsed. The attendant had been called away to an emergency and found Arthur dead at 10:35.

> **Implementation note:** The poison is fictional. Its only story properties are: (a) it acts within a few minutes of being swallowed, (b) it gives off a faint medicinal smell, and (c) its vial was sealed with dark-red wax. Never model it as a real substance or give any real-world details about it.

---

## 2. Setting and Layout

### Locations

| ID    | Location              | Occupant / purpose | Notes                                                                                         |
| ----- | --------------------- | ------------------ | --------------------------------------------------------------------------------------------- |
| C1    | Arthur's compartment  | Arthur Blackwood   | Desk, leather document case, brandy flask, glass, service bell. Three paces from the station  |
| C2    | Eleanor's compartment | Eleanor Blackwood  | Directly opposite C1, closest to the station                                                  |
| C3    | Daniel's compartment  | Daniel Cross       | Rear end, facing C5. His suitcase is here. The window latch is stiff and will not open        |
| C4    | Samuel's compartment  | Dr Samuel Reed     | Middle of the corridor. His medical bag is here                                               |
| C5    | Maya's compartment    | Maya Bennett       | Rear end, facing C3                                                                           |
| COR   | Corridor              | —                  | One straight corridor serving C1–C5                                                           |
| STN   | Attendant's station   | Thomas Hale        | At the dining-car end of the corridor; holds the service log, bell panel and pantry tray      |
| DIN   | Dining car            | Public             | Beyond the attendant's station; the steward and passengers corroborate presence               |
| CAR-B | Carriage B            | Mr and Mrs Pryor   | A different carriage; where the attendant is called away at 10:14. Dr Vale also travels here |

### Corridor layout, from the station end

```
DIN ─ STN ─┬─ C1 │ C2 ─┬─ C4 ─┬─ C3 │ C5
           (3 paces)   (middle) (rear end)
```

C1 and C2 face each other closest to the station, about three paces away. C4 is in the middle. C3 and C5 face each other at the rear end.

### Physical rules

- **Sightline:** The corridor is straight. From the attendant's station, every compartment door (C1–C5) is in view. Anyone walking between the dining car and the compartments must pass the station.
- **Doors:** Each compartment door has a spring latch. Closing the door latches it automatically. It opens normally from the corridor with the handle. It is not an inside-only lock.
- **Latches:** Every spring latch gives a loud metallic click when a door opens or closes. Hale's ear is trained to it.
- **Window:** Arthur's window is shut and undamaged. There are no forced-entry marks anywhere.
- **No one boards or leaves the train** during the evening. The train does not stop.
- **Search authority:** The detective may search any compartment, bag or document without anyone's consent. Suspects may object in dialogue, but they cannot block a search.

---

## 3. Characters and Their Truths

The truths below are fixed. Characters may lie about them, but their lies never change what actually happened.

### 3.1 Arthur Blackwood — Victim

**Age:** 52 · **Role:** Owner of Blackwood Maritime, a shipping and freight company

**Why he is travelling:** To Edinburgh for a Blackwood Maritime board meeting, and to see his solicitor, Mr Ross, the next morning.

**Habits** (discoverable from staff and suspects):

- Drinks brandy from his personal silver flask before bed.
- **Always pours the brandy into a glass and never drinks from the flask's neck.** Hale, Eleanor and Daniel all know this.
- Dislikes being disturbed once he has closed his door for the night.
- Keeps important papers in a locked leather document case, with the key in his waistcoat pocket.

**What he had discovered:**

- Daniel had been diverting company funds through invoices to shell companies.
- Eleanor had privately consulted a solicitor about leaving him. That afternoon he found her solicitor's letter in her luggage and kept it.

**His plans:**

- Hand the financial records and a sealed envelope to his solicitor, Mr Ross, in Edinburgh the next morning.
- Report Dr Samuel Reed's prescribing error to the medical authorities after the journey.
- Pursue a libel action against Maya Bennett's newspaper if she published anything about the company.

**Contents of the leather document case:**

1. Company financial records showing the fraudulent invoices, several authorised through Daniel's office. One is a double-billed Leith dock-fee invoice.
2. A sealed envelope addressed to his solicitor asking for urgent review of the records.
3. A handwritten note: _"Cross — final reconciliation before solicitor. No further delay."_

This is separate from **Eleanor's letter**, the letter from her solicitor that Arthur had taken from her luggage and left on his desk.

### 3.2 Eleanor Blackwood — Wife (Innocent)

**Age:** 46 · **Personality:** Composed, observant, proud · **Speech:** Polite, controlled, occasionally cutting

**Why she is travelling:** As his wife, as she always does.

**Motive (apparent):** During dinner, Arthur privately told her he knew about her solicitor and threatened to cut her out of his will.

**Secrets:**

1. She planned to leave Arthur and had already contacted a solicitor. During her visit to C1 at 9:20–9:27 she took back the letter from her solicitor that Arthur had taken from her luggage.
2. At about 10:14 she heard a cry and a heavy thud from C1. After their argument she assumed he was in a temper, and she chose not to go. She is ashamed of this.

**Why she lies:** She is ashamed and afraid that her plans make her look like the obvious suspect. She admits visiting Arthur, but initially claims she "only wanted to talk," and denies taking anything.

**What is true:**

- 8:50: walks from the dining car to C2.
- 8:50–9:20: alone in C2. This is unverified, and nothing depends on it.
- 9:20–9:27: in C1, argues with Arthur, takes back the letter.
- 9:27 onward: in C2 for the rest of the evening.
- 9:52: receives fresh linen from the attendant at her door.
- ~10:14: hears a cry and a heavy thud from C1, and does not go.
- ~10:35: opens her door at Hale's call.
- She never touches the brandy flask.

**What she knows:**

- Arthur was alive and angry when she left at 9:27.
- Arthur had been anxious about "tomorrow morning."
- She heard footsteps in the corridor at various times but did not open her door to look.
- The cry and thud at about 10:14.

**What she does not know:** Daniel's fraud, what happened in C1 after 9:27, how Arthur died.

**Interrogation behaviour:**

- On the marriage: careful and guarded.
- On the solicitor: denies it at first; admits it if shown the letter.
- If shown the letter: admits taking it back and explains why.
- On what she heard after 10:00: hides the cry and thud at first. Admits it if shown the bell log entry "rang repeatedly" (E3), or if asked directly whether she heard anything from C1 after 10:00, on the second asking or when pressed. Once she admits it she is visibly shaken and more forthcoming.
- She never invents a new alibi. She stays in C2 in every version of her story.

### 3.3 Daniel Cross — Business Partner (Murderer)

**Age:** 49 · **Personality:** Charming, pragmatic, confident · **Speech:** Smooth, reasonable, slightly condescending

**Why he is travelling:** To attend the board meeting. He has been Arthur's partner for 11 years.

**Motive:** He has embezzled from Blackwood Maritime for years. If the records reach Arthur's solicitor, he faces ruin and prison.

**What is true:**

- ~8:50: in the dining car, tells Maya, _"If you'll excuse me, I must see Arthur about the accounts."_ The steward overhears.
- 8:55–9:05: first conversation with Arthur in C1 about "discrepancies in the accounts." Arthur says they will settle it in the morning. Hale sees him go in and come back out.
- 9:05–9:30: in the dining car.
- 9:30: walks past the attendant's station to C3 to collect the poison vial from his suitcase.
- 9:30–9:41: waits in C3 until the attendant leaves C1. At about 9:31 he hears a woman's voice in C1 and guesses it is Maya.
- 9:41: steps out of C3, walks up the corridor and goes into C1 on the pretext of "one last discrepancy." Hale, setting his tray down at the station, hears C3's latch click, glances up and sees him go in. Daniel believes he wasn't noticed, because a moment earlier the attendant had his back to him while walking away.
- 9:41–9:44: while Arthur is turned towards his document case, Daniel breaks the vial's wax seal and pours the poison into the flask. A fragment of the wax catches in the flask cap's thread.
- 9:44: leaves C1 and walks down to C3. Hale sees him, and Maya watches through the gap of her unlatched C5 door. Daniel sees only a door ajar, not her.
- 9:44–9:48: in C3. He puts the empty vial back in his suitcase, wrapped in a handkerchief inside a shoe. C3's window latch is stiff and won't open, and Hale is in the corridor, so he can't reach a corridor window or the vestibule without passing him. Carrying the vial seems riskier than leaving it hidden, and he plans to drop it in Edinburgh.
- 9:48: walks past the attendant to the dining car.
- 9:49–10:45: in the dining car. At about 9:50 he orders a whisky and seems "in very good spirits." Witnesses confirm he is there at 10:00.
- ~10:45: returns to C3 when the suspects are told to stay in their compartments.

**Initial statement:** "I spoke with Arthur about the accounts around nine. After that I was in the dining car, apart from a quick trip to my compartment. I didn't go back to Arthur's."

- The first conversation is true. The trip to C3 is true; he admits it because he knows the attendant saw him pass.
- **The lie:** that he did not go back to C1.

**Cover story (once the visit is admitted):** The "one last discrepancy" was a double-billed Leith dock-fee invoice: _"a clerk's error, I wanted Arthur to see the correction before the board."_ The invoice is real, and it is one of the fraudulent ones in E4.

**What he knows:** Everything he did; Arthur's brandy habit; that Eleanor argued with Arthur at dinner; that Arthur planned to see his solicitor; that he heard a woman's voice in C1 at about 9:31, which he uses to deflect suspicion onto Maya; that his window latch is stiff.

**What he does not know:** That the attendant saw him enter C1; that Maya saw him go into C3 at 9:31 or leave C1 at 9:44; what is in Maya's notebook; what other suspects have told the detective.

**Interrogation behaviour (escalation ladder):**

1. Cooperative. Steers attention towards Arthur's heart condition, Eleanor's marriage and Maya's investigation.
2. Asked about the accounts: calls them "administrative errors."
3. Asked whether he returned to C1: denies it.
4. Shown the attendant's account or Maya's notebook: admits a "brief" visit about business, gives the Leith invoice story and says he left at once.
5. Shown the flask, the wax fragment or the vial: denies touching the flask and disputes what the evidence means ("vials like that are sold everywhere").
6. Shown the vial **and** the wax match **and** the motive **and** the timeline together: his explanations stop holding up. He may stop answering or ask for a solicitor.
7. He never confesses just because he is accused. The player must make the final accusation.

### 3.4 Dr Samuel Reed — Physician (Innocent)

**Age:** 54 · **Personality:** Methodical, reserved, irritated by careless reasoning · **Speech:** Precise and factual

**Why he is travelling:** Arthur invited him personally, saying they would "discuss the matter of my letter on the way." Samuel came hoping to talk Arthur out of reporting him. This is part of his secret.

**Motive (apparent):** In the spring, Samuel prescribed Arthur a medicine that reacted badly with another medicine Arthur was taking. Arthur fell seriously ill and recovered. In September he worked out the cause, and on 2 October wrote to Samuel saying he would report him to the General Medical Council after the journey. Samuel stands to lose his licence.

**Secret:** The prescribing error, Arthur's threatening letter, and the real reason he accepted the invitation. He hides them because he knows they look like a motive.

**What is true:**

- He is travelling as a long-standing family acquaintance.
- 8:50: walks from the dining car to C4.
- 8:50–9:08: in C4, writing notes.
- 9:08: Arthur knocks at C4 and asks him to look at him.
- 9:10–9:16: examines Arthur in C1 because Arthur complains of feeling unwell. Arthur is alive, coherent, and has a raised pulse consistent with anxiety. Samuel notes it.
- 9:16 onward: in C4 for the rest of the evening, writing notes.
- 9:56: receives fresh linen from the attendant at his door.
- ~10:35: comes to his door and offers to examine Arthur. Hale refuses, because railway rules say a doctor outside the party must be called, and he has just met Dr Vale during the carriage B incident. Samuel is offended.
- He never touches the brandy flask.
- He does **not** examine the body; Dr Vale does.

**What he knows:** Arthur's heart condition; Arthur's state at 9:16; his own error, Arthur's letter and the invitation.

**What he does not know:** The fraud, what happened in C1 after 9:16, the cause of death.

**Interrogation behaviour:**

- On Arthur's health: answers directly, and explains why a heart death might look plausible at first.
- On the prescribing error: withholds it until shown Arthur's letter, then admits it plainly.
- On poisoning: says only a proper examination can decide. He won't endorse the detective's theory without evidence.
- On being refused at 10:35: still offended, and says so.
- He never invents medical findings.

### 3.5 Maya Bennett — Journalist (Innocent)

**Age:** 32 · **Personality:** Intelligent, persistent, sceptical · **Speech:** Direct, observant, sometimes sarcastic

**Why she is travelling:** She is **not** in Arthur's party. She booked C5 on purpose to corner him. At coffee she sat down at his table uninvited, which is why she heard the 8:45 threat.

**Motive (apparent):** Arthur's solicitors had threatened her newspaper with a libel action that could end her career. She also wanted his papers for her story.

**Secret:** She holds a confidential document from a source inside Blackwood Maritime suggesting a senior executive was behind fraudulent payments. She has promised never to reveal the source.

**What is true:**

- 8:30–9:31: in the dining car, writing (the steward confirms).
- ~8:50: hears Daniel say he must "see Arthur about the accounts."
- 9:31: walks past the attendant's station to C1. On the way she sees Daniel's back as he goes into C3.
- 9:31–9:34: in C1, asks Arthur who is behind the irregularities. He refuses and orders her out.
- 9:34–9:43: in the dining car. She realises she left her notebook in C5.
- 9:43: walks past the attendant's station into the corridor, goes into C5, and pushes the door to without latching it, because she means to be quick.
- 9:44: through the gap, sees Daniel come out of C1 and walk down to C3. He does not see her.
- 9:44–9:47: in C5, collecting her notebook.
- 9:47: walks back past the attendant to the dining car. She does not go near C1. She saw Hale at the station both times she passed.
- 9:50: in the dining car, she writes: _"9.44 — D.C. came out of A.B.'s compartment, straight into his own. Second visit tonight? Ask."_ ("Second visit" because she heard him at 8:50.)
- 9:47–10:45: in the dining car.
- She never touches the brandy flask.

**What she knows:** Arthur planned to reveal something; Daniel handles the company's finances; her source's document; Daniel's 8:50 remark; Daniel going into C3 at 9:31; what she saw at 9:44.

**What she does not know:** What Daniel did inside C1, how Arthur died, the details of the embezzlement.

**Interrogation behaviour:**

- On her investigation: protects her source and gives as little as possible.
- If shown the confidential document: admits having it and refuses to name the source.
- If asked specifically about the corridor or about Daniel's movements: tells what she saw at 9:31 and 9:44, and separates what she saw from what she suspects.
- If accused because she was in the corridor: explains the notebook trip and points out the attendant saw her.

### 3.6 Thomas Hale — Train Attendant (Witness, not accusable)

**Age:** 41 · **Personality:** Discreet, precise, proud of his service record · **Speech:** Formal, brief

**Background:** Has worked for the railway for 14 years. He had never met Arthur before tonight.

**Behaviour rule:** He does not volunteer passengers' movements. He answers truthfully and precisely when asked about a specific time, person or place. If asked "Did anyone go into Mr Blackwood's compartment after you left?", he answers fully.

**What he did and saw:**

- 8:30–8:48: serving coffee in the dining car.
- 8:48–9:37: at the station, facing the corridor. He sees:

| Time      | Hale sees                                                                       |
| --------- | ------------------------------------------------------------------------------- |
| 8:50      | Arthur, Eleanor and Samuel pass to C1, C2 and C4                                |
| 8:55      | Daniel passes and goes into C1                                                  |
| 9:05      | Daniel comes out of C1 and passes back to the dining car                        |
| 9:08      | Arthur steps out of C1 and knocks at C4                                         |
| 9:10      | Samuel goes into C1 with his bag                                                |
| 9:16      | Samuel comes out of C1 and returns to C4                                        |
| 9:20      | Eleanor crosses from C2 into C1                                                 |
| 9:20–9:27 | Raised voices from C1, a woman's and Mr Blackwood's                             |
| 9:27      | Eleanor comes out of C1 and goes straight into C2                               |
| 9:30      | Daniel passes the station and goes into C3                                      |
| 9:31      | Maya passes the station and goes into C1                                        |
| 9:34      | Maya comes out of C1 and passes back to the dining car, "looking furious"       |
| 9:36      | C1 bell (logged)                                                                |

- 9:37–9:40: in C1 bringing water. At about 9:39, Arthur pours a measure of brandy from his flask into his glass and drinks it. Hale takes the used glass away on his tray and leaves a clean glass upturned on the desk.
- 9:40: walks the three paces back to the station. _"I had my back to the corridor for perhaps two seconds. No door clicked behind me. The first click I heard was C3's, and that's why I looked up."_
- 9:40–9:44: at the station, sorting linen and facing the corridor. At 9:41 he sees Daniel walk up the corridor and go into C1. At 9:43 he sees Maya walk past towards C5. At 9:44 he sees Daniel come out of C1 and go into C3.
- 9:44–10:05: corridor round, trimming lamps, drawing corridor blinds, and handing linen to passengers at their doors. He stays in the corridor throughout and enters no compartment.
  - 9:47: Maya walks past him back to the dining car.
  - 9:48: Daniel walks past him to the dining car.
  - 9:52: hands Eleanor linen at C2.
  - 9:56: hands Samuel linen at C4.
  - 9:58: hangs linen bags on the door hooks of C3 and C5, both empty.
- 10:05: knocks at C1. Arthur opens the door, declines turndown and says goodnight. He looks well. Hale sees the flask capped on the desk and the clean glass still upturned. Arthur closes the door, and it latches.
- 10:05–10:13: at the station, facing the corridor. No one enters the corridor or opens a door.
- 10:13: Mrs Pryor arrives, distressed: her husband is trapped in their compartment in carriage B by a jammed door.
- 10:14: Arthur's bell **rings repeatedly** (logged) while Hale is with Mrs Pryor. He judges a trapped elderly man more urgent and goes to carriage B, intending to come straight back.
- 10:14–10:33: in carriage B freeing the door. Dr Vale comes out during the commotion.
- 10:35: reaches C1, gets no answer, opens the latched door and finds Arthur dead on the floor beside the bell push. The glass is upright on the desk.
- 10:35–10:40: keeps C1 shut, refuses Samuel's offer to examine Arthur, and sends for Dr Vale.

**Pantry tray:** The glass Arthur used at 9:39 is still on Hale's tray at the station, unwashed.

**Service log note:** _"C3 window latch stiff — reported 8:40."_

**What he does not know:** What happened inside C1 while Daniel was there; anyone's motives.

### 3.7 Dr Margaret Vale — Independent Doctor (Witness, not accusable)

**Age:** 60 · **Role:** Physician travelling in carriage B · **Speech:** Careful, plain

She met Hale during the carriage B incident and is asked to examine Arthur at 10:40. Her statements:

- Arthur's condition does not fit a simple heart attack in **a man seen well at 10:05 and dead by 10:35.**
- **"Whatever this was, it acted within minutes of being swallowed, not hours."**
- The glass on the desk has a faint medicinal smell, and so does the flask.
- If shown the 9:39 glass from the attendant's tray: it has no medicinal smell.
- She cannot identify the substance on a moving train. The body, flask and glass must go to the police at the next station.
- She does not name a culprit.

### 3.8 Mrs Agnes Pryor — Passenger (Witness, not accusable)

**Age:** 72 · **Location:** Carriage B

- Confirms she fetched the attendant at about 10:13 and that he was with her and her husband until about 10:33.
- She was standing at the station at 10:14: _"The little panel kept buzzing and buzzing, but I'm afraid I insisted he come with me."_
- She knows nothing about Arthur or the suspects.
- She speaks for both of them. **Mr Pryor** is a background character and cannot be questioned.

### 3.9 Fergus Lamont — Dining-Car Steward (Witness, not accusable)

**Personality:** Formal, observant, slow to gossip

- Confirms Maya in the dining car at 8:30–9:31, 9:34–9:43 and 9:47 onward.
- Confirms Daniel in the dining car at 9:05–9:30 and 9:49 onward. At about 9:50 Daniel ordered a whisky and "seemed in very good spirits."
- At about 8:50 he overheard Daniel tell Maya, "If you'll excuse me, I must see Arthur about the accounts."
- Knows nothing about what happened in the corridor.

### 3.10 Relationships

|               | Eleanor                                                       | Daniel                                                 | Samuel                          | Maya                                         |
| ------------- | ------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------- | -------------------------------------------- |
| **Eleanor →** | —                                                             | Polite; thinks he flatters Arthur                      | Trusts him; old family friend   | Contempt: "that newspaper woman"             |
| **Daniel →**  | Courteous; privately thinks she's unhappy and useful as a suspect | —                                                  | Cordial, distant                | Wary; knows she's digging into the company   |
| **Samuel →**  | Fond of her, protective                                       | Finds him slippery                                     | —                               | Indifferent; dislikes the press              |
| **Maya →**    | Curious about her                                             | Her prime suspect for the fraud (she never says why)   | Thinks he's hiding something    | —                                            |

---

## 4. The Fixed Timeline

All times p.m. This timeline is canonical. Dialogue, evidence and simulation events must agree with it.

| Time        | Event                                                                                                                                       | Location   | Corroboration                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------- |
| ~8:15       | During dinner, Arthur privately tells Eleanor he knows about her solicitor and threatens to disinherit her.                                | DIN        | Eleanor; nearby diners noticed tension              |
| 8:30        | Dinner ends.                                                                                                                                | DIN        | Staff, passengers                                   |
| 8:30–8:48   | Hale serves coffee.                                                                                                                         | DIN        | Lamont                                              |
| 8:30–9:31   | Maya in the dining car, writing.                                                                                                            | DIN        | Lamont                                              |
| 8:45        | Over coffee, Arthur says that by morning one of the four "will wish you had never met me." Maya has joined his table uninvited.            | DIN        | All four suspects                                   |
| 8:48–9:37   | Hale at the station, facing the corridor.                                                                                                   | STN        | Hale                                                |
| 8:50        | Arthur, Eleanor and Samuel pass the station to C1, C2 and C4.                                                                               | COR        | Hale                                                |
| ~8:50       | Daniel tells Maya he must "see Arthur about the accounts."                                                                                  | DIN        | Lamont; Maya                                        |
| 8:50–9:20   | Eleanor alone in C2.                                                                                                                        | C2         | Unverified                                          |
| 8:50–9:08   | Samuel in C4, writing notes.                                                                                                                | C4         | Samuel                                              |
| 8:55–9:05   | Daniel's first conversation with Arthur about the accounts.                                                                                 | C1         | Daniel admits it; Hale                              |
| 9:05        | Arthur locks the records, solicitor's envelope and note in his document case; key goes in his waistcoat.                                   | C1         | Case and key found later                            |
| 9:05–9:30   | Daniel in the dining car.                                                                                                                   | DIN        | Lamont                                              |
| 9:08        | Arthur knocks at C4 and asks Samuel to look at him.                                                                                         | COR        | Hale; Samuel                                        |
| 9:10–9:16   | Samuel examines Arthur. Arthur is alive and coherent.                                                                                       | C1         | Samuel's medical notes; Hale                        |
| 9:20–9:27   | Eleanor argues with Arthur and takes back her solicitor's letter.                                                                          | C1         | Letter in Eleanor's handbag; Hale heard voices      |
| 9:30        | Daniel passes the attendant's station to C3.                                                                                                | COR → C3   | Hale                                                |
| 9:30–9:41   | Daniel waits in C3; hears a woman's voice in C1 at about 9:31.                                                                              | C3         | —                                                   |
| 9:31–9:34   | Maya visits Arthur and is ordered out. On the way in she sees Daniel's back going into C3.                                                  | C1         | Maya; Hale                                          |
| 9:34–9:43   | Maya in the dining car.                                                                                                                     | DIN        | Lamont                                              |
| 9:36        | Arthur rings for water.                                                                                                                     | C1         | Bell log                                            |
| 9:37–9:40   | Hale in C1. **At ~9:39 Arthur pours brandy from the flask into his glass and drinks it (the safe drink).** Hale takes the used glass and leaves a clean one upturned. | C1 | Hale; service log; used glass on tray |
| 9:40        | Hale walks three paces back to the station; no door clicks behind him.                                                                     | COR → STN  | Hale                                                |
| 9:41        | Daniel walks from C3 up the corridor into C1. Hale hears C3's latch and looks up.                                                          | C1         | Hale                                                |
| 9:41–9:44   | **Daniel poisons the flask.**                                                                                                               | C1         | Wax fragment; vial                                  |
| 9:43        | Maya walks past the station into C5 and leaves the door unlatched.                                                                          | COR → C5   | Hale                                                |
| 9:44        | Daniel leaves C1 and goes into C3.                                                                                                          | COR        | Hale; Maya (through the gap)                        |
| 9:44–9:47   | Maya in C5 fetching her notebook.                                                                                                           | C5         | Hale saw her go in and come out                     |
| 9:44–9:48   | Daniel hides the vial in his suitcase.                                                                                                      | C3         | Vial                                                |
| 9:44–10:05  | Hale's corridor round; he stays in the corridor.                                                                                            | COR        | Service log                                         |
| 9:47        | Maya walks back to the dining car, nowhere near C1.                                                                                         | COR → DIN  | Hale                                                |
| 9:47–10:45  | Maya in the dining car.                                                                                                                     | DIN        | Lamont                                              |
| 9:48        | Daniel walks past Hale to the dining car.                                                                                                   | COR → DIN  | Hale                                                |
| 9:49–10:45  | Daniel in the dining car.                                                                                                                   | DIN        | Lamont; dining-car witnesses                        |
| 9:50        | Maya writes her notebook entry about 9:44.                                                                                                  | DIN        | Notebook                                            |
| ~9:50       | Daniel orders a whisky, "in very good spirits."                                                                                             | DIN        | Lamont                                              |
| 9:52        | Eleanor takes linen at C2's door.                                                                                                           | C2         | Hale; service log                                   |
| 9:56        | Samuel takes linen at C4's door.                                                                                                            | C4         | Hale; service log                                   |
| 9:58        | Linen bags hung on C3 and C5 (both empty).                                                                                                  | COR        | Service log                                         |
| 10:00       | Daniel seen in the dining car.                                                                                                              | DIN        | Dining-car witnesses                                |
| 10:05       | Arthur, alive and well, says goodnight at his door. Flask capped; clean glass upturned. Door closes and latches.                            | C1         | Hale                                                |
| 10:05–10:13 | Hale at the station watching the corridor. No one moves.                                                                                    | STN        | Hale                                                |
| ~10:10      | **Arthur drinks from the poisoned flask (the fatal drink).** Player can only bound it to 10:05–10:14.                                      | C1         | Upright glass with residue; repeated bell; Dr Vale  |
| 10:13       | Mrs Pryor arrives at the station.                                                                                                           | STN        | Mrs Pryor; Hale                                     |
| 10:14       | Arthur, already dying, rings repeatedly and collapses by the bell push. Eleanor hears a cry and a thud. Hale goes to carriage B.            | C1; STN    | Bell log; Mrs Pryor; Eleanor                        |
| 10:14–10:33 | Hale frees Mr Pryor in carriage B. Dr Vale comes out during the commotion.                                                                  | CAR-B      | Mr and Mrs Pryor; Dr Vale                           |
| 10:15–10:25 | Arthur dies.                                                                                                                                | C1         | Dr Vale's estimate                                  |
| 10:35       | Hale opens C1 and finds Arthur dead beside the bell push.                                                                                   | C1         | Hale                                                |
| 10:35–10:40 | Hale keeps C1 shut and sends for Dr Vale. Eleanor opens her door; Samuel offers to help and is refused.                                    | COR        | Hale; Eleanor; Samuel                               |
| 10:40       | Dr Vale's examination.                                                                                                                      | C1         | Dr Vale                                             |
| 10:45–10:50 | The four suspects are told to return to their own compartments.                                                                             | COR        | Hale                                                |
| 10:50       | The detective begins.                                                                                                                       | —          | —                                                   |

### Who could reach the flask after the safe drink?

| Interval    | Who was watching C1's door                                    | Who entered C1         |
| ----------- | ------------------------------------------------------------- | ---------------------- |
| 9:39–9:40   | Hale (inside C1, with Arthur)                                 | —                      |
| 9:40–9:41   | Hale (two seconds back-turned; would have heard any latch)    | —                      |
| 9:41–9:44   | Hale (station)                                                | **Daniel**, 9:41–9:44  |
| 9:44–10:05  | Hale (corridor round)                                         | No one                 |
| 10:05       | Hale (at C1's door)                                           | No one; Arthur stays inside |
| 10:05–10:13 | Hale (station)                                                | No one                 |
| ~10:10      | —                                                             | Fatal drink            |
| 10:14       | — (Arthur already in distress)                                | —                      |

So Daniel is the only person, other than Arthur, who was inside C1 between the safe drink and the fatal drink.

### Timeline integrity rules

1. The safe drink is at ~9:39, during Hale's 9:37–9:40 visit. Arthur always pours into a glass, so the clean upturned glass at 10:05 means he had not drunk since.
2. The safe drink is proven clean by Arthur being well at 10:05 combined with the poison's onset within minutes.
3. Daniel visits C1 twice: 8:55–9:05 (admitted) and 9:41–9:44 (denied).
4. Maya sees Daniel leave at 9:44 and writes the entry at 9:50, not on the spot.
5. Hale never enters any compartment between 9:40 and 10:35 except C1 at 10:35.
6. Samuel examines Arthur at 9:10–9:16 and does not examine the body.
7. The fatal drink is between 10:05 and 10:14. Its exact time (~10:10) is engine-only.
8. Nothing enters or leaves C1 between 10:14 and 10:35. The corridor is unwatched then, but Arthur was already in distress at 10:14 (repeated bell, Mrs Pryor, Eleanor's thud), so nothing after 10:14 matters.
9. The door's spring latch is never described as an inside-only lock.

---

## 5. Evidence File

Each item has exactly one location (or one carrier). Evidence can be found in any order, but its facts never change.

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
  - Arthur's body lies on the floor beside the bell push.
- **Proves:** With Dr Vale's assessment, poisoning is likely and the poison was in the flask. The wax fragment is a physical trace of whatever was added.
- **Does not prove:** Who added it.

### E3 — The Attendant's Service Log and the 9:39 Glass

- **Location:** Attendant's station.
- **Contents:**
  - Bell log: C1 at 9:36, and C1 at 10:14 marked **"rang repeatedly."**
  - Service entries: "C3 window latch stiff — reported 8:40"; water to C1 at 9:37–9:40; corridor round at 9:44–10:05, with linen handed to C2 at 9:52 and C4 at 9:56; C1 declined turndown at 10:05; called to carriage B at 10:14.
  - The unwashed glass Arthur used at 9:39, still on the pantry tray.
- **With Hale's testimony** (when asked specifically): the full 8:48–9:37 log, the safe drink at 9:39, the latch he heard at 9:41, Daniel entering C1 at 9:41 and leaving at 9:44, Maya's movements at 9:43–9:47, Arthur well at 10:05, nobody moving between 10:05 and 10:13.
- **Proves:** The flask was safe at 9:39; the access window; Daniel's second visit; Eleanor and Samuel in their compartments; Arthur already in distress at 10:14.

### E4 — Arthur's Document Case

- **Location:** C1. The case is locked; the key is in Arthur's waistcoat pocket.
- **Contents:** Financial records showing fraudulent invoices authorised through Daniel's office, including a double-billed Leith dock-fee invoice; a sealed envelope to Arthur's solicitor; the note _"Cross — final reconciliation before solicitor. No further delay."_
- **Proves:** Daniel's motive, and that Arthur planned to act the next morning. Undercuts Daniel's "clerk's error" story.
- **Does not prove:** Murder.

### E5 — Eleanor's Letter

- **Location:** Eleanor's handbag, C2.
- **Contents:** A letter from Eleanor's solicitor, Mr Graham of Edinburgh, to Eleanor, setting out settlement terms if she leaves Arthur. Arthur had found it in her luggage that afternoon and kept it; she took it back at 9:20. It is not the solicitor's envelope in E4.
- **Proves:** Eleanor lied about taking something and had a motive.
- **Does not prove:** Anything about the flask. It is a red herring.

### E6 — Arthur's Letter to Samuel

- **Location:** Samuel's medical bag, C4, in a folder behind his notes.
- **Contents:** A letter dated 2 October 1934 from Arthur to Samuel, describing the adverse reaction in the spring and stating that Arthur will report him to the General Medical Council after the journey.
- **Proves:** Samuel had a motive and hid it.
- **Does not prove:** Any contact with the flask after 9:16. It is a red herring.

### E7 — Maya's Satchel: Notebook and Confidential Document

- **Location:** On Maya's person: the satchel she carries.
- **Contents:**
  - Notebook entry, dated 9:50: _"9.44 — D.C. came out of A.B.'s compartment, straight into his own. Second visit tonight? Ask."_
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

| Suspect | Initial statement                                                                                                                                  | True parts                                  | Lie or omission                                                                                       | Evidence that exposes it          |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------- |
| Eleanor | "We argued at dinner. I did go to his compartment, but only to talk. Then I stayed in mine."                                                       | The visit; staying in C2                    | Why she went; taking the letter; hiding the cry and thud at 10:14                                      | E5; E3 ("rang repeatedly")        |
| Daniel  | "I spoke with Arthur about the accounts around nine. After that I was in the dining car, apart from a quick trip to my compartment. I didn't go back to Arthur's." | First visit; trip to C3; dining car later | Denies the 9:41–9:44 visit; then the Leith invoice cover story                                     | E3 (Hale), E7; E4                 |
| Samuel  | "I examined Arthur at about ten past nine. He was alive and in no danger. Then I worked in my compartment."                                        | All of it                                   | Hides the prescribing error, Arthur's letter, and why he accepted the invitation                       | E6                                |
| Maya    | "I asked Arthur about his company and he threw me out. I had nothing to do with his death."                                                        | All of it                                   | Hides her source and document; doesn't volunteer the 9:31 and 9:44 sightings until asked               | E7                                |

---

## 7. Deduction Path

### Step 1 — The death was not natural

- Arthur was well at 10:05 (E3, Hale). At 10:14 the bell rang repeatedly (E3, Mrs Pryor) and he collapsed beside it (E2).
- Dr Vale: not a simple heart attack in a man seen well at 10:05 and dead by 10:35; it acted within minutes; the glass and flask smell medicinal (E2).
- **Conclusion:** Probable poisoning through the flask.

### Step 2 — When was the flask poisoned?

- Arthur drank from the flask at 9:39 (E3, Hale).
- He was well at 10:05. The poison acts within minutes, so the 9:39 drink was clean. The 9:39 glass also has no smell (E3 plus Dr Vale).
- Arthur always pours into a glass. The fatal glass was upright with residue at 10:35, but was clean and upturned at 10:05 (E2, E3). So the fatal drink happened after 10:05.
- He was already in distress at 10:14: the repeated bell, Mrs Pryor, and Eleanor's thud. So the fatal drink happened before 10:14, and anything after 10:14 is irrelevant.
- **Conclusion:** The flask was poisoned between 9:39 and about 10:14.

### Step 3 — Who could reach the flask in that window?

- Hale watched C1's door continuously from 9:39 to 10:13 (E3). His back was turned for two seconds at 9:40, but any door would have clicked, and the first latch he heard was C3's.
- The only person to enter was Daniel, at 9:41–9:44 (Hale). Maya independently saw him leave (E7).
- Eleanor was at C2's door at 9:52 and Samuel at C4's door at 9:56; neither went near C1 (E3).
- Maya's only trip into the corridor was 9:43–9:47, to C5 and back, watched by Hale.
- Hale himself has no motive, his round is corroborated, and nothing links him to the poison.
- No container was found in C1, so Arthur did not poison himself.
- **Conclusion:** Only Daniel had access.

### Step 4 — Daniel lied about it

- He denies returning to C1. Two witnesses contradict him.
- **Conclusion:** He lied about the one event that matters.

### Step 5 — Motive

- Arthur's document case (E4): fraud through Daniel's office, solicitor the next morning. His "clerk's error" invoice is one of the fraudulent ones.
- **Conclusion:** Daniel had a concrete reason to stop Arthur before morning.

### Step 6 — Physical link

- The wax fragment in the flask cap (E2) matches the broken seal on the vial in Daniel's suitcase (E8).
- **Conclusion:** Physical corroboration of everything above.

### Step 7 — Clear the red herrings

- **Eleanor:** Real motive (E5), but her visit was before the safe drink and she was in C2 throughout the window. Her hidden thud is shame, not guilt.
- **Samuel:** Real motive (E6), but his visit was before the safe drink and he was in C4 throughout the window.
- **Maya:** Real motive and secrets (E7), but her visit was before the safe drink, and her one corridor trip was watched and never reached C1.

**Final answer:** Daniel Cross poisoned Arthur Blackwood's brandy flask during his 9:41–9:44 visit to stop Arthur exposing his embezzlement.

---

## 8. Solvability Check

| Suspect | Motive                        | Visit to C1                 | In C1 after the safe drink? | Cleared by                                                                   | Verdict                    |
| ------- | ----------------------------- | --------------------------- | --------------------------- | ---------------------------------------------------------------------------- | -------------------------- |
| Eleanor | Disinheritance; leaving Arthur | 9:20–9:27                  | No                          | E3: safe drink at 9:39; linen at 9:52; continuous watch                      | Innocent                   |
| Daniel  | Embezzlement exposure         | 8:55–9:05 and 9:41–9:44     | **Yes**                     | Nothing clears him; E2, E3, E4, E7 and E8 all point to him                   | **Murderer**               |
| Samuel  | Licence threat                | 9:10–9:16                   | No                          | E1 and E3: safe drink at 9:39; linen at 9:56; continuous watch               | Innocent                   |
| Maya    | Libel threat; her story       | 9:31–9:34                   | No                          | E3: safe drink at 9:39; watched trip at 9:43–9:47                            | Innocent                   |
| Hale    | None                          | 9:37–9:40 (with Arthur)     | Only with Arthur present    | No motive; round corroborated by Eleanor, Samuel, Maya and Daniel; no link to E8 | Witness, not accusable |

### Minimum proof for a winning accusation

The player must name:

1. **Culprit:** Daniel Cross.
2. **Motive:** Preventing exposure of his embezzlement (E4).
3. **Method:** Poisoning the brandy flask.
4. **Opportunity:** The 9:41–9:44 visit, after the safe drink (E3 and/or E7).
5. **Evidence:** At least E3 (the safe drink and the watch) and E8 (the vial matching the wax in E2).

An accusation naming Daniel but missing the motive, the method or the opportunity is a **partial solve**. The game shows what was missing and does not count it as a full win.

**A full win requires E8.** E8 is never destroyed and can always be found. Naming Daniel with the right motive and opportunity but without E8 is a partial solve, with the ending text: _"You have the right man, but the case would not stand up in court."_

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
11. Every evidence item has exactly one location (or one carrier).
12. Every innocent has a motive and a lie, and each lie concerns something other than the murder.
13. Arthur is in visible distress by 10:14, shown by at least two independent sources.
14. Every door opening or closing in the corridor between 9:39 and 10:13 is either seen or heard by Hale.
15. Every passage past the station between 8:48 and 10:13 appears in Hale's account.
16. Daniel never sees Maya between 9:43 and 9:47.
17. Hale cannot be accused, and nothing in the case gives him a motive.

---

## 9. Rules for the AI Mystery Engine

### Global

- The timeline and evidence here are canonical. No character may invent an event that changes them.
- A character may lie only where their stance on a fact is `lie`. They may be vague or evasive about anything they `conceal`.
- No character knows another character's private information unless the case says they witnessed it.
- Daniel never confesses on accusation alone (see his escalation ladder).
- Innocent suspects become more forthcoming once their own secret has been exposed.

### Stances

| Stance    | Meaning                                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| `share`   | True and known; answers truthfully when asked, may volunteer it.                                                  |
| `guarded` | True and known; does not volunteer it, but answers truthfully and precisely when asked specifically.              |
| `conceal` | True and known; evades or withholds it until the unlock condition is met. Some concealments never unlock.         |
| `lie`     | Asserts a false version until the unlock condition is met, then follows the reveal behaviour. Some lies never drop. |

### Time tolerance (consistency checker)

- A statement using "around," "about" or "roughly" with a time matches the truth within **±10 minutes**. (Daniel's "around nine" for 8:55 is true.)
- A statement giving an exact time ("at 9:41") matches within **±2 minutes**.
- A statement about order ("before," "after") must match the true order exactly.

### Knowledge boundaries

| Character | Knows                                                                                   | Must not know                                                          |
| --------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Eleanor   | Her visit, the letter, the dinner threat, footsteps she heard, the cry and thud at 10:14 | Daniel's 9:41 visit; the fraud; the cause of death                    |
| Daniel    | Everything he did; Arthur's habits; the solicitor plan; the voice in C1 at 9:31          | That Hale saw him enter; that Maya saw him at 9:31 or 9:44; the notebook |
| Samuel    | His exam, Arthur's health, his error, Arthur's letter, the invitation, Hale's refusal    | The fraud; events in C1 after 9:16                                    |
| Maya      | Her visit, her source, Daniel's 8:50 remark, the 9:31 and 9:44 sightings                 | What happened inside C1; the cause of death                           |
| Hale      | Everything in his section                                                                | What happened inside C1 during Daniel's visit; any motives            |
| Dr Vale   | Her examination findings; the carriage B incident                                        | The identity of the poison; the culprit                               |
| Mrs Pryor | The 10:13–10:33 incident; the buzzing panel                                              | Everything about the Blackwood party                                  |
| Lamont    | Who was in the dining car and when; Daniel's 8:50 remark; the 9:50 whisky                | Anything in the corridor or compartments; any motives                 |

### Evidence state

- Discovering evidence unlocks new questions. It never changes history.
- If the vial is moved (E8 simulation rule), record the move with its time. The vial stays findable.
- The game distinguishes **suspicion**, **corroboration** and **proof**. No single clue ends the case.

---

## 10. The Player and the Opening

- **Who the player is:** A retired Scotland Yard inspector travelling in carriage B. After the death, the train guard asks them to look into it before the police take over.
- **Time pressure:** Police will board at Perth, around 12:30 a.m. v1 has no hard timer; the arrival is flavour only.
- **Opening state at 10:50 p.m.:**
  - The four suspects are in their own compartments (Eleanor C2, Daniel C3, Samuel C4, Maya C5) and have been told to stay there.
  - Hale watches the corridor from the station.
  - Dr Vale and Mrs Pryor are in carriage B.
  - Lamont is in the dining car.
  - C1 is shut and untouched apart from Dr Vale's examination.
- **Opening briefing:** Arthur Blackwood was found dead in C1 at 10:35, and Dr Vale suspects he swallowed something. The four people in his corridor are Eleanor Blackwood, Daniel Cross, Dr Samuel Reed and Maya Bennett. You may question anyone and search anything.

---

## 11. Open Questions

Characters must not invent answers to these.

- Daniel's stated reason for the 9:30 trip to C3, if pressed beyond "a quick trip to my compartment."
- The train guard who asks the detective to investigate is not defined as a character and cannot be questioned.

---

## 12. Final Summary

Arthur Blackwood is poisoned aboard the _Midnight Express_ on 17 October 1934. Eleanor hides her plan to leave him and the cry she ignored, Samuel hides a prescribing error Arthur was about to report, and Maya hides a confidential source. Each has a motive, and each lies, but none of them is inside C1 after Arthur's safe drink at 9:39.

Daniel Cross, facing exposure for embezzlement, slips into C1 at 9:41 while the attendant's back is turned for two seconds, poisons the flask and leaves at 9:44. The attendant heard his latch and saw him go in, and Maya watched him come out through her unlatched door. The attendant watched C1's door continuously until Arthur's fatal drink after 10:05, and by 10:14 Arthur was already dying. The wax fragment in the flask cap matches the vial in Daniel's suitcase.

**Canonical answer: Daniel Cross killed Arthur Blackwood to prevent the exposure of his embezzlement.**
