# HUSHWAKE — Vertical Slice

> **Document status:** Revised production target incorporating Tuner encounters, selected-lineup Field Data, intelligent speaking Wildkin, and no universal enemy-action reveal. This defines what the slice must prove, not an immediate implementation promise.

## Slice title and purpose

**The Missing Chorus** is a 2–3 hour opening chapter set around Hearthmere, a colorful high-technology service town, its conductive bellfruit orchard, and the old water-and-network weirworks.

The slice succeeds if a new player finishes wanting to:

- form Accords with more wildkin;
- try a different active/reserve sequence and Focus handoff;
- learn what caused the Hush;
- care about Skein as a living synthetic individual whose body the protagonist repaired but whose identity is its own;
- revisit a changed location or follow the next route.

It does not need to prove the final game’s total length, full roster, or final antagonist.

## Questions the slice must answer

1. Is standard 1v1 combat quick, readable, and distinct when reserves and switching are available?
2. Can opponent behavior remain fair and learnable without universally revealing the next selected action?
3. Does deterministic Accord make recruitment more satisfying and less frustrating?
4. Can exploration, synthetic creature habitats, civic technology, and story evidence share the same small maps?
5. Does one local conflict build naturally into two meaningful major battles?
6. Can the Hush mystery create theories without confusing the immediate objective?
7. Can the project deliver this quality with a small RPG Maker MZ content footprint?
8. Do wildkin feel organically alive, mechanically integrated, socially useful, and individually charming at once?
9. Does the root-access reveal feel like a disturbing deepening of an appealing world rather than a reversal into “technology bad”?
10. Does the opening establish the protagonist as a skilled repairer and Skein as an autonomous companion without slowing the first battle?
11. Can the foundation support future Focus shared across switches without depending on universal Intent/Answers?

Everything else is secondary to these questions.

## Experience target

- **First-time critical path:** 2 hours to 2 hours 30 minutes.
- **Moderately exploratory path:** 2 hours 30 minutes to 3 hours.
- **Replay/alternate early-Accord path:** under 2 hours with seen text and animations accelerated.
- **Mandatory battles:** approximately 7–9 ordinary 1v1 duels, one sequential Tavi team battle, one 1v1 multi-phase Orralume climax.
- **Optional battles:** approximately 6–10 visible groups, all avoidable or retreatable.
- **Playable entries:** Skein plus 11 registered species at content-complete; expansion toward 25–30 forms/species only after approval gates.
- **Side quests:** 3, each 10–20 minutes and each serving at least two design purposes.

## Content boundary

### Locations

1. **Cable Approach** — small public service bay, Skein’s activation and voluntary Accord, autonomous transit interruption, first 1v1 battle.
2. **Hearthmere** — compact civic-tech hub, community cradle, resynchronization festival setup, returning aftermath.
3. **Sunken Track: Upper** — exposed service spine, first Accord, simple fork, first system shortcut.
4. **Sunken Track: Lower** — denser habitats, Hush symptom, connection to orchard.
5. **Bellwether Orchard** — conductive agriculture, mesh stakes, open-protocol Tune interactions, altered return state.
6. **Old Weir Exterior** — pressure/network event, sealed Meridian rollback equipment, waypost.
7. **Weirworks** — compact dungeon loop with thermal, hydraulic, archive, and legacy cradle rooms.
8. **Resonance Cistern** — ancient fabrication cradle, Tavi control platform, recovery point, Orralume arena.

Adjacent spaces can share one RPG Maker map when that reduces transitions. The target is **6–8 authored maps**, not eight large maps.

### Characters with substantial dialogue

- Protagonist.
- Skein, a central speaking Wildkin companion with authored behavior and unusually strong social/emotional inference.
- Tavi Rook, rival/companion.
- Warden Mara Venn, mentor and local authority.
- Merrit Quill, Meridian field engineer.
- Edda Sorn, orchard caretaker and keeper of the old bell practice.

Other villagers receive short functional or flavor conversations. Do not create a crowd of named characters the slice cannot develop.

### Systems required

