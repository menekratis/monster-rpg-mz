/*:
 * @target MZ
 * @plugindesc HUSHWAKE Milestone 1A - 1v1 Wildkin battle, switching, and lineups.
 * @author OpenAI
 *
 * @help
 * Extends MZ battles only while a HUSHWAKE Wildkin battle context is active.
 * Normal human actors, parties, and battles retain their native behavior.
 */

(() => {
    "use strict";

    const Hushwake = (window.Hushwake = window.Hushwake || {});
    const Data = Hushwake.Data;
    const Battle = (Hushwake.Battle = Hushwake.Battle || {});

    Battle._context = null;

    Battle.isActive = function() {
        return !!this._context;
    };

    Battle.context = function() {
        return this._context;
    };

    Battle.begin = function() {
        const enemies = $gameTroop.members();
        this._context = {
            enemyOrder: enemies.map((enemy, index) => index),
            activeEnemyIndex: 0
        };
        enemies.forEach((enemy, index) => {
            if (index === 0) {
                enemy.appear();
            } else {
                enemy.hide();
            }
        });
        BattleManager._hushwakeNeedsForcedSwitch = false;
    };

    Battle.end = function() {
        this._context = null;
        BattleManager._hushwakeNeedsForcedSwitch = false;
    };

    Battle.activeEnemy = function() {
        if (!this.isActive()) {
            return null;
        }
        return $gameTroop.members()[this._context.activeEnemyIndex] || null;
    };

    Battle.enemyEntryText = function(incoming) {
        return incoming.name() + " enters the active slot.";
    };

    Battle.prepareEnemyEntry = function() {
        const current = this.activeEnemy();
        if (current && !current.isDeathStateAffected()) {
            return false;
        }
        const members = $gameTroop.members();
        const nextIndex = this._context.enemyOrder.find(
            index => !members[index].isDeathStateAffected()
        );
        if (nextIndex === undefined) {
            return false;
        }
        this._context.activeEnemyIndex = nextIndex;
        const incoming = members[nextIndex];
        incoming.appear();
        incoming.setActionState("undecided");
        $gameTemp.requestBattleRefresh();
        if (BattleManager._logWindow) {
            BattleManager._logWindow.push(
                "addText",
                this.enemyEntryText(incoming)
            );
            BattleManager._logWindow.push("wait");
            BattleManager._logWindow.push("clear");
        }
        return true;
    };

    Battle.performSwitch = function(instanceId, forced) {
        if (!this.isActive() || !$gameWildkinRoster) {
            return false;
        }
        const outgoing = $gameWildkinRoster.active();
        if (!$gameWildkinRoster.setActiveLead(instanceId)) {
            return false;
        }
        const incoming = $gameWildkinRoster.active();
        incoming.clearActions();
        incoming.setActionState("waiting");
        incoming.deselect();
        $gameTemp.requestBattleRefresh();
        $gameParty.requestMotionRefresh();
        if (BattleManager._logWindow) {
            const text = outgoing
                ? outgoing.name() + " withdraws. " + incoming.name() + " enters."
                : incoming.name() + " enters."
            BattleManager._logWindow.push("addText", text);
            if (forced) {
                BattleManager._logWindow.push("wait");
                BattleManager._logWindow.push("clear");
            }
        }
        return true;
    };

    Battle.aspectsOf = function(battler) {
        if (battler && battler.aspects) {
            return battler.aspects();
        }
        return [];
    };

    Battle.techniqueAspect = function(action) {
        const item = action && action.item ? action.item() : null;
        return item && item.hushwake ? item.hushwake.aspect : "";
    };

    Battle.aspectRelation = function(attackAspect, defenderAspects) {
        const strongAgainst = {
            Ember: "Verdant",
            Verdant: "Current",
            Current: "Ember",
            Stone: "Gale",
            Gale: "Gloam",
            Gloam: "Stone"
        };
        if (!attackAspect || defenderAspects.length === 0) {
            return 1;
        }
        const rates = defenderAspects.map(defenderAspect => {
            if (strongAgainst[attackAspect] === defenderAspect) {
                return 1.5;
            }
            if (strongAgainst[defenderAspect] === attackAspect) {
                return 0.75;
            }
            return 1;
        });
        return Math.max(...rates);
    };

    Battle.aspectLabel = function(action, target) {
        const aspect = this.techniqueAspect(action);
        const relation = this.aspectRelation(aspect, this.aspectsOf(target));
        if (relation > 1) {
            return "Strong";
        }
        if (relation < 1) {
            return "Resisted";
        }
        return "Neutral";
    };

    Battle.damageRange = function(action, target) {
        if (!action || !target || !action.item() || !action.isDamage()) {
            return null;
        }
        const item = action.item();
        let value = action.evalDamageFormula(target);
        value *= action.calcElementRate(target);
        if (action.isPhysical()) {
            value *= target.pdr;
        }
        if (action.isMagical()) {
            value *= target.mdr;
        }
        value = action.applyGuard(value, target);
        const amp = Math.floor(
            Math.max((Math.abs(value) * item.damage.variance) / 100, 0)
        );
        return {
            min: Math.max(0, Math.round(value - amp)),
            max: Math.max(0, Math.round(value + amp))
        };
    };

    Battle.actionPriority = function(battler) {
        const action = battler ? battler.currentAction() : null;
        const item = action ? action.item() : null;
        return item && item.hushwake ? Number(item.hushwake.priority || 0) : 0;
    };

    Battle.stableOrder = function(battler) {
        if (battler && battler.isActor && battler.isActor()) {
            return 0;
        }
        return 100 + (battler ? battler.index() : 0);
    };

    const _Data_buildRuntimeDatabase = Data.buildRuntimeDatabase;
    Data.buildRuntimeDatabase = function() {
        _Data_buildRuntimeDatabase.call(this);
        if (this.switchSkill) {
            return;
        }
        const id = $dataSkills.length;
        const skill = {
            id: id,
            animationId: 0,
            damage: {
                critical: false,
                elementId: 0,
                formula: "0",
                type: 0,
                variance: 0
            },
            description: "Switch to a reserve Wildkin.",
            effects: [],
            hitType: Game_Action.HITTYPE_CERTAIN,
            iconIndex: 75,
            message1: "",
            message2: "",
            messageType: 0,
            mpCost: 0,
            name: "Switch",
            note: "<HushwakeSwitch>\n<Priority:100>",
            occasion: 1,
            repeats: 1,
            requiredWtypeId1: 0,
            requiredWtypeId2: 0,
            scope: 11,
            speed: 0,
            stypeId: 1,
            successRate: 100,
            tpCost: 0,
            tpGain: 0,
            hushwake: {
                key: "__switch__",
                aspect: "",
                priority: 100,
                switchAction: true
            }
        };
        DataManager.extractMetadata(skill);
        $dataSkills.push(skill);
        this.switchSkill = skill;
    };

    Game_Enemy.prototype.isWildkin = function() {
        return !!(this.enemy() && this.enemy().hushwake);
    };

    Game_Enemy.prototype.aspects = function() {
        const data = this.enemy().hushwake;
        return data ? data.aspects.slice() : [];
    };

    const _Game_Enemy_makeActions = Game_Enemy.prototype.makeActions;
    Game_Enemy.prototype.makeActions = function() {
        if (!Battle.isActive() || !this.isWildkin()) {
            _Game_Enemy_makeActions.call(this);
            return;
        }
        Game_Battler.prototype.makeActions.call(this);
        if (this.numActions() > 0) {
            const sequence = this.enemy().hushwake.techniqueSequence;
            const index = Number(this._hushwakeSequenceIndex || 0);
            this.action(0).setSkill(sequence[index]);
            this.action(0).setTarget(0);
            this._hushwakeSequenceIndex = (index + 1) % sequence.length;
        }
        this.setActionState("waiting");
    };

    const _Game_Action_calcElementRate = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function(target) {
        const item = this.item();
        if (!Battle.isActive() || !item || !item.hushwake) {
            return _Game_Action_calcElementRate.call(this, target);
        }
        const aspect = item.hushwake.aspect;
        if (!aspect) {
            return 1;
        }
        const relation = Battle.aspectRelation(
            aspect,
            Battle.aspectsOf(target)
        );
        const affinity = Battle.aspectsOf(this.subject()).includes(aspect)
            ? 1.25
            : 1;
        return relation * affinity;
    };

    const _Game_System_isSideView = Game_System.prototype.isSideView;
    Game_System.prototype.isSideView = function() {
        return Battle.isActive() || _Game_System_isSideView.call(this);
    };

    const _Game_Party_battleMembers = Game_Party.prototype.battleMembers;
    Game_Party.prototype.battleMembers = function() {
        if (Battle.isActive() && $gameWildkinRoster) {
            const active = $gameWildkinRoster.active();
            return active ? [active] : [];
        }
        return _Game_Party_battleMembers.call(this);
    };

    const _Game_Party_maxBattleMembers = Game_Party.prototype.maxBattleMembers;
    Game_Party.prototype.maxBattleMembers = function() {
        return Battle.isActive()
            ? 1
            : _Game_Party_maxBattleMembers.call(this);
    };

    const _Game_Party_isAllDead = Game_Party.prototype.isAllDead;
    Game_Party.prototype.isAllDead = function() {
        if (Battle.isActive() && $gameWildkinRoster) {
            return $gameWildkinRoster.isPartySpent();
        }
        return _Game_Party_isAllDead.call(this);
    };

    const _Game_Party_onBattleStart = Game_Party.prototype.onBattleStart;
    Game_Party.prototype.onBattleStart = function(advantageous) {
        if (!Battle.isActive() || !$gameWildkinRoster) {
            _Game_Party_onBattleStart.call(this, advantageous);
            return;
        }
        for (const member of $gameWildkinRoster.partyMembers()) {
            member.onBattleStart(advantageous);
        }
        this._inBattle = true;
    };

    const _Game_Party_onBattleEnd = Game_Party.prototype.onBattleEnd;
    Game_Party.prototype.onBattleEnd = function() {
        if (!Battle.isActive() || !$gameWildkinRoster) {
            _Game_Party_onBattleEnd.call(this);
            return;
        }
        this._inBattle = false;
        for (const member of $gameWildkinRoster.partyMembers()) {
            member.onBattleEnd();
        }
    };

    const _Game_Troop_isAllDead = Game_Troop.prototype.isAllDead;
    Game_Troop.prototype.isAllDead = function() {
        if (!Battle.isActive()) {
            return _Game_Troop_isAllDead.call(this);
        }
        const members = this.members();
        return (
            members.length === 0 ||
            members.every(enemy => enemy.isDeathStateAffected())
        );
    };

    const _BattleManager_initMembers = BattleManager.initMembers;
    BattleManager.initMembers = function() {
        _BattleManager_initMembers.call(this);
        this._hushwakeNeedsForcedSwitch = false;
    };

    const _BattleManager_displayStartMessages =
        BattleManager.displayStartMessages;
    BattleManager.displayStartMessages = function() {
        if (!Battle.isActive()) {
            _BattleManager_displayStartMessages.call(this);
        }
    };

    const _BattleManager_startInput = BattleManager.startInput;
    BattleManager.startInput = function() {
        if (!Battle.isActive()) {
            _BattleManager_startInput.call(this);
            return;
        }
        Battle.prepareEnemyEntry();
        const active = $gameWildkinRoster.active();
        if (
            active &&
            active.isDeathStateAffected() &&
            $gameWildkinRoster.usableReserves().length > 0
        ) {
            this._phase = "input";
            this._inputting = true;
            this._currentActor = null;
            this._hushwakeNeedsForcedSwitch = true;
            return;
        }
        this._hushwakeNeedsForcedSwitch = false;
        _BattleManager_startInput.call(this);
    };

    const _BattleManager_makeActionOrders = BattleManager.makeActionOrders;
    BattleManager.makeActionOrders = function() {
        if (!Battle.isActive()) {
            _BattleManager_makeActionOrders.call(this);
            return;
        }
        const battlers = [];
        if (!this._surprise) {
            battlers.push(...$gameParty.battleMembers());
        }
        if (!this._preemptive) {
            battlers.push(...$gameTroop.aliveMembers());
        }
        battlers.sort((a, b) => {
            const priorityDifference =
                Battle.actionPriority(b) - Battle.actionPriority(a);
            if (priorityDifference !== 0) {
                return priorityDifference;
            }
            const tempoDifference = b.agi - a.agi;
            if (tempoDifference !== 0) {
                return tempoDifference;
            }
            return Battle.stableOrder(a) - Battle.stableOrder(b);
        });
        this._actionBattlers = battlers;
    };

    const _BattleManager_startAction = BattleManager.startAction;
    BattleManager.startAction = function() {
        const subject = this._subject;
        const action = subject ? subject.currentAction() : null;
        if (
            Battle.isActive() &&
            action &&
            action.item() &&
            action.item().hushwake &&
            action.item().hushwake.switchAction
        ) {
            this._phase = "action";
            this._action = action;
            this._targets = [];
            subject.cancelMotionRefresh();
            Battle.performSwitch(action._hushwakeSwitchTargetId, false);
            return;
        }
        _BattleManager_startAction.call(this);
    };

    function Window_WildkinSwitch() {
        this.initialize(...arguments);
    }

    Window_WildkinSwitch.prototype = Object.create(
        Window_Selectable.prototype
    );
    Window_WildkinSwitch.prototype.constructor = Window_WildkinSwitch;

    Window_WildkinSwitch.prototype.initialize = function(rect) {
        this._data = [];
        this._forced = false;
        Window_Selectable.prototype.initialize.call(this, rect);
        this.hide();
        this.deactivate();
    };

    Window_WildkinSwitch.prototype.setForced = function(forced) {
        this._forced = !!forced;
    };

    Window_WildkinSwitch.prototype.isForced = function() {
        return this._forced;
    };

    Window_WildkinSwitch.prototype.isCancelEnabled = function() {
        return !this._forced;
    };

    Window_WildkinSwitch.prototype.maxItems = function() {
        return this._data.length;
    };

    Window_WildkinSwitch.prototype.item = function() {
        return this._data[this.index()] || null;
    };

    Window_WildkinSwitch.prototype.isCurrentItemEnabled = function() {
        const item = this.item();
        return !!item && !item.isDeathStateAffected();
    };

    Window_WildkinSwitch.prototype.refresh = function() {
        this._data = $gameWildkinRoster
            ? $gameWildkinRoster.reserves()
            : [];
        Window_Selectable.prototype.refresh.call(this);
    };

    Window_WildkinSwitch.prototype.drawItem = function(index) {
        const wildkin = this._data[index];
        if (!wildkin) {
            return;
        }
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(!wildkin.isDeathStateAffected());
        this.drawText(wildkin.name(), rect.x, rect.y, 180);
        this.drawText(
            wildkin.aspects().join("/"),
            rect.x + 190,
            rect.y,
            150
        );
        this.drawText(
            "Resolve " + wildkin.hp + "/" + wildkin.mhp,
            rect.x + 350,
            rect.y,
            rect.width - 350,
            "right"
        );
        this.changePaintOpacity(true);
    };

    window.Window_WildkinSwitch = Window_WildkinSwitch;

    const _Window_ActorCommand_makeCommandList =
        Window_ActorCommand.prototype.makeCommandList;
    Window_ActorCommand.prototype.makeCommandList = function() {
        if (
            Battle.isActive() &&
            this._actor &&
            this._actor.isWildkin &&
            this._actor.isWildkin()
        ) {
            this.addCommand("Techniques", "skill", true, 1);
            this.addCommand(
                "Switch",
                "hushwakeSwitch",
                $gameWildkinRoster.usableReserves().length > 0
            );
            this.addCommand("Retreat", "hushwakeRetreat", true);
            return;
        }
        _Window_ActorCommand_makeCommandList.call(this);
    };

    const _Window_StatusBase_placeBasicGauges =
        Window_StatusBase.prototype.placeBasicGauges;
    Window_StatusBase.prototype.placeBasicGauges = function(actor, x, y) {
        if (
            Battle.isActive() &&
            actor &&
            actor.isWildkin &&
            actor.isWildkin()
        ) {
            this.placeGauge(actor, "hp", x, y);
            return;
        }
        _Window_StatusBase_placeBasicGauges.call(this, actor, x, y);
    };

    const _Window_BattleStatus_basicGaugesY =
        Window_BattleStatus.prototype.basicGaugesY;
    Window_BattleStatus.prototype.basicGaugesY = function(rect) {
        if (Battle.isActive()) {
            const bottom = rect.y + rect.height - this.extraHeight();
            return bottom - this.gaugeLineHeight();
        }
        return _Window_BattleStatus_basicGaugesY.call(this, rect);
    };

    const _Sprite_Gauge_label = Sprite_Gauge.prototype.label;
    Sprite_Gauge.prototype.label = function() {
        if (
            Battle.isActive() &&
            this._statusType === "hp" &&
            this._battler &&
            this._battler.isWildkin &&
            this._battler.isWildkin()
        ) {
            return "Resolve";
        }
        return _Sprite_Gauge_label.call(this);
    };

    const _Window_BattleLog_displayAddedStates =
        Window_BattleLog.prototype.displayAddedStates;
    Window_BattleLog.prototype.displayAddedStates = function(target) {
        if (!Battle.isActive()) {
            _Window_BattleLog_displayAddedStates.call(this, target);
            return;
        }
        const states = target.result().addedStateObjects();
        if (!states.some(state => state.id === target.deathStateId())) {
            _Window_BattleLog_displayAddedStates.call(this, target);
            return;
        }
        for (const state of states) {
            if (state.id === target.deathStateId()) {
                this.push("performCollapse", target);
                this.push("popBaseLine");
                this.push("pushBaseLine");
                this.push("addText", target.name() + " is Spent.");
                this.push("waitForEffect");
            } else {
                const stateText = target.isActor()
                    ? state.message1
                    : state.message2;
                if (stateText) {
                    this.push("popBaseLine");
                    this.push("pushBaseLine");
                    this.push("addText", stateText.format(target.name()));
                    this.push("waitForEffect");
                }
            }
        }
    };

    const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
        _Scene_Battle_createAllWindows.call(this);
        const rect = this.skillWindowRect();
        this._hushwakeSwitchWindow = new Window_WildkinSwitch(rect);
        this._hushwakeSwitchWindow.setHandler(
            "ok",
            this.onHushwakeSwitchOk.bind(this)
        );
        this._hushwakeSwitchWindow.setHandler(
            "cancel",
            this.onHushwakeSwitchCancel.bind(this)
        );
        this.addWindow(this._hushwakeSwitchWindow);
    };

    const _Scene_Battle_createActorCommandWindow =
        Scene_Battle.prototype.createActorCommandWindow;
    Scene_Battle.prototype.createActorCommandWindow = function() {
        _Scene_Battle_createActorCommandWindow.call(this);
        this._actorCommandWindow.setHandler(
            "hushwakeSwitch",
            this.commandHushwakeSwitch.bind(this)
        );
        this._actorCommandWindow.setHandler(
            "hushwakeRetreat",
            this.commandHushwakeRetreat.bind(this)
        );
    };

    const _Scene_Battle_isAnyInputWindowActive =
        Scene_Battle.prototype.isAnyInputWindowActive;
    Scene_Battle.prototype.isAnyInputWindowActive = function() {
        return (
            (this._hushwakeSwitchWindow &&
                this._hushwakeSwitchWindow.active) ||
            _Scene_Battle_isAnyInputWindowActive.call(this)
        );
    };

    const _Scene_Battle_hideSubInputWindows =
        Scene_Battle.prototype.hideSubInputWindows;
    Scene_Battle.prototype.hideSubInputWindows = function() {
        _Scene_Battle_hideSubInputWindows.call(this);
        if (this._hushwakeSwitchWindow) {
            this._hushwakeSwitchWindow.deactivate();
            this._hushwakeSwitchWindow.hide();
        }
    };

    const _Scene_Battle_needsInputWindowChange =
        Scene_Battle.prototype.needsInputWindowChange;
    Scene_Battle.prototype.needsInputWindowChange = function() {
        if (
            Battle.isActive() &&
            BattleManager._hushwakeNeedsForcedSwitch &&
            this._hushwakeSwitchWindow &&
            this._hushwakeSwitchWindow.active
        ) {
            return false;
        }
        return _Scene_Battle_needsInputWindowChange.call(this);
    };

    const _Scene_Battle_startPartyCommandSelection =
        Scene_Battle.prototype.startPartyCommandSelection;
    Scene_Battle.prototype.startPartyCommandSelection = function() {
        if (!Battle.isActive()) {
            _Scene_Battle_startPartyCommandSelection.call(this);
            return;
        }
        this._partyCommandWindow.close();
        if (BattleManager._hushwakeNeedsForcedSwitch) {
            this.openHushwakeSwitchWindow(true);
        } else {
            this.commandFight();
        }
    };

    Scene_Battle.prototype.openHushwakeSwitchWindow = function(forced) {
        this._hushwakeSwitchWindow.setForced(forced);
        this._hushwakeSwitchWindow.refresh();
        this._hushwakeSwitchWindow.show();
        this._hushwakeSwitchWindow.activate();
        this._hushwakeSwitchWindow.forceSelect(0);
        this._actorCommandWindow.hide();
        this._statusWindow.hide();
    };

    Scene_Battle.prototype.commandHushwakeSwitch = function() {
        this.openHushwakeSwitchWindow(false);
    };

    Scene_Battle.prototype.commandHushwakeRetreat = function() {
        BattleManager._escaped = true;
        $gameMessage.add("The team retreats safely.");
        BattleManager.processAbort();
        this.changeInputWindow();
    };

    Scene_Battle.prototype.onHushwakeSwitchOk = function() {
        const incoming = this._hushwakeSwitchWindow.item();
        if (!incoming) {
            return;
        }
        if (this._hushwakeSwitchWindow.isForced()) {
            if (!Battle.performSwitch(incoming.instanceId(), true)) {
                return;
            }
            BattleManager._hushwakeNeedsForcedSwitch = false;
            this._hushwakeSwitchWindow.hide();
            this._hushwakeSwitchWindow.deactivate();
            BattleManager.startInput();
            this.changeInputWindow();
        } else {
            const action = BattleManager.inputtingAction();
            action.setSkill(Data.switchSkill.id);
            action._hushwakeSwitchTargetId = incoming.instanceId();
            this._hushwakeSwitchWindow.hide();
            this._hushwakeSwitchWindow.deactivate();
            this.selectNextCommand();
        }
    };

    Scene_Battle.prototype.onHushwakeSwitchCancel = function() {
        if (this._hushwakeSwitchWindow.isForced()) {
            return;
        }
        this._hushwakeSwitchWindow.hide();
        this._hushwakeSwitchWindow.deactivate();
        this._statusWindow.show();
        this._actorCommandWindow.show();
        this._actorCommandWindow.activate();
    };

    const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function() {
        _Scene_Battle_terminate.call(this);
        if (Battle.isActive()) {
            Battle.end();
        }
    };
})();
