# HUSHWAKE — Combat

> **Document status:** Revised combat foundation. The approved 1v1 switching loop, Wild/Tuner encounter distinction, selected-lineup Field Data, and no-universal-prediction rule are canonical. Focus, signatures, Accord combat, advanced conditions, and final balance remain deferred.

## Combat promise

Combat is a brisk **1v1 active duel with reserves** about current matchup state, technique choice, Resolve management, and whether spending the round to switch is worth it. It should retain the satisfaction of creature matchups while avoiding universal enemy-action prediction, hidden capture odds, long move-message chains, routine grinding, and imitation of a basic type-checking battle system.

The player should usually know **why** damage happened and what they could try next.

## Battle format

- Standard combat has **one active player wildkin and one active opposing wildkin**.
- Either side may have reserve wildkin. Opposing wayfinders normally send their next reserve after the active one becomes Spent.
- One active wildkin chooses one technique per round unless Spent or explicitly unable to act.
- Each Wildkin may eventually equip up to **four techniques**. The current foundation uses available core techniques and does not implement a signature slot or replacement UI.
- A future player-team **Focus meter** may persist across switches, allowing one companion to prepare an opening another spends. Focus and signatures are not implemented in this milestone.
- Techniques have no consumable PP, ammunition, or battery chores. Wildkin metabolize, store, and recover battle energy as living systems. Strong effects may later rely on visible conditions, signatures, or modest cooldowns if testing proves repetition is a problem.
- Battle commands are **Techniques, Switch, Accord, Field, Retreat**. Items are handled through a small Field Kit, not a large battle inventory.
- The final number of wildkin allowed in the player’s carried battle party is **not yet decided**. UI and balance specifications should say “active” and “reserves,” not assume a three- or six-member limit.
- 2v2 battles, simultaneous multi-wildkin encounters, and other formats may appear later as authored exceptions. They are not the standard architecture and are outside the first graybox.

### Why 1v1 with reserves

- One command per round keeps state readable and gives each companion more screen presence.
- Switching turns roster construction into play rather than a decision made entirely before battle.
- Future shared Focus may preserve cooperation across time, but the current foundation must work without it.
- Sequential opposing teams let an authored battle reveal character strategy without crowding the screen or multiplying simultaneous effects.
- The format is easier to communicate and animate at RPG Maker scope while leaving rare multi-wildkin encounters special.

The main risk is that Aspect advantage makes switching automatic. Current Resolve, known techniques, prior opponent behavior, visible conditions, future team resources, and the action cost of switching must make “stay or switch?” a genuine decision rather than a rote matchup correction.

## Encounter types

### Wild Encounter

A Wild Encounter is against autonomous or unbonded Wildkin. No opposing Tuner exists in battle context. Ordinary Wild Encounters normally use one opponent, though authored sequential wild lineups remain possible.

### Tuner Battle

A Tuner Battle is against another character who bonds with and coordinates an ordered Wildkin lineup. **Wildkin Tuner**, normally shortened to **Tuner**, is the canonical role name. The battle stores the opposing Tuner independently from the active Wildkin, including a stable definition ID, display name, optional portrait/presentation reference, ordered lineup and lead, battle metadata, victory/defeat text hooks, reward hooks, and a future AI/profile reference.

Tuner ownership belongs to encounter/opponent data, never a species template. Sequential enemy replacement remains the baseline. Advanced Tuner AI and voluntary switching are deferred unless a specific authored battle later requires them.

## Switching baseline

Switching is an important tactical action, but detailed edge cases remain a playtest topic.

- A voluntary switch uses the player’s action for that round.
- A normal switch resolves before ordinary techniques.
- The opponent’s already-planned action proceeds against the incoming wildkin when its target remains valid.
- If the active wildkin becomes Spent, choosing an available replacement is free before the next round.
- Reserve wildkin retain their current Resolve.
- Future shared Focus is expected to persist when switching; no Focus state exists in the current milestone.
- Opposing teams automatically send the next planned reserve after one becomes Spent; important Tuners may later make a limited authored voluntary switch when their strategy calls for it.
- Retreat and Accord remain separate commands; switching never manipulates recruitment odds.

Provisional state persistence, switch-lock effects, pursuit attacks, entry hazards, and elaborate switch passives are intentionally **not** part of the first specification. Add one only when playtesting identifies a concrete tactical gap.

## Turn flow

### 1. Observe

The player sees the active Wildkin, current/max Resolve, Aspects when known, visible conditions, lineup context, and the results of prior actions. Standard combat does **not** reveal the opponent's selected action automatically.

### 2. Plan

The player selects one technique for the active Wildkin, switches to a reserve, or uses another available command. Technique UI previews the target, Aspect result, predicted relative damage band, and directly stated effects. A switch preview shows the incoming Wildkin's current Resolve and Aspects, and explains that switching consumes the round and valid committed attacks hit the incoming Wildkin. It does not claim to know the opponent's next action.