- Standard 1v1 active combat with one wildkin per side.
- Carried reserves, action-cost voluntary switching, free replacement after Spent, and persistent reserve Resolve.
- Sequential opposing rosters; no fixed final player party-size limit yet.
- Visible encounter groups.
- Wild Encounters with no opposing Tuner and Tuner Battles whose opponent identity persists independently across sequential Wildkin.
- No universal enemy-action reveal or baseline Answer system; limited prediction may return through explicit special abilities.
- Architecture compatible with future shared Focus and signatures, without implementing them in the current foundation.
- Six Aspects and outcome preview.
- Deterministic Accord and one temperament shortcut per wild species.
- Active/reserve roster management at wayposts.
- Full base Field Data for every Wildkin in the selected battle lineup after a qualifying victory, whether active or reserve, with native-MZ-backed Levels.
- Survey, Tune, and Rig authored field interactions.
- Simple quest log and bestiary updates.
- Immediate major-battle retry with active/reserve-edit access.
- Map-state changes after the climax.
- Bestiary fields for observed behavior, registered service lineage, and unresolved anomaly.

### Systems explicitly not required

- 2v2 or general multi-active battle support, universal Intent reveal, Answers, Focus, signatures, advanced Tuner AI, Tuner voluntary switching, switch hazards, deep switch-state rules, breeding, modular body construction, playable Reweaving, companion equipment slots, hacking minigames, trading, procedural encounters, crafting, equipment rarity, mounts, online play, day/night cycle, dynamic weather, stealth, relationship meters, branching endings, voiced scenes, or a generalized physics/puzzle framework.

Reweaving is visible in dialogue, cradle design, and later-form previews, but implementing evolution is deliberately deferred until the combat prototype proves creature identity and continuity.

## Player-facing flow

Times are observation targets, not cutscene scripts.

| Time | Activity | New element | Story movement |
|---|---|---|---|
| 0:00–0:03 | Perform final body checks; Skein wakes and offers Accord | Movement, naming, mutual Accord | `ROUTE PEER: RETURNED`; unplanned relay filament grows |
| 0:03–0:06 | Ride Cable Approach; battle one Thrumble | 1v1 command, Resolve, Aspect preview | Relay swarm replays its route and Skein’s handshake |
| 0:06–0:15 | Enter Hearthmere; short introductions | Wayglass, community cradle | Festival sync failed; Merrit’s rollback prevents a cascade |
| 0:15–0:30 | Survey Upper Track; form first wild Accord | Visible duels, Open/Accord, free replacement | A root handshake preceded the reversed route |
| 0:30–0:50 | Explore fork and optional loop | Voluntary switch, shared Focus, Rig | Checksum rings and old credentials imply more than a broken weir |
| 0:50–1:10 | Reach Bellwether Orchard | Open-protocol Tune, habitat interaction | Orralume is missing; it and Thrumble answer Skein’s signal |
| 1:10–1:30 | Complete lower route / optional return | Reserve edits, broader technique patterns | Tavi and player form competing explanations |
| 1:30–1:55 | Explore Weirworks and legacy cradle | Compact dungeon loop, archive clue | Skein is admitted as a peer; old consent interval offers a solution |
| 1:55–2:10 | Cascade and Tavi confrontation | Sequential 1v1 team battle | Player earns the right to attempt consent before override |
| 2:10–2:30 | Orralume rescue | 1v1 three-phase boss, switching, battle Tune | Orralume recognizes Skein, rejects rollback, restores route/pressure |
| 2:30–2:45 | Changed town/orchard and dusk festival | Return-state rewards | First Waymark; Merrit hides two linked ancient identifiers |

An exploratory player spends the additional time on side branches, roster experimentation, and three short quests. The critical path never asks the player to patrol for levels.

## Activity rhythm

The target cadence is:

**scene → field observation → battle/Accord → route choice → character interpretation → puzzle/traversal → major encounter → changed world**

No single activity should dominate for more than about 15 minutes in the first hour. Weirworks may sustain exploration longer because its rooms mix combat, evidence, and traversal.

## Major encounters

### Tavi Rook — Upper Control Platform

- **Recommended roster:** Enough reserves to demonstrate at least one voluntary switch; no final party-size limit is implied.
- **Opposing sequence:** Reedimp builds Focus, then Tavi spends a round switching to Loamlet at a readable safe moment. When Loamlet becomes Spent, the weakened Reedimp returns for at most one brief handoff attempt; if already Spent, that beat is skipped. Kilnkit enters last and spends the inherited momentum.
- **Duration target:** 5–8 minutes on first attempt.
- **Narrative function:** resolve who leads an immediate safety decision; expose Tavi’s Red Wake fear and emergency-override position.
- **Mechanical function:** exam on action-cost switching, free replacement, lineup endurance, and readable authored technique patterns before the guardian fight. Tavi remains represented independently as the opposing Tuner.
- **Battle shape:** Tavi establishes a sequential shield/tempo engine and makes one readable switch. Finishing Reedimp early disrupts that engine; otherwise its short return clarifies that switched reserves persist. Kilnkit remains the climax. Their partners still emote and improvise so coordination never reads as ownership.
- **Failure handling:** instant retry prompt; “Review team” opens the nearby waypost; one short Tavi line changes after a loss.
- **Aftermath:** full recovery before the cistern. The story does not punish the player with depleted resources for winning.

