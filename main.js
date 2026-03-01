/* =============================================
   STRANDED - Main Entry Point
   게임 초기화 및 이벤트 바인딩
   ============================================= */

(function() {
    'use strict';

    const engine = new GameEngine();
    const ui = new UIManager(engine);

    // ===== TITLE SCREEN =====
    document.getElementById('btn-new-game').addEventListener('click', () => {
        ui.showScreen('screen-name');
        document.getElementById('player-name-input').focus();
    });

    // ===== NAME INPUT =====
    document.getElementById('btn-start').addEventListener('click', () => {
        const name = document.getElementById('player-name-input').value.trim();
        if (!name) {
            document.getElementById('player-name-input').placeholder = '이름을 입력해주세요!';
            document.getElementById('player-name-input').focus();
            return;
        }
        startGame(name);
    });

    document.getElementById('player-name-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('btn-start').click();
        }
    });

    // ===== GAME START =====
    function startGame(playerName) {
        engine.newGame(playerName);

        // Replace player name in prologue
        GAME_DATA.prologue[0].text = `수학여행 2일째... ${playerName}의 이야기가 시작된다.`;

        ui.showPrologue(() => {
            ui.showScreen('screen-game');
            ui.updateHUD();
            ui.showDefaultScene();
            ui.showToast(`${playerName}, 무인도에서의 첫째 날이 밝았다.`, 'info');
        });
    }

    // ===== DAY ACTION BUTTONS =====
    document.getElementById('btn-search').addEventListener('click', () => {
        const s = engine.getState();
        if (s.actionsLeft <= 0) {
            ui.showToast('행동력이 부족합니다', 'warning');
            return;
        }
        ui.showSearchPanel();
    });

    document.getElementById('btn-work').addEventListener('click', () => {
        const s = engine.getState();
        if (s.actionsLeft <= 0) {
            ui.showToast('행동력이 부족합니다', 'warning');
            return;
        }
        ui.showWorkPanel();
    });

    document.getElementById('btn-talk').addEventListener('click', () => {
        const s = engine.getState();
        if (s.actionsLeft <= 0) {
            ui.showToast('행동력이 부족합니다', 'warning');
            return;
        }
        // Check if there are talk cards
        const talkCards = engine.getTalkCards();
        if (talkCards.length === 0) {
            ui.showToast('대화 카드가 없습니다! 수색으로 카드를 얻으세요.', 'warning');
            return;
        }
        ui.showTalkPanel();
    });

    // ===== NIGHT ACTION BUTTONS =====
    document.getElementById('btn-night-work').addEventListener('click', () => {
        const s = engine.getState();
        if (!s.nightActionsLeft.work) {
            ui.showToast('이미 밤 일을 했습니다', 'warning');
            return;
        }
        ui.showNightWorkPanel();
    });

    document.getElementById('btn-night-talk').addEventListener('click', () => {
        const s = engine.getState();
        if (!s.nightActionsLeft.talk) {
            ui.showToast('이미 밤 대화를 했습니다', 'warning');
            return;
        }
        const talkCards = engine.getTalkCards();
        if (talkCards.length === 0) {
            ui.showToast('대화 카드가 없습니다!', 'warning');
            return;
        }
        ui.showTalkPanel();
    });

    // ===== DECK BUTTON =====
    document.getElementById('btn-deck').addEventListener('click', () => {
        ui.showDeckPanel();
    });

    // ===== CHARACTER PORTRAITS =====
    document.querySelectorAll('.char-portrait').forEach(portrait => {
        portrait.addEventListener('click', () => {
            const charId = portrait.dataset.char;
            if (charId) ui.showCharacterDetail(charId);
        });
    });

    // ===== CLOSE PANEL BUTTONS =====
    document.getElementById('close-search').addEventListener('click', () => {
        document.getElementById('panel-search').classList.add('hidden');
    });
    document.getElementById('close-search-result').addEventListener('click', () => {
        document.getElementById('panel-search-result').classList.add('hidden');
        ui.updateHUD();
    });
    document.getElementById('close-work').addEventListener('click', () => {
        document.getElementById('panel-work').classList.add('hidden');
    });
    document.getElementById('close-talk').addEventListener('click', () => {
        document.getElementById('panel-talk').classList.add('hidden');
    });
    document.getElementById('close-night-work').addEventListener('click', () => {
        document.getElementById('panel-night-work').classList.add('hidden');
    });
    document.getElementById('close-deck').addEventListener('click', () => {
        document.getElementById('panel-deck').classList.add('hidden');
    });
    document.getElementById('close-char-detail').addEventListener('click', () => {
        document.getElementById('panel-char-detail').classList.add('hidden');
    });

    // ===== RESTART =====
    document.getElementById('btn-restart').addEventListener('click', () => {
        ui.showScreen('screen-title');
    });

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        const s = engine.getState();
        if (!s) return;

        // ESC to close panels
        if (e.key === 'Escape') {
            document.querySelectorAll('.overlay-panel').forEach(p => {
                if (!p.classList.contains('hidden')) {
                    // Don't close conversation panel
                    if (p.id !== 'panel-conversation' && p.id !== 'panel-event') {
                        p.classList.add('hidden');
                    }
                }
            });
        }

        // Quick keys (only during game screen)
        if (document.getElementById('screen-game').classList.contains('active')) {
            if (e.key === '1' && s.phase === 'day' && s.actionsLeft > 0) {
                document.getElementById('btn-search').click();
            }
            if (e.key === '2' && s.phase === 'day' && s.actionsLeft > 0) {
                document.getElementById('btn-work').click();
            }
            if (e.key === '3' && s.phase === 'day' && s.actionsLeft > 0) {
                document.getElementById('btn-talk').click();
            }
            if (e.key === 'd' || e.key === 'D') {
                document.getElementById('btn-deck').click();
            }
        }
    });

    // ===== DEBUG (remove in production) =====
    window.DEBUG = {
        engine: engine,
        ui: ui,
        getState: () => engine.getState(),
        setCharStat: (charId, stat, val) => {
            const char = engine.getCharacter(charId);
            if (char) char[stat] = val;
            ui.updateHUD();
        },
        setPlayerStat: (stat, val) => {
            engine.getState().player[stat] = val;
            ui.updateHUD();
        }
    };

    console.log('%c STRANDED %c 무인도 서바이벌 카드게임 ', 
        'background:#e87d2f;color:white;font-size:16px;font-weight:bold;padding:4px 8px;',
        'background:#6b3fa0;color:white;font-size:12px;padding:4px 8px;');
    console.log('Debug: window.DEBUG 사용 가능');

})();
