/*:
 * @target MZ
 * @plugindesc HUSHWAKE Milestone 1A - direct graybox Battle Lab launcher.
 * @author OpenAI
 *
 * @help
 * Adds Battle Prototype to the title screen. It creates disposable graybox
 * Wildkin instances and launches the Milestone 1A encounter directly.
 */

(() => {
    "use strict";

    const Hushwake = (window.Hushwake = window.Hushwake || {});
    const Data = Hushwake.Data;
    const Battle = Hushwake.Battle;
    const BattleLab = (Hushwake.BattleLab = Hushwake.BattleLab || {});

    BattleLab.setupGrayboxRoster = function() {
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
        return instances;
    };

    BattleLab.launch = function() {
        DataManager.setupNewGame();
        this.setupGrayboxRoster();

        const serializationResult = Hushwake.Wildkin.serializationCheck();
        if (!serializationResult.passed) {
            throw new Error(
                "Wildkin serialization check failed: " +
                    JSON.stringify(serializationResult)
            );
        }
        console.info(
            "[HUSHWAKE] Wildkin serialization check passed.",
            serializationResult
        );

        const troopId = Data.encounterId("milestone_1a");
        if (!troopId) {
            throw new Error("HUSHWAKE Milestone 1A encounter was not loaded.");
        }
        BattleManager.setup(troopId, true, true);
        Battle.begin();
        BattleManager.saveBgmAndBgs();
        SoundManager.playBattleStart();
        SceneManager.push(Scene_Battle);
    };

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
        rect.y = Graphics.boxHeight - rect.height - 96 +
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
        BattleLab.launch();
    };
})();