### Orralume — Resonance Cistern

- **Recommended roster:** Any healthy set of active/reserve partners; Skein is not required to occupy the active slot.
- **Duration target:** 7–10 minutes on first clear.
- **Narrative function:** rescue an autonomous synthetic coordinator, preserve its present identity, and vent the weir safely.
- **Mechanical function:** combine learned technique patterns, switching during authored visible cues, reserve Resolve management, and an authored field action without universal prediction.
- **Phase 1 — Panic:** clear Assault tells; sheltering and tempo control are strong.
- **Phase 2 — Fold:** Orralume uses layered Guard and scale decoys; Break/Feint techniques create openings.
- **Phase 3 — Root rollback:** Hush authorization creates Disrupt pressure. Tune exposes the old consent interval; Orralume’s own response, not the player’s command, replaces a damage race with a rescue finish.
- **Failure handling:** retry from the control platform with a short phase hint based on where the team failed.
- **Story recognition:** Orralume addresses Skein before battle even if Skein is in reserve. This grants no combat bonus and does not imply obedience.
- **Aftermath:** Orralume leads the returning swarm through the map; the creature is not recruited.

## Exploration plan

### Main-path readability

- Landmark composition, NPC facing, and the sound motif point toward the current lead.
- The quest log names a place and observable goal, never coordinates.
- Every fork reconnects or creates a visible shortcut.
- Critical evidence uses a strong authored interaction and cannot be missed.

### Optional-path value

Each optional branch should contain at least two of:

- a species or unusual encounter group;
- a shortcut;
- a bestiary observation;
- a useful field-kit refill or technique reward;
- a character perspective;
- a mystery clue that changes interpretation;
- a side-quest step.

No branch should end with only currency or a generic healing item.

### Environmental state changes

Before the climax:

- orchard blossoms and charge petals remain shut;
- public displays and waybells answer at the wrong interval;
- Thrumble are absent or disoriented;
- maintenance wildkin perform obsolete routines and the weir emits a pale root pulse;
- villagers cluster near prepared festival spaces.

After the climax:

- blossoms open, the town mesh stabilizes, autonomous transit resumes, and Thrumble follow Orralume across at least two maps;
- the correct three-note phrase returns to ambient sound;
- one former encounter obstruction becomes a shortcut;
- villagers move into a modest dusk festival;
- a small checksum ring and legacy maker glyph remain near the mobile Stillpoint, preserving unease.

Visible consequence is a required part of the reward, not polish to cut first.

## Staged build plan

### Gate A — Combat lab

**Content:** Skein, Briarkid, Kilnkit, Rillip, Thrumble, and Loamlet; neutral test backdrop; single wild duels and one sequential opposing team; placeholder icons and animation. Even graybox silhouettes must mark each species’ integrated synthetic system and personality beat.

**Must prove:**

- one active wildkin per side is readable;
- “act, stay, or switch” remains interesting after the obvious Aspect tutorial without universal next-action reveal;
- voluntary switching consumes the round, resolves first, and redirects the planned attack clearly;
- free replacement after Spent is immediate and reserve Resolve persists;
- Focus built by one wildkin is satisfying to spend with another;
- ordinary wild duels finish in 3–6 rounds;
- each of the six entries has a reason to stay active and a reason to hand off momentum;
- Accord visually reads as a mutual handshake, not capture or hacking.

**Stop condition:** Do not build the full map flow if switching is an automatic Aspect correction, if staying in is almost always superior, or if sequential replacements make battles drag.

### Gate B — 45–60 minute graybox

**Content:** Cable service bay and approach, compressed civic-tech Hearthmere, one Sunken Track service map, compressed Weirworks/legacy cradle/cistern; Skein plus five prototype species; abbreviated story; Orralume prototype. Tavi’s battle may use temporary data for its sequential roster.

**Must prove:**

- Skein activation, first battle, first wild Accord, and switch-tutorial timing;
- protagonist repair competence and Skein agency without opening exposition;
- visible encounter navigation;
- one route fork and shortcut;
- evidence leading to a story conclusion;
- rescue framing of the boss;
- the opening `ROUTE PEER: RETURNED` clue is noticed but not understood;
- daily-life technology feels warm before root rollback becomes unsettling.

