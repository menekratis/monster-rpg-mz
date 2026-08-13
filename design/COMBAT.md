# HUSHWAKE — Combat

> **Document status:** Revised first-draft combat specification. Accord now explicitly represents voluntary coordination, while root control remains story-only. Exact values are starting hypotheses; prove the loop with six wildkin first.

## Combat promise

Combat is a brisk three-wildkin coordination puzzle about reading intent, combining organic-synthetic capabilities, covering vulnerabilities, and creating a shared opening. It should retain the satisfaction of creature matchups while removing hidden capture odds, long move-message chains, and routine grinding.

The player should usually know **why** damage happened and what they could try next.

## Battle format

- The player fields **three active wildkin simultaneously**.
- Ordinary enemy groups contain one to three wildkin.
- Each active wildkin chooses one technique per turn unless Spent or explicitly disabled.
- Each wildkin equips up to **four techniques**: usually three core techniques and one Focus signature.
- The team shares one **Focus meter** from 0–100.
- Techniques have no consumable PP, ammunition, or battery chores. Wildkin metabolize, store, and recover battle energy as living systems. Signatures spend Focus; other strong effects rely on conditions or modest cooldowns only if testing proves repetition is a problem.
- Battle commands are **Techniques, Accord, Field, Retreat**. Items are handled through a small Field Kit, not a large battle inventory.

### Why three active creatures

- Team synergy happens on-screen rather than through frequent switch turns.
- Support and defensive wildkin remain visibly useful.
- RPG Maker MZ already supports party-based turns, reducing the number of systems that must be replaced.
- A three-slot team is small enough that changing one member meaningfully changes the plan.

The risk is command overload. If testing confirms that risk, reduce kit complexity and animation time before abandoning the format.

## Turn flow

### 1. Read

Each enemy displays one planned **intent category** before commands are selected. Direct attacks also show their expected target when target selection is part of the tactic. Bosses may obscure a target or combine intents only after those exceptions have been taught.

### 2. Plan

The player selects one technique for each available wildkin. The UI previews:

- target;
- Aspect result;
- predicted relative damage band;
- relevant intent response;
- Focus gained or spent;
- temporary states applied and duration.

### 3. Resolve

Actions resolve by explicit priority, then Tempo, then a stable tie rule. The log groups outcomes and avoids separate text boxes for every passive tick.

### 4. Open

The battle updates enemy Open/Accord state, Focus, temporary conditions, and next intents. Short phase-change moments may interrupt this step in major encounters.

## Enemy intents

| Intent | Meaning | Typical answer | Player lesson |
|---|---|---|---|
| **Assault** | Immediate damage or focused pressure | Guard, redirect, weaken | Protect the threatened slot and earn tempo |
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

Three active allies, intents, Aspects, and Focus already create information load. A large status catalog would turn readable tactics into icon management.

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

Avoid four near-identical attacks with different Aspects. Coverage belongs across a team, not on every individual.

## Accord, consent, and command fiction

The player choosing techniques is a playable abstraction of rapid shared planning through Accord. Wildkin are not puppets. Animation, non-blocking flavor, and story scenes should show them interpreting a plan, protecting one another, and retaining personality.

Accord operates at a mutual companion layer:

- either partner can end or refuse the link in fiction;
- it shares intent, sensory shorthand, and trusted tactical requests—not continuous thoughts;
- the Wayglass cannot rewrite memory, force Reweaving, or issue root commands;
- existing partner teams cannot be “captured” because lowered Resolve does not revoke a current relationship;
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
- One charge restores a clear percentage of Resolve to one ally; exact amount starts at 40%.
- Charges refill at wayposts and before major retries.
- Field Kit use consumes that wildkin’s action or one team action—the graybox should compare both models.
- A Spent wildkin returns after an ordinary battle at 1 Resolve, preventing a dead roster slot but still encouraging a waypost visit.
- Major battles begin from an adjacent full-recovery point.

Do not build a large shop/consumable economy until repeated play proves that resource choice is missing.

## Defeat, retreat, and retry

