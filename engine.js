/* =============================================
   STRANDED - Game Engine
   핵심 게임 로직 (스탯, 턴, 상태관리)
   ============================================= */

class GameEngine {
    constructor() {
        this.state = null;
    }

    // ===== INITIALIZATION =====
    newGame(playerName) {
        this.state = {
            playerName: playerName,
            day: 1,
            phase: 'day', // 'day' | 'mid' | 'night'
            turnPhase: 'day_turn', // 'day_turn' | 'mid_turn' | 'night_turn'
            actionsLeft: 3,
            nightActionsLeft: { work: true, talk: true },

            // Player stats
            player: {
                hp: 100,
                maxHp: 100,
                stress: 0,
                hunger: 20,
                thirst: 20,
            },

            // Characters (with individual hunger/thirst)
            characters: {},

            // Inventory: typed consumable items
            inventory: { food: [], water: [] },

            // Deck
            deck: [],

            // Location levels (visit counts)
            locationLevels: {},
            locationVisits: {},

            // Shelter / tools / fire
            shelter: 0,       // 0~100
            tools: 0,
            hasFirePit: false,
            fireActive: false,

            // Signal progress
            signalProgress: 0,

            // Search bonus from night star watch
            searchBonus: 0,

            // Next day bonuses
            nextDayBonuses: {
                hpCostReduction: false,
                foodBonus: false,
                healBonus: false,
            },

            // Conversation counts per character
            conversationCounts: {},

            // Past unlocks per character
            pastUnlocks: {},

            // Special events seen
            specialEventsSeen: {},

            // Dispatch system: characters sent on missions
            dispatched: {}, // { charId: { location, returnDay, loot:[] } }

            // Dialogue state tracking
            dialogueState: {
                usedThisTurn: [], // charIds used this turn (mid/night)
                availableThisTurn: [], // charIds available for talk this turn
            },

            // Special event flags
            specialEventReady: {}, // { charId: true } when event is triggered
            specialEventSeen: {},  // mirrors specialEventsSeen for compat

            // Map exploration tracking
            exploredLocations: {},  // { locId: true }

            // Day log
            dayLog: [],

            // Game over flag
            gameOver: false,
            gameOverReason: '',

            // Gyuwon danger state
            gyuwonPoisoning: false,

            // Tutorial progress tracking
            tutorialComplete: false,

            // House building system
            house: {
                level: 0,
                xp: 0,
                totalXp: 0,
            },

            // Night card tracking
            epicCardsObtained: 0,
            uniqueUnlocked: false,

            // Madness tracking
            madnessTriggered: false,
            madnessCharId: null,

            // Special items inventory (buffs, timed effects - NOT cards or food)
            specialItems: [],
            // Active timed buffs: [{id, remainingDays}]
            activeBuffs: [],
        };

        // Initialize characters with individual hunger/thirst starting at 80%
        const charData = GAME_DATA.characters;
        for (const [id, data] of Object.entries(charData)) {
            this.state.characters[id] = {
                ...data.initialStats,
                alive: true,
                name: data.name,
                hunger: 80,   // Start at 80% (high = bad)
                thirst: 80,   // Start at 80% (high = bad)
            };
            this.state.conversationCounts[id] = 0;
            this.state.pastUnlocks[id] = [];
            this.state.specialEventsSeen[id] = false;
        }

        // Initialize location levels
        GAME_DATA.locations.forEach(loc => {
            this.state.locationLevels[loc.id] = 0;
            this.state.locationVisits[loc.id] = 0;
        });

        // Initialize deck with starting cards
        this.state.deck = [...GAME_DATA.initialDeck];

        // Initialize explored locations
        this.state.exploredLocations = {};

        return this.state;
    }

    // ===== GETTERS =====
    getState() { return this.state; }

    getCharacter(id) { return this.state.characters[id]; }

    getCharacterData(id) { return GAME_DATA.characters[id]; }

    getAvailableLocations() {
        const day = this.state.day;
        const available = GAME_DATA.locations.filter(loc => loc.unlockDay <= day);
        // Show only 3 (+searchBonus) out of available
        const showCount = Math.min(available.length, GAME_DATA.constants.searchLocationsShown + this.state.searchBonus);
        const shuffled = this.shuffleArray([...available]);
        return shuffled.slice(0, showCount);
    }

    getLocationInfo(locId) {
        const loc = GAME_DATA.locations.find(l => l.id === locId);
        if (!loc) return null;
        const level = this.state.locationLevels[locId] || 0;
        const visits = this.state.locationVisits[locId] || 0;
        return { ...loc, level, visits };
    }

    getAvailableDayWorks() {
        return GAME_DATA.dayWorks.filter(w => !w.unlockDay || w.unlockDay <= this.state.day);
    }

    getAvailableNightWorks() {
        const available = GAME_DATA.nightWorks.filter(w => !w.unlockDay || w.unlockDay <= this.state.day);
        // Show rest + 2 random work options
        const rest = available.find(w => w.id === 'rest');
        const works = available.filter(w => w.id !== 'rest');
        const shuffled = this.shuffleArray([...works]);
        const shown = shuffled.slice(0, GAME_DATA.constants.nightWorksShown);
        return [rest, ...shown];
    }

    getTalkTargets() {
        // 2-of-4 system: show 2 characters, minus those already used this turn
        const aliveChars = Object.entries(this.state.characters)
            .filter(([id, char]) => char.alive && !this.isDispatched(id))
            .map(([id]) => id);
        
        // If we haven't set up available chars for this turn, do it now
        if (!this.state.dialogueState.availableThisTurn || this.state.dialogueState.availableThisTurn.length === 0) {
            const shuffled = this.shuffleArray([...aliveChars]);
            this.state.dialogueState.availableThisTurn = shuffled.slice(0, Math.min(GAME_DATA.constants.talkTargetsShown, aliveChars.length));
            this.state.dialogueState.usedThisTurn = [];
        }
        
        // Filter out already used characters this turn
        const available = this.state.dialogueState.availableThisTurn.filter(
            id => !this.state.dialogueState.usedThisTurn.includes(id)
        );
        
        return available;
    }

