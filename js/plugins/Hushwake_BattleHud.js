/*:
 * @target MZ
 * @plugindesc HUSHWAKE Milestone 1A.5 - compact battler overlays and unified battle HUD.
 * @author OpenAI
 * @orderAfter Hushwake_BattleSystem
 *
 * @param overheadWidth
 * @text Overhead Width
 * @type number
 * @min 160
 * @default 232
 *
 * @param overheadHeight
 * @text Overhead Height
 * @type number
 * @min 48
 * @default 58
 *
 * @param overheadGap
 * @text HUD-to-Battler Gap
 * @type number
 * @min 0
 * @default 22
 *
 * @param edgeMargin
 * @text Screen Edge Margin
 * @type number
 * @min 0
 * @default 8
 *
 * @param playerBattlerX
 * @text Player Battler X
 * @type number
 * @min 0
 * @default 270
 *
 * @param playerBattlerY
 * @text Player Battler Y
 * @type number
 * @min 0
 * @default 370
 *
 * @param enemyBattlerX
 * @text Enemy Battler X
 * @type number
 * @min 0
 * @default 570
 *
 * @param enemyBattlerY
 * @text Enemy Battler Y
 * @type number
 * @min 0
 * @default 280
 *
 * @param commandWidth
 * @text Command Area Width
 * @type number
 * @min 160
 * @default 192
 *
 * @param techniqueListWidth
 * @text Technique List Width
 * @type number
 * @min 240
 * @default 320
 *
 * @param switchListWidth
 * @text Switch List Width
 * @type number
 * @min 400
 * @default 496
 *
 * @param showResolveNumbers
 * @text Show Resolve Numbers Overhead
 * @type boolean
 * @on Show
 * @off Hide
 * @default false
 *
 * @param resolveLabel
 * @text Resolve Label
 * @type string
 * @default Resolve
 *
 * @help
 * Presentation-only graybox HUD for one-active-per-side battles.
 *
 * Active battlers receive a compact, frameless name and Resolve bar overlay.
 * Player and enemy home coordinates are configurable here so battle staging
 * remains presentation-only. Player motion automatically faces and advances
 * toward the configured enemy position.
 * The native battle log is restyled and moved into the bottom HUD beside the
 * command window. Technique help, target previews, switch guidance, Spent
 * messages, and handoff messages reuse that same bottom area.
 *
 * The plugin reads only standard battler/action data plus the optional
 * Hushwake.Battle preview helpers. Species, encounter, story, and balance data
 * do not belong here. Later presentation modules can use the left-side bottom
 * context area for encounter identity, future limited Intent effects, Focus,
 * conditions, and Accord without changing the battler data model.
 */

