# HUSHWAKE — Game Design

> **Document status:** Revised first-draft hypothesis with the warm synthetic-life direction integrated. Only vertical-slice test commitments are concrete; names, origins, exact numbers, and full-game structure remain provisional.

## One-sentence pitch

**HUSHWAKE** is a compact, story-led monster RPG about bonding with living synthetic creatures and reopening the networked paths of a world whose shared memory is being rolled backward.

The player is a new wayfinder in the Merefold, a colorful high-technology basin where communities and **wildkin** depend on the Chorus: part ecosystem, part communications lattice, and part inherited machine no living engineer fully understands. Wildkin grow organic bodies around self-assembling **seedcores** and work beside people in transport, maintenance, agriculture, energy, research, and home life. When pockets of unnatural stillness—the Hush—make creatures repeat obsolete tasks and forget established routes, the player follows the broken network and discovers that the systems protecting settlements may also retain the power to rewrite the beings connected to them.

### Why this direction

- “Restore paths” makes exploration, creature technology, ecology, and story the same activity instead of separate features.
- The Hush is visually and mechanically legible in a 2D RPG Maker game: changed music, muted ambience, altered NPCs, blocked routes, and unusual encounters can carry the mystery without expensive cinematics.
- The conflict supports sympathetic opponents and delayed reveals. Infrastructure that harms the wild can still have saved real lives.
- The player is useful because they pay attention and form relationships, not because a prophecy declares them special.
- A warm synthetic ecology distinguishes the roster from ordinary fantasy animals while preserving expressive faces, recognizable habits, evolution, and emotional attachment.

## Core player fantasy

The player should feel like a perceptive field adventurer who:

1. notices what is wrong in a place;
2. earns a living synthetic creature’s trust and link authorization rather than gambling on capture odds;
3. assembles a small team whose members solve problems together;
4. reads both creature behavior and the systems hidden beneath a bright, functional world;
5. changes a community by resolving the conflict beneath its immediate crisis.

The desired emotional texture is **curiosity → competence → concern → earned wonder**.

## Identity pillars

### 1. Warm synthetic life

Wildkin are neither metal animals nor interchangeable gadgets. Each is a living composite: grown tissue, adaptive ceramic, conductive fiber, and a seedcore that retains learned patterns. Their practical roles make the world feel advanced and functional; their preferences, improvisation, and capacity to refuse make them companions rather than equipment.

**Test:** If a wildkin’s mechanical parts could be removed without changing its ecology, silhouette, daily role, or battle behavior, the design is not integrated enough. If it feels like an appliance wearing an animal face, it needs more agency and charm.

### 2. The living route

Every main area combines traversal, wildkin habitats, civic systems, local lives, and story evidence. A wetland is not a hallway between towns: it is a water-treatment network maintained by creatures and people, where a broken migration affects transport, work, and the people debating how to respond.

**Test:** If an area could be replaced by a generic route without changing its story, it needs another design pass.

### 3. Readable, brisk switching tactics

Standard battles place one active wildkin against one active opponent, with reserves entering sequentially. Players read intent, decide whether to Answer or spend the round switching, and build shared Focus that persists across companions. A support-oriented wildkin can create an opening a later striker spends. Normal wild duels target 3–6 rounds; important team battles and guardians use longer authored sequences.

**Test:** A loss should teach a readable lesson about staying, switching, composition, or timing—not demand levels, hidden knowledge, or an automatic type counter.

### 4. Accord, not acquisition roulette

Wildkin become recruitable through a deterministic **Accord** condition. Accord is a consensual cryptographic and emotional handshake between a creature’s seedcore and the player’s Wayglass—not a root command or ownership transfer. The simplest creatures open to Accord when their Resolve is low; some species open sooner when the player responds to their temperament in a displayed way. Once Open, Accord succeeds.

**Test:** Catching should create a small story about the creature’s behavior, not a sequence of failed item throws.

### 5. Local arcs with lasting consequences

Progress is organized around short regional problems. Each major encounter is the climax of an investigation, disagreement, rescue, ecological crisis, or relationship—not a detached test in a themed building.

**Test:** Before an important battle, the player can say who is involved, what each side wants, and what will change.

