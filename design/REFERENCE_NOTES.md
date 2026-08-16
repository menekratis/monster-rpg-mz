# HUSHWAKE — External RPG Maker Reference Notes

> **Scope:** Developer-facing architectural observations from the supplied Pokémon Essentials v21.1 and Akea sources. These projects are read-only references. They are not dependencies, and no reference code or assets have been copied into HUSHWAKE.

## Pokémon Essentials patterns worth remembering

- **Persistent individual, static definition, battle adapter:** a Pokémon object carries mutable identity and progression state (including a personal ID, owner, level/experience, current HP, moves, and other individual values), while species, moves, trainers, encounters, and evolutions live in `GameData` registries. Battle battlers refer back to party entries rather than becoming the persistent source of truth. This strongly supports HUSHWAKE's existing split between Wildkin instances, content definitions, and battle state.
- **Party and storage are separate responsibilities:** trainer parties expose usable-member and all-fainted queries, while storage has its own box/container and transfer operations. HUSHWAKE should retain its separate Wildkin roster and selected battle lineup instead of coupling Wildkin ownership to the normal RPG Maker map party.
- **Battle lifecycle is divided by responsibility:** startup/shutdown, command selection, switching, attacks, end-of-round work, experience/move learning, scene presentation, AI, and debug behavior are separate script sections. Switching has explicit validation, registration, recall/replace, send-out, and on-entry stages. This is a useful model for keeping HUSHWAKE's battle controller, rewards, encounter context, and HUD modular.
- **Sequential opponents remain persistent party entries:** the active battler is replaced from the owning trainer's party, and the battle judges completion from the whole side rather than the current battler alone. HUSHWAKE already follows the appropriate 1-active-per-side version of this pattern.
- **Rewards are resolved from battle records:** defeated battlers retain participation records, and reward processing happens through a centralized battle phase. Essentials' actual eligibility rules are Pokémon-specific, but the architectural lesson is useful: record opponent outcomes once, then evaluate recipients and apply progression in a controlled result phase.
- **Data has schemas and validation:** human-editable PBS files separate species, moves, trainers, encounters, forms, and map metadata. Compiler code validates references and produces runtime registries. HUSHWAKE does not need a compiler yet, but stable IDs, schema checks, and clear validation errors will matter as its roster grows.
- **Persistence is registered and migratable:** save values define their own save/load/new-game behavior, and versioned conversions are separate from ordinary loading. This is a strong future model for evolving serialized Wildkin instances without making save compatibility logic part of battle code.
- **Map integration uses narrow entry points and hooks:** wild and trainer battle setup build an explicit battle context, apply rules, start the scene, process the outcome, and run end-of-battle handlers. Debug menus use registries of commands rather than one monolithic test script. HUSHWAKE's encounter definitions and Battle Lab should continue in this direction.
- **Evolution is a registry of triggers and callbacks:** evolution definitions, eligibility checks, after-battle checks, and presentation are separable. Future Reweaving should likewise keep content requirements, state transition, and UI presentation distinct.

## Akea patterns worth remembering

- **Add-ons declare relationships:** MZ plugin headers use `@base` and `@orderAfter`, while add-ons extend documented base-plugin seams. HUSHWAKE plugins should keep explicit load-order/dependency expectations where one module genuinely builds on another.
- **Core methods are extended by aliasing:** Akea wraps relevant MZ prototype methods instead of editing engine files. This matches HUSHWAKE's no-core-modification rule, although every alias still needs a small surface and compatibility guard.
- **Presentation actions can be queued as descriptors:** Akea translates configured action information into small action objects consumed by battler sprites. The useful principle is separation: combat decides what happened; presentation schedules how it is shown. A smaller HUSHWAKE-native queue could later support animation, replacement, and result sequencing without putting visual timing into Wildkin data.
- **Presentation capabilities are separate modules:** camera, battler positioning, perspective, gauges, cursor, afterimages, and other effects are add-ons rather than battle-model responsibilities. This supports retaining `Hushwake_BattleHud.js` and configurable staging as presentation layers.
- **Coordinate scopes are explicit:** Akea gauges distinguish global, HUD-relative, and battler-relative placement, and its positioning add-on accounts for game resolution. Future HUSHWAKE Intent-like special cues, conditions, Focus, or Accord/Open UI should similarly declare an anchor/scope instead of scattering coordinate assumptions through battle logic.
- **Plugin parameters and note/config data provide useful seams:** creator-facing values are kept outside core execution where practical. HUSHWAKE should add parameters or hooks when a real project variation appears, without prebuilding a generic editor.