(() => {
    "use strict";

    const Hushwake = (window.Hushwake = window.Hushwake || {});
    const Battle = Hushwake.Battle;
    const Hud = (Hushwake.BattleHud = Hushwake.BattleHud || {});
    const parameters = PluginManager.parameters("Hushwake_BattleHud");

    const numberParameter = function(name, fallback) {
        const value = Number(parameters[name]);
        return Number.isFinite(value) && value > 0 ? value : fallback;
    };

    const booleanParameter = function(name, fallback) {
        if (parameters[name] === "true") {
            return true;
        }
        if (parameters[name] === "false") {
            return false;
        }
        return fallback;
    };

    Hud.settings = {
        overheadWidth: numberParameter("overheadWidth", 232),
        overheadHeight: numberParameter("overheadHeight", 58),
        overheadGap: Number(parameters.overheadGap || 22),
        edgeMargin: Number(parameters.edgeMargin || 8),
        playerBattlerX: numberParameter("playerBattlerX", 270),
        playerBattlerY: numberParameter("playerBattlerY", 370),
        enemyBattlerX: numberParameter("enemyBattlerX", 570),
        enemyBattlerY: numberParameter("enemyBattlerY", 280),
        commandWidth: numberParameter("commandWidth", 192),
        techniqueListWidth: numberParameter("techniqueListWidth", 320),
        switchListWidth: numberParameter("switchListWidth", 496),
        showResolveNumbers: booleanParameter("showResolveNumbers", false),
        resolveLabel: String(parameters.resolveLabel || "Resolve")
    };

    Hud.playerBattler = function() {
        return $gameWildkinRoster ? $gameWildkinRoster.active() : null;
    };

    Hud.enemyBattler = function() {
        return Battle.activeEnemy();
    };

    Hud.playerApproach = function() {
        return {
            x: Math.sign(
                this.settings.enemyBattlerX - this.settings.playerBattlerX
            ) || 1,
            y: Math.sign(
                this.settings.enemyBattlerY - this.settings.playerBattlerY
            ) || -1
        };
    };

    Hud.techniqueHelpText = function(item) {
        return item ? String(item.description || "") : "";
    };

    Hud.switchHelpText = function(forced) {
        if (forced) {
            return "Active partner\nis Spent.\nChoose a free\nreplacement.";
        }
        return (
            "Switch uses this round.\nThe incoming Wildkin receives\n" +
            "the opponent's action if it remains valid."
        );
    };

    Hud._bottomContextRenderers = [];

    Hud.registerBottomContext = function(renderer) {
        if (
            typeof renderer === "function" &&
            !this._bottomContextRenderers.includes(renderer)
        ) {
            this._bottomContextRenderers.push(renderer);
        }
    };

    Hud.drawBottomContext = function(windowObject) {
        for (const renderer of this._bottomContextRenderers) {
            if (renderer(windowObject) === true) {
                return true;
            }
        }
        return false;
    };

    Hud.bottomHeight = function() {
        const scene = SceneManager._scene;
        if (scene && scene._actorCommandWindow) {
            return scene._actorCommandWindow.height;
        }
        return 204;
    };

    Hud.bottomTop = function() {
        return Graphics.boxHeight - this.bottomHeight();
    };

    Hud.logRect = function() {
        const width = Math.max(
            320,
            Graphics.boxWidth - this.settings.commandWidth
        );
        return new Rectangle(0, this.bottomTop(), width, this.bottomHeight());
    };

    Hud.helpRect = function(listWidth) {
        const width = Math.max(240, Graphics.boxWidth - listWidth);
        return new Rectangle(0, this.bottomTop(), width, this.bottomHeight());
    };

    Hud.listRect = function(width) {
        const actualWidth = Math.min(width, Graphics.boxWidth - 240);
        return new Rectangle(
            Graphics.boxWidth - actualWidth,
            this.bottomTop(),
            actualWidth,
            this.bottomHeight()
        );
    };

    Hud.targetRect = function() {
        return new Rectangle(
            0,
            this.bottomTop(),
            Graphics.boxWidth,
            this.bottomHeight()
        );
    };

    Hud.overheadRect = function() {
        return new Rectangle(
            0,
            0,
            this.settings.overheadWidth,
            this.settings.overheadHeight
        );
    };

    Hud.battlerSnapshot = function(battler) {
        if (!battler) {
            return "none";
        }
        return [battler.name(), battler.hp, battler.mhp].join(":");
    };

    Hud.battlerSprite = function(side, battler) {
        const spriteset = BattleManager._spriteset;
        if (!spriteset || !battler) {
            return null;
        }
        const sprites =
            side === "player"
                ? spriteset._actorSprites || []
                : spriteset._enemySprites || [];
        return sprites.find(sprite => sprite._battler === battler) || null;
    };

    Hud.spriteVisualHeight = function(sprite) {
        if (!sprite) {
            return 80;
        }
        const mainSprite = sprite._mainSprite;
        const measured = mainSprite && mainSprite.height
            ? mainSprite.height
            : sprite.height;
        return Number(measured || 80).clamp(48, 220);
    };

    Hud.overheadPosition = function(side, battler, windowWidth, windowHeight) {
        const sprite = this.battlerSprite(side, battler);
        const margin = this.settings.edgeMargin;
        if (!sprite) {
            const fallbackX = side === "player"
                ? Graphics.boxWidth - windowWidth - margin
                : margin;
            return { x: fallbackX, y: margin };
        }
        const visualHeight = this.spriteVisualHeight(sprite);
        const maximumY = this.bottomTop() - windowHeight - margin;
        const x = Math.round(sprite.x - windowWidth / 2).clamp(
            margin,
            Graphics.boxWidth - windowWidth - margin
        );
        const y = Math.round(
            sprite.y - visualHeight - windowHeight - this.settings.overheadGap
        ).clamp(margin, maximumY);
        return { x: x, y: y };
    };

    Hud.moveWindow = function(windowObject, rect) {
        if (!windowObject) {
            return;
        }
        const sizeChanged =
            windowObject.width !== rect.width ||
            windowObject.height !== rect.height;
        windowObject.move(rect.x, rect.y, rect.width, rect.height);
        if (sizeChanged) {
            windowObject.createContents();
        }
    };

    Hud.layoutTechniqueWindows = function(scene) {
        const listRect = this.listRect(this.settings.techniqueListWidth);
        this.moveWindow(scene._skillWindow, listRect);
        this.moveWindow(scene._helpWindow, this.helpRect(listRect.width));
        if (scene._helpWindow) {
            scene._helpWindow._hushwakeCompactContext = false;
            scene._helpWindow._hushwakeTechniqueContext = true;
        }
        if (scene._skillWindow) {
            scene._skillWindow.refresh();
        }
        if (scene._helpWindow) {
            scene._helpWindow.refresh();
        }
    };

    Hud.layoutSwitchWindows = function(scene) {
        const listRect = this.listRect(this.settings.switchListWidth);
        this.moveWindow(scene._hushwakeSwitchWindow, listRect);
        this.moveWindow(scene._helpWindow, this.helpRect(listRect.width));
        if (scene._helpWindow) {
            scene._helpWindow._hushwakeCompactContext = true;
            scene._helpWindow._hushwakeTechniqueContext = false;
        }
        if (scene._hushwakeSwitchWindow) {
            scene._hushwakeSwitchWindow.refresh();
        }
        if (scene._helpWindow) {
            scene._helpWindow.refresh();
        }
    };

    Hud.queueBattleText = function(text, holdFrames) {
        const logWindow = BattleManager._logWindow;
        if (!logWindow) {
            return false;
        }
        logWindow.push("clear");
        logWindow.push("addText", text);
        if (holdFrames > 0) {
            logWindow.push("hushwakeWait", holdFrames);
        }
        return true;
    };

    function Window_HushwakeBattlerHud() {
        this.initialize(...arguments);
    }

    Window_HushwakeBattlerHud.prototype = Object.create(Window_Base.prototype);
    Window_HushwakeBattlerHud.prototype.constructor =
        Window_HushwakeBattlerHud;

    Window_HushwakeBattlerHud.prototype.initialize = function(rect, side) {
        this._side = side;
        this._battler = null;
        this._snapshot = "";
        Window_Base.prototype.initialize.call(this, rect);
        this.padding = 4;
        this.opacity = 0;
        this.backOpacity = 0;
        this.createContents();
        this.hide();
    };

    Window_HushwakeBattlerHud.prototype.setBattler = function(battler) {
        const snapshot = Hud.battlerSnapshot(battler);
        if (battler !== this._battler || snapshot !== this._snapshot) {
            this._battler = battler;
            this._snapshot = snapshot;
            this.refresh();
        }
    };

    Window_HushwakeBattlerHud.prototype.drawResolveGauge = function(
        battler,
        x,
        y,
        width
    ) {
        const height = 9;
        const rate = battler.mhp > 0 ? battler.hp / battler.mhp : 0;
        const fillWidth = Math.floor(width * rate.clamp(0, 1));
        this.contents.fillRect(
            x,
            y,
            width,
            height,
            ColorManager.gaugeBackColor()
        );
        this.contents.gradientFillRect(
            x,
            y,
            fillWidth,
            height,
            ColorManager.hpGaugeColor1(),
            ColorManager.hpGaugeColor2()
        );
    };

    Window_HushwakeBattlerHud.prototype.refresh = function() {
        this.contents.clear();
        const battler = this._battler;
        if (!battler) {
            return;
        }

        const width = this.innerWidth;
        const height = this.innerHeight;

        this.resetFontSettings();
        this.contents.fontSize = 19;
        const numberWidth = Hud.settings.showResolveNumbers ? 76 : 0;
        this.drawText(battler.name(), 10, -7, width - 20 - numberWidth);
        if (Hud.settings.showResolveNumbers) {
            this.contents.fontSize = 13;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(
                battler.hp + "/" + battler.mhp,
                width - numberWidth - 8,
                -5,
                numberWidth,
                "right"
            );
        }
        this.resetTextColor();
        this.drawResolveGauge(battler, 10, height - 14, width - 20);
        this.resetFontSettings();
    };

    Window_HushwakeBattlerHud.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        const battler = this._side === "player"
            ? Hud.playerBattler()
            : Hud.enemyBattler();
        this.setBattler(battler);
        if (!Battle.isActive() || !battler) {
            this.hide();
            return;
        }
        const position = Hud.overheadPosition(
            this._side,
            battler,
            this.width,
            this.height
        );
        this.x = position.x;
        this.y = position.y;
        this.show();
    };

    window.Window_HushwakeBattlerHud = Window_HushwakeBattlerHud;

    const _Scene_Battle_logWindowRect = Scene_Battle.prototype.logWindowRect;
    Scene_Battle.prototype.logWindowRect = function() {
        return Battle.isActive()
            ? Hud.logRect()
            : _Scene_Battle_logWindowRect.call(this);
    };

    const _Scene_Battle_helpWindowRect = Scene_Battle.prototype.helpWindowRect;
    Scene_Battle.prototype.helpWindowRect = function() {
        return Battle.isActive()
            ? Hud.helpRect(Hud.settings.techniqueListWidth)
            : _Scene_Battle_helpWindowRect.call(this);
    };

    const _Scene_Battle_skillWindowRect = Scene_Battle.prototype.skillWindowRect;
    Scene_Battle.prototype.skillWindowRect = function() {
        return Battle.isActive()
            ? Hud.listRect(Hud.settings.techniqueListWidth)
            : _Scene_Battle_skillWindowRect.call(this);
    };

    const _Scene_Battle_enemyWindowRect = Scene_Battle.prototype.enemyWindowRect;
    Scene_Battle.prototype.enemyWindowRect = function() {
        return Battle.isActive()
            ? Hud.targetRect()
            : _Scene_Battle_enemyWindowRect.call(this);
    };

    const _Scene_Battle_createLogWindow =
        Scene_Battle.prototype.createLogWindow;
    Scene_Battle.prototype.createLogWindow = function() {
        _Scene_Battle_createLogWindow.call(this);
        if (Battle.isActive()) {
            this._logWindow._hushwakeUnifiedHud = true;
            this._logWindow.opacity = 255;
            this._logWindow.backOpacity = 192;
            this._logWindow.refresh();
        }
    };

    const _Window_BattleLog_drawBackground =
        Window_BattleLog.prototype.drawBackground;
    Window_BattleLog.prototype.drawBackground = function() {
        if (this._hushwakeUnifiedHud) {
            this.contentsBack.clear();
            return;
        }
        _Window_BattleLog_drawBackground.call(this);
    };

    const _Window_BattleLog_refresh = Window_BattleLog.prototype.refresh;
    Window_BattleLog.prototype.refresh = function() {
        _Window_BattleLog_refresh.call(this);
        if (
            this._hushwakeUnifiedHud &&
            this._lines.length === 0 &&
            Battle.isActive()
        ) {
            Hud.drawBottomContext(this);
        }
    };

    Window_BattleLog.prototype.hushwakeWait = function(frames) {
        this._waitCount = Math.max(this._waitCount, Number(frames || 0));
    };

    Window_BattleLog.prototype.hushwakeFinishRetreat = function() {
        BattleManager.processAbort();
    };

    const _Window_Help_refresh = Window_Help.prototype.refresh;
    Window_Help.prototype.refresh = function() {
        const customContext =
            this._hushwakeCompactContext ||
            this._hushwakeTechniqueContext;
        if (!Battle.isActive() || !customContext) {
            _Window_Help_refresh.call(this);
            return;
        }
        this.contents.clear();
        this.resetFontSettings();
        this.contents.fontSize = 20;
        this.drawTextEx(this._text, 0, 0, this.innerWidth);
        this.resetFontSettings();
    };

    const _Scene_Battle_createStatusWindow =
        Scene_Battle.prototype.createStatusWindow;
    Scene_Battle.prototype.createStatusWindow = function() {
        _Scene_Battle_createStatusWindow.call(this);
        if (Battle.isActive()) {
            this._statusWindow.opacity = 0;
            this._statusWindow.backOpacity = 0;
            this._statusWindow.contentsOpacity = 0;
            this._statusWindow.hide();
            if (this._statusWindow.contentsBack) {
                this._statusWindow.contentsBack.clear();
            }
        }
    };

    const _Scene_Battle_updateStatusWindowVisibility =
        Scene_Battle.prototype.updateStatusWindowVisibility;
    Scene_Battle.prototype.updateStatusWindowVisibility = function() {
        if (!Battle.isActive()) {
            _Scene_Battle_updateStatusWindowVisibility.call(this);
            return;
        }
        this._statusWindow.hide();
    };

    const _Window_BattleStatus_drawItem =
        Window_BattleStatus.prototype.drawItem;
    Window_BattleStatus.prototype.drawItem = function(index) {
        if (!Battle.isActive()) {
            _Window_BattleStatus_drawItem.call(this, index);
        }
    };

    const _Window_BattleStatus_drawItemBackground =
        Window_BattleStatus.prototype.drawItemBackground;
    Window_BattleStatus.prototype.drawItemBackground = function(index) {
        if (!Battle.isActive()) {
            _Window_BattleStatus_drawItemBackground.call(this, index);
        }
    };

    const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
    Sprite_Enemy.prototype.setBattler = function(battler) {
        _Sprite_Enemy_setBattler.call(this, battler);
        if (
            Battle.isActive() &&
            battler &&
            battler.isWildkin &&
            battler.isWildkin()
        ) {
            this.setHome(
                Hud.settings.enemyBattlerX,
                Hud.settings.enemyBattlerY
            );
        }
    };

    const _Sprite_Actor_setActorHome = Sprite_Actor.prototype.setActorHome;
    Sprite_Actor.prototype.setActorHome = function(index) {
        if (!Battle.isActive()) {
            _Sprite_Actor_setActorHome.call(this, index);
            return;
        }
        this.setHome(
            Hud.settings.playerBattlerX,
            Hud.settings.playerBattlerY
        );
        if (this._mainSprite) {
            const approach = Hud.playerApproach();
            this._mainSprite.scale.x = approach.x > 0 ? -1 : 1;
        }
    };

    const _Sprite_Actor_moveToStartPosition =
        Sprite_Actor.prototype.moveToStartPosition;
    Sprite_Actor.prototype.moveToStartPosition = function() {
        if (!Battle.isActive()) {
            _Sprite_Actor_moveToStartPosition.call(this);
            return;
        }
        const approach = Hud.playerApproach();
        this.startMove(-approach.x * 220, -approach.y * 40, 0);
    };

    const _Sprite_Actor_stepForward = Sprite_Actor.prototype.stepForward;
    Sprite_Actor.prototype.stepForward = function() {
        if (!Battle.isActive()) {
            _Sprite_Actor_stepForward.call(this);
            return;
        }
        const approach = Hud.playerApproach();
        this.startMove(approach.x * 48, approach.y * 12, 12);
    };

    const _Sprite_Actor_retreat = Sprite_Actor.prototype.retreat;
    Sprite_Actor.prototype.retreat = function() {
        if (!Battle.isActive()) {
            _Sprite_Actor_retreat.call(this);
            return;
        }
        const approach = Hud.playerApproach();
        this.startMove(-approach.x * 300, -approach.y * 70, 30);
    };

    const _Scene_Battle_createAllWindows =
        Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
        _Scene_Battle_createAllWindows.call(this);
        if (!Battle.isActive()) {
            return;
        }

        Hud.layoutSwitchWindows(this);
        this._helpWindow.hide();

        this._hushwakeEnemyHud = new Window_HushwakeBattlerHud(
            Hud.overheadRect(),
            "enemy"
        );
        this._hushwakePlayerHud = new Window_HushwakeBattlerHud(
            Hud.overheadRect(),
            "player"
        );
        this.addWindow(this._hushwakeEnemyHud);
        this.addWindow(this._hushwakePlayerHud);
    };

    const _Window_BattleSkill_maxCols = Window_BattleSkill.prototype.maxCols;
    Window_BattleSkill.prototype.maxCols = function() {
        return Battle.isActive()
            ? 1
            : _Window_BattleSkill_maxCols.call(this);
    };

    const _Window_BattleSkill_updateHelp =
        Window_BattleSkill.prototype.updateHelp;
    Window_BattleSkill.prototype.updateHelp = function() {
        const item = this.item();
        if (
            Battle.isActive() &&
            this._helpWindow &&
            (!item || item.hushwake)
        ) {
            this._helpWindow.setText(Hud.techniqueHelpText(item));
            return;
        }
        _Window_BattleSkill_updateHelp.call(this);
    };

    const _Window_BattleEnemy_maxCols = Window_BattleEnemy.prototype.maxCols;
    Window_BattleEnemy.prototype.maxCols = function() {
        return Battle.isActive()
            ? 1
            : _Window_BattleEnemy_maxCols.call(this);
    };

    const _Window_BattleEnemy_itemHeight =
        Window_BattleEnemy.prototype.itemHeight;
    Window_BattleEnemy.prototype.itemHeight = function() {
        return Battle.isActive()
            ? this.lineHeight() * 2
            : _Window_BattleEnemy_itemHeight.call(this);
    };

    const _Window_BattleEnemy_drawItem = Window_BattleEnemy.prototype.drawItem;
    Window_BattleEnemy.prototype.drawItem = function(index) {
        const action = BattleManager.inputtingAction();
        const target = this._enemies[index];
        const item = action ? action.item() : null;
        if (
            !Battle.isActive() ||
            !action ||
            !item ||
            !item.hushwake ||
            !target
        ) {
            _Window_BattleEnemy_drawItem.call(this, index);
            return;
        }

        const rect = this.itemRectWithPadding(index);
        const range = Battle.damageRange(action, target);
        const relation = Battle.aspectLabel(action, target);
        const aspect = item.hushwake.aspect || "Neutral";
        const preview = range
            ? relation + "  •  " + range.min + "–" + range.max + " predicted"
            : relation;

        this.resetFontSettings();
        this.contents.fontSize = 21;
        this.drawText(target.name(), rect.x, rect.y, 220);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(
            Hud.settings.resolveLabel + " " + target.hp + " / " + target.mhp,
            rect.x + 226,
            rect.y,
            220
        );

        this.contents.fontSize = 18;
        this.resetTextColor();
        this.drawText(
            item.name + "  •  " + aspect,
            rect.x,
            rect.y + this.lineHeight(),
            360
        );
        const previewColor = relation === "Strong"
            ? ColorManager.powerUpColor()
            : relation === "Resisted"
            ? ColorManager.powerDownColor()
            : ColorManager.normalColor();
        this.changeTextColor(previewColor);
        this.drawText(
            preview,
            rect.x + 370,
            rect.y + this.lineHeight(),
            rect.width - 370,
            "right"
        );
        this.resetFontSettings();
    };

    const _Window_BattleLog_displayActionResults =
        Window_BattleLog.prototype.displayActionResults;
    Window_BattleLog.prototype.displayActionResults = function(subject, target) {
        _Window_BattleLog_displayActionResults.call(this, subject, target);
        const action = BattleManager._action;
        if (
            !Battle.isActive() ||
            !action ||
            !action.item() ||
            !action.item().hushwake ||
            !target.result().used ||
            !target.result().hpAffected
        ) {
            return;
        }
        const relation = Battle.aspectLabel(action, target);
        if (relation === "Strong") {
            this.push("addText", "Strong against " + target.name() + ".");
        } else if (relation === "Resisted") {
            this.push("addText", target.name() + " resisted the Aspect.");
        }
    };

    const _Scene_Battle_commandSkill = Scene_Battle.prototype.commandSkill;
    Scene_Battle.prototype.commandSkill = function() {
        if (Battle.isActive()) {
            Hud.layoutTechniqueWindows(this);
        }
        _Scene_Battle_commandSkill.call(this);
    };

    const _Scene_Battle_openHushwakeSwitchWindow =
        Scene_Battle.prototype.openHushwakeSwitchWindow;
    Scene_Battle.prototype.openHushwakeSwitchWindow = function(forced) {
        _Scene_Battle_openHushwakeSwitchWindow.call(this, forced);
        Hud.layoutSwitchWindows(this);
        this._helpWindow.setText(Hud.switchHelpText(forced));
        this._helpWindow.show();
    };

    const _Scene_Battle_onHushwakeSwitchOk =
        Scene_Battle.prototype.onHushwakeSwitchOk;
    Scene_Battle.prototype.onHushwakeSwitchOk = function() {
        this._helpWindow.hide();
        _Scene_Battle_onHushwakeSwitchOk.call(this);
    };

    const _Scene_Battle_onHushwakeSwitchCancel =
        Scene_Battle.prototype.onHushwakeSwitchCancel;
    Scene_Battle.prototype.onHushwakeSwitchCancel = function() {
        this._helpWindow.hide();
        _Scene_Battle_onHushwakeSwitchCancel.call(this);
    };

    Scene_Battle.prototype.commandHushwakeRetreat = function() {
        BattleManager._escaped = true;
        this.endCommandSelection();
        const logWindow = BattleManager._logWindow;
        if (!Hud.queueBattleText("The team retreats safely.", 48)) {
            BattleManager.processAbort();
            return;
        }
        logWindow.push("hushwakeFinishRetreat");
    };

    const _BattleManager_displayVictoryMessage =
        BattleManager.displayVictoryMessage;
    BattleManager.displayVictoryMessage = function() {
        if (!Battle.isActive()) {
            _BattleManager_displayVictoryMessage.call(this);
            return;
        }
        Hud.queueBattleText(TextManager.victory.format($gameParty.name()), 48);
    };

    const _BattleManager_displayDefeatMessage =
        BattleManager.displayDefeatMessage;
    BattleManager.displayDefeatMessage = function() {
        if (!Battle.isActive()) {
            _BattleManager_displayDefeatMessage.call(this);
            return;
        }
        Hud.queueBattleText(TextManager.defeat.format($gameParty.name()), 48);
    };
})();