    // Mark a character as used for dialogue this turn
    markTalkUsed(charId) {
        if (!this.state.dialogueState.usedThisTurn.includes(charId)) {
            this.state.dialogueState.usedThisTurn.push(charId);
        }
    }

    // Reset dialogue state for new turn
    resetDialogueState() {
        this.state.dialogueState = {
            usedThisTurn: [],
            availableThisTurn: [],
        };
    }

    // Check if any special event should fire tonight
    // Special events trigger after 3 conversations (per character)
    getSpecialEventForNight() {
        for (const [charId, data] of Object.entries(GAME_DATA.characters)) {
            if (this.state.specialEventsSeen[charId]) continue;
            const convCount = this.state.conversationCounts[charId] || 0;
            const threshold = data.specialEvent?.unlockConvCount || 3;
            if (data.specialEvent && convCount >= threshold) {
                return charId;
            }
        }
        return null;
    }

    // Trigger special event for a character
    triggerSpecialEvent(charId) {
        this.state.specialEventsSeen[charId] = true;
        if (!this.state.specialEventReady) this.state.specialEventReady = {};
        this.state.specialEventReady[charId] = true;
    }

    getTalkCards() {
        const talkCards = this.state.deck.filter(cardId => {
            const card = GAME_DATA.cards[cardId];
            return card && card.type === 'talk';
        });
        return talkCards;
    }

    getConversationCount(charId) {
        return this.state.conversationCounts[charId] || 0;
    }

    // ===== ACTIONS =====

    // --- SEARCH ---
    doSearch(locationId) {
        if (this.state.actionsLeft <= 0) return { success: false, msg: '행동력이 부족합니다' };
        if (this.state.phase !== 'day') return { success: false, msg: '낮에만 수색할 수 있습니다' };

        const loc = GAME_DATA.locations.find(l => l.id === locationId);
        if (!loc) return { success: false, msg: '잘못된 장소' };

        this.state.actionsLeft--;

        // Track explored location
        if (!this.state.exploredLocations) this.state.exploredLocations = {};
        this.state.exploredLocations[locationId] = true;

        // Update visits & level
        this.state.locationVisits[locationId] = (this.state.locationVisits[locationId] || 0) + 1;
        const visits = this.state.locationVisits[locationId];
        const threshold = GAME_DATA.constants.levelUpThreshold;
        if (visits % threshold === 0 && this.state.locationLevels[locationId] < loc.maxLevel) {
            this.state.locationLevels[locationId]++;
        }

        // HP cost
        let hpCost = 10;
        if (this.state.nextDayBonuses.hpCostReduction) hpCost = Math.floor(hpCost * 0.7);
        if (this.state.shelter >= 50) hpCost = Math.floor(hpCost * 0.8);
        this.state.player.hp = Math.max(0, this.state.player.hp - hpCost);

        // Determine loot
        const level = this.state.locationLevels[locationId] || 0;
        const lootTable = loc.loot[1]; // day 1 loot for prototype
        const levelBonus = level * 0.03; // 3% better per level

        // Roll for each possible loot, adjusted by level
        let roll = Math.random();
        let cumProb = 0;
        let result = null;

        for (const item of lootTable) {
            let adjustedProb = item.prob;
            if (item.card !== 'nothing') {
                adjustedProb += levelBonus;
            } else {
                adjustedProb = Math.max(0.05, adjustedProb - (levelBonus * lootTable.length));
            }
            cumProb += adjustedProb;
            if (roll <= cumProb) {
                result = item;
                break;
            }
        }

        if (!result) result = lootTable[lootTable.length - 1];

        const resultInfo = {
            success: true,
            location: loc.name,
            hpCost: hpCost,
            found: result.name,
            foundDesc: result.desc,
            cardId: result.card,
            isNothing: result.card === 'nothing',
        };

        // Add card to deck if not nothing and deck not full
        if (result.card !== 'nothing') {
            const cardData = GAME_DATA.cards[result.card];
            if (cardData && this.state.deck.length < GAME_DATA.constants.maxDeck) {
                this.state.deck.push(result.card);
                resultInfo.cardAdded = true;
                resultInfo.cardData = cardData;
            } else if (this.state.deck.length >= GAME_DATA.constants.maxDeck) {
                resultInfo.deckFull = true;
                resultInfo.cardData = cardData;
            }
        }

        this.state.dayLog.push(`수색: ${loc.name} → ${result.name}`);
        this.checkPlayerDeath();
        return resultInfo;
    }

    // --- HOUSE BUILDING ---
    addHouseXp(amount, source = '') {
        if (!this.state.house) this.state.house = { level: 0, xp: 0, totalXp: 0 };
        this.state.house.xp += amount;
        this.state.house.totalXp += amount;
        // Check level up
        const levels = GAME_DATA.houseLevels;
        let leveled = false;
        while (this.state.house.level < levels.length - 1) {
            const nextLevel = levels[this.state.house.level + 1];
            if (this.state.house.totalXp >= nextLevel.xpRequired) {
                this.state.house.level++;
                leveled = true;
            } else break;
        }
        return { xpGained: amount, newLevel: this.state.house.level, leveled, source };
    }

    getHouseLevel() {
        if (!this.state.house) return 0;
        return this.state.house.level;
    }

    getHouseEffect() {
        const level = this.getHouseLevel();
        if (level < 0 || level >= GAME_DATA.houseLevels.length) return { stressReduction: 0, restBonus: 0 };
        return GAME_DATA.houseLevels[level].teamEffect;
    }