### 3. Resolve

Both sides choose actions before resolution. Actions resolve by explicit priority, then Tempo, then a stable tie rule. A voluntary switch resolves before ordinary techniques, so a valid opposing attack targets the incoming Wildkin. The log groups outcomes and avoids separate text boxes for every passive tick.

### 4. Continue or replace

The battle updates Resolve, visible conditions, and available reserves. A Spent side chooses or sends its replacement before the next decision. Short phase changes may interrupt this sequence in major encounters.

## Enemy information and limited prediction

Universal enemy Intent reveal and the Answer system are not standard battle features. Assault, Guard, Setup, and Disrupt may survive as internal design vocabulary or recognizable technique families, but the HUD does not expose a guaranteed category every round and techniques do not receive a baseline Answer bonus.

Fair information instead comes from known technique sets, prior actions, animation and dialogue cues, visible charges or conditions, authored boss phases, and consistent AI patterns. A particular Wildkin may later earn explicit prediction through an Instinct, technique, scouting effect, or similar limited capability. Such an effect must state its scope and must not silently become a global battle rule.

## Future Focus and signatures

Focus and signatures remain compatible with the 1v1 architecture but are not part of this milestone. The eventual design may use one player-team meter that persists across switches so support actions can prepare later companions. Its gain rules must not depend on universal Intent/Answers, and exact values should be designed only after the no-Focus foundation is playtested.

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

Aspect advantage should matter without deciding an encounter at team selection. Current Resolve, technique utility, target pressure, switching cost, and role synergy must remain viable on neutral teams. A player using favorites should be able to win the slice with sound tactics.

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
- No hidden random critical hits initially. Critical-style bursts should be created by visible states, conditions, or future signatures the player can predict.
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

Switching, Aspects, technique previews, and reserve Resolve already create information load. A large status catalog would turn readable tactics into icon management.

## Technique structure

Every technique entry should specify:

- target pattern;
- Aspect;
- priority;
- power or exact support effect;
- conditional or visible-state interaction, if any;
- future Focus gain or cost, if that deferred system uses the technique;
- state and duration;
- animation-length target;
- AI valuation notes where relevant.

### Kit construction rule

A prototype wildkin normally receives:

1. one reliable damaging technique;
2. one role technique for defense, interruption, cleanse, or pressure;
3. one identity technique for support, matchup shaping, or tempo;
4. one future signature only after Focus is implemented and proven.

Avoid four near-identical attacks with different Aspects. Coverage belongs across a reserve roster, not on every individual. Each kit should also answer: **why would I keep this wildkin active, and why might I switch after it acts?**

## Accord, consent, and command fiction

The player choosing techniques is a playable abstraction of rapid shared planning through Accord. Wildkin are not puppets. Animation, non-blocking flavor, and story scenes should show them interpreting a plan, protecting one another, and retaining personality.

Accord operates at a mutual companion layer:

- either partner can end or refuse the link in fiction;
- it shares tactical plans, sensory shorthand, and trusted requests—not continuous thoughts;
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

## Field Data, Levels, and readiness

Player-facing progression is **Data** or, after battle, **Field Data**. Internal use of RPG Maker MZ's native EXP storage is acceptable and preferred.

- After a victorious qualifying battle, every Wildkin in the player's currently selected battle lineup receives the full base Data reward.
- Participation is not required. Reserves receive the same amount as the active Wildkin.
- The reward is not divided, and there are no participation bonuses or reserve penalties.
- Wildkin outside the selected battle lineup receive no base reward under the current rule; refuge catch-up remains an open design point.
- Standard result language is **“Field Data synchronized.”** A Level threshold uses **“Data threshold reached.”** followed by **“[Name] advanced to Level [N].”**
- Levels update Resolve/HP, Force/ATK, Guard/DEF, and Tempo/AGI through provisional species growth.
- Newly bonded Wildkin should eventually enter near the current readiness floor, but that onboarding rule is not implemented here.
- Major encounters are balanced against critical-path Field Data only.
- No Reweave trigger in the prototype depends on repetitive leveling.

Future level-based technique learning should use species/content data and the persistent Wildkin instance. Native MZ skill-learning hooks may be reused where safe, but the forced four-technique replacement UI is deferred.

If balance still produces grind, increase milestone readiness or reduce stat growth before adding repeatable high-yield encounters.

## Encounter construction

### Ordinary Wild Encounters

- A standard Wild Encounter begins 1v1 and normally contains one recruitable opponent.
- Target duration remains 3–6 rounds, roughly 35–75 seconds after learning the UI.
- Each encounter demonstrates one readable pattern through technique history, visible state, consistent behavior, or an Accord temperament—not automatic next-action disclosure.
- Groups are visible on the map and use habitat-appropriate species; a map group may visually contain several Wildkin without becoming simultaneous multi-target combat.
- A scripted Wild Encounter may send a second opponent sequentially when fiction and lesson justify it, but this is not the default.
- Encounter density leaves room to avoid at least half the optional groups.