## Patterns that do NOT fit HUSHWAKE

- Pokémon-specific capture odds, ownership rules, PC boxes, badges, items, breeding, EVs, move-learning behavior, multi-battler assumptions, and evolution triggers are not design defaults for HUSHWAKE.
- Essentials awards experience using participation and other Pokémon rules. HUSHWAKE's authoritative rule remains: after a qualifying victory, every selected Wildkin that is not Spent receives the full accumulated Field Data pool; participation is irrelevant and the pool is not split.
- Essentials' player/opponent party model should not replace HUSHWAKE's separate Wildkin roster, Tuner abstraction, or one-active-per-side encounter context.
- Akea's large animation command language would be premature for the graybox. Its use of executable text/`eval`, broad access to private engine state, and long prototype-alias chains would make validation and plugin compatibility harder.
- Akea's exact battler formulas, HUD construction, and animation behaviors should not replace the approved HUSHWAKE staging or bottom-HUD hierarchy.
- Neither project justifies universal enemy Intent reveal, an Answer system, Pokémon terminology, or changes to the approved switching, Spent, Field Data, Wild Coin, encounter, or Tuner rules.

## Potential future architectural improvements

1. Add a lightweight validation pass for duplicate/missing species, technique, encounter, Tuner, and lineup IDs, with Battle Lab-friendly error messages. Do this before building a compiler or editor.
2. Formalize a small battle lifecycle hook surface only as new systems need it: encounter prepared, opponent became Spent, replacement completed, victory result built, rewards committed, and battle disposed. Preserve a single authoritative reward commit.
3. Version Wildkin save data and add explicit migrations before introducing fields that cannot be safely defaulted, especially technique learning, instincts, Accord state, or Reweaving history.
4. Keep battle events/results as data records that presentation consumes. If animation complexity grows, introduce a small typed presentation queue rather than an open-ended script language.
5. Grow Battle Lab through registered scenarios and assertions for switching, sequential opponents, reward eligibility, persistence, and future Reweaving. Debug-only techniques must remain encounter-scoped and nonpersistent.
6. Keep HUSHWAKE's content registries project-specific for now, but avoid requiring named species, Skein, story rules, or balance constants inside reusable instance/battle modules.

These are future guardrails, not authorization to redesign the current architecture. The existing Wildkin instance model, separate roster, 1v1 switching loop, Tuner context, sequential opponents, Field Data flow, save integration, staging, and HUD remain authoritative.

## Licensing and reuse notes

- The supplied Pokémon Essentials package contains PBS data and a compiled `Data/Scripts.rxdata` archive but no standalone Ruby source files, LICENSE, COPYING, or README stating reuse terms. Its only documentation shortcut points to the Essentials community wiki; a generic credits-screen statement is not a software license. Treat all Essentials code and assets as reference-only unless the relevant upstream license and asset provenance are verified separately.
- All 14 JavaScript files in the supplied `Akea-master` source folder state in their headers that they are released under the zlib License and identify their authors/URLs. The supplied folder does not include a standalone copy of the full license text. If any code reuse is ever proposed, first verify the upstream license version and preserve required notices and attribution.
- The Akea demo also contains third-party battler assets with separate usage terms and attribution instructions. Those asset terms are independent of the plugin source license. Do not move demo assets into HUSHWAKE without a separate provenance review.
- No substantial implementation code, data, text, or assets from either reference was copied during this study. Prefer independently written, HUSHWAKE-native MZ implementations.