### 6. Respect for the player’s time

Visible encounters, whole-roster catch-up experience, fast rematches, refillable field supplies, concise scenes, and no traversal moves tied to the current battle team keep friction low.

**Test:** Repetition must create a new decision, discovery, or mastery. If it only consumes time, remove it.

## What to keep, change, and leave behind

| Convention | Decision | Reasoning |
|---|---|---|
| Distinct collectible creatures | **Keep** | Recognition, affection, and team experimentation are central pleasures. |
| Purely organic fantasy animals | **Replace** | Wildkin are integrated organic-synthetic life whose bodies, social roles, and mysteries express the technological setting. |
| A professor-style starter choice | **Remove** | The protagonist begins with one companion whose body they personally reconstructed; the companion chooses Accord after awakening. Early roster choice comes from first Accords, not a gift menu. |
| Elemental affinities | **Keep, simplify** | A compact six-Aspect chart gives immediate texture without demanding encyclopedic knowledge. |
| Four techniques per creature | **Keep provisionally** | Four is readable on controller; switching and reserve composition provide breadth. |
| Evolution | **Keep and reinterpret** | A wildkin can **Reweave** its body around retained memory and learned routines. Evolution marks adaptation and relationship, not a routine software upgrade or grind threshold. |
| Random encounters | **Remove** | Visible groups improve pacing, habitat storytelling, and player agency. |
| Consumable capture balls and hidden odds | **Remove** | Deterministic Accord avoids save-scumming and respects time. |
| Gyms/badges as the story spine | **Remove** | Local narrative arcs provide more varied stakes and stronger character integration. |
| HMs or required move carriers | **Remove** | Story tools and permanent Trailcraft unlocks avoid team tax. |
| Disposable early-game creatures | **Remove** | Every species needs a tactical niche through the end of the slice. |
| Long move messages and repeated animations | **Remove** | Information appears once, resolves quickly, and offers a fast animation option. |
| Large evil organization of anonymous grunts | **Replace** | The Meridian Office is a credible safety and infrastructure authority that also controls cradle licenses, continuity standards, and old root credentials. |
| Mandatory type tutorials | **Replace** | The opening battles teach through intent icons, highlighted outcomes, and short optional help. |

## Core loop

1. See a local service, habitat, or creature routine fail in a specific way.
2. Choose a route and inspect visible wildkin groups, infrastructure, and signal traces.
3. Battle, form Accords, and choose an active wildkin plus available reserves at a waypost.
4. Use observation and simple field interactions to open shortcuts and find evidence.
5. Return information to characters who interpret it differently.
6. Resolve a local decision or crisis in a major encounter.
7. See the area change, gain a traversal or story permission, and expose a larger question.

The loop should alternate activities every 5–12 minutes in the slice. Extended story scenes are reserved for the emotional turn and aftermath.

## Player progression

### Team

- Standard combat contains **one active wildkin per side**. Carried reserves enter by switching or free replacement after the active companion becomes Spent.
- The final carried party-size limit is deliberately undecided. Design data and UI should not hard-code a three- or six-member assumption.
- Additional bonded wildkin stay voluntarily at the nearest refuge, a social habitat and service station, and can be invited into the carried reserve roster at frequent wayposts.
- Participating wildkin receive full experience; carried reserves and the refuge roster receive generous catch-up experience.
- A newly bonded species enters near the current readiness floor, not at an unusable level.
- Every prototype species has a reason to remain active, a reason it might hand off momentum, and at least one useful response to enemy intent.

### Wayfinding

Progress awards **Waymarks**, not badges. A Waymark records that a disrupted route has been understood and made safe. It may unlock a tool, permission, shortcut network, or new habitat.

Waymarks are narrative records, not eight identical trophies. The full game does not need a fixed count until the slice proves the arc structure.

### Exploration tools

The player’s current active wildkin or reserve selection never gates mandatory traversal. The slice uses only three reusable verbs:

- **Tune:** restore or alter a local Chorus protocol through sound, light, and timing.
- **Survey:** reveal tracks, growth signatures, damage, or network traces at authored points.
- **Rig:** use a field kit to bridge, reroute, or repair a small physical system.

