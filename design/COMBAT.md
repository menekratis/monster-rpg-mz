# HUSHWAKE — Combat

> **Document status:** Revised first-draft 1v1-with-reserves specification. Switching, cross-switch Focus, and voluntary Accord are defined at prototype depth; exact values and the carried party limit remain playtest questions. Prove the loop with six wildkin first.

## Combat promise

Combat is a brisk **1v1 active duel with reserves** about reading intent, deciding whether to answer or switch, and building an advantage that another companion can inherit. It should retain the satisfaction of creature matchups while avoiding hidden capture odds, long move-message chains, routine grinding, and imitation of a basic type-checking battle system.

The player should usually know **why** damage happened and what they could try next.

## Battle format

- Standard combat has **one active player wildkin and one active opposing wildkin**.
- Either side may have reserve wildkin. Opposing wayfinders normally send their next reserve after the active one becomes Spent.
- One active wildkin chooses one technique per round unless Spent or explicitly unable to act.
- Each wildkin equips up to **four techniques**: usually three core techniques and one Focus signature.
- The player’s battle team shares one **Focus meter** from 0–100. Focus persists across switches, allowing one companion to build an opening and another to spend it.
- Techniques have no consumable PP, ammunition, or battery chores. Wildkin metabolize, store, and recover battle energy as living systems. Signatures spend Focus; other strong effects rely on conditions or modest cooldowns only if testing proves repetition is a problem.
- Battle commands are **Techniques, Switch, Accord, Field, Retreat**. Items are handled through a small Field Kit, not a large battle inventory.
- The final number of wildkin allowed in the player’s carried battle party is **not yet decided**. UI and balance specifications should say “active” and “reserves,” not assume a three- or six-member limit.
- 2v2 battles, simultaneous multi-wildkin encounters, and other formats may appear later as authored exceptions. They are not the standard architecture and are outside the first graybox.

### Why 1v1 with reserves

- One command per round keeps intents fast to read and gives each companion more screen presence.
- Switching turns roster construction into play rather than a decision made entirely before battle.
- Shared Focus preserves cooperation across time: a support-oriented wildkin can prepare a signature for a later specialist.
- Sequential opposing teams let an authored battle reveal character strategy without crowding the screen or multiplying simultaneous effects.
- The format is easier to communicate and animate at RPG Maker scope while leaving rare multi-wildkin encounters special.

The main risk is that Aspect advantage makes switching automatic. Intent Answers, Focus, revealed enemy plans, and the action cost of switching must make “stay or switch?” a genuine decision rather than a rote matchup correction.

## Switching baseline

Switching is an important tactical action, but detailed edge cases remain a playtest topic.

- A voluntary switch uses the player’s action for that round.
- A normal switch resolves before ordinary techniques.
- The opponent’s already-planned action proceeds against the incoming wildkin when its target remains valid.
- If the active wildkin becomes Spent, choosing an available replacement is free before the next round.
- Reserve wildkin retain their current Resolve.
- Shared Focus is not lost when switching.
- Opposing teams automatically send the next planned reserve after one becomes Spent; important trainers may make a limited voluntary switch when their authored strategy calls for it.
- Retreat and Accord remain separate commands; switching never manipulates recruitment odds.

Provisional state persistence, switch-lock effects, pursuit attacks, entry hazards, and elaborate switch passives are intentionally **not** part of the first specification. Add one only when playtesting identifies a concrete tactical gap.

## Turn flow

### 1. Read

The active opponent displays one planned **intent category** before commands are selected. The intent belongs to the planned action, not to its current target; switching does not erase it. Bosses may obscure or combine intents only after those exceptions have been taught.

### 2. Plan

The player selects one technique for the active wildkin, switches to a reserve, or uses another battle command. The UI previews:

- target;
- Aspect result;
- predicted relative damage band;
- relevant intent response;
- Focus gained or spent;
- temporary states applied and duration.

A switch preview shows the incoming wildkin’s current Resolve, Aspects, and the known outcome of the displayed enemy intent. It should not calculate an exact “best choice.”

### 3. Resolve

Actions resolve by explicit priority, then Tempo, then a stable tie rule. The log groups outcomes and avoids separate text boxes for every passive tick.

### 4. Open

The battle updates enemy Open/Accord state, Focus, temporary conditions, available reserves, and next intent. A Spent side chooses or sends its replacement before the following Read step. Short phase-change moments may interrupt this sequence in major encounters.

## Enemy intents

| Intent | Meaning | Typical answer | Player lesson |
|---|---|---|---|
| **Assault** | Immediate damage or focused pressure | Guard, weaken, or switch to a safer response | Decide whether the active partner should absorb the pressure |
| **Guard** | Shield, recovery, counter posture | Break, Feint, condition | Do not waste the turn hitting the wall normally |
| **Setup** | Charge, summon support, prepare sequence | Interrupt, accelerate, focus target | Act before the threat matures |
| **Disrupt** | Slow, expose, displace, or alter state | Cleanse, Rally, exploit low damage | Decide whether to repair or race ahead |