    // --- NIGHT CARD ACQUISITION ---
    rollNightCard() {
        const C = GAME_DATA.constants;
        const pools = GAME_DATA.nightCardPool;
        const siPools = GAME_DATA.nightSpecialItemPool;
        let rarity, healthCost = 5;
        
        // Check if unique unlocked
        if (!this.state.epicCardsObtained) this.state.epicCardsObtained = 0;
        const uniqueUnlocked = this.state.epicCardsObtained >= C.epicCardsForUnique;
        this.state.uniqueUnlocked = uniqueUnlocked;
        
        const roll = Math.random();
        if (uniqueUnlocked) {
            if (roll < C.uniquePoolRare) rarity = 'rare';
            else if (roll < C.uniquePoolRare + C.uniquePoolEpic) { rarity = 'epic'; healthCost = 8; }
            else { rarity = 'unique'; healthCost = C.uniqueHealthCost; }
        } else {
            if (roll < C.nightRareProb) rarity = 'rare';
            else { rarity = 'epic'; healthCost = 8; }
        }
        
        // 40% chance to get a special item instead of a card
        const isSpecialItem = Math.random() < 0.4 && siPools[rarity] && siPools[rarity].length > 0;
        
        if (isSpecialItem) {
            const siPool = siPools[rarity];
            const itemId = siPool[Math.floor(Math.random() * siPool.length)];
            const itemData = GAME_DATA.specialItems[itemId];
            if (rarity === 'epic') this.state.epicCardsObtained++;
            this.state.player.hp = Math.max(0, this.state.player.hp - healthCost);
            // Add to special items inventory
            if (!this.state.specialItems) this.state.specialItems = [];
            this.state.specialItems.push(itemId);
            return { itemId, rarity, healthCost, isSpecialItem: true, item: itemData };
        }
        
        const pool = pools[rarity];
        if (!pool || pool.length === 0) return null;
        const cardId = pool[Math.floor(Math.random() * pool.length)];
        
        if (rarity === 'epic') this.state.epicCardsObtained++;
        this.state.player.hp = Math.max(0, this.state.player.hp - healthCost);
        
        if (this.state.deck.length < GAME_DATA.constants.maxDeck) {
            this.state.deck.push(cardId);
        }
        
        return { cardId, rarity, healthCost, isSpecialItem: false, card: GAME_DATA.cards[cardId] };
    }

    // --- USE SPECIAL ITEM ---
    useSpecialItem(itemId) {
        if (!this.state.specialItems) this.state.specialItems = [];
        const idx = this.state.specialItems.indexOf(itemId);
        if (idx === -1) return { success: false, msg: '아이템이 없습니다' };
        const itemData = GAME_DATA.specialItems[itemId];
        if (!itemData) return { success: false, msg: '잘못된 아이템' };

        this.state.specialItems.splice(idx, 1);
        const result = { success: true, itemName: itemData.name, effects: [] };

        if (itemData.category === 'timed_buff' && itemData.duration > 0) {
            if (!this.state.activeBuffs) this.state.activeBuffs = [];
            this.state.activeBuffs.push({ id: itemId, remainingDays: itemData.duration });
            result.effects.push(`${itemData.duration}일간 효과 적용!`);
        } else {
            // Immediate effect
            switch (itemData.effect.type) {
                case 'team_stress':
                    for (const [id, char] of Object.entries(this.state.characters)) {
                        if (char.alive) char.stress = Math.max(0, char.stress + itemData.effect.value);
                    }
                    this.state.player.stress = Math.max(0, this.state.player.stress + itemData.effect.value);
                    result.effects.push(`전원 스트레스 ${itemData.effect.value}`);
                    break;
                case 'rest_bonus':
                    this.state.player.hp = Math.min(this.state.player.maxHp, this.state.player.hp + itemData.effect.value);
                    result.effects.push(`체력 +${itemData.effect.value}`);
                    break;
                default:
                    result.effects.push('사용 완료');
            }
        }
        return result;
    }

    // --- PROCESS ACTIVE BUFFS (call at end of day) ---
    processActiveBuffs() {
        if (!this.state.activeBuffs) this.state.activeBuffs = [];
        this.state.activeBuffs = this.state.activeBuffs.filter(b => {
            b.remainingDays--;
            return b.remainingDays > 0;
        });
    }

    hasActiveBuff(effectType) {
        if (!this.state.activeBuffs) return false;
        return this.state.activeBuffs.some(b => {
            const item = GAME_DATA.specialItems[b.id];
            return item && item.effect.type === effectType;
        });
    }

    getActiveBuffValue(effectType) {
        if (!this.state.activeBuffs) return 0;
        let total = 0;
        this.state.activeBuffs.forEach(b => {
            const item = GAME_DATA.specialItems[b.id];
            if (item && item.effect.type === effectType) total += item.effect.value;
        });
        return total;
    }

    // --- DAY WORK ---
    doDayWork(workId) {
        if (this.state.actionsLeft <= 0) return { success: false, msg: '행동력이 부족합니다' };
        if (this.state.phase !== 'day') return { success: false, msg: '낮에만 일할 수 있습니다' };

        const work = GAME_DATA.dayWorks.find(w => w.id === workId);
        if (!work) return { success: false, msg: '잘못된 작업' };

        this.state.actionsLeft--;

        // HP cost
        let hpCost = work.cost.hp || 0;
        if (this.state.nextDayBonuses.hpCostReduction) hpCost = Math.floor(hpCost * 0.7);
        // Minye benefit: if affection >= threshold, reduce HP cost
        const minye = this.state.characters.minye;
        if (minye && minye.alive && minye.affection >= GAME_DATA.characters.minye.benefitThreshold) {
            hpCost = Math.floor(hpCost * 0.7);
        }
        // House bonus: reduce HP cost based on house level
        const houseEffect = this.getHouseEffect();
        if (houseEffect.restBonus > 0) {
            hpCost = Math.max(1, Math.floor(hpCost * (1 - houseEffect.restBonus * 0.01)));
        }
        this.state.player.hp = Math.max(0, this.state.player.hp - hpCost);

        const result = { success: true, workName: work.name, hpCost, effects: [], houseXp: null };

        switch (work.effect.type) {
            case 'build':
                this.state.shelter = Math.min(100, this.state.shelter + work.effect.shelterProgress);
                // House XP: +5 per person action
                const hxp = this.addHouseXp(GAME_DATA.constants.houseXpPerAction, 'build');
                result.houseXp = hxp;
                result.effects.push(`움막 진행도: ${this.state.shelter}% | 집 XP +${hxp.xpGained}`);
                if (hxp.leveled) result.effects.push(`🏠 집 레벨 UP! Lv.${hxp.newLevel}`);
                break;
            case 'fish':
                if (Math.random() < work.effect.prob) {
                    this.state.player.hunger = Math.max(0, this.state.player.hunger + (work.effect.hunger || 0));
                    result.effects.push(`낚시 성공! 굶주림 ${work.effect.hunger}`);
                } else {
                    result.effects.push('낚시 실패...');
                }
                break;
            case 'gather_water':
                this.state.player.thirst = Math.max(0, this.state.player.thirst + (work.effect.thirst || 0));
                result.effects.push(`물 확보! 목마름 ${work.effect.thirst}`);
                break;
            case 'craft':
                this.state.tools++;
                result.effects.push(`도구 제작 완료 (보유: ${this.state.tools})`);
                break;
            case 'cook':
                result.effects.push('요리 완료! 음식 효과 2배');
                break;
            case 'day_rest': {
                let restHp = work.effect.hp || 0;
                let restStress = work.effect.stress || 0;
                // House rest bonus
                const hEffect = this.getHouseEffect();
                restHp += hEffect.restBonus;
                restStress -= Math.floor(hEffect.stressReduction * 0.3);
                this.state.player.hp = Math.min(this.state.player.maxHp, this.state.player.hp + restHp);
                this.state.player.stress = Math.max(0, this.state.player.stress + restStress);
                result.effects.push(`체력 +${restHp}, 스트레스 ${restStress}`);
                break;
            }
        }

        this.state.dayLog.push(`일: ${work.name}`);
        this.checkPlayerDeath();
        return result;
    }

