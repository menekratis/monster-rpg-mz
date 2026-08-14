/*:
 * @target MZ
 * @plugindesc HUSHWAKE Milestone 1A - persistent Wildkin instances and roster.
 * @author OpenAI
 *
 * @help
 * Provides species-agnostic Wildkin instances backed by data/HushwakeWildkin.json.
 * This plugin does not change normal human actor or map-party behavior.
 */

(() => {
    "use strict";

    const Hushwake = (window.Hushwake = window.Hushwake || {});
    const Data = (Hushwake.Data = Hushwake.Data || {});

    window.$dataHushwakeWildkin = null;
    window.$gameWildkinRoster = null;

    DataManager._databaseFiles.push({
        name: "$dataHushwakeWildkin",
        src: "HushwakeWildkin.json"
    });

    Data._built = false;
    Data._speciesByKey = Object.create(null);
    Data._techniqueByKey = Object.create(null);
    Data._enemyIdByKey = Object.create(null);
    Data._encounterIdByKey = Object.create(null);

    Data.species = function(key) {
        return this._speciesByKey[key] || null;
    };

    Data.technique = function(key) {
        return this._techniqueByKey[key] || null;
    };

    Data.enemyId = function(key) {
        return this._enemyIdByKey[key] || 0;
    };

    Data.encounterId = function(key) {
        return this._encounterIdByKey[key] || 0;
    };

    Data.statAtLevel = function(species, statName, level) {
        const base = Number(species.baseStats[statName] || 0);
        const growth = Number(species.growth[statName] || 0);
        return Math.max(0, Math.round(base + growth * Math.max(0, level - 1)));
    };

    Data.makeSkill = function(definition, id) {
        const kind = String(definition.kind || "damage");
        const target = String(definition.target || "opponent");
        const isDamage = kind !== "support";
        const intent = String(definition.intent || "");
        const answer = definition.answer
            ? {
                  intent: String(definition.answer.intent || ""),
                  effect: String(definition.answer.effect || ""),
                  value: Number(definition.answer.value || 0),
                  preview: String(definition.answer.preview || ""),
                  result: String(definition.answer.result || "")
              }
            : null;
        const noteLines = [
            "<HushwakeTechnique:" + definition.key + ">",
            "<Aspect:" + definition.aspect + ">",
            "<Priority:" + Number(definition.priority || 0) + ">"
        ];
        if (intent) {
            noteLines.push("<Intent:" + intent + ">");
        }
        if (answer) {
            noteLines.push("<Answer:" + answer.intent + ">");
        }
        const skill = {
            id: id,
            animationId: Number(definition.animationId || 1),
            damage: {
                critical: false,
                elementId: 0,
                formula: isDamage
                    ? "Math.max(1, a.atk * " +
                      Number(definition.power || 1) +
                      " - b.def * 0.5)"
                    : "0",
                type: isDamage ? 1 : 0,
                variance: isDamage ? 5 : 0
            },
            description: String(definition.description || ""),
            effects: [],
            hitType: Game_Action.HITTYPE_CERTAIN,
            iconIndex: Number(definition.iconIndex || 0),
            message1: "%1 uses %2!",
            message2: "",
            messageType: 1,
            mpCost: 0,
            name: String(definition.name || definition.key),
            note: noteLines.join("\n"),
            occasion: 1,
            repeats: 1,
            requiredWtypeId1: 0,
            requiredWtypeId2: 0,
            scope: target === "self" ? 11 : 1,
            speed: 0,
            stypeId: 1,
            successRate: 100,
            tpCost: 0,
            tpGain: 0,
            hushwake: {
                key: String(definition.key),
                aspect: String(definition.aspect),
                priority: Number(definition.priority || 0),
                intent: intent,
                answer: answer,
                kind: kind,
                target: target
            }
        };
        DataManager.extractMetadata(skill);
        return skill;
    };

    Data.makeEnemy = function(definition, id) {
        const species = this.species(definition.speciesKey);
        const level = Number(definition.level || 1);
        const sequence = definition.techniqueSequence.map(key => {
            const technique = this.technique(key);
            if (!technique) {
                throw new Error("Unknown enemy technique: " + key);
            }
            return technique.id;
        });
        const enemy = {
            id: id,
            actions: sequence.map(skillId => ({
                conditionParam1: 0,
                conditionParam2: 0,
                conditionType: 0,
                rating: 5,
                skillId: skillId
            })),
            battlerHue: Number(definition.battlerHue || 0),
            battlerName: String(definition.battlerName),
            dropItems: [
                { dataId: 1, denominator: 1, kind: 0 },
                { dataId: 1, denominator: 1, kind: 0 },
                { dataId: 1, denominator: 1, kind: 0 }
            ],
            exp: 0,
            traits: [],
            gold: 0,
            name: species.name,
            note:
                "<HushwakeSpecies:" +
                species.key +
                ">\n<HushwakeEnemySequence:" +
                sequence.join(",") +
                ">",
            params: [
                this.statAtLevel(species, "resolve", level),
                0,
                this.statAtLevel(species, "force", level),
                this.statAtLevel(species, "guard", level),
                this.statAtLevel(species, "force", level),
                this.statAtLevel(species, "guard", level),
                this.statAtLevel(species, "tempo", level),
                0
            ]
        };
        DataManager.extractMetadata(enemy);
        enemy.hushwake = {
            speciesKey: species.key,
            formId: species.formId,
            level: level,
            aspects: species.aspects.slice(),
            techniqueSequence: sequence.slice()
        };
        return enemy;
    };

    Data.makeTroop = function(encounter, id) {
        const members = encounter.enemyKeys.map((key, index) => {
            const source = $dataHushwakeWildkin.enemyTemplates.find(
                enemy => enemy.key === key
            );
            return {
                enemyId: this.enemyId(key),
                x: Number(source.screenX || 260),
                y: Number(source.screenY || 300),
                hidden: index > 0
            };
        });
        return {
            id: id,
            members: members,
            name: String(encounter.name || encounter.key),
            pages: [
                {
                    conditions: {
                        actorHp: 50,
                        actorId: 1,
                        actorValid: false,
                        enemyHp: 50,
                        enemyIndex: 0,
                        enemyValid: false,
                        switchId: 1,
                        switchValid: false,
                        turnA: 0,
                        turnB: 0,
                        turnEnding: false,
                        turnValid: false
                    },
                    list: [{ code: 0, indent: 0, parameters: [] }],
                    span: 0
                }
            ]
        };
    };

    Data.buildRuntimeDatabase = function() {
        if (this._built) {
            return;
        }
        if (!$dataHushwakeWildkin) {
            throw new Error("HushwakeWildkin.json was not loaded.");
        }

        for (const species of $dataHushwakeWildkin.species) {
            this._speciesByKey[species.key] = species;
        }

        for (const definition of $dataHushwakeWildkin.techniques) {
            const id = $dataSkills.length;
            const skill = this.makeSkill(definition, id);
            $dataSkills.push(skill);
            this._techniqueByKey[definition.key] = skill;
        }

        for (const definition of $dataHushwakeWildkin.enemyTemplates) {
            const id = $dataEnemies.length;
            const enemy = this.makeEnemy(definition, id);
            $dataEnemies.push(enemy);
            this._enemyIdByKey[definition.key] = id;
        }

        for (const encounter of $dataHushwakeWildkin.encounters || []) {
            const id = $dataTroops.length;
            $dataTroops.push(this.makeTroop(encounter, id));
            this._encounterIdByKey[encounter.key] = id;
        }

        this._built = true;
    };

    const _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        if (!_DataManager_isDatabaseLoaded.call(this)) {
            return false;
        }
        Data.buildRuntimeDatabase();
        return true;
    };

    function Game_Wildkin() {
        this.initialize(...arguments);
    }

    Game_Wildkin.prototype = Object.create(Game_Actor.prototype);
    Game_Wildkin.prototype.constructor = Game_Wildkin;

    Game_Wildkin.prototype.initialize = function(
        instanceId,
        speciesKey,
        options
    ) {
        const settings = options || {};
        const species = Data.species(speciesKey);
        if (!species) {
            throw new Error("Unknown Wildkin species: " + speciesKey);
        }
        this._wildkinInstanceId = String(instanceId);
        this._wildkinSpeciesKey = String(speciesKey);
        this._techniqueKeys = (settings.techniques || species.techniques).slice();
        Game_Actor.prototype.initialize.call(this, species.actorTemplateId);
        this._wildkinFormId = String(settings.formId || species.formId);
        this._wildkinNickname = String(settings.nickname || "");
        this._name = this._wildkinNickname || species.name;
        this._nickname = this._wildkinNickname ? species.name : "";
        this._level = Math.max(1, Number(settings.level || 1));
        this._exp[this._classId] =
            settings.exp !== undefined
                ? Math.max(0, Number(settings.exp))
                : this.expForLevel(this._level);
        this.recoverAll();
        if (settings.resolve !== undefined) {
            this.setHp(Number(settings.resolve));
        }
    };

    Game_Wildkin.prototype.isWildkin = function() {
        return true;
    };

    Game_Wildkin.prototype.instanceId = function() {
        return this._wildkinInstanceId;
    };

    Game_Wildkin.prototype.speciesKey = function() {
        return this._wildkinSpeciesKey;
    };

    Game_Wildkin.prototype.species = function() {
        return Data.species(this._wildkinSpeciesKey);
    };

    Game_Wildkin.prototype.formId = function() {
        return this._wildkinFormId;
    };

    Game_Wildkin.prototype.aspects = function() {
        return this.species().aspects.slice();
    };

    Game_Wildkin.prototype.techniqueKeys = function() {
        return this._techniqueKeys.slice();
    };

    Game_Wildkin.prototype.skills = function() {
        return this._techniqueKeys
            .map(key => Data.technique(key))
            .filter(skill => !!skill);
    };

    Game_Wildkin.prototype.isLearnedSkill = function(skillId) {
        return this.skills().some(skill => skill.id === skillId);
    };

    Game_Wildkin.prototype.paramBase = function(paramId) {
        const species = this.species();
        switch (paramId) {
            case 0:
                return Data.statAtLevel(species, "resolve", this._level);
            case 1:
                return 0;
            case 2:
            case 4:
                return Data.statAtLevel(species, "force", this._level);
            case 3:
            case 5:
                return Data.statAtLevel(species, "guard", this._level);
            case 6:
                return Data.statAtLevel(species, "tempo", this._level);
            default:
                return 0;
        }
    };

    Game_Wildkin.prototype.paramPlus = function(paramId) {
        return Game_Battler.prototype.paramPlus.call(this, paramId);
    };

    Game_Wildkin.prototype.traitObjects = function() {
        return Game_Battler.prototype.traitObjects.call(this);
    };

    window.Game_Wildkin = Game_Wildkin;

    function Game_WildkinRoster() {
        this.initialize(...arguments);
    }

    Game_WildkinRoster.prototype.initialize = function() {
        this._schemaVersion = 1;
        this._nextInstanceNumber = 1;
        this._instances = [];
        this._partyOrder = [];
        this._activeLeadId = null;
    };

    Game_WildkinRoster.prototype.ensureValid = function() {
        this._schemaVersion = Number(this._schemaVersion || 1);
        this._nextInstanceNumber = Number(this._nextInstanceNumber || 1);
        this._instances = Array.isArray(this._instances) ? this._instances : [];
        this._partyOrder = Array.isArray(this._partyOrder)
            ? this._partyOrder
            : [];
        if (!this.instance(this._activeLeadId)) {
            this._activeLeadId = this._partyOrder[0] || null;
        }
    };

    Game_WildkinRoster.prototype.makeInstanceId = function() {
        const id = "WK-" + String(this._nextInstanceNumber).padZero(6);
        this._nextInstanceNumber++;
        return id;
    };

    Game_WildkinRoster.prototype.createWildkin = function(speciesKey, options) {
        const instance = new Game_Wildkin(
            this.makeInstanceId(),
            speciesKey,
            options || {}
        );
        this._instances.push(instance);
        return instance;
    };

    Game_WildkinRoster.prototype.instances = function() {
        return this._instances.slice();
    };

    Game_WildkinRoster.prototype.instance = function(instanceId) {
        return (
            this._instances.find(
                instance => instance.instanceId() === instanceId
            ) || null
        );
    };

    Game_WildkinRoster.prototype.setParty = function(instanceIds) {
        const unique = [];
        for (const id of instanceIds) {
            if (this.instance(id) && !unique.includes(id)) {
                unique.push(id);
            }
        }
        this._partyOrder = unique;
        if (!unique.includes(this._activeLeadId)) {
            this._activeLeadId = unique[0] || null;
        }
    };

    Game_WildkinRoster.prototype.partyOrder = function() {
        return this._partyOrder.slice();
    };

    Game_WildkinRoster.prototype.partyMembers = function() {
        return this._partyOrder
            .map(id => this.instance(id))
            .filter(instance => !!instance);
    };

    Game_WildkinRoster.prototype.activeLeadId = function() {
        return this._activeLeadId;
    };

    Game_WildkinRoster.prototype.active = function() {
        return this.instance(this._activeLeadId);
    };

    Game_WildkinRoster.prototype.setActiveLead = function(instanceId) {
        if (!this._partyOrder.includes(instanceId)) {
            return false;
        }
        const instance = this.instance(instanceId);
        if (!instance || instance.isDeathStateAffected()) {
            return false;
        }
        this._activeLeadId = instanceId;
        return true;
    };

    Game_WildkinRoster.prototype.reserves = function() {
        return this.partyMembers().filter(
            instance => instance.instanceId() !== this._activeLeadId
        );
    };

    Game_WildkinRoster.prototype.usableReserves = function() {
        return this.reserves().filter(
            instance => !instance.isDeathStateAffected()
        );
    };

    Game_WildkinRoster.prototype.isPartySpent = function() {
        const members = this.partyMembers();
        return (
            members.length === 0 ||
            members.every(instance => instance.isDeathStateAffected())
        );
    };

    window.Game_WildkinRoster = Game_WildkinRoster;

    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        window.$gameWildkinRoster = new Game_WildkinRoster();
    };

    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.wildkinRoster = $gameWildkinRoster;
        return contents;
    };

    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        window.$gameWildkinRoster =
            contents.wildkinRoster || new Game_WildkinRoster();
        $gameWildkinRoster.ensureValid();
    };

    const _Game_Action_setSubject = Game_Action.prototype.setSubject;
    Game_Action.prototype.setSubject = function(subject) {
        if (
            subject &&
            subject.isWildkin &&
            subject.isWildkin() &&
            typeof subject.instanceId === "function"
        ) {
            this._hushwakeWildkinInstanceId = subject.instanceId();
        } else {
            this._hushwakeWildkinInstanceId = null;
        }
        _Game_Action_setSubject.call(this, subject);
    };

    const _Game_Action_subject = Game_Action.prototype.subject;
    Game_Action.prototype.subject = function() {
        if (this._hushwakeWildkinInstanceId && $gameWildkinRoster) {
            const instance = $gameWildkinRoster.instance(
                this._hushwakeWildkinInstanceId
            );
            if (instance) {
                return instance;
            }
        }
        return _Game_Action_subject.call(this);
    };

    Hushwake.Wildkin = Hushwake.Wildkin || {};

    Hushwake.Wildkin.serializationCheck = function() {
        const roster = new Game_WildkinRoster();
        const first = roster.createWildkin("rillip", {
            nickname: "Ripple",
            level: 4
        });
        const second = roster.createWildkin("rillip", {
            nickname: "Current",
            level: 6
        });
        roster.setParty([first.instanceId(), second.instanceId()]);
        roster.setActiveLead(second.instanceId());
        first.setHp(Math.max(1, first.mhp - 17));

        const restored = JsonEx.makeDeepCopy(roster);
        restored.ensureValid();
        const restoredFirst = restored.instance(first.instanceId());
        const restoredSecond = restored.instance(second.instanceId());
        const passed =
            restored instanceof Game_WildkinRoster &&
            restoredFirst instanceof Game_Wildkin &&
            restoredSecond instanceof Game_Wildkin &&
            restoredFirst !== restoredSecond &&
            restoredFirst.instanceId() !== restoredSecond.instanceId() &&
            restoredFirst.speciesKey() === restoredSecond.speciesKey() &&
            restoredFirst.formId() === first.formId() &&
            restoredSecond.formId() === second.formId() &&
            restoredFirst.name() === "Ripple" &&
            restoredSecond.name() === "Current" &&
            restoredFirst.level === 4 &&
            restoredSecond.level === 6 &&
            restoredFirst.currentExp() === first.currentExp() &&
            restoredSecond.currentExp() === second.currentExp() &&
            restoredFirst.techniqueKeys().join(",") ===
                first.techniqueKeys().join(",") &&
            restoredSecond.techniqueKeys().join(",") ===
                second.techniqueKeys().join(",") &&
            restoredFirst.hp !== restoredSecond.hp &&
            restored.partyOrder().join(",") ===
                roster.partyOrder().join(",") &&
            restored.activeLeadId() === restoredSecond.instanceId();

        return {
            passed: passed,
            firstId: restoredFirst ? restoredFirst.instanceId() : null,
            secondId: restoredSecond ? restoredSecond.instanceId() : null
        };
    };
})();