A technique can be tagged as an **Answer** to one intent. When it meaningfully meets that intent, it gains its stated bonus and adds Focus. “Answer” represents partners reading and coordinating through Accord; it never means remote-control certainty or a universal cancel. The tooltip says whether it reduces damage, breaks a state, interrupts a charge, or cleanses an effect.

### Starting Focus values

- Ordinary core technique: +3 Focus.
- Successful intent Answer: +12 additional Focus.
- Species support techniques: usually +5 to +10 as part of their identity.
- Signatures: 30–50 Focus.
- Focus begins at 0 and resets after battle.

These values aim for one signature around turns 3–4 and a second only in longer encounters. Adjust the entire economy before tuning individual species around a bad baseline.

### Cross-switch Focus identity

Focus is the main team-synergy layer in the 1v1 format:

- Answers and support techniques can build Focus even when their user is not the intended signature spender.
- Switching preserves Focus but costs immediate tempo.
- A signature should not become efficient enough that every battle follows “farm with support, switch to striker, spend.” Enemy intent, current Resolve, and signature function must sometimes reward staying in.
- The opponent may have its own authored Focus or charge sequence, but the player does not need to track an invisible mirror meter.
- No passive reserve Focus generation in the first prototype.

## Aspects

### Advantage loops

- **Ember > Verdant > Current > Ember**
- **Stone > Gale > Gloam > Stone**

Cross-loop interactions are neutral in the prototype.

Aspects describe dominant body processes, not mystical elements: Ember converts heat; Verdant fabricates growth; Current transfers fluid and charge; Stone holds structure; Gale moves and broadcasts; Gloam obscures, reflects, and subverts data.

### Starting modifiers

- Strong: 1.5×.
- Resisted: 0.75×.
- Matching user Aspect: 1.25× affinity bonus.
- Dual-Aspect defenders use the single strongest applicable outcome; multipliers do not stack in the first prototype.

The command preview labels outcomes **Strong**, **Resisted**, or **Neutral**. The player never needs to memorize the chart to avoid a trap.

### Design limit

Aspect advantage should matter without deciding an encounter at team selection. Intent response, target pressure, and role synergy must remain viable on neutral teams. A player using favorites should be able to win the slice with sound tactics.

## Stats and damage

Use four visible combat stats initially:

- **Resolve:** health and willingness to continue.
- **Force:** potency of damaging techniques.
- **Guard:** resistance to damage.
- **Tempo:** order within priority bands.

Support effects use authored values or percentages rather than a fifth scaling stat until one is demonstrably needed.

### Damage principles

- Small random variance only: target ±5%.
- No random misses in the prototype unless a technique clearly states a conditional failure.
- No hidden random critical hits initially. Critical-style bursts should be created by Exposed, intent answers, or signatures the player can predict.
- Multi-hit techniques show total expected range and resolve quickly.
- Damage numbers are less important than a clear bar change and outcome label.

## Temporary states

Start with four universal states. Species-specific marks may exist, but should reuse these behaviors where possible.

| State | Effect | Duration rule |
|---|---|---|
| **Guarded** | Next damaging technique received is reduced by 40% | Consumed on hit or expires after one round |
| **Exposed** | Next damaging technique received gains 25% power | Consumed on hit or expires after one round |
| **Slowed** | Acts one step later within its priority band | Two rounds |
| **Soothed** | Deals 20% less damage; ordinary wildkin Open threshold rises from 30% to 40% | Two rounds |

“Hushbound,” Orralume’s feedback loop, is an encounter rule rather than a general status.

### Why a small state list

Intents, switching, Aspects, Focus, and reserve Resolve already create information load. A large status catalog would turn readable tactics into icon management.

## Technique structure

Every technique entry should specify:

- target pattern;
- Aspect;
- priority;
- power or exact support effect;
- intent Answer, if any;
- Focus gain or cost;
- state and duration;
- animation-length target;
- AI valuation notes where relevant.

### Kit construction rule

A prototype wildkin normally receives:

1. one reliable damaging technique;
2. one intent Answer aligned to its role;
3. one identity technique for support, pressure, or tempo;
4. one Focus signature that changes the current decision.

Avoid four near-identical attacks with different Aspects. Coverage belongs across a reserve roster, not on every individual. Each kit should also answer: **why would I keep this wildkin active, and why might I switch after it acts?**

## Accord, consent, and command fiction

