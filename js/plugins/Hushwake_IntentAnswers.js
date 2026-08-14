/*:
 * @target MZ
 * @plugindesc HUSHWAKE Milestone 1B - enemy Intent plans and deterministic Answers.
 * @author OpenAI
 * @orderAfter Hushwake_BattleSystem
 * @orderBefore Hushwake_BattleHud
 *
 * @help
 * Adds content-agnostic enemy Intent and player Answer behavior while a
 * HUSHWAKE battle context is active.
 *
 * Intent types and technique metadata live in data/HushwakeWildkin.json.
 * This module stores the Intent on the enemy's already-generated action, so
 * switching does not reroll or erase the plan. Answer effects are resolved by
 * small registered handlers. Milestone 1B includes damage reduction and
 * interruption handlers; Focus and signatures are intentionally absent.
 */

(() => {
    "use strict";

    const Hushwake = (window.Hushwake = window.Hushwake || {});
    const Data = Hushwake.Data;
    const Battle = Hushwake.Battle;
    const Intent = (Hushwake.IntentAnswers =
        Hushwake.IntentAnswers || {});

    Intent._effectHandlers = Object.create(null);

    Data._intentByKey = Data._intentByKey || Object.create(null);

    Data.intentType = function(key) {
        return this._intentByKey[String(key || "").toLowerCase()] || null;
    };

    const _Data_buildRuntimeDatabase = Data.buildRuntimeDatabase;
    Data.buildRuntimeDatabase = function() {
        _Data_buildRuntimeDatabase.call(this);
        if (this._intentTypesBuilt) {
            return;
        }
        const definitions = $dataHushwakeWildkin.intentTypes || [];
        for (const definition of definitions) {
            const key = String(definition.key || "").toLowerCase();
            if (!key) {
                throw new Error("HUSHWAKE Intent type is missing a key.");
            }
            this._intentByKey[key] = {
                key: key,
                name: String(definition.name || key),
                description: String(definition.description || ""),
                color: String(definition.color || "#ffffff")
            };
        }
        for (const definition of $dataHushwakeWildkin.techniques || []) {
            const intentKey = String(definition.intent || "").toLowerCase();
            if (intentKey && !this.intentType(intentKey)) {
                throw new Error(
                    "Unknown Intent '" + intentKey + "' on " + definition.key
                );
            }
            const answerKey = definition.answer
                ? String(definition.answer.intent || "").toLowerCase()
                : "";
            if (answerKey && !this.intentType(answerKey)) {
                throw new Error(
                    "Unknown Answer Intent '" +
                        answerKey +
                        "' on " +
                        definition.key
                );
            }
        }
        this._intentTypesBuilt = true;
    };

    Intent.context = function() {
        return Battle.isActive() ? Battle.context() : null;
    };

    Intent.plan = function() {
        const context = this.context();
        const plan = context ? context.enemyIntentPlan : null;
        if (!plan || !plan.enemy || plan.enemy.isDeathStateAffected()) {
            return null;
        }
        if (plan.state === "completed" || plan.state === "answered") {
            return null;
        }
        return plan;
    };

    Intent.intentType = function(key) {
        return Data.intentType(key);
    };

    Intent.currentIntent = function() {
        const plan = this.plan();
        return plan ? this.intentType(plan.intentKey) : null;
    };

    Intent.answerForItem = function(item) {
        return item && item.hushwake ? item.hushwake.answer : null;
    };

    Intent.answerMatchesItem = function(item) {
        const answer = this.answerForItem(item);
        const plan = this.plan();
        return !!(
            answer &&
            plan &&
            String(answer.intent).toLowerCase() === plan.intentKey
        );
    };

    Intent.refreshHud = function() {
        if (BattleManager._logWindow) {
            BattleManager._logWindow.refresh();
        }
    };

    Intent.clearPlan = function() {
        const context = this.context();
        if (context) {
            context.enemyIntentPlan = null;
        }
        this.refreshHud();
    };

    Intent.recordEnemyPlan = function(enemy, action) {
        const context = this.context();
        if (!context || enemy !== Battle.activeEnemy()) {
            return;
        }
        const item = action ? action.item() : null;
        const key = item && item.hushwake
            ? String(item.hushwake.intent || "").toLowerCase()
            : "";
        if (!key) {
            this.clearPlan();
            return;
        }
        if (!this.intentType(key)) {
            throw new Error("Unknown planned HUSHWAKE Intent: " + key);
        }
        context.intentPlanSerial = Number(context.intentPlanSerial || 0) + 1;
        context.enemyIntentPlan = {
            id: context.intentPlanSerial,
            enemy: enemy,
            action: action,
            intentKey: key,
            state: "planned",
            damageMultiplier: 1,
            answerResult: null
        };
        action._hushwakeIntentPlanId = context.intentPlanSerial;
        this.refreshHud();
    };

    Intent.registerEffect = function(key, handler) {
        this._effectHandlers[String(key)] = handler;
    };

    Intent.onAnswerResolved = function(listener) {
        this._answerListeners = this._answerListeners || [];
        this._answerListeners.push(listener);
    };

    Intent.notifyAnswerResolved = function(result) {
        for (const listener of this._answerListeners || []) {
            listener(result);
        }
    };

    Intent.resolveAnswer = function(action) {
        const plan = this.plan();
        const item = action ? action.item() : null;
        const answer = this.answerForItem(item);
        if (!plan || !answer || !this.answerMatchesItem(item)) {
            return null;
        }
        const handler = this._effectHandlers[String(answer.effect || "")];
        if (!handler || handler(plan, answer, action) === false) {
            return null;
        }
        const intentType = this.intentType(plan.intentKey);
        const result = {
            planId: plan.id,
            intentKey: plan.intentKey,
            intentName: intentType ? intentType.name : plan.intentKey,
            techniqueName: item.name,
            text: String(answer.result || "Answer successful.")
        };
        plan.answerResult = result;
        action._hushwakeAnswerResult = result;
        return result;
    };

    Intent.beginEnemyAction = function(action) {
        const plan = this.plan();
        if (plan && plan.action === action) {
            plan.state = "resolving";
        }
    };

    Intent.completeEnemyAction = function(action) {
        const context = this.context();
        const plan = context ? context.enemyIntentPlan : null;
        if (plan && plan.action === action && plan.state === "resolving") {
            plan.state = "completed";
        }
    };

    Intent.registerEffect("reduceDamage", function(plan, answer) {
        const reduction = Number(answer.value || 0).clamp(0, 1);
        plan.damageMultiplier = 1 - reduction;
        return true;
    });

    Intent.registerEffect("interrupt", function(plan) {
        plan.state = "answered";
        if (plan.enemy) {
            plan.enemy.clearActions();
        }
        return true;
    });

    Battle.plannedIntent = function() {
        return Intent.currentIntent();
    };

    Battle.intentPlan = function() {
        return Intent.plan();
    };

    const _Battle_begin = Battle.begin;
    Battle.begin = function() {
        _Battle_begin.call(this);
        const context = this.context();
        context.enemyIntentPlan = null;
        context.intentPlanSerial = 0;
    };

    const _Battle_prepareEnemyEntry = Battle.prepareEnemyEntry;
    Battle.prepareEnemyEntry = function() {
        const previous = this.activeEnemy();
        const changed = _Battle_prepareEnemyEntry.call(this);
        if (changed && previous !== this.activeEnemy()) {
            Intent.clearPlan();
        }
        return changed;
    };

    const _Game_Enemy_makeActions = Game_Enemy.prototype.makeActions;
    Game_Enemy.prototype.makeActions = function() {
        _Game_Enemy_makeActions.call(this);
        if (
            Battle.isActive() &&
            this.isWildkin &&
            this.isWildkin() &&
            this === Battle.activeEnemy()
        ) {
            Intent.recordEnemyPlan(this, this.currentAction());
        }
    };

    const _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        const value = _Game_Action_makeDamageValue.call(this, target, critical);
        if (!Battle.isActive() || value <= 0) {
            return value;
        }
        const plan = Intent.plan();
        if (
            plan &&
            plan.state === "resolving" &&
            plan.action === this &&
            plan.damageMultiplier < 1
        ) {
            return Math.round(value * plan.damageMultiplier);
        }
        return value;
    };

    const _BattleManager_startAction = BattleManager.startAction;
    BattleManager.startAction = function() {
        const subject = this._subject;
        const action = subject ? subject.currentAction() : null;
        let answerResult = null;
        if (Battle.isActive() && subject && action) {
            if (subject.isActor && subject.isActor()) {
                answerResult = Intent.resolveAnswer(action);
            } else if (subject === Battle.activeEnemy()) {
                Intent.beginEnemyAction(action);
            }
        }
        _BattleManager_startAction.call(this);
        if (answerResult) {
            Intent.notifyAnswerResolved(answerResult);
        }
    };

    const _BattleManager_endAction = BattleManager.endAction;
    BattleManager.endAction = function() {
        const subject = this._subject;
        const action = this._action;
        const ownsAction = !!(
            action &&
            action.subject &&
            action.subject() === subject
        );
        _BattleManager_endAction.call(this);
        if (!Battle.isActive() || !ownsAction) {
            return;
        }
        if (subject === Battle.activeEnemy()) {
            Intent.completeEnemyAction(action);
        }
    };
})();