    // --- START CONVERSATION ---
    startConversation(charId) {
        if (this.state.phase === 'day' && this.state.actionsLeft <= 0) {
            return { success: false, msg: '행동력이 부족합니다' };
        }

        const charData = GAME_DATA.characters[charId];
        const char = this.state.characters[charId];
        if (!charData || !char || !char.alive) {
            return { success: false, msg: '대화할 수 없는 상대' };
        }

        if (this.state.phase === 'day') {
            this.state.actionsLeft--;
        }

        // Get talk cards and group into turns of 3
        const talkCards = this.getTalkCards();
        if (talkCards.length === 0) {
            return { success: false, msg: '대화 카드가 없습니다' };
        }

        const shuffled = this.shuffleArray([...talkCards]);
        const turns = [];
        for (let i = 0; i < shuffled.length; i += 3) {
            const turnCards = shuffled.slice(i, i + 3);
            if (turnCards.length > 0) turns.push(turnCards);
        }

        return {
            success: true,
            charId,
            charName: charData.name,
            turns,
            totalTurns: turns.length,
        };
    }

    // --- PLAY CONVERSATION CARD ---
    playConversationCard(charId, cardId) {
        const charData = GAME_DATA.characters[charId];
        const char = this.state.characters[charId];
        const card = GAME_DATA.cards[cardId];
        if (!charData || !char || !card) return null;

        const action = card.effect.action;
        const reactions = charData.dialogueReactions[action];
        if (!reactions) return null;

        // Calculate stat changes with randomness
        const changes = {};
        for (const [stat, range] of Object.entries(reactions)) {
            const min = range[0];
            const max = range[1];
            changes[stat] = this.randomInt(min, max);
        }

        // Apply changes
        for (const [stat, val] of Object.entries(changes)) {
            if (stat in char) {
                char[stat] = this.clamp(char[stat] + val, 0, 100);
            }
        }

        // Increment conversation count
        this.state.conversationCounts[charId] = (this.state.conversationCounts[charId] || 0) + 1;
        const convCount = this.state.conversationCounts[charId];

        // Check past unlock
        let pastUnlock = null;
        let specialEvent = null;
        for (const past of charData.pastStories) {
            if (convCount === past.unlockAt && !this.state.pastUnlocks[charId].includes(past.unlockAt)) {
                this.state.pastUnlocks[charId].push(past.unlockAt);
                pastUnlock = past;
            }
        }

        // Check special event - triggers after unlockConvCount (default 3) conversations
        const seThreshold = charData.specialEvent?.unlockConvCount || 3;
        if (charData.specialEvent && convCount >= seThreshold && !this.state.specialEventsSeen[charId]) {
            this.state.specialEventsSeen[charId] = true;
            specialEvent = charData.specialEvent;
        }

        // Get dialogue line
        const lines = charData.dialogueLines[action];
        const line = lines ? lines[Math.floor(Math.random() * lines.length)] : '"..."';

        // Talk cards are NOT consumed (kept in deck)
        // const cardIndex = this.state.deck.indexOf(cardId);
        // if (cardIndex !== -1) { this.state.deck.splice(cardIndex, 1); }

        // Gyuwon affection check
        this.checkGyuwonDanger();

        return {
            changes,
            line,
            pastUnlock,
            specialEvent,
            convCount,
        };
    }