The player choosing techniques is a playable abstraction of rapid shared planning through Accord. Wildkin are not puppets. Animation, non-blocking flavor, and story scenes should show them interpreting a plan, protecting one another, and retaining personality.

Accord operates at a mutual companion layer:

- either partner can end or refuse the link in fiction;
- it shares intent, sensory shorthand, and trusted tactical requests—not continuous thoughts;
- the Wayglass cannot rewrite memory, force Reweaving, or issue root commands;
- existing partner teams cannot be recruited because lowered Resolve does not revoke a current relationship;
- major Hush encounters are about restoring present choice, not hacking a stronger machine.

The deeper story reveals unauthorized root access beneath this interface. Normal battle play should reinforce the ethical contrast rather than make coercion routine.

### Standard encounter rule

- An unbonded ordinary wildkin becomes **Open**—willing to exchange an Accord handshake—at or below 30% Resolve.
- Soothed raises the threshold to 40% while active.
- A species temperament condition may make it Open immediately or at a higher threshold.
- Open state is visible above the target and in the target panel.
- Selecting Accord on an Open target succeeds.
- Selecting Accord too early does not consume an item or attack the target; the UI reads “No handshake offered” and allows command cancellation before resolution when possible.
- Bonded teams, major story guardians, and explicitly frenzied scripted creatures cannot be recruited.

When Accord succeeds, the target chooses to leave the hostile group and shares a short preference/behavior note. If the active team is full, the new partner travels or is escorted to the nearest refuge and can be invited at the next waypost.

### Temperament rule

Temperament shortcuts are authored, readable battle mini-goals. They cannot require an unknown species, rare technique, or hidden sequence. After the behavior appears once, a short hint becomes available in the target panel.

### Why no capture probability

The tactical work is demonstrating coordination while managing the rest of the encounter. Random failure after a displayed mutual handshake would weaken both pacing and consent fiction.

## Field Kit and recovery

- The Field Kit begins with three recovery charges.
- One charge restores a clear percentage of Resolve to the active wildkin; exact amount starts at 40%.
- Charges refill at wayposts and before major retries.
- Field Kit use consumes the player’s action for that round.
- A Spent wildkin returns after an ordinary battle at 1 Resolve, preventing a dead roster slot but still encouraging a waypost visit.
- Major battles begin from an adjacent full-recovery point.

Do not build a large shop/consumable economy until repeated play proves that resource choice is missing.

## Defeat, retreat, and retry

- A wildkin at 0 Resolve becomes **Spent**: it withdraws its Accord participation and enters protective low activity. No death, shutdown, or “broken machine” language is used.
- If the active wildkin is Spent and no usable battle reserve remains, ordinary defeat returns the player to the last waypost without lost currency, Accord progress, or story state.
- Major defeat returns to immediately before the encounter with **Retry**, **Review Team**, and **Leave** options.
- Retreat from ordinary visible encounters succeeds by default. Story-bound encounters label the restriction before battle.
- Previously seen boss introductions can be skipped on retry.

Failure should preserve the lesson and remove the commute.

## Experience and readiness

- Any wildkin that participated receives 100% encounter experience.
- Carried reserves and the bonded refuge roster receive catch-up experience; begin testing at 80% and 70% respectively.
- Newly bonded wildkin are raised to no more than two readiness levels below the current highest story-appropriate member.
- Major encounters are balanced against critical-path experience only.
- The slice uses a shallow level range so a few optional battles create flexibility, not overwhelming stats.
- No Reweave/evolution trigger in the prototype depends on repetitive leveling.

If balance still produces grind, increase milestone readiness or reduce stat growth before adding repeatable high-yield encounters.

## Encounter construction

### Ordinary encounters

- A standard wild encounter begins 1v1 and normally contains one recruitable opponent.
- Target duration: 3–6 rounds, roughly 35–75 seconds after learning the UI.
- Each encounter demonstrates one readable pattern: focused Assault, Guard timing, Setup interruption, Disrupt recovery, or an Accord temperament.
- Groups are visible on the map and use habitat-appropriate species; a map group may visually contain several wildkin without turning the battle into a simultaneous multi-target fight.
- A scripted wild encounter may send a second opponent sequentially when the fiction and lesson justify it, but this is not the default catch encounter.
- Encounter density leaves room to avoid at least half the optional groups.

### Rival/wayfinder teams

- Communicate character through composition and sequencing.
- Use a plan the player can identify and disrupt.
- Use one active wildkin at a time; the sequence of reserves should create a plan across handoffs.
- A major rival may voluntarily switch once or twice when a visible tactical reason exists; do not secretly counter-pick the player’s command.
- Do not permit Accord.

### Guardians and autonomous coordinators

- Use authored phases tied to visible story states.
- Phase changes introduce one new problem at a time.
- Field actions appear only after being taught in exploration.
- Winning may require rescue, calming, surviving, exposing a safe protocol, or changing the environment rather than reducing Resolve to zero.

