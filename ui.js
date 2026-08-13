/* =============================================
   STRANDED - UI Manager
   모든 UI 렌더링 및 인터랙션
   ============================================= */

class UIManager {
    constructor(engine) {
        this.engine = engine;
        this.currentConversation = null;
        this.currentConvTurn = 0;
    }

    // ===== SCREEN MANAGEMENT =====
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById(screenId);
        if (screen) screen.classList.add('active');
    }

    // ===== HUD UPDATE =====
    updateHUD() {
        const s = this.engine.getState();
        if (!s) return;

        document.getElementById('day-number').textContent = s.day;
        const phaseEl = document.getElementById('time-phase');
        phaseEl.textContent = s.phase === 'day' ? '낮' : '밤';
        phaseEl.className = 'time-phase ' + (s.phase === 'day' ? 'phase-day' : 'phase-night');

        // Player bars
        this.updateBar('hp', s.player.hp, s.player.maxHp);
        this.updateBar('stress', s.player.stress, 100);
        this.updateBar('hunger', s.player.hunger, 100);
        this.updateBar('thirst', s.player.thirst, 100);

        // Actions
        if (s.phase === 'day') {
            document.getElementById('actions-left').textContent = s.actionsLeft;
        } else {
            const nightLeft = (s.nightActionsLeft.work ? 1 : 0) + (s.nightActionsLeft.talk ? 1 : 0);
            document.getElementById('actions-left').textContent = nightLeft;
        }

        // Deck count
        document.getElementById('deck-count').textContent = s.deck.length;

        // Character mini stats
        for (const [id, char] of Object.entries(s.characters)) {
            const miniEl = document.getElementById(`mini-stress-${id}`);
            if (miniEl) {
                miniEl.style.width = char.stress + '%';
                miniEl.style.background = char.alive ? 'var(--stress-color)' : '#555';
            }
            const portrait = document.getElementById(`portrait-${id}`);
            if (portrait) {
                portrait.style.opacity = char.alive ? '1' : '0.3';
            }
        }

        // Action bars
        if (s.phase === 'day') {
            document.getElementById('action-bar-day').classList.remove('hidden');
            document.getElementById('action-bar-night').classList.add('hidden');
        } else {
            document.getElementById('action-bar-day').classList.add('hidden');
            document.getElementById('action-bar-night').classList.remove('hidden');
        }

        // Scene background
        const sceneBg = document.getElementById('scene-bg');
        if (s.phase === 'night') {
            sceneBg.classList.add('night');
        } else {
            sceneBg.classList.remove('night');
        }

        // Disable action buttons if no actions left
        if (s.phase === 'day') {
            const disabled = s.actionsLeft <= 0;
            document.getElementById('btn-search').disabled = disabled;
            document.getElementById('btn-work').disabled = disabled;
            document.getElementById('btn-talk').disabled = disabled;
        } else {
            document.getElementById('btn-night-work').disabled = !s.nightActionsLeft.work;
            document.getElementById('btn-night-talk').disabled = !s.nightActionsLeft.talk;
        }

        // Check if all actions done -> show end phase button
        this.checkPhaseEnd();
    }

    updateBar(stat, value, max) {
        const bar = document.getElementById(`bar-${stat}`);
        const val = document.getElementById(`val-${stat}`);
        if (bar) bar.style.width = (value / max * 100) + '%';
        if (val) val.textContent = Math.round(value);
    }

    // ===== CHECK PHASE END =====
    checkPhaseEnd() {
        const s = this.engine.getState();
        const sceneContent = document.getElementById('scene-content');

        if (s.phase === 'day' && s.actionsLeft <= 0) {
            sceneContent.innerHTML = `
                <div class="scene-message">
                    <p>낮 행동을 모두 마쳤다.</p>
                    <button class="menu-btn" id="btn-end-day" style="margin-top:16px;">밤으로 넘어가기</button>
                </div>
            `;
            document.getElementById('btn-end-day').onclick = () => this.transitionToNight();
        } else if (s.phase === 'night' && !s.nightActionsLeft.work && !s.nightActionsLeft.talk) {
            sceneContent.innerHTML = `
                <div class="scene-message">
                    <p>밤 행동을 모두 마쳤다. 내일을 준비하자.</p>
                    <button class="menu-btn" id="btn-end-night" style="margin-top:16px;">다음 날로</button>
                </div>
            `;
            document.getElementById('btn-end-night').onclick = () => this.transitionToNextDay();
        } else if (s.phase === 'night') {
            this.showDefaultScene();
        } else if (s.phase === 'day') {
            this.showDefaultScene();
        }
    }

    showDefaultScene() {
        const s = this.engine.getState();
        const sceneContent = document.getElementById('scene-content');
        if (s.phase === 'day') {
            const dayNames = ['', '첫째', '둘째', '셋째', '넷째', '다섯째'];
            const dayName = s.day <= 5 ? dayNames[s.day] : s.day + '번째';
            sceneContent.innerHTML = `
                <div class="scene-message">
                    <p><strong>Day ${s.day}</strong> - 무인도의 ${dayName} 날이 밝았다.</p>
                    <p style="margin-top:8px; color:var(--text-secondary);">수색, 일, 대화 중 행동을 선택하세요. (${s.actionsLeft}회 남음)</p>
                    ${s.day === 1 ? '<p style="margin-top:12px;font-size:0.8rem;color:var(--text-dim);">Tip: 왼쪽 캐릭터 초상화를 클릭하면 상세 정보를 볼 수 있습니다.</p>' : ''}
                </div>
            `;
        } else {
            const nightMsgs = [
                '별이 쏟아지는 밤하늘 아래, 파도 소리만이 들린다.',
                '모닥불의 희미한 빛이 어둠을 밀어낸다.',
                '밤바다의 바람이 차갑게 불어온다.',
                '누군가의 작은 한숨 소리가 들린다.',
            ];
            const nightMsg = nightMsgs[Math.floor(Math.random() * nightMsgs.length)];
            let actionsInfo = [];
            if (s.nightActionsLeft.work) actionsInfo.push('밤 일');
            if (s.nightActionsLeft.talk) actionsInfo.push('대화');
            sceneContent.innerHTML = `
                <div class="scene-message">
                    <p><strong>Day ${s.day} - 밤</strong></p>
                    <p style="margin-top:8px;color:var(--text-secondary);font-style:italic;">${nightMsg}</p>
                    <p style="margin-top:12px;color:var(--text-secondary);">${actionsInfo.length > 0 ? actionsInfo.join(', ') + '을(를) 해야 합니다.' : '모든 행동을 마쳤습니다.'}</p>
                </div>
            `;
        }
    }

    // ===== TRANSITIONS =====
    transitionToNight() {
        const summary = this.engine.endDayPhase();
        this.showDayEndSummary(summary, 'night');
    }

    transitionToNextDay() {
        const result = this.engine.endNightPhase();

        // Check game over
        if (this.engine.getState().gameOver) {
            this.showGameOver(this.engine.getState().gameOverReason);
            return;
        }

        // Check character deaths
        const s = this.engine.getState();
        const deathLog = s.dayLog.filter(l => l.includes(':'));
        if (deathLog.length > 0) {
            // Show death events
        }

        this.updateHUD();
        this.showDefaultScene();
    }

    showDayEndSummary(summary, nextPhase) {
        const panel = document.getElementById('panel-day-end');
        const title = document.getElementById('day-end-title');
        const content = document.getElementById('day-end-summary');
        const btn = document.getElementById('btn-next-phase');

        title.textContent = nextPhase === 'night' ? `${summary.day}일차 낮 종료` : `${summary.day}일차 종료`;

        let html = '<div class="summary-section"><h4>플레이어 상태</h4>';
        html += `<div class="summary-item"><span>체력</span><span>${summary.player.hp}/${summary.player.maxHp || 100}</span></div>`;
        html += `<div class="summary-item"><span>스트레스</span><span>${summary.player.stress}/100</span></div>`;
        html += `<div class="summary-item"><span>굶주림</span><span>${summary.player.hunger}/100</span></div>`;
        html += `<div class="summary-item"><span>목마름</span><span>${summary.player.thirst}/100</span></div>`;
        html += '</div>';

        html += '<div class="summary-section"><h4>동료 상태</h4>';
        for (const [id, char] of Object.entries(summary.characters)) {
            const statusIcon = char.alive ? '&#9679;' : '&#10006;';
            const statusColor = char.alive ? 'var(--accent-green)' : 'var(--accent-red)';
            html += `<div class="summary-item">
                <span style="color:${statusColor}">${statusIcon} ${char.name}</span>
                <span>스트레스:${char.stress} 희망:${char.hope}</span>
            </div>`;
        }
        html += '</div>';

        if (summary.log.length > 0) {
            html += '<div class="summary-section"><h4>기록</h4>';
            summary.log.forEach(log => {
                html += `<div class="summary-item"><span>${log}</span></div>`;
            });
            html += '</div>';
        }

        content.innerHTML = html;

        btn.textContent = nextPhase === 'night' ? '밤으로' : '다음 날로';
        btn.onclick = () => {
            panel.classList.add('hidden');
            this.updateHUD();

            if (this.engine.getState().gameOver) {
                this.showGameOver(this.engine.getState().gameOverReason);
                return;
            }

            if (nextPhase === 'night') {
                this.showDefaultScene();
            }
        };

        panel.classList.remove('hidden');
    }

    // ===== SEARCH UI =====
    showSearchPanel() {
        const locations = this.engine.getAvailableLocations();
        const container = document.getElementById('search-locations');
        container.innerHTML = '';

        locations.forEach(loc => {
            const info = this.engine.getLocationInfo(loc.id);
            const lootTable = loc.loot[1];

            // Show partial info (3 out of 5 pieces: name, some probs, some items)
            let infoHtml = '';
            const shuffledLoot = this.engine.shuffleArray([...lootTable]);
            const shownCount = Math.min(3, shuffledLoot.length);
            const shownItems = shuffledLoot.slice(0, shownCount);
            const hiddenCount = lootTable.length - shownCount;

            shownItems.forEach(item => {
                if (item.card !== 'nothing') {
                    infoHtml += `<div><span class="prob-text">${Math.round(item.prob * 100)}%</span> ${item.name}</div>`;
                } else {
                    infoHtml += `<div><span class="prob-text">${Math.round(item.prob * 100)}%</span> ???</div>`;
                }
            });
            if (hiddenCount > 0) {
                infoHtml += `<div class="location-hidden-info">+ ${hiddenCount}개 더...</div>`;
            }

            const card = document.createElement('div');
            card.className = 'location-card';
            card.innerHTML = `
                <span class="location-icon">${loc.icon}</span>
                <div class="location-name">${loc.name}</div>
                <div class="location-level">Lv.${info.level} (탐색 ${info.visits}회)</div>
                <div class="location-info">${infoHtml}</div>
            `;
            card.onclick = () => this.doSearch(loc.id);
            container.appendChild(card);
        });

        document.getElementById('panel-search').classList.remove('hidden');
    }

    doSearch(locationId) {
        document.getElementById('panel-search').classList.add('hidden');

        const result = this.engine.doSearch(locationId);
        if (!result.success) {
            this.showToast(result.msg, 'warning');
            return;
        }

        // Show result
        const titleEl = document.getElementById('search-result-title');
        const contentEl = document.getElementById('search-result-content');
        const cardsEl = document.getElementById('search-result-cards');

        titleEl.textContent = `${result.location} 수색 결과`;

        if (result.isNothing) {
            contentEl.innerHTML = `<p style="color:var(--text-secondary)">${result.foundDesc}</p>
                <p style="margin-top:8px;color:var(--text-dim)">체력 -${result.hpCost}</p>`;
            cardsEl.innerHTML = '';
        } else {
            contentEl.innerHTML = `<p>발견: <strong>${result.found}</strong></p>
                <p style="color:var(--text-secondary)">${result.foundDesc}</p>
                <p style="margin-top:8px;color:var(--text-dim)">체력 -${result.hpCost}</p>`;

            if (result.cardAdded && result.cardData) {
                cardsEl.innerHTML = this.renderCard(result.cardData, false);
                this.showToast(`카드 획득: ${result.cardData.name}`, 'success');
            } else if (result.deckFull) {
                cardsEl.innerHTML = `<p style="color:var(--accent-red)">덱이 가득 찼습니다! (${GAME_DATA.constants.maxDeck}장)</p>`;
            } else {
                cardsEl.innerHTML = '';
            }
        }

        document.getElementById('panel-search-result').classList.remove('hidden');
        this.updateHUD();
    }

    // ===== WORK UI =====
    showWorkPanel() {
        const works = this.engine.getAvailableDayWorks();
        const container = document.getElementById('work-options');
        container.innerHTML = '';

        works.forEach(work => {
            const option = document.createElement('div');
            option.className = 'work-option';
            option.innerHTML = `
                <div class="work-name">${work.name}</div>
                <div class="work-desc">${work.desc}</div>
                <div class="work-cost">체력 -${work.cost.hp}</div>
            `;
            option.onclick = () => {
                document.getElementById('panel-work').classList.add('hidden');
                const result = this.engine.doDayWork(work.id);
                if (result.success) {
                    this.showToast(`${result.workName}: ${result.effects.join(', ')}`, 'success');

                    if (this.engine.getState().gameOver) {
                        this.showGameOver(this.engine.getState().gameOverReason);
                        return;
                    }
                } else {
                    this.showToast(result.msg, 'warning');
                }
                this.updateHUD();
            };
            container.appendChild(option);
        });

        document.getElementById('panel-work').classList.remove('hidden');
    }

    // ===== TALK UI =====
    showTalkPanel() {
        const targets = this.engine.getTalkTargets();
        const container = document.getElementById('talk-targets');
        container.innerHTML = '';

        if (targets.length === 0) {
            container.innerHTML = '<p style="color:var(--text-secondary)">대화할 수 있는 사람이 없습니다.</p>';
            document.getElementById('panel-talk').classList.remove('hidden');
            return;
        }

        targets.forEach(charId => {
            const data = GAME_DATA.characters[charId];
            const target = document.createElement('div');
            target.className = 'talk-target';
            target.innerHTML = `
                <div class="talk-portrait ${data.portraitClass}"></div>
                <div class="talk-target-name">${data.name}</div>
            `;
            target.onclick = () => {
                document.getElementById('panel-talk').classList.add('hidden');
                this.startConversation(charId);
            };
            container.appendChild(target);
        });

        document.getElementById('panel-talk').classList.remove('hidden');
    }

    startConversation(charId) {
        const result = this.engine.startConversation(charId);
        if (!result.success) {
            this.showToast(result.msg, 'warning');
            this.updateHUD();
            return;
        }

        this.currentConversation = result;
        this.currentConvTurn = 0;
        this.showConversationTurn();
    }

    showConversationTurn() {
        const conv = this.currentConversation;
        if (!conv || this.currentConvTurn >= conv.totalTurns) {
            this.endConversation();
            return;
        }

        const charData = GAME_DATA.characters[conv.charId];
        const panel = document.getElementById('panel-conversation');
        const portrait = document.getElementById('conv-portrait');
        const nameEl = document.getElementById('conv-char-name');
        const turnInfo = document.getElementById('conv-turn-info');
        const dialogue = document.getElementById('conv-dialogue');
        const cardsContainer = document.getElementById('conv-cards');

        portrait.className = `conv-portrait ${charData.portraitClass}`;
        nameEl.textContent = charData.name;
        turnInfo.textContent = `턴 ${this.currentConvTurn + 1}/${conv.totalTurns}`;

        const convCount = this.engine.getConversationCount(conv.charId);
        dialogue.innerHTML = `<p class="conv-text">${charData.name}와(과)의 대화 - 카드를 선택하세요</p>`;

        // Render 3 cards
        const turnCards = conv.turns[this.currentConvTurn];
        cardsContainer.innerHTML = '';

        turnCards.forEach(cardId => {
            const card = GAME_DATA.cards[cardId];
            if (!card) return;

            const cardEl = document.createElement('div');
            cardEl.className = `card card-talk`;
            cardEl.innerHTML = `
                <span class="card-type-tag">대화</span>
                <span class="card-rarity rarity-${card.rarity}">${card.rarity.toUpperCase()}</span>
                <span class="card-icon">${card.icon}</span>
                <div class="card-name">${card.name}</div>
                <div class="card-desc">${card.desc}</div>
            `;
            cardEl.onclick = () => this.playConversationCard(conv.charId, cardId, cardEl);
            cardsContainer.appendChild(cardEl);
        });

        panel.classList.remove('hidden');
    }

    playConversationCard(charId, cardId, cardEl) {
        // Visual feedback
        document.querySelectorAll('#conv-cards .card').forEach(c => {
            c.style.pointerEvents = 'none';
            if (c !== cardEl) c.style.opacity = '0.3';
        });
        cardEl.classList.add('card-selected');

        const result = this.engine.playConversationCard(charId, cardId);
        if (!result) return;

        const charData = GAME_DATA.characters[charId];
        const dialogue = document.getElementById('conv-dialogue');

        // Show dialogue line
        let html = `<p class="conv-text">${result.line}</p>`;

        // Show stat changes (vague hints)
        const changeHints = [];
        for (const [stat, val] of Object.entries(result.changes)) {
            if (val > 0) changeHints.push(`<span class="stat-change-pos">무언가가 올라간 것 같다</span>`);
            else if (val < 0) changeHints.push(`<span class="stat-change-neg">무언가가 내려간 것 같다</span>`);
        }
        if (changeHints.length > 0) {
            html += `<div style="margin-top:8px;font-size:0.8rem;color:var(--text-dim)">${changeHints[0]}</div>`;
        }

        dialogue.innerHTML = html;

        // Past unlock notification
        if (result.pastUnlock) {
            setTimeout(() => {
                this.showToast(`과거 이야기 해금: "${result.pastUnlock.title}"`, 'special');
            }, 500);
        }

        // Special event
        if (result.specialEvent) {
            setTimeout(() => {
                this.showSpecialEvent(charId, result.specialEvent);
            }, 1000);
            return;
        }

        // Next turn after delay
        setTimeout(() => {
            this.currentConvTurn++;
            this.showConversationTurn();
        }, 1500);
    }

    showSpecialEvent(charId, event) {
        const charData = GAME_DATA.characters[charId];
        const panel = document.getElementById('panel-event');
        const textEl = document.getElementById('event-text');
        const choicesEl = document.getElementById('event-choices');

        textEl.innerHTML = `
            <div class="special-event-badge">${event.title}</div>
            <h3 style="margin-top:12px;">${charData.name}</h3>
            <p style="margin-top:16px;line-height:1.8;font-size:1.05rem;">${event.text}</p>
        `;

        choicesEl.innerHTML = `<button class="menu-btn" id="btn-event-continue">계속...</button>`;
        document.getElementById('btn-event-continue').onclick = () => {
            panel.classList.add('hidden');
            this.currentConvTurn++;
            this.showConversationTurn();
        };

        document.getElementById('panel-conversation').classList.add('hidden');
        panel.classList.remove('hidden');
    }

    endConversation() {
        document.getElementById('panel-conversation').classList.add('hidden');
        this.currentConversation = null;
        this.currentConvTurn = 0;

        const s = this.engine.getState();
        if (s.phase === 'night') {
            s.nightActionsLeft.talk = false;
        }

        this.updateHUD();
    }

    // ===== NIGHT WORK UI =====
    showNightWorkPanel() {
        const works = this.engine.getAvailableNightWorks();
        const container = document.getElementById('night-work-options');
        container.innerHTML = '';

        works.forEach(work => {
            const option = document.createElement('div');
            option.className = 'work-option night-option';

            let rewardHtml = '';
            if (work.cardReward) {
                const rewardCard = GAME_DATA.cards[work.cardReward.card];
                if (rewardCard) {
                    rewardHtml = `<div class="work-effect">${Math.round(work.cardReward.prob * 100)}% 확률로 카드 획득</div>`;
                }
            }

            option.innerHTML = `
                <div class="work-name">${work.icon || ''} ${work.name}</div>
                <div class="work-desc">${work.desc}</div>
                ${work.cost.hp > 0 ? `<div class="work-cost">체력 -${work.cost.hp}</div>` : '<div class="work-effect">체력 소모 없음</div>'}
                ${rewardHtml}
            `;
            option.onclick = () => {
                document.getElementById('panel-night-work').classList.add('hidden');
                const result = this.engine.doNightWork(work.id);
                if (result.success) {
                    let msg = `${result.workName}: ${result.effects.join(', ')}`;
                    this.showToast(msg, 'success');
                    if (result.cardReward) {
                        setTimeout(() => this.showToast(`카드 획득: ${result.cardReward.name}`, 'special'), 500);
                    }

                    if (this.engine.getState().gameOver) {
                        this.showGameOver(this.engine.getState().gameOverReason);
                        return;
                    }
                } else {
                    this.showToast(result.msg, 'warning');
                }
                this.updateHUD();
            };
            container.appendChild(option);
        });

        document.getElementById('panel-night-work').classList.remove('hidden');
    }

    // ===== DECK VIEW =====
    showDeckPanel() {
        const s = this.engine.getState();
        const container = document.getElementById('deck-cards');
        const totalEl = document.getElementById('deck-total');

        totalEl.textContent = `(${s.deck.length}/${GAME_DATA.constants.maxDeck})`;

        this.renderDeckCards('all');

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderDeckCards(btn.dataset.filter);
            };
        });

        document.getElementById('panel-deck').classList.remove('hidden');
    }

    renderDeckCards(filter) {
        const s = this.engine.getState();
        const container = document.getElementById('deck-cards');
        container.innerHTML = '';

        // Count cards
        const cardCounts = {};
        s.deck.forEach(cardId => {
            cardCounts[cardId] = (cardCounts[cardId] || 0) + 1;
        });

        const uniqueCards = Object.keys(cardCounts);

        uniqueCards.forEach(cardId => {
            const card = GAME_DATA.cards[cardId];
            if (!card) return;

            if (filter !== 'all' && card.type !== filter) return;

            const count = cardCounts[cardId];
            const cardEl = document.createElement('div');
            cardEl.className = `card card-${card.type}`;
            cardEl.innerHTML = `
                <span class="card-type-tag">${card.type === 'day' ? '낮' : card.type === 'night' ? '밤' : '대화'}</span>
                <span class="card-rarity rarity-${card.rarity}">${card.rarity.toUpperCase()}</span>
                <span class="card-icon">${card.icon}</span>
                <div class="card-name">${card.name}${count > 1 ? ` x${count}` : ''}</div>
                <div class="card-desc">${card.desc}</div>
            `;

            // Click to use/discard
            cardEl.onclick = () => {
                if (card.type === 'talk') return; // Talk cards used in conversation only
                this.showCardActionMenu(cardId, cardEl);
            };

            container.appendChild(cardEl);
        });

        if (uniqueCards.length === 0 || container.children.length === 0) {
            container.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:20px;">카드가 없습니다</p>';
        }
    }

    showCardActionMenu(cardId, cardEl) {
        const card = GAME_DATA.cards[cardId];
        if (!card) return;

        // Check if card is usable in current phase
        const s = this.engine.getState();
        const canUse = (card.type === 'day' && s.phase === 'day') || (card.type === 'night' && s.phase === 'night');

        // Simple confirm for now
        const action = canUse ? confirm(`"${card.name}" 사용하시겠습니까?\n(취소: 버리기)`) : false;

        if (action) {
            const result = this.engine.useCard(cardId);
            if (result.success) {
                this.showToast(`${result.cardName} 사용: ${result.effects.join(', ')}`, 'success');
            }
        } else {
            if (confirm(`"${card.name}"을(를) 버리시겠습니까?`)) {
                this.engine.discardCard(cardId);
                this.showToast(`${card.name} 버림`, 'info');
            }
        }

        this.renderDeckCards(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
        this.updateHUD();
    }

    // ===== CHARACTER DETAIL =====
    showCharacterDetail(charId) {
        const charData = GAME_DATA.characters[charId];
        const char = this.engine.getCharacter(charId);
        if (!charData || !char) return;

        const portrait = document.getElementById('detail-portrait');
        portrait.className = `char-detail-portrait ${charData.portraitClass}`;

        document.getElementById('detail-name').textContent = `${charData.name} (${charData.mbti})`;
        document.getElementById('detail-personality').textContent = charData.personality;

        // Stats
        const statsContainer = document.getElementById('detail-stats');
        const stats = [
            { label: '용기', value: char.courage, color: '#e67e22' },
            { label: '이성', value: char.reason, color: '#3498db' },
            { label: '호감', value: char.affection, color: '#e84393' },
            { label: '희망', value: char.hope, color: '#f1c40f' },
            { label: '스트레스', value: char.stress, color: '#e74c3c' },
        ];

        statsContainer.innerHTML = stats.map(s => `
            <div class="detail-stat-item">
                <span class="detail-stat-label">${s.label}</span>
                <div class="detail-stat-bar">
                    <div class="detail-stat-fill" style="width:${s.value}%;background:${s.color}"></div>
                </div>
                <span class="detail-stat-val">${s.value}</span>
            </div>
        `).join('');

        // Past stories
        const pastContainer = document.getElementById('past-entries');
        const unlocks = this.engine.getState().pastUnlocks[charId] || [];

        pastContainer.innerHTML = charData.pastStories.map((past, i) => {
            const unlocked = unlocks.includes(past.unlockAt);
            return `<div class="past-entry ${unlocked ? '' : 'locked'}">
                ${unlocked ? `<strong>${past.title}</strong><br>${past.text}` : `??? (대화 ${past.unlockAt}회 필요)`}
            </div>`;
        }).join('');

        // Special event
        if (charData.specialEvent) {
            const seen = this.engine.getState().specialEventsSeen[charId];
            pastContainer.innerHTML += `<div class="past-entry ${seen ? '' : 'locked'}">
                ${seen ? `<span class="special-event-badge">특별 이벤트</span><br>${charData.specialEvent.text}` : '??? (특별 이벤트 미해금)'}
            </div>`;
        }

        document.getElementById('panel-char-detail').classList.remove('hidden');
    }

    // ===== GAME OVER =====
    showGameOver(reason) {
        document.getElementById('gameover-reason').textContent = reason;
        this.showScreen('screen-gameover');
    }

    // ===== PROLOGUE =====
    showPrologue(callback) {
        this.showScreen('screen-prologue');
        const lines = GAME_DATA.prologue;
        let index = 0;

        const speakerEl = document.querySelector('.dialogue-speaker');
        const textEl = document.querySelector('.dialogue-text');
        const box = document.querySelector('.dialogue-box');

        const showLine = () => {
            if (index >= lines.length) {
                callback();
                return;
            }
            speakerEl.textContent = lines[index].speaker;
            textEl.textContent = '';
            // Typewriter effect
            const fullText = lines[index].text;
            let charIdx = 0;
            const typingInterval = setInterval(() => {
                if (charIdx < fullText.length) {
                    textEl.textContent += fullText[charIdx];
                    charIdx++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 30);
            index++;
        };

        box.onclick = showLine;
        showLine();
    }

    // ===== TOAST =====
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 3000);
    }

    // ===== RENDER CARD HTML =====
    renderCard(cardData, clickable = true) {
        if (!cardData) return '';
        return `
            <div class="card card-${cardData.type}">
                <span class="card-type-tag">${cardData.type === 'day' ? '낮' : cardData.type === 'night' ? '밤' : '대화'}</span>
                <span class="card-rarity rarity-${cardData.rarity}">${cardData.rarity.toUpperCase()}</span>
                <span class="card-icon">${cardData.icon}</span>
                <div class="card-name">${cardData.name}</div>
                <div class="card-desc">${cardData.desc}</div>
            </div>
        `;
    }
}