    // --- NIGHT WORK ---
    doNightWork(workId) {
        if (!this.state.nightActionsLeft.work) return { success: false, msg: '이미 밤 일을 했습니다' };

        const work = GAME_DATA.nightWorks.find(w => w.id === workId);
        if (!work) return { success: false, msg: '잘못된 작업' };

        this.state.nightActionsLeft.work = false;

        // HP cost
        let hpCost = work.cost.hp || 0;
        this.state.player.hp = Math.max(0, this.state.player.hp - hpCost);

        const result = { success: true, workName: work.name, hpCost, effects: [], cardReward: null, restHpGained: 0 };

        // Apply effects
        switch (work.effect.type) {
            case 'rest': {
                let nightRestHp = work.effect.hp || 0;
                let nightRestStress = work.effect.stress || 0;
                // House rest bonus
                const nightHEffect = this.getHouseEffect();
                nightRestHp += nightHEffect.restBonus;
                nightRestStress -= Math.floor(nightHEffect.stressReduction * 0.5);
                this.state.player.hp = Math.min(this.state.player.maxHp, this.state.player.hp + nightRestHp);
                this.state.player.stress = Math.max(0, this.state.player.stress + nightRestStress);
                result.restHpGained = nightRestHp;
                result.effects.push(`체력 +${nightRestHp}, 스트레스 ${nightRestStress}`);
                // REST does NOT grant cards - only HP/stress
                result.skipNightCard = true;
                break;
            }
            case 'fire_keep':
                this.state.nextDayBonuses.hpCostReduction = true;
                this.state.fireActive = true;
                result.effects.push('내일 체력 소모 30% 감소');
                break;
            case 'star_watch':
                this.state.searchBonus = (this.state.searchBonus || 0) + 1;
                result.effects.push('내일 수색 선택지 +1');
                break;
            case 'trap':
                this.state.nextDayBonuses.foodBonus = true;
                result.effects.push('내일 식량 획득 확률 증가');
                break;
            case 'herb_prep':
                this.state.nextDayBonuses.healBonus = true;
                result.effects.push('약초 효과 증가');
                break;
            case 'journal':
                this.state.player.stress = Math.max(0, this.state.player.stress + (work.effect.stress || 0));
                result.effects.push(`스트레스 ${work.effect.stress}`);
                break;
            case 'night_fish':
                this.state.player.hunger = Math.max(0, this.state.player.hunger + (work.effect.hunger || 0));
                this.state.player.thirst = Math.max(0, this.state.player.thirst + (work.effect.thirst || 0));
                result.effects.push(`굶주림 ${work.effect.hunger}, 목마름 ${work.effect.thirst}`);
                break;
            case 'signal':
                this.state.signalProgress = Math.min(100, this.state.signalProgress + work.effect.signalProgress);
                result.effects.push(`신호 장치: ${this.state.signalProgress}%`);
                break;
            default:
                result.effects.push('작업 완료');
        }

        // GUARANTEED night reward acquisition (except for rest)
        // Can be a card OR a special item
        if (!result.skipNightCard) {
            const nightResult = this.rollNightCard();
            if (nightResult) {
                if (nightResult.isSpecialItem) {
                    result.specialItemReward = nightResult.item;
                    result.specialItemId = nightResult.itemId;
                    result.nightCardRarity = nightResult.rarity;
                    result.nightCardHealthCost = nightResult.healthCost;
                    result.isSpecialItem = true;
                    result.effects.push(`특수 아이템 획득: ${nightResult.item.name} [${nightResult.rarity.toUpperCase()}] (체력 -${nightResult.healthCost})`);
                } else {
                    result.cardReward = nightResult.card;
                    result.nightCardRarity = nightResult.rarity;
                    result.nightCardHealthCost = nightResult.healthCost;
                    result.isSpecialItem = false;
                    result.effects.push(`카드 획득: ${nightResult.card.name} [${nightResult.rarity.toUpperCase()}] (체력 -${nightResult.healthCost})`);
                }
            }
        }

        this.state.dayLog.push(`밤 일: ${work.name}`);
        this.checkPlayerDeath();
        return result;
    }

    // --- GIVE CONSUMABLE TO CHARACTER ---
    giveConsumable(charId, itemId, type) {
        const char = this.state.characters[charId];
        if (!char || !char.alive) return { success: false, msg: '캐릭터를 찾을 수 없습니다' };

        const inv = type === 'food' ? this.state.inventory.food : this.state.inventory.water;
        const idx = inv.indexOf(itemId);
        if (idx === -1) return { success: false, msg: '아이템이 없습니다' };

        const consumable = GAME_DATA.consumables[itemId];
        if (!consumable) return { success: false, msg: '잘못된 아이템' };

        // Remove from inventory
        inv.splice(idx, 1);

        // Apply effects to character
        if (consumable.hungerRestore) {
            char.hunger = Math.max(0, char.hunger - consumable.hungerRestore);
        }
        if (consumable.thirstRestore) {
            char.thirst = Math.max(0, char.thirst - consumable.thirstRestore);
        }

        // Apply bonus stat effects (exploration-only foods)
        if (consumable.bonusStat && consumable.bonusValue) {
            if (consumable.bonusStat in char) {
                char[consumable.bonusStat] = this.clamp(char[consumable.bonusStat] + consumable.bonusValue, 0, 100);
            }
        }

        // Also reduce stress slightly and increase hope
        char.stress = Math.max(0, char.stress - 3);
        char.hope = Math.min(100, char.hope + 2);

        return {
            success: true,
            charName: char.name,
            itemName: consumable.name,
            effects: consumable.effect,
        };
    }

    // --- ADD CONSUMABLE TO INVENTORY ---
    addConsumable(itemId, type) {
        if (type === 'food') this.state.inventory.food.push(itemId);
        else this.state.inventory.water.push(itemId);
    }