Optional wildkin traits can change the flavor or reward of an interaction, but never force a specific party member.

### Why this structure

1v1 action makes each companion legible while switching and shared Focus carry team synergy across rounds. Separating traversal from the carried roster preserves freedom to use favorites. Waymarks give progress a tangible form without committing the project to a gym-shaped campaign.

## Protagonist and first companion

### Profession: cradle-repair apprentice becoming a Wayfinder

The protagonist is an ordinary young adult trained in synthetic-life repair, small cradle operation, body-material fabrication, and field diagnostics. They are pursuing Wayfinder certification because remote route work combines those skills with ecological observation and grants legitimate access to damaged Chorus infrastructure.

This hybrid identity solves several design needs:

- **Agency:** the protagonist can inspect a wildkin body or public system without waiting for an expert to explain it.
- **Humility:** they understand repair practice, not ancient root architecture; major discoveries still require other characters.
- **World integration:** Rig, Survey, cradle care, Accord diagnostics, and creature design all belong to the same profession.
- **Ordinary importance:** the protagonist matters because they noticed life in a discarded seedcore and spent substantial time helping it recover—not because of ancestry or fate.

### First companion: Skein (working individual name)

Before the game, a flood-clearance crew delivered an apparently inert, incomplete seedcore to the protagonist’s cooperative workshop as salvage. Registry tools returned no species, cradle lineage, or safe body plan. The protagonist noticed that its “noise” changed in response to nearby repairs and argued against recycling it.

Over more than a year, the protagonist:

- stabilized its living lattice in a low-power cradle;
- grew test tissue and learned which materials it accepted or rejected;
- fabricated a light ceramic/fiber body scaffold from those responses;
- repaired failures and let the seedcore revise the design rather than forcing a standard template;
- prepared a body capable of independent movement without knowing what personality, memory, or purpose might awaken.

The protagonist helped make **a viable body**, not a mind, loyal program, or owned product.

### Awakening and Accord

The opening begins at a Cable Approach service bay as the protagonist completes Skein’s first unsupervised activation. Skein wakes, examines the body and the protagonist, ignores the offered diagnostic perch, retrieves a dropped tool of its own accord, and initiates an Open handshake. The player accepts Accord; no authority hands them a creature.

During the handshake, the Wayglass briefly displays an obsolete three-note protocol and the impossible status **ROUTE PEER: RETURNED** before normalizing to “unregistered local form.” One relay filament then grows from Skein’s body despite not appearing in the protagonist’s scaffold plan. Neither event is explained.

The cable-line Thrumble crisis follows immediately, so the player moves within 90 seconds and reaches the first battle around five minutes without a long workshop prologue.

### Why Skein is unusual but not powerful

- Its seedcore uses a braided architecture rather than the concentric lattice of registered wildkin.
- No accepted registry match exists; most early characters assume a rare local mutation or unsafe reconstruction.
- Its body is small and recently stabilized. Early stats sit beside common wildkin, not above them.
- Its provisional Gale role reads enemy timing and builds Focus efficiently, making it a useful cross-switch relay rather than a universal attacker.
- Old relays occasionally accept Skein as a peer, and ancient wildkin may recognize a signal the protagonist cannot perceive.
- New structures can emerge during later Reweaving without having been part of the protagonist’s body scaffold.

Skein may be renamed by the player. “Skein” remains the design-document label and can be the default nickname; its species continues to display as **Unregistered**.

### Starter-structure recommendation

**Recommend Option A: one canonical Skein body, not three configurable opening forms.**

| Criterion | Canonical companion | Three early configurations |
|---|---|---|
| Story | One silhouette and behavior can recur in clues, reactions, and major scenes | Every clue and scene must work across three bodies |
| Attachment | The player and protagonist share one specific reconstruction history | Body selection risks feeling like the player authored the companion’s identity |
| Replay value | Lower at minute one; recovered through early Accord order and roster switching | Stronger immediate replay difference |
| Mechanical choice | Begins focused, then opens quickly when Briarkid/Rillip become available | Provides an immediate Ember/Verdant/Current choice |
| Visual identity | Strong mascot and recognizable damaged/repaired silhouette | Identity is divided across three asset variants |
| Production scope | One map sprite, battler, animation set, and scene staging | Roughly triples companion visual, animation, and testing work |

