/*:
 * @target MZ
 * @plugindesc HUSHWAKE foundation - direct graybox Battle Lab launcher.
 * @author OpenAI
 * @orderAfter Hushwake_FieldData
 * @orderAfter Hushwake_EncounterHud
 *
 * @help
 * Adds Battle Prototype to the title screen. Its compact selector launches
 * disposable Wildkin rosters for wild, Tuner, Field Data, and Level-up tests.
 */

(() => {
    "use strict";

    const Hushwake = (window.Hushwake = window.Hushwake || {});
    const Data = Hushwake.Data;
    const Battle = Hushwake.Battle;
    const Encounters = Hushwake.Encounters;
    const BattleLab = (Hushwake.BattleLab = Hushwake.BattleLab || {});

    BattleLab.testStrikeKey = "test_strike";

    BattleLab.isTestStrikeEnabled = function() {
        const encounter = Encounters ? Encounters.current() : null;
        const metadata = encounter ? encounter.battleMetadata : null;
        return !!(
            Battle.isActive() &&
            metadata &&
            metadata.enableTestStrike === true
        );
    };

    BattleLab.testStrikeSkill = function() {
        return Data.technique(this.testStrikeKey);
    };

    BattleLab.isTestStrikeAction = function(action, target) {
        const skill = action ? action.item() : null;
        return !!(
            this.isTestStrikeEnabled() &&
            skill &&
            skill.hushwake &&
            skill.hushwake.key === this.testStrikeKey &&
            target &&
            target.isEnemy &&
            target.isEnemy()
        );
    };

    const _Game_Wildkin_skills = Game_Wildkin.prototype.skills;
    Game_Wildkin.prototype.skills = function() {
        const skills = _Game_Wildkin_skills.call(this);
        if (!BattleLab.isTestStrikeEnabled()) {
            return skills;
        }
        const testStrike = BattleLab.testStrikeSkill();
        if (!testStrike || skills.some(skill => skill.id === testStrike.id)) {
            return skills;
        }
        return skills.concat(testStrike);
    };

    const _Game_Action_makeDamageValue =
        Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        if (BattleLab.isTestStrikeAction(this, target)) {
            return Math.max(0, target.hp);
        }
        return _Game_Action_makeDamageValue.call(this, target, critical);
    };

    BattleLab.modes = {
        wild: {
            name: "Wild Encounter",
            encounterKey: "milestone_1a"
        },
        tuner: {
            name: "Tuner Battle",
            encounterKey: "foundation_tuner"
        },
        fieldData: {
            name: "Field Data Test (Debug)",
            encounterKey: "field_data_test"
        },
        levelUp: {
            name: "Level-Up Test",
            encounterKey: "level_up_test",
            prepareLevelUp: true
        }
    };

    BattleLab.setupGrayboxRoster = function(mode) {
        const lineup = [
            { speciesKey: "briarkid", nickname: "Briarkid" },
            { speciesKey: "kilnkit", nickname: "Kilnkit" },
            { speciesKey: "rillip", nickname: "Rillip" }
        ];
        const instances = lineup.map(entry =>
            $gameWildkinRoster.createWildkin(entry.speciesKey, {
                nickname: entry.nickname,
                level: 5
            })
        );
        $gameWildkinRoster.setParty(
            instances.map(instance => instance.instanceId())
        );
        $gameWildkinRoster.setActiveLead(instances[0].instanceId());

        if (mode.prepareLevelUp) {
            for (const instance of instances) {
                instance.changeExp(
                    Math.max(
                        instance.currentLevelExp(),
                        instance.nextLevelExp() - 25
                    ),
                    false
                );
            }
        }
        return instances;
    };

    BattleLab.runFoundationChecks = function() {
        const serializationResult = Hushwake.Wildkin.serializationCheck();
        if (!serializationResult.passed) {
            throw new Error(
                "Wildkin serialization check failed: " +
                    JSON.stringify(serializationResult)
            );
        }

        const progressionResult =
            Hushwake.Wildkin.progressionSerializationCheck();
        if (!progressionResult.passed) {
            throw new Error(
                "Wildkin progression serialization check failed: " +
                    JSON.stringify(progressionResult)
            );
        }

        console.info(
            "[HUSHWAKE] Wildkin serialization checks passed.",
            {
                instances: serializationResult,
                progression: progressionResult
            }
        );
    };

    BattleLab.launch = function(modeKey) {
        const mode = this.modes[modeKey];
        if (!mode) {
            throw new Error("Unknown HUSHWAKE Battle Lab mode: " + modeKey);
        }

        DataManager.setupNewGame();
        this.setupGrayboxRoster(mode);
        this.runFoundationChecks();

        const troopId = Data.encounterId(mode.encounterKey);
        if (!troopId) {
            throw new Error(
                "HUSHWAKE encounter was not loaded: " + mode.encounterKey
            );
        }

        this._lastLaunchMode = modeKey;
        BattleManager.setup(troopId, true, true);
        Battle.begin();
        BattleManager.saveBgmAndBgs();
        SoundManager.playBattleStart();
        SceneManager.push(Scene_Battle);
    };

    function Window_HushwakeBattleLabCommand() {
        this.initialize(...arguments);
    }

    Window_HushwakeBattleLabCommand.prototype = Object.create(
        Window_Command.prototype
    );
    Window_HushwakeBattleLabCommand.prototype.constructor =
        Window_HushwakeBattleLabCommand;

    Window_HushwakeBattleLabCommand.prototype.makeCommandList = function() {
        for (const key of Object.keys(BattleLab.modes)) {
            this.addCommand(BattleLab.modes[key].name, key, true);
        }
        this.addCommand("Back", "cancel", true);
    };

    function Scene_HushwakeBattleLab() {
        this.initialize(...arguments);
    }

    Scene_HushwakeBattleLab.prototype = Object.create(
        Scene_MenuBase.prototype
    );
    Scene_HushwakeBattleLab.prototype.constructor = Scene_HushwakeBattleLab;

    Scene_HushwakeBattleLab.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_HushwakeBattleLab.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
    };

    Scene_HushwakeBattleLab.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        this._commandWindow.open();
        this._commandWindow.activate();
    };

    Scene_HushwakeBattleLab.prototype.commandWindowRect = function() {
        const width = 360;
        const height = this.calcWindowHeight(5, true);
        return new Rectangle(
            Math.floor((Graphics.boxWidth - width) / 2),
            Math.floor((Graphics.boxHeight - height) / 2),
            width,
            height
        );
    };

    Scene_HushwakeBattleLab.prototype.createCommandWindow = function() {
        this._commandWindow = new Window_HushwakeBattleLabCommand(
            this.commandWindowRect()
        );
        for (const key of Object.keys(BattleLab.modes)) {
            this._commandWindow.setHandler(
                key,
                this.commandLaunch.bind(this, key)
            );
        }
        this._commandWindow.setHandler(
            "cancel",
            this.popScene.bind(this)
        );
        this.addWindow(this._commandWindow);
    };

    Scene_HushwakeBattleLab.prototype.commandLaunch = function(modeKey) {
        this._commandWindow.close();
        this._commandWindow.deactivate();
        BattleLab.launch(modeKey);
    };

    window.Scene_HushwakeBattleLab = Scene_HushwakeBattleLab;

    const _Window_TitleCommand_makeCommandList =
        Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        _Window_TitleCommand_makeCommandList.call(this);
        this.addCommand("Battle Prototype", "hushwakeBattleLab", true);
    };

    const _Scene_Title_commandWindowRect =
        Scene_Title.prototype.commandWindowRect;
    Scene_Title.prototype.commandWindowRect = function() {
        const rect = _Scene_Title_commandWindowRect.call(this);
        rect.height = this.calcWindowHeight(4, true);
        rect.y =
            Graphics.boxHeight -
            rect.height -
            96 +
            $dataSystem.titleCommandWindow.offsetY;
        return rect;
    };

    const _Scene_Title_createCommandWindow =
        Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.call(this);
        this._commandWindow.setHandler(
            "hushwakeBattleLab",
            this.commandHushwakeBattleLab.bind(this)
        );
    };

    Scene_Title.prototype.commandHushwakeBattleLab = function() {
        this._commandWindow.close();
        SceneManager.push(Scene_HushwakeBattleLab);
    };
})();