    // --- USE CARD ---
    useCard(cardId) {
        const card = GAME_DATA.cards[cardId];
        if (!card) return { success: false, msg: '잘못된 카드' };

        const cardIndex = this.state.deck.indexOf(cardId);
        if (cardIndex === -1) return { success: false, msg: '카드가 덱에 없습니다' };

        const result = { success: true, cardName: card.name, effects: [] };

        switch (card.effect.type) {
            case 'food':
                this.state.player.hunger = Math.max(0, this.state.player.hunger + (card.effect.hunger || 0));
                if (card.effect.thirst) this.state.player.thirst = Math.max(0, this.state.player.thirst + card.effect.thirst);
                if (card.effect.hp) this.state.player.hp = Math.min(this.state.player.maxHp, this.state.player.hp + card.effect.hp);
                result.effects.push(`굶주림 ${card.effect.hunger || 0}`);
                break;
            case 'water':
                this.state.player.thirst = Math.max(0, this.state.player.thirst + (card.effect.thirst || 0));
                result.effects.push(`목마름 ${card.effect.thirst || 0}`);
                break;
            case 'heal':
                this.state.player.hp = Math.min(this.state.player.maxHp, this.state.player.hp + (card.effect.hp || 0));
                if (card.effect.stress) this.state.player.stress = Math.max(0, this.state.player.stress + card.effect.stress);
                result.effects.push(`체력 +${card.effect.hp || 0}`);
                break;
            case 'food_water':
                this.state.player.hunger = Math.max(0, this.state.player.hunger + (card.effect.hunger || 0));
                this.state.player.thirst = Math.max(0, this.state.player.thirst + (card.effect.thirst || 0));
                result.effects.push(`굶주림 ${card.effect.hunger}, 목마름 ${card.effect.thirst}`);
                break;
            case 'team_stress':
                for (const [id, char] of Object.entries(this.state.characters)) {
                    if (char.alive) char.stress = Math.max(0, char.stress + card.effect.value);
                }
                this.state.player.stress = Math.max(0, this.state.player.stress + card.effect.value);
                result.effects.push(`전원 스트레스 ${card.effect.value}`);
                break;
            case 'team_hope':
                for (const [id, char] of Object.entries(this.state.characters)) {
                    if (char.alive) char.hope = Math.min(100, char.hope + card.effect.value);
                }
                result.effects.push(`전원 희망 +${card.effect.value}`);
                break;
            case 'rest_bonus':
                this.state.player.hp = Math.min(this.state.player.maxHp, this.state.player.hp + card.effect.value);
                result.effects.push(`체력 +${card.effect.value}`);
                break;
            case 'search_bonus':
                this.state.searchBonus += card.effect.value;
                result.effects.push(`다음 수색 선택지 +${card.effect.value}`);
                break;
            case 'gift':
                // Used during conversation, special
                result.effects.push('특별한 선물');
                break;
            default:
                result.effects.push('사용 완료');
        }

        // Remove from deck
        this.state.deck.splice(cardIndex, 1);
        this.checkPlayerDeath();
        return result;
    }

    // --- DISCARD CARD ---
    discardCard(cardId) {
        const idx = this.state.deck.indexOf(cardId);
        if (idx !== -1) {
            this.state.deck.splice(idx, 1);
            return true;
        }
        return false;
    }

    // ===== PHASE MANAGEMENT =====

    // Transition: Day turn → Mid turn (Distribution + Dialogue + Dispatch)
    endDayActions() {
        this.state.phase = 'mid';
        this.state.turnPhase = 'mid_turn';
        // Reset dialogue state for mid turn
        this.resetDialogueState();
        // Don't increase hunger/thirst yet (that happens at night transition)
        this.state.dayLog.push('--- 중간 턴: 배급 & 대화 & 파견 ---');
        return this.getDaySummary();
    }

    // Transition: Mid turn → Night turn
    endDayPhase() {
        this.state.phase = 'night';
        this.state.turnPhase = 'night_turn';
        this.state.nightActionsLeft = { work: true, talk: true };

        // Reset dialogue state for night talk
        this.resetDialogueState();

        // Apply daily increases to player
        this.state.player.hunger = Math.min(100, this.state.player.hunger + GAME_DATA.constants.dailyHungerIncrease);
        this.state.player.thirst = Math.min(100, this.state.player.thirst + GAME_DATA.constants.dailyThirstIncrease);

        // Apply daily increases to characters
        for (const [id, char] of Object.entries(this.state.characters)) {
            if (!char.alive) continue;
            char.hunger = Math.min(100, (char.hunger || 0) + GAME_DATA.constants.dailyHungerIncrease);
            char.thirst = Math.min(100, (char.thirst || 0) + GAME_DATA.constants.dailyThirstIncrease);
        }

        // Character benefits
        this.applyCharacterBenefits();

        this.state.dayLog.push('--- 밤이 되었다 ---');

        return this.getDaySummary();
    }

    endNightPhase() {
        // Process end-of-day
        this.processEndOfDay();

        // Process active buff timers
        this.processActiveBuffs();

        // Process dispatched characters returning
        this.processDispatchReturns();

        // Advance to next day
        this.state.day++;
        this.state.phase = 'day';
        this.state.turnPhase = 'day_turn';
        this.state.actionsLeft = 3;
        this.state.searchBonus = 0;

        // Reset dialogue state for new day
        this.resetDialogueState();

        // Reset next day bonuses
        this.state.nextDayBonuses = {
            hpCostReduction: false,
            foodBonus: false,
            healBonus: false,
        };

        this.state.dayLog = [];

        return {
            day: this.state.day,
            phase: 'day',
        };
    }

    // ===== DISPATCH SYSTEM =====
    dispatchCharacter(charId, locationId, provisions) {
        const char = this.state.characters[charId];
        if (!char || !char.alive) return { success: false, msg: '파견할 수 없는 캐릭터' };
        if (this.state.dispatched[charId]) return { success: false, msg: '이미 파견 중입니다' };

        const returnDays = this.randomInt(1, 3);
        const returnDay = this.state.day + returnDays;

        // Apply dispatch penalties: stress increases, hope decreases
        char.stress = Math.min(100, char.stress + 15);
        char.hope = Math.max(0, char.hope - 10);

        this.state.dispatched[charId] = {
            location: locationId,
            returnDay: returnDay,
            departDay: this.state.day,
            provisions: provisions || { food: [], water: [] },
        };

        this.state.dayLog.push(`${char.name} 파견 (${returnDays}일 후 귀환)`);
        return { success: true, returnDays, returnDay };
    }

    // Apply daily dispatch effects (hunger/thirst/stress while dispatched)
    processDispatchDaily() {
        for (const [charId, data] of Object.entries(this.state.dispatched)) {
            const char = this.state.characters[charId];
            if (!char || !char.alive) continue;
            // Dispatched characters get hungry/thirsty faster
            char.hunger = Math.min(100, (char.hunger || 0) + 12);
            char.thirst = Math.min(100, (char.thirst || 0) + 14);
            char.stress = Math.min(100, char.stress + 5);
            char.hope = Math.max(0, char.hope - 3);
            // If they have provisions, consume them
            if (data.provisions) {
                if (data.provisions.food.length > 0) {
                    const fId = data.provisions.food.shift();
                    const cons = GAME_DATA.consumables[fId];
                    if (cons && cons.hungerRestore) char.hunger = Math.max(0, char.hunger - cons.hungerRestore);
                }
                if (data.provisions.water.length > 0) {
                    const wId = data.provisions.water.shift();
                    const cons = GAME_DATA.consumables[wId];
                    if (cons && cons.thirstRestore) char.thirst = Math.max(0, char.thirst - cons.thirstRestore);
                }
            }
            // Dispatched characters do NOT die - cap stats at 99 to keep alive
            // They will be in critical state when they return, giving player one chance to feed
            if (char.hunger >= 100) char.hunger = 99;
            if (char.thirst >= 100) char.thirst = 99;
            if (char.stress >= 100) char.stress = 99;
        }
    }

