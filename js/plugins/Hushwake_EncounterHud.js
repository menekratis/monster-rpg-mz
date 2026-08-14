/*:
 * @target MZ
 * @plugindesc HUSHWAKE foundation - graybox wild and Tuner battle presentation.
 * @author OpenAI
 * @orderAfter Hushwake_BattleHud
 * @orderAfter Hushwake_Encounters
 *
 * @param showTunerPortrait
 * @text Show Tuner Portrait
 * @type boolean
 * @default true
 *
 * @help
 * Presents encounter identity inside the unified bottom battle HUD. It does not
 * alter targeting, action order, switching, opposing lineups, or rewards.
 */

(() => {
    "use strict";

    const Hushwake = (window.Hushwake = window.Hushwake || {});
    const Battle = Hushwake.Battle;
    const Encounters = Hushwake.Encounters;
    const Hud = Hushwake.BattleHud;
    const Presentation = (Hushwake.EncounterHud =
        Hushwake.EncounterHud || {});
    const parameters = PluginManager.parameters("Hushwake_EncounterHud");

    Presentation.showTunerPortrait =
        parameters.showTunerPortrait !== "false";

    Presentation.queueLines = function(lines, holdFrames) {
        const logWindow = BattleManager._logWindow;
        if (!logWindow) {
            return false;
        }
        logWindow.push("clear");
        for (const line of lines.filter(text => !!text)) {
            logWindow.push("addText", line);
        }
        logWindow.push("hushwakeWait", Number(holdFrames || 48));
        logWindow.push("clear");
        return true;
    };

    Presentation.drawBottomContext = function(windowObject) {
        const encounter = Encounters.current();
        if (!encounter) {
            return false;
        }

        const opponent = Encounters.opponent();
        const active = Battle.activeEnemy();
        const remaining = Encounters.remainingWildkin();
        const total = $gameTroop.members().length;
        let textX = 0;

        windowObject.resetFontSettings();
        if (
            opponent &&
            this.showTunerPortrait &&
            opponent.portrait &&
            opponent.portrait.faceName
        ) {
            windowObject.drawFace(
                opponent.portrait.faceName,
                opponent.portrait.faceIndex,
                0,
                4,
                72,
                72
            );
            textX = 88;
        }

        windowObject.contents.fontSize = 15;
        windowObject.changeTextColor(ColorManager.systemColor());
        windowObject.drawText(
            opponent ? "TUNER BATTLE" : "WILD ENCOUNTER",
            textX,
            -7,
            windowObject.innerWidth - textX
        );

        windowObject.contents.fontSize = 26;
        windowObject.resetTextColor();
        windowObject.drawText(
            opponent
                ? opponent.displayName
                : active
                ? active.name()
                : encounter.name,
            textX,
            18,
            windowObject.innerWidth - textX
        );

        windowObject.contents.fontSize = 17;
        windowObject.changeTextColor(ColorManager.systemColor());
        const activeText = active ? "Active: " + active.name() : "";
        windowObject.drawText(
            activeText +
                (activeText ? "  •  " : "") +
                "Lineup remaining: " +
                remaining +
                "/" +
                total,
            textX,
            55,
            windowObject.innerWidth - textX
        );
        windowObject.resetFontSettings();
        return true;
    };

    Hud.registerBottomContext(
        Presentation.drawBottomContext.bind(Presentation)
    );

    const _Battle_begin = Battle.begin;
    Battle.begin = function() {
        _Battle_begin.call(this);
        const opponent = Encounters.opponent();
        if (
            opponent &&
            opponent.portrait &&
            opponent.portrait.faceName
        ) {
            ImageManager.loadFace(opponent.portrait.faceName);
        }
    };

    const _Battle_enemyEntryText = Battle.enemyEntryText;
    Battle.enemyEntryText = function(incoming) {
        const opponent = Encounters.opponent();
        if (opponent) {
            return opponent.displayName + " deploys " + incoming.name() + ".";
        }
        if (Encounters.isWildEncounter()) {
            return "A wild " + incoming.name() + " enters the battle.";
        }
        return _Battle_enemyEntryText.call(this, incoming);
    };

    const _BattleManager_displayStartMessages =
        BattleManager.displayStartMessages;
    BattleManager.displayStartMessages = function() {
        if (!Battle.isActive() || !Encounters.current()) {
            _BattleManager_displayStartMessages.call(this);
            return;
        }
        const opponent = Encounters.opponent();
        const active = Battle.activeEnemy();
        if (opponent) {
            Presentation.queueLines(
                [
                    opponent.introText ||
                        opponent.displayName + " challenges you.",
                    opponent.displayName +
                        " deploys " +
                        (active ? active.name() : "a Wildkin") +
                        "."
                ],
                60
            );
        } else {
            Presentation.queueLines(
                [
                    "A wild " +
                        (active ? active.name() : "Wildkin") +
                        " approaches."
                ],
                48
            );
        }
    };

    const _BattleManager_displayVictoryMessage =
        BattleManager.displayVictoryMessage;
    BattleManager.displayVictoryMessage = function() {
        if (!Battle.isActive() || !Encounters.current()) {
            _BattleManager_displayVictoryMessage.call(this);
            return;
        }
        const opponent = Encounters.opponent();
        const text = opponent
            ? opponent.victoryText ||
              opponent.displayName + "'s lineup is Spent."
            : "The wild encounter is resolved.";
        if (!Presentation.queueLines([text], 48)) {
            _BattleManager_displayVictoryMessage.call(this);
        }
    };

    const _BattleManager_displayDefeatMessage =
        BattleManager.displayDefeatMessage;
    BattleManager.displayDefeatMessage = function() {
        if (!Battle.isActive() || !Encounters.current()) {
            _BattleManager_displayDefeatMessage.call(this);
            return;
        }
        const opponent = Encounters.opponent();
        const text = opponent
            ? opponent.defeatText ||
              opponent.displayName + " holds the field."
            : "The team can no longer continue.";
        if (!Presentation.queueLines([text], 48)) {
            _BattleManager_displayDefeatMessage.call(this);
        }
    };
})();
