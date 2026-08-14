/*:
 * @target MZ
 * @plugindesc HUSHWAKE foundation - wild and Tuner encounter definitions.
 * @author OpenAI
 * @orderAfter Hushwake_BattleSystem
 *
 * @help
 * Loads content-agnostic encounter and opponent definitions from
 * data/HushwakeEncounters.json. A Tuner is stored independently from the
 * active opposing Wildkin and remains stable across sequential replacements.
 */

(() => {
    "use strict";

    const Hushwake = (window.Hushwake = window.Hushwake || {});
    const Data = Hushwake.Data;
    const Battle = Hushwake.Battle;
    const Encounters = (Hushwake.Encounters = Hushwake.Encounters || {});

    window.$dataHushwakeEncounters = null;

    DataManager._databaseFiles.push({
        name: "$dataHushwakeEncounters",
        src: "HushwakeEncounters.json"
    });

    Data._opponentByKey = Object.create(null);
    Data._encounterByKey = Object.create(null);
    Data._encounterByTroopId = Object.create(null);

    Data.opponentDefinition = function(key) {
        return this._opponentByKey[String(key || "")] || null;
    };

    Data.encounterDefinition = function(key) {
        return this._encounterByKey[String(key || "")] || null;
    };

    Data.encounterForTroopId = function(troopId) {
        return this._encounterByTroopId[Number(troopId)] || null;
    };

    Encounters.requireUniqueKey = function(map, key, label) {
        if (!key) {
            throw new Error("HUSHWAKE " + label + " definition is missing a key.");
        }
        if (map[key]) {
            throw new Error("Duplicate HUSHWAKE " + label + " key: " + key);
        }
    };

    Encounters.normalizeOpponent = function(source) {
        const key = String(source.key || "");
        this.requireUniqueKey(Data._opponentByKey, key, "opponent");
        const lineup = Array.isArray(source.lineup)
            ? source.lineup.map(String)
            : [];
        if (lineup.length === 0) {
            throw new Error("HUSHWAKE opponent '" + key + "' has no lineup.");
        }
        for (const enemyKey of lineup) {
            if (!Data.enemyId(enemyKey)) {
                throw new Error(
                    "Unknown enemy template '" + enemyKey +
                    "' in opponent '" + key + "'."
                );
            }
        }
        const leadWildkin = String(source.leadWildkin || lineup[0]);
        if (!lineup.includes(leadWildkin)) {
            throw new Error(
                "Lead Wildkin '" + leadWildkin +
                "' is not in opponent '" + key + "' lineup."
            );
        }
        return {
            key: key,
            displayName: String(source.displayName || key),
            portrait: source.portrait
                ? {
                      faceName: String(source.portrait.faceName || ""),
                      faceIndex: Number(source.portrait.faceIndex || 0)
                  }
                : null,
            lineup: lineup,
            leadWildkin: leadWildkin,
            battleMetadata: Object.assign({}, source.battleMetadata || {}),
            introText: String(source.introText || ""),
            victoryText: String(source.victoryText || ""),
            defeatText: String(source.defeatText || ""),
            victoryHooks: Array.isArray(source.victoryHooks)
                ? source.victoryHooks.slice()
                : [],
            defeatHooks: Array.isArray(source.defeatHooks)
                ? source.defeatHooks.slice()
                : [],
            rewardHooks: Array.isArray(source.rewardHooks)
                ? source.rewardHooks.slice()
                : [],
            aiProfile: source.aiProfile
                ? String(source.aiProfile)
                : ""
        };
    };

    Encounters.normalizeEncounter = function(source) {
        const key = String(source.key || "");
        this.requireUniqueKey(Data._encounterByKey, key, "encounter");
        const type = String(source.type || "wild").toLowerCase();
        if (type !== "wild" && type !== "tuner") {
            throw new Error(
                "HUSHWAKE encounter '" + key + "' has invalid type '" + type + "'."
            );
        }
        const opponentKey = String(source.opponentKey || "");
        const opponent = opponentKey
            ? Data.opponentDefinition(opponentKey)
            : null;
        if (type === "tuner" && !opponent) {
            throw new Error(
                "Tuner encounter '" + key + "' has no valid opponent."
            );
        }
        if (type === "wild" && opponent) {
            throw new Error(
                "Wild encounter '" + key + "' cannot reference a Tuner."
            );
        }
        const enemyKeys = opponent
            ? opponent.lineup.slice()
            : Array.isArray(source.enemyKeys)
            ? source.enemyKeys.map(String)
            : [];
        if (enemyKeys.length === 0) {
            throw new Error("HUSHWAKE encounter '" + key + "' has no lineup.");
        }
        for (const enemyKey of enemyKeys) {
            if (!Data.enemyId(enemyKey)) {
                throw new Error(
                    "Unknown enemy template '" + enemyKey +
                    "' in encounter '" + key + "'."
                );
            }
        }
        const leadWildkin = opponent
            ? opponent.leadWildkin
            : String(source.leadWildkin || enemyKeys[0]);
        const leadIndex = enemyKeys.indexOf(leadWildkin);
        if (leadIndex < 0) {
            throw new Error(
                "Lead Wildkin '" + leadWildkin +
                "' is not in encounter '" + key + "' lineup."
            );
        }
        if (leadIndex > 0) {
            enemyKeys.splice(leadIndex, 1);
            enemyKeys.unshift(leadWildkin);
        }
        const rewards = Object.assign({}, source.rewards || {});
        rewards.wildCoins = Math.max(
            0,
            Math.round(Number(rewards.wildCoins || 0))
        );
        return {
            key: key,
            name: String(source.name || key),
            type: type,
            opponentKey: opponentKey,
            opponent: opponent,
            enemyKeys: enemyKeys,
            leadWildkin: leadWildkin,
            rewards: rewards,
            qualifiesForFieldData:
                source.qualifiesForFieldData !== false,
            battleMetadata: Object.assign({}, source.battleMetadata || {})
        };
    };

    const _Data_buildRuntimeDatabase = Data.buildRuntimeDatabase;
    Data.buildRuntimeDatabase = function() {
        _Data_buildRuntimeDatabase.call(this);
        if (this._hushwakeEncounterDefinitionsBuilt) {
            return;
        }
        if (!$dataHushwakeEncounters) {
            throw new Error("HushwakeEncounters.json was not loaded.");
        }

        for (const source of $dataHushwakeEncounters.opponents || []) {
            const opponent = Encounters.normalizeOpponent(source);
            this._opponentByKey[opponent.key] = opponent;
        }

        for (const source of $dataHushwakeEncounters.encounters || []) {
            const encounter = Encounters.normalizeEncounter(source);
            const troopId = $dataTroops.length;
            const troop = this.makeTroop(
                {
                    key: encounter.key,
                    name: encounter.name,
                    enemyKeys: encounter.enemyKeys
                },
                troopId
            );
            troop.hushwake = {
                encounterKey: encounter.key,
                type: encounter.type
            };
            $dataTroops.push(troop);
            this._encounterIdByKey[encounter.key] = troopId;
            this._encounterByKey[encounter.key] = encounter;
            this._encounterByTroopId[troopId] = encounter;
        }

        this._hushwakeEncounterDefinitionsBuilt = true;
    };

    Encounters.current = function() {
        const context = Battle.context();
        return context ? context.encounter || null : null;
    };

    Encounters.opponent = function() {
        const context = Battle.context();
        return context ? context.opponent || null : null;
    };

    Encounters.isTunerBattle = function() {
        const encounter = this.current();
        return !!encounter && encounter.type === "tuner";
    };

    Encounters.isWildEncounter = function() {
        const encounter = this.current();
        return !!encounter && encounter.type === "wild";
    };

    Encounters.remainingWildkin = function() {
        return Battle.isActive()
            ? $gameTroop
                  .members()
                  .filter(enemy => !enemy.isDeathStateAffected()).length
            : 0;
    };

    const _Battle_begin = Battle.begin;
    Battle.begin = function() {
        _Battle_begin.call(this);
        const encounter = Data.encounterForTroopId($gameTroop._troopId);
        const context = this.context();
        context.encounter = encounter;
        context.encounterKey = encounter ? encounter.key : "";
        context.encounterType = encounter ? encounter.type : "";
        context.opponent = encounter ? encounter.opponent : null;
        context.opponentDefinitionId = context.opponent
            ? context.opponent.key
            : "";
        context.playerLineupIds = $gameWildkinRoster
            ? $gameWildkinRoster.partyOrder()
            : [];
    };
})();