    processDispatchReturns() {
        const returns = [];
        for (const [charId, data] of Object.entries(this.state.dispatched)) {
            if (this.state.day + 1 >= data.returnDay) {
                const char = this.state.characters[charId];
                if (!char || !char.alive) { delete this.state.dispatched[charId]; continue; }

                // Mark character as just returned - they get one feeding grace period
                char.justReturned = true;

                // Generate loot from dispatch
                const loot = [];
                const locConsumables = GAME_DATA.searchConsumableLoot[data.location];
                if (locConsumables) {
                    // 50% chance food, 30% chance water
                    if (locConsumables.food.length > 0 && Math.random() < 0.5) {
                        const fId = locConsumables.food[Math.floor(Math.random() * locConsumables.food.length)];
                        loot.push({ type: 'food', itemId: fId });
                    }
                    if (locConsumables.water.length > 0 && Math.random() < 0.3) {
                        const wId = locConsumables.water[Math.floor(Math.random() * locConsumables.water.length)];
                        loot.push({ type: 'water', itemId: wId });
                    }
                }
                // Fallback: at least give something
                if (loot.length === 0 && Math.random() < 0.5) {
                    loot.push({ type: 'food', itemId: 'raw_berry' });
                }

                returns.push({ charId, charName: char.name, location: data.location, loot });

                // Add loot to inventory
                for (const item of loot) {
                    if (item.type === 'food') this.state.inventory.food.push(item.itemId);
                    else this.state.inventory.water.push(item.itemId);
                }

                delete this.state.dispatched[charId];
            }
        }
        return returns;
    }

    isDispatched(charId) {
        return !!this.state.dispatched[charId];
    }

    getDispatchInfo(charId) {
        return this.state.dispatched[charId] || null;
    }

    processEndOfDay() {
        const C = GAME_DATA.constants;

        // Process dispatched characters daily effects
        this.processDispatchDaily();

        // House effect on team
        const houseEffect = this.getHouseEffect();

        // Stress from hunger/thirst for player (AMPLIFIED)
        const amp = C.stressAmplifier || 1;
        if (this.state.player.hunger > 50) {
            const hungerStress = Math.floor(Math.floor((this.state.player.hunger - 50) / 10) * C.stressFromHunger * amp);
            this.state.player.stress = Math.min(100, this.state.player.stress + hungerStress);
        }
        if (this.state.player.thirst > 50) {
            const thirstStress = Math.floor(Math.floor((this.state.player.thirst - 50) / 10) * C.stressFromThirst * amp);
            this.state.player.stress = Math.min(100, this.state.player.stress + thirstStress);
        }

        // House stress reduction for player
        this.state.player.stress = Math.max(0, this.state.player.stress - houseEffect.stressReduction);

        // Natural stress decay
        this.state.player.stress = Math.max(0, this.state.player.stress - C.baseStressDecay);

        // Process each character
        for (const [id, char] of Object.entries(this.state.characters)) {
            if (!char.alive) continue;
            const data = GAME_DATA.characters[id];

            // Stress triggers
            switch (data.stressTrigger) {
                case 'hunger': // Minye
                    if (this.state.player.hunger > 40) {
                        const add = Math.floor((this.state.player.hunger - 40) / 10 * 3 * data.stressMultiplier * amp);
                        char.stress = Math.min(100, char.stress + add);
                    }
                    break;
                case 'affection_low': // Gyuwon
                    if (char.affection < 40) {
                        const add = Math.floor((40 - char.affection) / 10 * 3 * data.stressMultiplier * amp);
                        char.stress = Math.min(100, char.stress + add);
                    }
                    break;
                case 'thirst': // Seula
                    if (this.state.player.thirst > 40) {
                        const add = Math.floor((this.state.player.thirst - 40) / 10 * 3 * data.stressMultiplier * amp);
                        char.stress = Math.min(100, char.stress + add);
                    }
                    // Also if reason low
                    if (char.reason < 40) {
                        char.stress = Math.min(100, char.stress + 8);
                    }
                    break;
                case 'hope_low': // Gyeol
                    if (char.hope < 40) {
                        const add = Math.floor((40 - char.hope) / 10 * 3 * data.stressMultiplier * amp);
                        char.stress = Math.min(100, char.stress + add);
                    }
                    break;
            }

            // Hope natural decay
            char.hope = Math.max(0, char.hope - C.baseHopeDecay);

            // House stress reduction
            char.stress = Math.max(0, char.stress - houseEffect.stressReduction);

            // Stress natural decay
            char.stress = Math.max(0, char.stress - C.baseStressDecay);

            // Gyeol benefit: if hope high, reduce team stress increase
            if (id !== 'gyeol') {
                const gyeol = this.state.characters.gyeol;
                if (gyeol && gyeol.alive && gyeol.hope >= 60) {
                    const reduction = 0.1 + (gyeol.hope - 60) * 0.005; // 10~30%
                    char.stress = Math.max(0, char.stress - Math.floor(char.stress * reduction * 0.1));
                }
            }

            // Gyuwon high affection poison effect
            if (id === 'gyuwon' && char.affection >= C.gyuwonAffectionDangerHigh) {
                this.state.gyuwonPoisoning = true;
                // Poison other characters
                for (const [otherId, otherChar] of Object.entries(this.state.characters)) {
                    if (otherId !== 'gyuwon' && otherChar.alive) {
                        otherChar.stress = Math.min(100, otherChar.stress + 8);
                        otherChar.hope = Math.max(0, otherChar.hope - 5);
                    }
                }
            } else if (id === 'gyuwon') {
                this.state.gyuwonPoisoning = false;
            }

            // Gyuwon hope low -> dependency -> affection auto increase
            if (id === 'gyuwon' && char.hope < 30) {
                char.affection = Math.min(100, char.affection + 5);
            }

            // Check character death
            this.checkCharacterDeath(id);
        }

        // Check player death
        this.checkPlayerDeath();

        // Gyuwon benefit: fishing
        const gyuwon = this.state.characters.gyuwon;
        if (gyuwon && gyuwon.alive && gyuwon.affection >= GAME_DATA.characters.gyuwon.benefitThreshold) {
            if (Math.random() < 0.4) {
                this.state.player.hunger = Math.max(0, this.state.player.hunger - 8);
                this.state.dayLog.push('양규원이 낚시를 해서 음식을 가져왔다.');
            }
        }

        // Seula benefit: water
        const seula = this.state.characters.seula;
        if (seula && seula.alive && seula.affection >= GAME_DATA.characters.seula.benefitThreshold) {
            if (Math.random() < 0.3) {
                this.state.player.thirst = Math.max(0, this.state.player.thirst - 10);
                this.state.dayLog.push('윤슬아가 좋은 물 스팟을 찾았다.');
            }
        }
    }