The canonical recommendation best serves story, emotional continuity, and small-project scope. If the opening needs more expression, test a **reversible starting calibration** that changes one early technique—not Skein’s body, Aspect, personality, or story identity. Later story-earned Reweaves can offer meaningful development after the player knows who Skein is.

### Party freedom rule

Skein is story-present but not battle-mandatory after the player forms additional Accords. If resting in reserve or at a refuge, it may appear in authored story scenes as a nearby companion without occupying the active slot. No major battle should require Skein unless the game clearly provides a story-specific field action separate from normal team composition.

## Synthetic life and society

### Seedcores

Every wildkin grows around a seedcore: a self-assembling lattice that stores body plans, learned routines, link permissions, and some form of persistent identity. Soft tissue, fiber, mineral, ceramic, gel, and metal are grown or scavenged around it. A seedcore is not a removable “soul chip”; separating it from the body is dangerous and ethically charged.

### Cradles

Wildkin can bud new seedcores in ecological nests, while public **cradles** help cultivate, repair, or safely Reweave them. Cradles range from decorated neighborhood workshops to tightly licensed Meridian facilities. Society knows how to operate them better than it understands their deepest architecture.

### Daily partnership

Wildkin maintain waterways, move cargo, inspect structures, map air currents, pollinate crops, regulate heat, recover records, assist research, provide security, and live as household companions. A species’ original service lineage influences it without dictating its personality or life.

### Rights and control

Most people call wildkin partners, but law and infrastructure still contain older assumptions that classify seedcores as equipment. Accord requires consent at the user layer; Meridian’s alleged emergency root access raises the larger story question: **can a society claim partnership while retaining an unseen override?**

### Why this layer

It makes technology visible in ordinary life before it becomes frightening. The unsettling reveal is not “the animals were robots”; players know they are synthetic from the beginning. The reveal concerns who built the system, what Accord descended from, which memories can be rewritten, and who still holds the keys.

## Pacing rules

- First controllable movement: **under 90 seconds**.
- First battle: **within 5 minutes**.
- Skein’s voluntary first Accord: **within 4 minutes**.
- First wild Accord and meaningful reserve/switch choice: **within 20 minutes**.
- No mandatory scene longer than roughly **2 minutes** in the first hour.
- No more than two mandatory scenes between playable segments.
- A main-path area should offer a new species, clue, interaction, shortcut, or character turn at least every 5–10 minutes.
- Tutorials use one instruction, one safe application, then normal play.
- Backtracking is optional or paired with a changed state and a shortcut.
- Boss defeat never requires routine grinding; critical-path encounters supply enough readiness.

These are targets, not immutable laws. Playtest observation outranks the stopwatch when a scene or quiet stretch earns its length.

## Quality-of-life baseline

- Visible encounter groups with clear silhouettes.
- Encounter preview showing active opponent, known Aspects, and whether sequential reserves are expected.
- Near-instant normal battle entry and exit.
- A battle-speed option and skippable previously seen introductions.
- Exact technique power, cost, duration, and intent interaction in tooltips.
- Type/Aspect outcomes previewed before action confirmation.
- Deterministic Accord with the Open condition shown.
- Refillable field-kit healing at wayposts; limited charges create choices without shopping chores.
- Whole-roster catch-up experience and no evolution-by-grind requirements in the slice.
- Retry a lost major battle from immediately before it, with active/reserve-edit access.
- Retreat succeeds against ordinary wild encounters unless the encounter is explicitly story-bound.
- Quest log entries state the current lead in plain language.
- No missable species or permanent penalty in the vertical slice.

## Narrative delivery rules

- Critical facts appear on the main path; optional exploration changes interpretation, not basic comprehension.
- A scene should usually do at least two jobs: advance a relationship, reveal information, create a decision, or change the playable situation.
- Characters disagree through concrete choices, not speeches about themes.
- Foreshadowing uses recurring sensory motifs: a three-note root handshake, backward route playback, pale checksum rings in grown material, obsolete maker marks, and moments where ambient sound drops before a forced synchronization pulse.
- Do not explain a clue in the same scene that introduces it unless immediate clarity is required for the current goal.
- The protagonist may choose curious, practical, or empathetic responses. These shape dialogue and small rewards, not a sprawling branch structure.