**Stop condition:** Do not add species if the opening objective is unclear or players disengage before the orchard clue.

### Gate C — Content-complete slice

**Content:** 6–8 maps, all five central characters, 12 playable wildkin entries (including the unique Skein), Tavi battle, Orralume battle, three side quests, pre/post area states, complete main dialogue.

**Must prove:**

- 2–3 hour pacing;
- reserve and switching experimentation without grinding;
- local arc satisfaction;
- mystery comprehension and curiosity;
- organic-synthetic visual identity, social integration, and emotional attachment;
- production pace representative of a small full project.

### Gate D — Polish and roster decision

Polish battle readability, menus, encounter placement, audio cues, portraits, and the return-state celebration first. Expand toward 25–30 forms/species only if playtests show that the 12-entry roster runs out of meaningful combinations.

**Reasoning:** The target is a fun slice with up to 25–30 creatures, not a 30-creature catalog wrapped around an unproven game.

## Prototype roster allocation

### Six-entry graybox

- Skein, Briarkid, Kilnkit, Rillip, Thrumble, and Loamlet.

### Twelve-entry content-complete target

- Add Latchling, Reedimp, Sootnewt, Cairncap, Vellumoth, and Rucklet.
- Mirrorminnow moves to the expansion roadmap so Skein does not increase the immediate 12-entry scope.
- Orralume is a non-playable encounter and does not count toward the roster.

### Expansion target

- Up to 8 evolved forms and 6 additional standalone species are listed in `MONSTERS.md`.
- Implement only entries that add a tested battle role or exploration payoff.

## Side-content budget

Three optional quests are sufficient:

1. **The Borrowed Key** — Latchling access-game behavior, alternate Accord approach, pre-founding Meridian credential.
2. **A Bed for Loamlet** — repair a field-wall passage, habitat consequence, permanent shortcut.
3. **Three Notes Missing** — compare old and current bell phrases, Vellumoth archive observation, stronger foreshadowing.

Each uses existing maps and characters. None requires an exclusive system, a unique dungeon, or more than one new reward asset.

## Dialogue and presentation budget

- Portrait set: protagonist-neutral framing plus Tavi, Mara, Merrit, and Edda; expressions kept to a small reusable set.
- No lip sync or voice acting.
- Major scene staging uses public interfaces, wildkin service/play animation, map movement, sound changes, screen tone, light overlays, and wildkin sprites.
- Skein uses one canonical map sprite/battler and a small set of reusable behavior animations; configurable bodies are outside scope.
- Opening contains at most three brief prompts across movement, Accord acceptance, and the first battle before free exploration.
- Previously seen major-battle introductions are skippable after a retry.
- Ambient audio carries the three-note clue, with a simultaneous visual pulse for players who cannot rely on sound.

## Difficulty and economy targets

- Critical-path encounters alone keep Skein and any regularly used reserves within the expected readiness band.
- Players who avoid all optional battles can still defeat Tavi through sound switching, matchup, and Resolve management.
- Optional encounters primarily provide roster choice, field observations, and technique experimentation—not required levels.
- Field Kit starts with three refillable recovery charges and refills at wayposts.
- Ordinary defeat returns the player to the last waypost without lost currency or recruited wildkin.
- Major defeat returns to the pre-battle decision with full field-kit charges.
- Currency exists only if it buys meaningful, limited choices in the slice; otherwise omit shops from the prototype.

## Playtest protocol

Use at least five fresh players across Gates B and C before expanding the roster. Observe without explaining unless progress is fully blocked.

Record:

- time to movement, Skein Accord, first battle, first wild Accord, first voluntary switch, orchard, Tavi, and ending;
- number of avoidable encounters entered;
- active/reserve selection, voluntary switches, and stated reasons;
- opponent cues or technique patterns misunderstood or ignored;
- Tuner identity or Field Data result information misunderstood;
- failed Accord attempts and why;
- dialogue skipped;
- wrong turns lasting more than two minutes;
- theories about Skein, the Hush, Merrit, Tavi, and Orralume;
- how testers describe wildkin origin, personhood, daily roles, Accord, and Reweaving in their own words;
- moments players voluntarily revisit after the climax.

### Initial success thresholds

