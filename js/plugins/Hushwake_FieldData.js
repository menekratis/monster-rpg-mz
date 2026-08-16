/*:
 * @target MZ
 * @plugindesc HUSHWAKE foundation - party-wide Field Data and Wildkin Levels.
 * @author OpenAI
 * @orderAfter Hushwake_Encounters
 * @orderAfter Hushwake_BattleHud
 *
 * @param dataLabel
 * @text Data Label
 * @type string
 * @default Data
 *
 * @param synchronizedText
 * @text Synchronization Message
 * @type string
 * @default Field Data synchronized.
 *
 * @param thresholdText
 * @text Threshold Message
 * @type string
 * @default Data threshold reached.
 *
 * @param coinSingular
 * @text Singular Currency Name
 * @type string
 * @default Wild Coin
 *
 * @param coinPlural
 * @text Plural Currency Name
 * @type string
 * @default Wild Coins
 *
 * @help
 * Pools Data yields from opposing Wildkin as they become Spent, then awards
 * the full accumulated amount to each non-Spent selected lineup member only
 * on victory.
 * Wild Coins reuse MZ's native party wallet. Data Levels reuse Game_Actor EXP,
 * class curves, changeExp, level-up handling, and level-based stat refresh.
 */

(() => {
    "use strict";

    const Hushwake = (window.Hushwake = window.Hushwake || {});
    const Battle = Hushwake.Battle;
    const Encounters = Hushwake.Encounters;
    const FieldData = (Hushwake.FieldData = Hushwake.FieldData || {});
    const parameters = PluginManager.parameters("Hushwake_FieldData");

    FieldData.settings = {
        dataLabel: String(parameters.dataLabel || "Data"),
        synchronizedText: String(
            parameters.synchronizedText || "Field Data synchronized."
        ),
        thresholdText: String(
            parameters.thresholdText || "Data threshold reached."
        ),
        coinSingular: String(parameters.coinSingular || "Wild Coin"),
        coinPlural: String(parameters.coinPlural || "Wild Coins")
    };

    FieldData.statSnapshot = function(wildkin) {
        return {
            resolve: wildkin.mhp,
            force: wildkin.atk,
            guard: wildkin.def,
            tempo: wildkin.agi
        };
    };

    FieldData.setupBattlePool = function() {
        const context = Battle.context();
        if (!context) {
            return;
        }
        context.fieldDataPool = 0;
        context.fieldDataEntries = [];
        context.fieldDataCollectedEnemyIndexes = [];
        this._lastAward = null;
        this._lastWildCoinReward = 0;
    };

    FieldData.enemyYield = function(enemy) {
        const data = enemy && enemy.enemy ? enemy.enemy() : null;
        const hushwake = data ? data.hushwake : null;
        return Math.max(
            0,
            Math.round(Number(hushwake ? hushwake.dataYield || 0 : 0))
        );
    };

    FieldData.currentPool = function() {
        const context = Battle.context();
        return {
            amount: context ? Number(context.fieldDataPool || 0) : 0,
            entries:
                context && Array.isArray(context.fieldDataEntries)
                    ? context.fieldDataEntries.map(entry =>
                          Object.assign({}, entry)
                      )
                    : []
        };
    };

    FieldData.logPoolDebug = function(entry) {
        const encounter = Encounters.current();
        const metadata = encounter ? encounter.battleMetadata : null;
        if (!metadata || !metadata.showDataPoolDebug) {
            return;
        }
        console.info(
            "[HUSHWAKE Battle Lab] Field Data pooled.",
            Object.assign({}, entry)
        );
    };

    FieldData.collectSpentEnemies = function(announce) {
        const encounter = Encounters.current();
        const context = Battle.context();
        if (
            !Battle.isActive() ||
            !encounter ||
            !encounter.qualifiesForFieldData ||
            !context
        ) {
            return [];
        }
        context.fieldDataPool = Number(context.fieldDataPool || 0);
        context.fieldDataEntries = Array.isArray(context.fieldDataEntries)
            ? context.fieldDataEntries
            : [];
        context.fieldDataCollectedEnemyIndexes = Array.isArray(
            context.fieldDataCollectedEnemyIndexes
        )
            ? context.fieldDataCollectedEnemyIndexes
            : [];

        const added = [];
        $gameTroop.members().forEach((enemy, enemyIndex) => {
            if (
                !enemy.isDeathStateAffected() ||
                context.fieldDataCollectedEnemyIndexes.includes(enemyIndex)
            ) {
                return;
            }
            const amount = this.enemyYield(enemy);
            context.fieldDataCollectedEnemyIndexes.push(enemyIndex);
            context.fieldDataPool += amount;
            const entry = {
                enemyIndex: enemyIndex,
                enemyName: enemy.name(),
                amount: amount,
                total: context.fieldDataPool
            };
            context.fieldDataEntries.push(entry);
            added.push(entry);
            if (announce !== false) {
                this.logPoolDebug(entry);
            }
        });
        return added;
    };
    Game_Wildkin.prototype.currentData = function() {
        return this.currentExp();
    };

    Game_Wildkin.prototype.dataForLevel = function(level) {
        return this.expForLevel(level);
    };

    Game_Wildkin.prototype.nextDataThreshold = function() {
        return this.nextLevelExp();
    };

    Game_Wildkin.prototype.gainFieldData = function(amount) {
        const gained = Math.max(0, Math.round(Number(amount || 0)));
        const oldLevel = this.level;
        const oldData = this.currentExp();
        const oldStats = FieldData.statSnapshot(this);
        this.changeExp(oldData + gained, false);
        return {
            instanceId: this.instanceId(),
            name: this.name(),
            amount: gained,
            oldData: oldData,
            newData: this.currentExp(),
            oldLevel: oldLevel,
            newLevel: this.level,
            oldStats: oldStats,
            newStats: FieldData.statSnapshot(this)
        };
    };

    FieldData.projectedLevel = function(wildkin, amount) {
        const targetData =
            wildkin.currentExp() + Math.max(0, Math.round(amount));
        let level = wildkin.level;
        while (
            level < wildkin.maxLevel() &&
            targetData >= wildkin.expForLevel(level + 1)
        ) {
            level++;
        }
        return level;
    };

    FieldData.canSynchronize = function(wildkin) {
        return !!wildkin &&
            wildkin.hp > 0 &&
            !wildkin.isDeathStateAffected();
    };

    FieldData.makeReward = function() {
        const encounter = Encounters.current();
        const context = Battle.context();
        if (
            !encounter ||
            !encounter.qualifiesForFieldData ||
            !context
        ) {
            return {
                amount: 0,
                recipients: [],
                excludedSpent: []
            };
        }
        this.collectSpentEnemies(false);
        const amount = Math.max(
            0,
            Math.round(Number(context.fieldDataPool || 0))
        );
        const instanceIds = Array.isArray(context.playerLineupIds)
            ? context.playerLineupIds
            : [];
        const selected = instanceIds
            .map(instanceId => {
                const wildkin = $gameWildkinRoster.instance(instanceId);
                if (!wildkin) {
                    return null;
                }
                return {
                    instanceId: instanceId,
                    name: wildkin.name(),
                    wildkin: wildkin
                };
            })
            .filter(entry => !!entry);
        const excludedSpent = selected
            .filter(entry => !this.canSynchronize(entry.wildkin))
            .map(entry => ({
                instanceId: entry.instanceId,
                name: entry.name
            }));
        const recipients = selected
            .filter(entry => this.canSynchronize(entry.wildkin))
            .map(entry => {
                const wildkin = entry.wildkin;
                return {
                    instanceId: entry.instanceId,
                    name: entry.name,
                    amount: amount,
                    oldData: wildkin.currentExp(),
                    oldLevel: wildkin.level,
                    newLevel: this.projectedLevel(wildkin, amount),
                    oldStats: this.statSnapshot(wildkin)
                };
            });
        return {
            amount: amount,
            recipients: recipients,
            excludedSpent: excludedSpent
        };
    };

    FieldData.queuePage = function(lines, holdFrames) {
        const logWindow = BattleManager._logWindow;
        if (!logWindow || lines.length === 0) {
            return;
        }
        logWindow.push("hushwakeShowFieldDataPage", lines);
        logWindow.push("hushwakeWait", Number(holdFrames || 60));
        logWindow.push("clear");
    };

    FieldData.queueResultFlow = function(reward) {
        if (!reward || reward.amount <= 0) {
            return;
        }
        const excludedSpent = Array.isArray(reward.excludedSpent)
            ? reward.excludedSpent
            : [];
        const summaryLines = [
            this.settings.synchronizedText,
            reward.amount + " " + this.settings.dataLabel + " received."
        ];
        if (excludedSpent.length > 0) {
            summaryLines.push(
                "Spent Wildkin could not synchronize Field Data."
            );
        }
        this.queuePage(summaryLines, 66);

        const advancementLines = [];
        for (const recipient of reward.recipients) {
            for (
                let level = recipient.oldLevel + 1;
                level <= recipient.newLevel;
                level++
            ) {
                advancementLines.push(
                    recipient.name + " advanced to Level " + level + "."
                );
            }
        }
        for (let index = 0; index < advancementLines.length; index += 2) {
            this.queuePage(
                [
                    this.settings.thresholdText,
                    ...advancementLines.slice(index, index + 2)
                ],
                72
            );
        }
    };

    FieldData.queueWildCoinResult = function(amount) {
        const coins = Math.max(0, Math.round(Number(amount || 0)));
        if (coins <= 0) {
            return;
        }
        const label =
            coins === 1
                ? this.settings.coinSingular
                : this.settings.coinPlural;
        this.queuePage([coins + " " + label + " received."], 66);
    };
    FieldData.award = function(reward) {
        const results = [];
        for (const recipient of reward ? reward.recipients : []) {
            const wildkin = $gameWildkinRoster.instance(
                recipient.instanceId
            );
            if (!wildkin) {
                continue;
            }
            const result = wildkin.gainFieldData(recipient.amount);
            if (result.newLevel !== recipient.newLevel) {
                throw new Error(
                    "Field Data level preview did not match the awarded Level."
                );
            }
            results.push(result);
        }
        this._lastAward = {
            amount: reward ? reward.amount : 0,
            recipients: results
        };
        return this._lastAward;
    };

    FieldData.lastAward = function() {
        return this._lastAward || null;
    };

    FieldData.lastWildCoinReward = function() {
        return Number(this._lastWildCoinReward || 0);
    };

    const _Battle_begin = Battle.begin;
    Battle.begin = function() {
        _Battle_begin.call(this);
        FieldData.setupBattlePool();
    };

    const _BattleManager_endAction = BattleManager.endAction;
    BattleManager.endAction = function() {
        _BattleManager_endAction.call(this);
        if (Battle.isActive()) {
            FieldData.collectSpentEnemies(true);
        }
    };

    Window_BattleLog.prototype.hushwakeShowFieldDataPage = function(lines) {
        this._lines = lines.slice();
        this._baseLineStack = [];
        this.refresh();
    };

    const _BattleManager_makeRewards = BattleManager.makeRewards;
    BattleManager.makeRewards = function() {
        _BattleManager_makeRewards.call(this);
        if (Battle.isActive()) {
            const encounter = Encounters.current();
            this._rewards.exp = 0;
            this._rewards.gold = encounter
                ? Math.max(
                      0,
                      Math.round(
                          Number(encounter.rewards.wildCoins || 0)
                      )
                  )
                : 0;
            this._rewards.fieldData = FieldData.makeReward();
            FieldData._lastWildCoinReward = this._rewards.gold;
        }
    };

    const _BattleManager_displayRewards = BattleManager.displayRewards;
    BattleManager.displayRewards = function() {
        if (!Battle.isActive()) {
            _BattleManager_displayRewards.call(this);
            return;
        }
        FieldData.queueResultFlow(this._rewards.fieldData);
        FieldData.queueWildCoinResult(this._rewards.gold);
    };

    const _BattleManager_gainExp = BattleManager.gainExp;
    BattleManager.gainExp = function() {
        if (!Battle.isActive()) {
            _BattleManager_gainExp.call(this);
            return;
        }
        FieldData.award(this._rewards.fieldData);
    };

    Hushwake.Wildkin.progressionSerializationCheck = function() {
        const roster = new Game_WildkinRoster();
        const first = roster.createWildkin("rillip", {
            nickname: "First Current",
            level: 4
        });
        const second = roster.createWildkin("rillip", {
            nickname: "Second Current",
            level: 4
        });
        roster.setParty([first.instanceId(), second.instanceId()]);
        roster.setActiveLead(first.instanceId());

        first.changeExp(first.nextLevelExp() - 10, false);
        second.changeExp(second.currentLevelExp() + 5, false);
        const firstBeforeStats = FieldData.statSnapshot(first);
        first.gainFieldData(20);
        first.setHp(Math.max(1, first.mhp - 13));

        const restored = JsonEx.makeDeepCopy(roster);
        restored.ensureValid();
        const restoredFirst = restored.instance(first.instanceId());
        const restoredSecond = restored.instance(second.instanceId());
        const passed =
            restoredFirst instanceof Game_Wildkin &&
            restoredSecond instanceof Game_Wildkin &&
            restoredFirst.instanceId() !== restoredSecond.instanceId() &&
            restoredFirst.speciesKey() === restoredSecond.speciesKey() &&
            restoredFirst.level === 5 &&
            restoredSecond.level === 4 &&
            restoredFirst.currentExp() === first.currentExp() &&
            restoredSecond.currentExp() === second.currentExp() &&
            restoredFirst.currentExp() !== restoredSecond.currentExp() &&
            restoredFirst.mhp > firstBeforeStats.resolve &&
            restoredFirst.atk > firstBeforeStats.force &&
            restoredFirst.def > firstBeforeStats.guard &&
            restoredFirst.agi > firstBeforeStats.tempo &&
            restoredFirst.hp === first.hp &&
            restoredFirst.techniqueKeys().join(",") ===
                first.techniqueKeys().join(",") &&
            restored.partyOrder().join(",") ===
                roster.partyOrder().join(",") &&
            restored.activeLeadId() === first.instanceId();

        return {
            passed: passed,
            firstId: restoredFirst ? restoredFirst.instanceId() : null,
            secondId: restoredSecond ? restoredSecond.instanceId() : null,
            firstLevel: restoredFirst ? restoredFirst.level : null,
            secondLevel: restoredSecond ? restoredSecond.level : null,
            firstData: restoredFirst ? restoredFirst.currentExp() : null,
            secondData: restoredSecond ? restoredSecond.currentExp() : null
        };
    };
})();