- A wildkin at 0 Resolve becomes **Spent**: it withdraws its Accord participation and enters protective low activity. No death, shutdown, or “broken machine” language is used.
- If the full trio is Spent, ordinary defeat returns the player to the last waypost without lost currency, Accord progress, or story state.
- Major defeat returns to immediately before the encounter with **Retry**, **Review Team**, and **Leave** options.
- Retreat from ordinary visible encounters succeeds by default. Story-bound encounters label the restriction before battle.
- Previously seen boss introductions can be skipped on retry.

Failure should preserve the lesson and remove the commute.

## Experience and readiness

- Active trio receives 100% encounter experience.
- Bonded reserve roster receives 70% catch-up experience.
- Newly bonded wildkin are raised to no more than two readiness levels below the current highest story-appropriate member.
- Major encounters are balanced against critical-path experience only.
- The slice uses a shallow level range so a few optional battles create flexibility, not overwhelming stats.
- No Reweave/evolution trigger in the prototype depends on repetitive leveling.

If balance still produces grind, increase milestone readiness or reduce stat growth before adding repeatable high-yield encounters.

## Encounter construction

### Ordinary encounters

- Target duration: 3–5 turns, roughly 45–90 seconds after learning the UI.
- Each group demonstrates one combination: focused Assault, shield plus Setup, tempo disruption, or an Accord temperament.
- Groups are visible on the map and use habitat-appropriate species.
- The same species can feel different in a mixed group without receiving random invisible traits.
- Encounter density leaves room to avoid at least half the optional groups.

### Rival/wayfinder teams

- Communicate character through composition and sequencing.
- Use a plan the player can identify and disrupt.
- Adapt once in major fights; do not secretly counter-pick the player’s commands.
- Do not permit Accord.

### Guardians and autonomous coordinators

- Use authored phases tied to visible story states.
- Phase changes introduce one new problem at a time.
- Field actions appear only after being taught in exploration.
- Winning may require rescue, calming, surviving, exposing a safe protocol, or changing the environment rather than reducing Resolve to zero.

## Tavi battle specification

Tavi’s team is provisional and should use species available in the slice. Their plan:

1. Latchling or Reedimp creates early tempo.
2. Loamlet establishes Guard/Seedbed.
3. Their starter charges a visible finisher behind that safety.

The player can answer the Setup, break the protection, or outlast the sequence. Tavi changes target priority once after the first interrupt. This battle verifies that the player can read a team plan rather than only isolated icons.

Starter selection should influence Tavi’s starter for contrast, but Tavi’s overall difficulty must not make one opening choice superior.

## Orralume battle specification

### Phase 1 — Panic

- Frequent Assault intents with clear targets.
- Answering Assault removes one stack of **Wingbeat**, reducing incoming area pressure.
- Teaches that survival is progress.

### Phase 2 — Fold

- Orralume becomes Guarded behind two scale-decoy targets.
- Feint/Break answers remove layers; blind area damage is less efficient but not invalid.
- Survey from the field-action menu can identify the real wing layer once.

### Phase 3 — Root rollback

- Orralume becomes Hushbound and repeats a three-turn Disrupt sequence.
- A Tune action makes the old consent interval available. Using Tune into the correct visible interval breaks one forced authorization lock; it does not command Orralume.
- The player must expose a small number of voluntary-response windows while keeping the trio active. Orralume’s own answer completes each release; raw damage cannot finish this phase.
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
2. Does the shared Focus meter create cooperation or merely feed the strongest signature?
3. Are three command choices per turn engaging at normal-battle frequency?
4. Do players use role techniques when Aspect damage is neutral?
5. Is Soothed worth a team slot for Accord without becoming mandatory?
6. Can a favorite-based team recover from a disadvantaged matchup?
7. Is an Orralume failure attributable to a specific missed response?
8. Do tooltips prevent external chart/reference use?
9. Does choosing actions feel like partnership rather than remote control once the story foregrounds synthetic personhood?
10. Does the difference between Accord and root rollback remain clear during Orralume’s final phase?

## Decisions awaiting approval

- Three active wildkin with four-technique kits.
- One shared 0–100 Focus meter.
- Four visible intent categories.
- Four universal temporary states.
- Deterministic, consensual Accord at Open state; the Wayglass has no root authority.
- Minimal randomness: small damage variance, no baseline misses or hidden criticals.
- Fast, consequence-light retry and whole-roster catch-up experience.