- At least 4/5 players reach the first battle within 5 minutes.
- At least 4/5 explain that Skein chose Accord and that the protagonist repaired its body rather than created its personality.
- At least 4/5 can explain wild Open/Accord after using it once.
- At least 4/5 understand voluntary-switch cost, incoming targeting, and free replacement after one demonstration each.
- Median ordinary duel stays under roughly 75 seconds after the tutorial.
- No tester reports needing to grind to pass Tavi or Orralume.
- At least 3/5 switch voluntarily for a reason beyond simple Aspect advantage or a forced tutorial.
- At least 4/5 can state the local cause-and-solution chain after finishing.
- At least 3/5 offer a theory about the larger Hush without being prompted.
- At least 4/5 identify wildkin as living synthetic beings without concluding they are emotionless robots.
- At least 3/5 cite a useful or charming surface technology they would want to see more of.
- At least 3/5 remember or theorize about `ROUTE PEER: RETURNED` without being prompted with the phrase.

Thresholds flag investigation; they are not statistical proof with such a small sample.

## Slice completion checklist

The slice is “polished” only when:

- its opening, two major battles, and ending can be completed without developer intervention;
- all mandatory objectives, battle information, Tuner identity, Field Data results, and future Accord information are readable on keyboard and controller;
- all 12 implemented entries have a distinct 1v1/switching use and complete bestiary/Accord text;
- all 12 communicate an integrated synthetic body function, daily-life role/history, and individual behavior;
- the active wildkin and carried reserves can be changed at each intended waypost without assuming a final party-size limit;
- Skein can be rested from active battle without breaking authored story scenes;
- critical-path balance requires no repeated farming;
- the pre/post Hearthmere and orchard states are visible;
- retries, saves, and returns from side paths do not break quest state;
- optional clues never block main-story comprehension;
- credits or an end card clearly mark the slice boundary.

## Risks and responses

| Risk | Early response |
|---|---|
| Switching becomes automatic type correction | Make current Resolve, known techniques, visible state, prior behavior, and the lost action matter; keep Aspect multipliers modest. |
| Switching is rarely worth a round | Use readable pressure and lineup-management opportunities before inventing hazards or free-pivot states. |
| Sequential teams make battles long | Keep ordinary Wild Encounters to one opponent, resolve replacements instantly, and cap Tuner lineups/animations tightly. |
| Combat feels blind without Intent UI | Strengthen consistent technique patterns, authored cues, state readability, and limited special prediction where earned; do not restore universal reveal. |
| Accord feels automatic | Strengthen temperament interactions and presentation; do not reintroduce hidden capture odds first. |
| Story requires too many bespoke scenes | Deliver clues through reusable interfaces, service behavior, creature placement, and altered ambience. |
| Synthetic designs read as armored animals | Require integrated anatomy, growth needs, service history, and one personality behavior before art approval. |
| Wildkin read as equipment rather than companions | Show refusal, play, personalization, independent community life, and voluntary Accord; avoid ownership UI language. |
| The mystery reads as “technology bad” | Make Hearthmere attractive and capable; keep Merrit’s rescue action and Tavi’s fear concrete; make the combined technical solution mandatory. |
| Root access makes normal Accord feel coercive | Reiterate mutual handshake behavior in play and make Orralume’s own response complete the rescue. |
| Skein feels like a chosen-one legendary | Keep early stats ordinary, make recognition ambiguous, and require other characters/species for every solution. |
| Skein feels owned because the protagonist built its body | Make Skein initiate Accord, refuse small expectations, grow an unplanned structure, and retain battle/rest freedom. |
| Twelve playable entries feel sparse | Improve encounter compositions and kits before authorizing 14 more art/data entries. |
| Backtracking slows the slice | Open authored shortcuts and change map states on return. |

## Decisions awaiting approval

- A 2–3 hour target with 6–8 compact maps.
- A staged roster of 6, then 12, then up to 26 playable entries.
- Standard one-active-per-side combat with switching and sequential reserves; special multi-active formats deferred.
- Wild/Tuner encounter distinction with stable Tuner identity independent from the active opposing Wildkin.
- Full Field Data for every selected lineup member after qualifying victory, using Levels and native MZ progression internally.
- No universal Intent reveal or Answer system; Focus/signatures remain deferred.
- Fully intelligent, verbal Wildkin with literal/low-context tendencies and individual voices; Skein is unusually socially perceptive.
- One canonical reconstructed companion, Skein, replacing a traditional starter choice.
- Protagonist as cradle-repair apprentice/field mechanic pursuing Wayfinder certification.
- Tavi and Orralume as the only mandatory major battles.
- Three small side quests using existing spaces.
- A combined open-protocol/precise-control solution rather than a simple machine shutdown.
- Surface tone of warm, colorful civic technology with gradually revealed seedcore control horror.
- Reweaving established as evolution fiction but excluded as an implemented slice system.
- Playtest gates that can cut or revise features before the full-game plan expands.