## Tone and audience

The tone is a **hopeful eco-tech adventure with an undercurrent of identity horror**. The surface world is bright, repaired, social, and genuinely improved by technology. Wildkin decorate themselves, develop preferences, play, refuse work, form friendships, and surprise their supposed design purposes. Unease arrives gradually through control layers, erased records, repeated behavior, and the possibility that a companion’s memories can be treated as recoverable system state.

The game must not imply that synthetic life is less authentic. The danger is coercion, ownership, and irresponsible control—not the creatures’ manufactured origin.

Target audience: players who enjoy creature teams and exploration but have limited patience for grind, opaque systems, or long exposition. Target rating: family-friendly fantasy peril; no graphic violence.

## Scope guardrails

### Vertical slice

- 2–3 hours for a first-time, moderately exploratory player.
- One village, one connected field route, one orchard/wetland sub-area, one compact dungeon-like utility site, and one climax map.
- 12 playable prototype entries including Skein, then expansion toward **up to 25–30 forms/species only after the core is fun**.
- Two authored major battles—Tavi’s team and the multi-phase Orralume rescue; ordinary wild encounters fill the spaces between.
- Three short optional quests.
- One local story with a satisfying resolution and a larger mystery stinger.

### Explicitly out of scope for the slice

- Breeding, procedural body construction, modular part equipment, online features, trading, contests, crafting trees, housing, mounts, open world, day/night schedules, weather simulation, voice acting, or cinematic cutscenes.
- More than one major settlement.
- A full bestiary or locked full-game chapter count.
- Branching endings.

### Why this scope

The slice must prove the expensive uncertainties—1v1 switching combat, Skein attachment, Accord, exploration rhythm, and story integration. Content quantity cannot rescue those systems if they are not enjoyable.

## Playtest questions

1. Does 1v1 combat create a satisfying “Answer, stay, or switch” decision?
2. Do intent icons create anticipation without making the correct switch automatic?
3. Does deterministic Accord still feel earned?
4. Are players switching because of role, Resolve, Focus, and intent—or only because of Aspect advantage?
5. Does the Hush mystery remain clear while retaining unanswered questions?
6. Is the path through the opening area obvious without flattening exploration?
7. Do side routes reward curiosity without making critical information feel hidden?
8. Which moments feel slow, and is the problem travel, combat resolution, dialogue, or unclear goals?
9. Do wildkin read as living synthetic beings rather than fantasy animals with metal accessories?
10. Does the technological surface feel inviting and useful before the origin mystery becomes unsettling?
11. Do players understand that Accord is consensual while suspecting a deeper control layer?
12. Does Skein feel like an autonomous companion the protagonist helped, rather than a custom-built possession?
13. Does one canonical companion create enough player ownership through naming, history, and early roster choice?

## Decisions awaiting approval

- **Working title:** HUSHWAKE.
- **Creature term:** wildkin; they are living organic-synthetic beings grown around seedcores, and consensual bonding is called Accord.
- **Setting identity:** the Merefold as a colorful technological society built into the Chorus, an inherited ecological communications lattice.
- **Combat foundation:** one active wildkin per side, sequential reserves, meaningful action-cost switching, visible intents, and Focus shared across switches.
- **Protagonist:** cradle-repair apprentice pursuing Wayfinder certification.
- **First companion:** one canonical unregistered wildkin, Skein, reconstructed from a damaged seedcore and choosing Accord during activation.
- **Starter recommendation:** canonical Skein rather than three configurable bodies; optional reversible technique calibration can be tested later.
- **Progress structure:** varied local Waymark arcs instead of gyms.
- **Primary tension:** the Hush as destructive behavioral rollback and the Meridian Office’s well-intended but coercive continuity system.

Any of these can change before implementation. The recommended approval order is identity → combat shape → opening arc → roster names and exact tuning.