### Tuner teams

- Communicate character through composition, ordered lineups, presentation, and sequencing.
- Store the Tuner independently from the currently active opposing Wildkin.
- Use one active Wildkin at a time; reserves enter sequentially.
- The technical foundation supports stable opponent ID, display name, optional portrait, lead and lineup, battle metadata, victory/defeat text hooks, reward hooks, and future AI profile hooks.
- Advanced Tuner AI and voluntary switching are deferred.
- Do not permit Accord with another Tuner's bonded lineup.

### Guardians and autonomous coordinators

- Use authored phases tied to visible story states.
- Phase changes introduce one new problem at a time.
- Field actions appear only after being taught in exploration.
- Winning may require rescue, calming, surviving, exposing a safe protocol, or changing the environment rather than reducing Resolve to zero.

## Tavi Tuner battle specification

Tavi's eventual team is provisional and should use species available in the slice. Tavi is represented as a Tuner independently from the current opposing Wildkin. Their authored plan may later use Reedimp, Loamlet, and Kilnkit in sequence, but advanced AI, voluntary Tuner switching, Focus, and signatures are outside the current foundation.

The present technical requirement is that Tavi's stable identity, text hooks, metadata, and ordered lineup survive every sequential replacement. The battle ends only when the entire lineup is Spent, and every member of the player's selected lineup receives the full Field Data reward on victory.

## Orralume battle specification

Orralume remains a later authored guardian encounter rather than part of this milestone. Its future phases may use direct pressure, layered Guard, visible preparation, and a Tune-based consent interval. Those cues are authored encounter state, not a universal Intent reveal or Answer system. Raw damage cannot finish the final rescue phase; Orralume's own voluntary response completes it.

## Information and speed requirements

- Standard HUD information includes active names, Resolve, Aspect/damage preview, visible conditions when implemented, encounter identity, and concise battle messages.
- The opponent's selected action is not revealed automatically.
- Any future prediction effect must identify its special source and scope.
- Hold/help view explains every visible icon without leaving battle.
- Action previews update before confirmation.
- Repeated passive effects combine into one concise resolution line.
- Normal technique animations target under 1.5 seconds; future signatures under 3 seconds; boss transitions under 5 seconds.
- Battle-speed options affect waits and animation pacing without hiding decision information.
- Resolve changes and future Open state remain visible during fast mode.

## Balance order

When a battle is not fun, tune in this order:

1. clarity of available information and outcome;
2. number of meaningful player options;
3. turn and animation length;
4. enemy composition/sequence;
5. technique values;
6. level/stat values;
7. Field Data rewards.

Do not use higher enemy health to compensate for an unreadable or shallow pattern.

## Combat playtest questions

1. Can a first-time player make informed choices from known techniques, prior behavior, visible state, and authored cues without universal action prediction?
2. Does the 1v1 loop remain interesting before Focus and signatures are added?
3. Is “act, switch, or stay” interesting without making every Aspect disadvantage demand a switch?
4. Do players use role techniques when Aspect damage is neutral?
5. Can a favorite-based roster recover from a disadvantaged matchup?
6. Does voluntary switching feel costly but useful, and is the incoming target rule immediately understood?
7. Is free replacement after Spent fast and free of punitive extra damage?
8. Does a Tuner remain clearly present as opponent while their Wildkin replace one another?
9. Does every selected lineup member receive the same full Field Data amount, including unused reserves?
10. Are Level gains and resulting Resolve/Force/Guard/Tempo increases understandable?
11. Does choosing actions feel like partnership rather than remote control once Wildkin speak and exercise judgment?

## Decisions awaiting approval

- Standard battles use one active Wildkin per side, with sequential reserves.
- Voluntary switching consumes the round, resolves before ordinary techniques, and redirects a valid committed enemy action to the incoming Wildkin.
- Replacement after becoming Spent is free before the next round; reserve Resolve persists.
- The player battle-party limit remains undecided.
- Wild Encounters have no opposing Tuner; Tuner Battles keep stable opponent identity separate from the active Wildkin and ordered lineup.
- No universal enemy Intent reveal and no baseline Answer system. Limited prediction may return through explicit special abilities.
- Up to four techniques remains a provisional kit target; Focus, signatures, and replacement UI are deferred.
- Deterministic, consensual Accord remains future work; the Wayglass has no root authority.
- Minimal randomness: small damage variance, no baseline misses or hidden criticals.
- Qualifying victories grant the full base Field Data reward to every selected battle-lineup member.
- Native MZ EXP storage, class curves, and level-up handling may implement player-facing Data and Levels.
- Special multi-Wildkin formats remain possible later but are exceptions, not the base architecture.
- Wildkin are intelligent partners and may communicate verbally; command selection remains an abstraction of cooperative planning.