## Tavi battle specification

Tavi’s team is provisional and should use species available in the slice. Their plan:

1. Reedimp opens, Answers a Setup/Disrupt pattern, and builds shared Focus.
2. At a credible safe moment—and before Reedimp becomes Spent—Tavi spends a round switching to Loamlet. Loamlet stabilizes and forces a patient response.
3. After Loamlet becomes Spent, the already-weakened Reedimp returns for one brief handoff attempt. If the player made Reedimp Spent before the switch condition, this return is skipped.
4. Once both support partners are Spent, Kilnkit enters last as Tavi’s long-term companion and spends the accumulated Focus on a visible finishing sequence.

The player can stay in to protect Focus tempo, spend an action switching into a better Answer, knock Reedimp out before the handoff, or preserve a favored companion for Kilnkit. The low-Resolve return should last at most one or two rounds, keeping Kilnkit as the finale. Tavi’s one voluntary switch is authored for clarity rather than governed by a general hidden AI system.

This battle verifies that the player understands cross-switch Focus, free replacement after Spent, and the cost of a voluntary switch. Kilnkit’s role also repositions one former starter as a recognizable character companion.

## Orralume battle specification

### Phase 1 — Panic

- Frequent Assault intents with clear targets.
- Answering Assault removes one stack of **Wingbeat**, reducing pressure on the active wildkin.
- Teaches that survival is progress.

### Phase 2 — Fold

- Orralume becomes Guarded behind two scale-decoy targets.
- Feint/Break answers remove layers; blind area damage is less efficient but not invalid.
- Survey from the field-action menu can identify the real wing layer once.

### Phase 3 — Root rollback

- Orralume becomes Hushbound and repeats a three-turn Disrupt sequence.
- A Tune action makes the old consent interval available. Using Tune into the correct visible interval breaks one forced authorization lock; it does not command Orralume.
- The player must expose a small number of voluntary-response windows while managing active and reserve Resolve. Orralume’s own answer completes each release; raw damage cannot finish this phase.
- On success, the battle ends with Orralume rejecting the root rollback, accepting the open route, and broadcasting its own correct Chorus phrase.

The exact number of layers and locks should be minimized. The first test target is two of each.

## Information and speed requirements

- Intent icon plus color, shape, and text label; never color alone.
- Hold/help view explains every visible icon without leaving battle.
- Action previews update before confirmation.
- Repeated passive effects combine into one concise resolution line.
- Normal technique animations target under 1.5 seconds; signatures under 3 seconds; boss transitions under 5 seconds.
- Battle-speed options affect waits and animation pacing without hiding decision information.
- Health/Resolve changes and Open state remain visible during fast mode.

## Balance order

When a battle is not fun, tune in this order:

1. clarity of intent and outcome;
2. number of meaningful player options;
3. turn and animation length;
4. enemy composition/sequence;
5. technique values;
6. level/stat values;
7. encounter rewards.

Do not use higher enemy health to compensate for an unreadable or shallow pattern.

## Combat playtest questions

1. Can a first-time player predict what each intent category means after two encounters?
2. Does shared Focus create meaningful cooperation across switches or merely feed the strongest signature?
3. Is “Answer, switch, or stay” interesting without making every Aspect disadvantage demand a switch?
4. Do players use role techniques when Aspect damage is neutral?
5. Is Soothed worth carrying for Accord without becoming mandatory?
6. Can a favorite-based roster recover from a disadvantaged matchup?
7. Is an Orralume failure attributable to a specific missed response?
8. Do tooltips prevent external chart/reference use?
9. Does choosing actions feel like partnership rather than remote control once the story foregrounds synthetic personhood?
10. Does the difference between Accord and root rollback remain clear during Orralume’s final phase?
11. Does voluntary switching feel costly but useful, and is the incoming target rule immediately understood?
12. Is free replacement after Spent fast and free of punitive extra damage?

## Decisions awaiting approval

- Standard battles use one active wildkin per side, with sequential reserves.
- Voluntary switching consumes the round, resolves before ordinary techniques, and redirects the planned enemy action to the incoming wildkin.
- Replacement after becoming Spent is free before the next round; reserve Resolve persists.
- The player battle-party limit remains undecided.
- Four-technique kits and one shared 0–100 Focus meter that persists across switches.
- Four visible intent categories.
- Four universal temporary states.
- Deterministic, consensual Accord at Open state; the Wayglass has no root authority.
- Minimal randomness: small damage variance, no baseline misses or hidden criticals.
- Fast, consequence-light retry and whole-roster catch-up experience.
- Special multi-wildkin formats remain possible later but are exceptions, not the base architecture.