    applyCharacterBenefits() {
        // Minye: work help
        const minye = this.state.characters.minye;
        if (minye && minye.alive && minye.affection >= GAME_DATA.characters.minye.benefitThreshold) {
            this.state.player.hp = Math.min(this.state.player.maxHp, this.state.player.hp + 5);
        }
    }

    // ===== DEATH CHECKS =====

    checkPlayerDeath() {
        if (this.state.gameOver) return;

        if (this.state.player.hp <= 0) {
            this.state.gameOver = true;
            this.state.gameOverReason = '체력이 바닥났다... 더 이상 움직일 수 없었다.';
            return;
        }
        // Stress 100 does NOT cause instant death - instead madness triggers at 90+
        // Player stress death only from hunger/thirst/hp
        if (this.state.player.hunger >= 100) {
            this.state.gameOver = true;
            this.state.gameOverReason = '굶주림을 견디지 못했다...';
            return;
        }
        if (this.state.player.thirst >= 100) {
            this.state.gameOver = true;
            this.state.gameOverReason = '갈증을 견디지 못했다...';
            return;
        }
    }

    // Check if any character has stress > 90 (madness trigger)
    checkMadness() {
        const C = GAME_DATA.constants;
        for (const [id, char] of Object.entries(this.state.characters)) {
            if (!char.alive) continue;
            if (char.stress >= C.stressMadnessThreshold && !this.state.madnessTriggered) {
                this.state.madnessTriggered = true;
                this.state.madnessCharId = id;
                return { triggered: true, charId: id, charName: char.name };
            }
        }
        return { triggered: false };
    }

    // Execute madness: all characters die
    executeMadness() {
        for (const [id, char] of Object.entries(this.state.characters)) {
            char.alive = false;
        }
        this.state.gameOver = true;
        this.state.gameOverReason = '극도의 스트레스로 모두가 이성을 잃었다... 아무도 살아남지 못했다.';
    }

    checkCharacterDeath(charId) {
        const char = this.state.characters[charId];
        const data = GAME_DATA.characters[charId];
        if (!char || !char.alive) return;

        // Characters just returned from dispatch get a grace period (one feeding chance)
        if (char.justReturned) {
            char.justReturned = false;
            return; // Skip death check this turn
        }

        // Dispatched characters are immune to death
        if (this.isDispatched(charId)) return;

        // Stress >= 100 does NOT cause instant death
        // Instead, stress > 90 triggers madness sequence in UI (checked separately)

        // Special death conditions
        // Gyuwon: affection too low -> suicide
        if (charId === 'gyuwon' && char.affection <= GAME_DATA.constants.gyuwonAffectionDangerLow) {
            char.alive = false;
            char.deathCause = 'affection_low';
            char.deathCauseText = '극도로 낮은 호감도로 인한 자포자기';
            this.state.dayLog.push(`${data.name}: ${data.deathDesc}`);
            return;
        }

        // Gyeol: reason too low -> fall death
        if (charId === 'gyeol' && data.deathCondition === 'reason_low' && char.reason < data.deathThreshold) {
            char.alive = false;
            char.deathCause = 'reason_low';
            char.deathCauseText = '이성 상실로 인한 추락사';
            this.state.dayLog.push(`${data.name}: ${data.deathDesc}`);
            return;
        }

        // Hunger/thirst death for characters
        if (char.hunger >= 100) {
            char.alive = false;
            char.deathCause = 'hunger';
            char.deathCauseText = '극심한 굶주림';
            this.state.dayLog.push(`${data.name}이(가) 굶주림으로 쓰러졌다...`);
            return;
        }
        if (char.thirst >= 100) {
            char.alive = false;
            char.deathCause = 'thirst';
            char.deathCauseText = '극심한 갈증';
            this.state.dayLog.push(`${data.name}이(가) 갈증으로 쓰러졌다...`);
            return;
        }
    }

    checkGyuwonDanger() {
        const gyuwon = this.state.characters.gyuwon;
        if (!gyuwon || !gyuwon.alive) return;

        if (gyuwon.affection >= GAME_DATA.constants.gyuwonAffectionDangerHigh) {
            this.state.gyuwonPoisoning = true;
        }
    }

    // ===== DAY SUMMARY =====
    getDaySummary() {
        const summary = {
            day: this.state.day,
            phase: this.state.phase,
            player: { ...this.state.player },
            characters: {},
            log: [...this.state.dayLog],
        };

        for (const [id, char] of Object.entries(this.state.characters)) {
            summary.characters[id] = {
                name: GAME_DATA.characters[id].name,
                alive: char.alive,
                stress: char.stress,
                hope: char.hope,
                courage: char.courage,
                reason: char.reason,
                affection: char.affection,
            };
        }

        return summary;
    }

    // ===== UTILITY =====
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }
}
