/* =============================================
   STRANDED - Game Data
   모든 게임 데이터 (캐릭터, 카드, 장소, 이벤트)
   ============================================= */

const GAME_DATA = {
    // ===== CHARACTERS =====
    characters: {
        minye: {
            id: 'minye',
            name: '허민예',
            mbti: 'ESTP',
            personality: '까칠하고 자기 맘대로, 완벽한 인기녀인데 허당끼가 있다',
            portraitClass: 'minye-portrait',
            color: '#D4A017',
            initialStats: {
                courage: 30, reason: 30, affection: 30, hope: 30,
                stress: 0
            },
            clearCondition: { courage: [80,100], reason: [40,60], affection: [80,100], hope: [1,100] },
            // Stress triggers
            stressTrigger: 'hunger', // hunger high -> stress skyrockets
            stressMultiplier: 2.5,   // 2.5x stress from hunger compared to others
            // Death condition
            deathDesc: '어둠 속으로 사라졌다... 다음 날 차갑게 발견되었다.',
            // Benefit when affection high
            benefitThreshold: 60,
            benefitDesc: '일을 도와줘 체력 회복량 증가',
            // Past stories (unlocked by conversation count)
            pastStories: [
                { unlockAt: 3, text: '"...넘어졌다고 웃지 마. 원래 이런 거 아니거든."', title: '허당의 진실' },
                { unlockAt: 6, text: '"태권도... 했었어. 꽤 잘했지. 아니, 진짜 잘했어."', title: '유망주' },
                { unlockAt: 9, text: '"무릎이 나갔을 때... 세상이 끝난 줄 알았어. 아니, 실제로 끝났지."', title: '부상' },
            ],
            specialEvent: {
                unlockAt: 12,
                unlockConvCount: 3,
                title: '민예의 고백',
                text: '"...내가 왜 이런 얘기를 너한테 하는 거지? 됐어, 잊어."',
                isNight: true,
                illustration: 'assets/img/event_minye.svg'
            },
            dialogueReactions: {
                empathize: { affection: [-3,-1], courage: [0,1], reason: [0,0], hope: [0,1] },
                encourage: { affection: [1,3], courage: [2,4], reason: [-1,0], hope: [1,2] },
                joke: { affection: [2,5], courage: [0,1], reason: [0,0], hope: [1,3] },
                listen: { affection: [0,2], courage: [0,0], reason: [1,2], hope: [0,1] },
                advise: { affection: [-2,0], courage: [0,1], reason: [2,4], hope: [0,0] },
                comfort: { affection: [-1,1], courage: [-1,0], reason: [1,2], hope: [0,2] },
                tease: { affection: [3,6], courage: [1,2], reason: [-1,0], hope: [2,3] },
                serious: { affection: [-2,-1], courage: [1,3], reason: [2,3], hope: [-1,0] },
                share: { affection: [1,3], courage: [0,1], reason: [0,1], hope: [1,2] }
            },
            dialogueLines: {
                empathize: [
                    '"니가 뭘 알아? 쉽게 공감하지 마."',
                    '"...됐어. 그런 말 안 해도 돼."',
                    '"하... 그래서? 그게 어쨌다고?"'
                ],
                encourage: [
                    '"...뭐야, 쑥스럽게. 근데... 고마워."',
                    '"흥, 당연히 잘하지. 내가 누군데."',
                    '"...그래? 좀 더 말해봐."'
                ],
                joke: [
                    '"푸흡...! 아 진짜, 왜 웃기는 건데."',
                    '"야, 너 바보지? ...근데 좀 웃겨."',
                    '"하하, 미쳤나 봐 진짜. 근데 좋아."'
                ],
                listen: [
                    '"...듣고만 있을 거야? 뭐, 그것도 나쁘진 않네."',
                    '"조용히 있으니까 좀 편하다."',
                ],
                advise: [
                    '"충고는 됐어. 내 인생인데."',
                    '"...알아. 알고 있다고."',
                ],
                tease: [
                    '"야!! ...아 진짜, 너 죽을래?! ...근데 좀 웃기네."',
                    '"미쳤나봐 진짜... 푸흡."',
                ],
                serious: [
                    '"...갑자기 왜 진지해. 분위기 싸하잖아."',
                    '"...알았어. 근데 무겁다, 좀."',
                ],
            }
        },
        gyuwon: {
            id: 'gyuwon',
            name: '양규원',
            mbti: 'ISFJ',
            personality: '순하고 말 잘 듣는 아이, 바다를 유독 좋아한다',
            portraitClass: 'gyuwon-portrait',
            color: '#34495e',
            initialStats: {
                courage: 30, reason: 30, affection: 30, hope: 30,
                stress: 0
            },
            clearCondition: { courage: [0,35], reason: [80,100], affection: [40,60], hope: [1,100] },
            stressTrigger: 'affection_low', // low affection -> stress
            stressMultiplier: 2.0,
            deathDesc: '아무도 모르게 사라졌다... 해변에서 발견되었다.',
            benefitThreshold: 50,
            benefitDesc: '낚시를 해서 식량을 가져온다',
            // Special: high affection (80+) poisons others
            dangerZone: { affection: 80, effect: 'poison' },
            pastStories: [
                { unlockAt: 3, text: '"저... 괜찮아요. 저는 뭐든 괜찮으니까요."', title: '괜찮다는 말' },
                { unlockAt: 6, text: '"아빠가... 어부였어요. 바다 냄새가 나면 아빠 생각이 나요."', title: '바다의 기억' },
                { unlockAt: 9, text: '"엄마는... 떠났어요. 아빠는... 아빠는 저를 남자로 키우고 싶었대요."', title: '단발의 이유' },
            ],
            specialEvent: {
                unlockAt: 12,
                unlockConvCount: 3,
                title: '규원의 밤바다',
                text: '"...사랑받고 싶었어요. 그게 그렇게 큰 욕심인 건가요?"',
                isNight: true,
                illustration: 'assets/img/event_gyuwon.svg'
            },
            dialogueReactions: {
                empathize: { affection: [3,6], courage: [0,0], reason: [1,2], hope: [2,3] },
                encourage: { affection: [2,4], courage: [1,3], reason: [0,1], hope: [1,3] },
                joke: { affection: [1,2], courage: [0,0], reason: [0,0], hope: [1,2] },
                listen: { affection: [3,5], courage: [0,0], reason: [1,2], hope: [2,4] },
                advise: { affection: [1,2], courage: [0,0], reason: [3,5], hope: [0,1] },
                comfort: { affection: [4,6], courage: [0,0], reason: [0,1], hope: [3,5] },
                tease: { affection: [-2,0], courage: [0,0], reason: [0,0], hope: [-1,0] },
                serious: { affection: [1,3], courage: [0,1], reason: [2,4], hope: [0,1] },
                share: { affection: [2,4], courage: [0,0], reason: [1,2], hope: [2,3] }
            },
            dialogueLines: {
                empathize: [
                    '"정말... 이해해주시는 거예요? 감사해요..."',
                    '"그렇게 말해주니까... 마음이 따뜻해져요."',
                ],
                encourage: [
                    '"저도... 할 수 있을까요? ...네, 해볼게요."',
                    '"응원해주셔서... 고마워요."',
                ],
                listen: [
                    '"들어주셔서 감사해요... 이런 거 처음이에요."',
                    '"아무도 제 얘기를 이렇게 들어준 적이 없었어요."',
                ],
                comfort: [
                    '"...히익. 괜찮아요, 저는... 괜찮다고요... 흑."',
                    '"왜... 이렇게 다정한 거예요...?"',
                ],
                tease: [
                    '"...아. 네... 그렇죠, 하하..."',
                    '"(살짝 움찔하며) ...농담이죠?"',
                ],
            }
        },
        seula: {
            id: 'seula',
            name: '윤슬아',
            mbti: 'INTP',
            personality: '부정적이지만 천재적인 과학 지식, 전교 1등 왕따',
            portraitClass: 'seula-portrait',
            color: '#2c6e8a',
            initialStats: {
                courage: 15, reason: 75, affection: 30, hope: 30,
                stress: 0
            },
            clearCondition: { courage: [80,100], reason: [40,60], affection: [60,100], hope: [60,100] },
            stressTrigger: 'thirst', // thirst high -> stress skyrockets
            stressMultiplier: 2.5,
            deathDesc: '"죽고 말 거야... 죽고 말 거야..." 더 이상 말이 없었다.',
            benefitThreshold: 50,
            benefitDesc: '물 스팟을 발견한다 (확률형)',
            pastStories: [
                { unlockAt: 3, text: '"별... 보는 거 좋아해. 별은 거짓말 안 하니까."', title: '별을 보는 이유' },
                { unlockAt: 6, text: '"전교 1등이 뭐가 좋아... 아무도 옆에 없는데."', title: '1등의 고독' },
                { unlockAt: 9, text: '"제대로 해. 색종이도 못 접어? ...그게... 내가 들은 말이었는데."', title: '완벽의 대가' },
            ],
            specialEvent: {
                unlockAt: 12,
                unlockConvCount: 3,
                title: '슬아의 별',
                text: '"...맞으면서 공부했어. 매일. 완벽하지 않으면 맞았어. 그게... 일상이었어."',
                isNight: true,
                illustration: 'assets/img/event_seula.svg'
            },
            dialogueReactions: {
                empathize: { affection: [1,3], courage: [0,1], reason: [-1,0], hope: [1,2] },
                encourage: { affection: [1,2], courage: [2,5], reason: [-2,-1], hope: [2,4] },
                joke: { affection: [0,1], courage: [0,0], reason: [0,0], hope: [0,1] },
                listen: { affection: [2,4], courage: [1,2], reason: [-1,0], hope: [1,3] },
                advise: { affection: [0,1], courage: [0,0], reason: [1,3], hope: [0,0] },
                comfort: { affection: [2,4], courage: [1,3], reason: [-2,-1], hope: [2,4] },
                tease: { affection: [-3,-1], courage: [0,0], reason: [0,1], hope: [-2,-1] },
                serious: { affection: [2,3], courage: [2,3], reason: [-1,0], hope: [1,2] },
                share: { affection: [2,4], courage: [1,2], reason: [-1,0], hope: [2,3] }
            },
            dialogueLines: {
                empathize: [
                    '"...그래? 근데 어차피 소용없어."',
                    '"...고마워. 근데 우린 어차피..."',
                ],
                encourage: [
                    '"...할 수 있다고? 정말? ...근거는?"',
                    '"...그렇게 말하니까... 조금은..."',
                ],
                listen: [
                    '"...왜 듣고 있어? 재미없을 텐데."',
                    '"...처음이야. 누가 내 말을 끝까지 듣는 거."',
                ],
                comfort: [
                    '"...울지 마. 아 내가 왜 울어... 이상해."',
                    '"...따뜻하다. 이런 건 처음이야."',
                ],
                tease: [
                    '"...그래. 나 이상하지. 알고 있어."',
                    '"...(말없이 고개를 숙인다)"',
                ],
            }
        },
        gyeol: {
            id: 'gyeol',
            name: '한결',
            mbti: 'ENFP',
            personality: '긍정적 리더, 어른스럽지만 동생 걱정이 끊이지 않는',
            portraitClass: 'gyeol-portrait',
            color: '#7b3fa0',
            // ★ 한결 초기 설정 설명:
            // 한결은 용기(courage) 70, 이성(reason) 15으로 시작합니다.
            // deathCondition: 'reason_low' → reason < 20이면 추락사합니다.
            // 초기 reason이 15이므로, 첫날 밤 processEndOfDay에서 바로 사망 가능합니다!
            // 이는 의도적 설계: 한결은 감정적이고 무모한 성격으로, 
            // 플레이어가 첫날부터 적극적으로 '조언하기' 등으로 이성을 올려야 생존합니다.
            // FIX: reason을 25로 상향하여 첫날 즉사를 방지하고 플레이어에게 대응 기회를 줍니다.
            description: '동생 셋을 혼자 키우는 장녀. 항상 밝게 웃지만, 그 미소 뒤에는 무거운 짐이 있다. 수학여행비를 동생들이 모아줬다는 사실에 눈물 흘리는, 따뜻하지만 무모한 소녀.',
            initialStats: {
                courage: 70, reason: 25, affection: 30, hope: 70,
                stress: 0
            },
            clearCondition: { courage: [70,100], reason: [80,100], affection: [60,100], hope: [60,100] },
            stressTrigger: 'hope_low', // hope low -> stress skyrockets
            stressMultiplier: 2.0,
            deathDesc: '높은 곳에서 떨어졌다... 이성을 잃은 결과였다.',
            deathCondition: 'reason_low', // reason < 20 -> fall death
            deathThreshold: 20,
            benefitThreshold: 50,
            benefitDesc: '전체 스트레스 증가 10~30% 방어',
            pastStories: [
                { unlockAt: 3, text: '"동생들이... 집에서 기다리고 있거든. 맛있는 거 사달라고 했는데."', title: '동생들' },
                { unlockAt: 6, text: '"엄마가 돌아가시고... 아빠도 점점 안 왔어. 버려진 거지, 뭐."', title: '버려진 아이들' },
                { unlockAt: 9, text: '"나쁜 짓... 했어. 동생들 밥 먹이려고. 후회는 안 해."', title: '생존의 대가' },
            ],
            specialEvent: {
                unlockAt: 12,
                unlockConvCount: 3,
                title: '한결의 눈물',
                text: '"수학여행... 한 번도 못 간 언니한테, 동생이 모은 용돈으로 보내준 거야. 꼭 맛있는 거 사오라고..."',
                isNight: true,
                illustration: 'assets/img/event_gyeol.svg'
            },
            dialogueReactions: {
                empathize: { affection: [2,4], courage: [0,1], reason: [1,2], hope: [2,4] },
                encourage: { affection: [2,3], courage: [1,2], reason: [0,1], hope: [3,5] },
                joke: { affection: [2,4], courage: [0,0], reason: [0,1], hope: [3,5] },
                listen: { affection: [2,3], courage: [0,0], reason: [1,2], hope: [1,3] },
                advise: { affection: [0,2], courage: [0,0], reason: [3,6], hope: [0,1] },
                comfort: { affection: [3,5], courage: [0,0], reason: [1,2], hope: [2,4] },
                tease: { affection: [1,3], courage: [0,0], reason: [0,0], hope: [2,3] },
                serious: { affection: [1,2], courage: [0,1], reason: [3,5], hope: [-1,1] },
                share: { affection: [3,5], courage: [0,0], reason: [1,2], hope: [3,5] }
            },
            dialogueLines: {
                empathize: [
                    '"고마워... 이해해주는 사람이 있다는 게 좋다."',
                    '"그래, 맞아. 근데 괜찮아, 다 잘 될 거야!"',
                ],
                encourage: [
                    '"맞아! 우리 할 수 있어! 분명히!"',
                    '"그치? 포기하면 안 되지! 으하하!"',
                ],
                joke: [
                    '"아하하하! 너 진짜 웃겨! 좋아좋아!"',
                    '"이런 상황에도 웃을 수 있다니... 좋다, 진짜!"',
                ],
                listen: [
                    '"...들어줘서 고마워. 나도 가끔은 힘들거든."',
                    '"이런 얘기 할 사람이 없었는데... 고마워."',
                ],
                serious: [
                    '"...그래. 진지하게 얘기하자. 나도 맨날 웃을 수만은 없어."',
                    '"...동생들이 걱정돼. 솔직히."',
                ],
            }
        }
    },

    // ===== SEARCH LOCATIONS =====
    locations: [
        {
            id: 'beach',
            name: '모래사장',
            icon: '&#127958;',
            unlockDay: 1,
            level: 0,
            maxLevel: 5,
            description: '넓은 백사장. 표류물이 떠밀려올 수 있다.',
            loot: {
                1: [
                    { card: 'driftwood', prob: 0.5, name: '표류목', desc: '떠밀려온 나무 조각' },
                    { card: 'seashell', prob: 0.3, name: '조개', desc: '먹을 수 있는 조개' },
                    { card: 'nothing', prob: 0.2, name: '허탕', desc: '아무것도 없었다' }
                ]
            }
        },
        {
            id: 'forest_edge',
            name: '숲 입구',
            icon: '&#127795;',
            unlockDay: 1,
            level: 0,
            maxLevel: 5,
            description: '울창한 숲의 입구. 열매와 약초가 있을지도.',
            loot: {
                1: [
                    { card: 'berry', prob: 0.4, name: '야생 열매', desc: '배고픔을 달래주는 열매' },
                    { card: 'herb', prob: 0.3, name: '약초', desc: '상처에 좋은 풀' },
                    { card: 'talk_comfort', prob: 0.2, name: '예쁜 꽃', desc: '대화에 쓸 수 있을 것 같다' },
                    { card: 'nothing', prob: 0.1, name: '허탕', desc: '아무것도 없었다' }
                ]
            }
        },
        {
            id: 'tidepools',
            name: '갯바위',
            icon: '&#129704;',
            unlockDay: 1,
            level: 0,
            maxLevel: 5,
            description: '조수웅덩이가 있는 바위지대. 해산물을 찾을 수 있다.',
            loot: {
                1: [
                    { card: 'crab', prob: 0.35, name: '게', desc: '잡은 게. 식량이 된다' },
                    { card: 'seaweed', prob: 0.35, name: '해초', desc: '먹을 수 있는 해초' },
                    { card: 'sharp_stone', prob: 0.2, name: '날카로운 돌', desc: '도구로 쓸 수 있는 돌' },
                    { card: 'nothing', prob: 0.1, name: '허탕', desc: '미끄러졌다' }
                ]
            }
        },
        {
            id: 'stream',
            name: '개울',
            icon: '&#128167;',
            unlockDay: 2,
            level: 0,
            maxLevel: 5,
            description: '맑은 물이 흐르는 개울. 목마름 해결의 핵심.',
            loot: {
                1: [
                    { card: 'fresh_water', prob: 0.5, name: '깨끗한 물', desc: '목마름을 해소한다' },
                    { card: 'fish_small', prob: 0.3, name: '작은 물고기', desc: '작지만 식량이다' },
                    { card: 'nothing', prob: 0.2, name: '허탕', desc: '물만 마시고 왔다' }
                ]
            }
        },
        {
            id: 'cave',
            name: '동굴',
            icon: '&#127956;',
            unlockDay: 3,
            level: 0,
            maxLevel: 5,
            description: '어두운 동굴. 무엇이 있을지 알 수 없다.',
            loot: {
                1: [
                    { card: 'flint', prob: 0.3, name: '부싯돌', desc: '불을 피울 수 있다' },
                    { card: 'talk_serious', prob: 0.25, name: '동굴 벽화', desc: '깊은 대화의 소재가 될 것 같다' },
                    { card: 'crystal', prob: 0.15, name: '수정', desc: '빛나는 수정. 특별한 용도가 있을지도' },
                    { card: 'nothing', prob: 0.3, name: '허탕', desc: '너무 어두워서 돌아왔다' }
                ]
            }
        },
        {
            id: 'cliff',
            name: '절벽',
            icon: '&#9968;',
            unlockDay: 4,
            level: 0,
            maxLevel: 5,
            description: '높은 절벽 위. 멀리까지 볼 수 있다.',
            loot: {
                1: [
                    { card: 'bird_egg', prob: 0.3, name: '새알', desc: '절벽에 둥지가 있었다' },
                    { card: 'vine', prob: 0.3, name: '덩굴', desc: '튼튼한 덩굴. 도구 제작에 쓸 수 있다' },
                    { card: 'talk_encourage', prob: 0.15, name: '절벽 위의 경치', desc: '용기를 주는 풍경' },
                    { card: 'nothing', prob: 0.25, name: '허탕', desc: '위험해서 돌아왔다' }
                ]
            }
        },
        {
            id: 'wreckage',
            name: '난파선 잔해',
            icon: '&#9875;',
            unlockDay: 5,
            level: 0,
            maxLevel: 5,
            description: '해안에 떠밀려온 난파선 조각들.',
            loot: {
                1: [
                    { card: 'rope', prob: 0.25, name: '밧줄', desc: '튼튼한 밧줄' },
                    { card: 'metal_piece', prob: 0.25, name: '금속 조각', desc: '도구로 쓸 수 있는 금속' },
                    { card: 'canned_food', prob: 0.2, name: '통조림', desc: '보존된 음식!' },
                    { card: 'talk_share', prob: 0.15, name: '낡은 일기장', desc: '누군가의 이야기가 적혀있다' },
                    { card: 'nothing', prob: 0.15, name: '허탕', desc: '쓸 만한 게 없었다' }
                ]
            }
        },
        {
            id: 'deep_forest',
            name: '깊은 숲',
            icon: '&#127794;',
            unlockDay: 7,
            level: 0,
            maxLevel: 5,
            description: '깊고 어두운 숲속. 위험하지만 보상도 크다.',
            loot: {
                1: [
                    { card: 'mushroom', prob: 0.25, name: '버섯', desc: '먹을 수 있는 버섯... 아마도' },
                    { card: 'bamboo', prob: 0.25, name: '대나무', desc: '다용도 건축 자재' },
                    { card: 'medicinal_herb', prob: 0.2, name: '약용 식물', desc: '효과 좋은 약초' },
                    { card: 'talk_listen', prob: 0.15, name: '고요한 장소', desc: '마음이 차분해지는 곳을 발견했다' },
                    { card: 'nothing', prob: 0.15, name: '허탕', desc: '길을 잃을 뻔했다' }
                ]
            }
        },
        {
            id: 'mountain',
            name: '산꼭대기',
            icon: '&#9968;',
            unlockDay: 10,
            level: 0,
            maxLevel: 5,
            description: '섬에서 가장 높은 곳. 힘들지만 특별한 것이 있을지도.',
            loot: {
                1: [
                    { card: 'signal_material', prob: 0.2, name: '신호 재료', desc: '구조 신호를 만들 수 있는 재료' },
                    { card: 'rare_herb', prob: 0.2, name: '희귀 약초', desc: '산꼭대기에만 자라는 약초' },
                    { card: 'star_map', prob: 0.15, name: '별자리 관측', desc: '밤하늘을 잘 볼 수 있다' },
                    { card: 'nothing', prob: 0.45, name: '허탕', desc: '체력만 소모했다' }
                ]
            }
        },
        {
            id: 'reef',
            name: '산호초 지대',
            icon: '&#128032;',
            unlockDay: 12,
            level: 0,
            maxLevel: 5,
            description: '수중 산호초. 수영이 필요하다.',
            loot: {
                1: [
                    { card: 'big_fish', prob: 0.25, name: '큰 물고기', desc: '식량 대량 확보!' },
                    { card: 'pearl', prob: 0.1, name: '진주', desc: '아름다운 진주. 특별한 대화에 쓸 수 있을지도' },
                    { card: 'coral', prob: 0.25, name: '산호 조각', desc: '도구로 쓸 수 있다' },
                    { card: 'nothing', prob: 0.4, name: '허탕', desc: '파도가 거셌다' }
                ]
            }
        }
    ],

    // ===== CARD DATABASE =====
    cards: {
        // === DAY CARDS (Orange) ===
        driftwood: { id: 'driftwood', name: '표류목', type: 'day', rarity: 'rare', icon: '&#129717;', desc: '건축 재료', effect: { type: 'build_material', value: 1 } },
        seashell: { id: 'seashell', name: '조개', type: 'day', rarity: 'rare', icon: '&#129424;', desc: '작은 식량', effect: { type: 'food', hunger: -8 } },
        berry: { id: 'berry', name: '야생 열매', type: 'day', rarity: 'rare', icon: '&#127815;', desc: '달콤한 열매', effect: { type: 'food', hunger: -10 } },
        herb: { id: 'herb', name: '약초', type: 'day', rarity: 'rare', icon: '&#127807;', desc: 'HP 회복', effect: { type: 'heal', hp: 10 } },
        crab: { id: 'crab', name: '게', type: 'day', rarity: 'rare', icon: '&#129408;', desc: '맛있는 식량', effect: { type: 'food', hunger: -15 } },
        seaweed: { id: 'seaweed', name: '해초', type: 'day', rarity: 'rare', icon: '&#129716;', desc: '식량+수분', effect: { type: 'food', hunger: -5, thirst: -5 } },
        sharp_stone: { id: 'sharp_stone', name: '날카로운 돌', type: 'day', rarity: 'rare', icon: '&#129704;', desc: '도구 재료', effect: { type: 'tool_material', value: 1 } },
        fresh_water: { id: 'fresh_water', name: '깨끗한 물', type: 'day', rarity: 'rare', icon: '&#128167;', desc: '목마름 해소', effect: { type: 'water', thirst: -20 } },
        fish_small: { id: 'fish_small', name: '작은 물고기', type: 'day', rarity: 'rare', icon: '&#128031;', desc: '작은 식량', effect: { type: 'food', hunger: -8 } },
        flint: { id: 'flint', name: '부싯돌', type: 'day', rarity: 'epic', icon: '&#128293;', desc: '불을 피울 수 있다', effect: { type: 'fire_material', value: 1 } },
        crystal: { id: 'crystal', name: '수정', type: 'day', rarity: 'epic', icon: '&#128142;', desc: '아름다운 수정', effect: { type: 'special', value: 'crystal' } },
        bird_egg: { id: 'bird_egg', name: '새알', type: 'day', rarity: 'rare', icon: '&#129370;', desc: '영양가 있는 식량', effect: { type: 'food', hunger: -12, hp: 5 } },
        vine: { id: 'vine', name: '덩굴', type: 'day', rarity: 'rare', icon: '&#127793;', desc: '건축 재료', effect: { type: 'build_material', value: 1 } },
        rope: { id: 'rope', name: '밧줄', type: 'day', rarity: 'epic', icon: '&#128348;', desc: '다용도 밧줄', effect: { type: 'build_material', value: 2 } },
        metal_piece: { id: 'metal_piece', name: '금속 조각', type: 'day', rarity: 'epic', icon: '&#128296;', desc: '귀한 금속', effect: { type: 'tool_material', value: 2 } },
        canned_food: { id: 'canned_food', name: '통조림', type: 'day', rarity: 'epic', icon: '&#129379;', desc: '보존 식량!', effect: { type: 'food', hunger: -25 } },
        mushroom: { id: 'mushroom', name: '버섯', type: 'day', rarity: 'rare', icon: '&#127812;', desc: '식량... 아마도', effect: { type: 'food', hunger: -10, risk: 0.2 } },
        bamboo: { id: 'bamboo', name: '대나무', type: 'day', rarity: 'rare', icon: '&#127821;', desc: '건축 자재', effect: { type: 'build_material', value: 2 } },
        medicinal_herb: { id: 'medicinal_herb', name: '약용 식물', type: 'day', rarity: 'epic', icon: '&#127811;', desc: '강력한 회복', effect: { type: 'heal', hp: 20, stress: -10 } },
        big_fish: { id: 'big_fish', name: '큰 물고기', type: 'day', rarity: 'epic', icon: '&#128011;', desc: '대량 식량', effect: { type: 'food', hunger: -30 } },
        signal_material: { id: 'signal_material', name: '신호 재료', type: 'day', rarity: 'unique', icon: '&#128260;', desc: '구조 신호 제작용', effect: { type: 'special', value: 'signal' } },
        pearl: { id: 'pearl', name: '진주', type: 'day', rarity: 'unique', icon: '&#128302;', desc: '특별한 선물', effect: { type: 'gift', affection: 15 } },
        star_map: { id: 'star_map', name: '별자리 관측 기록', type: 'night', rarity: 'epic', icon: '&#11088;', desc: '밤에 유용하다', effect: { type: 'special', value: 'star' } },

        // === NIGHT CARDS (Purple) ===
        night_catch: { id: 'night_catch', name: '밤의 수확', type: 'night', rarity: 'rare', icon: '&#127753;', desc: '굶주림+목마름 감소', effect: { type: 'food_water', hunger: -10, thirst: -10 } },
        lullaby: { id: 'lullaby', name: '자장가', type: 'night', rarity: 'epic', icon: '&#127925;', desc: '전원 희망 소량 증가', effect: { type: 'team_hope', value: 3 } },
        constellation: { id: 'constellation', name: '별자리 지도', type: 'night', rarity: 'epic', icon: '&#127776;', desc: '다음날 수색 선택지+1', effect: { type: 'search_bonus', value: 1 } },

        // === TALK CARDS (Green) - No description of effect ===
        talk_empathize: { id: 'talk_empathize', name: '공감하기', type: 'talk', rarity: 'rare', icon: '&#128156;', desc: '마음을 이해하려 한다', effect: { type: 'dialogue', action: 'empathize' } },
        talk_encourage: { id: 'talk_encourage', name: '격려하기', type: 'talk', rarity: 'rare', icon: '&#128170;', desc: '힘을 북돋아준다', effect: { type: 'dialogue', action: 'encourage' } },
        talk_joke: { id: 'talk_joke', name: '농담하기', type: 'talk', rarity: 'rare', icon: '&#128514;', desc: '분위기를 밝힌다', effect: { type: 'dialogue', action: 'joke' } },
        talk_listen: { id: 'talk_listen', name: '들어주기', type: 'talk', rarity: 'rare', icon: '&#128066;', desc: '조용히 경청한다', effect: { type: 'dialogue', action: 'listen' } },
        talk_advise: { id: 'talk_advise', name: '조언하기', type: 'talk', rarity: 'rare', icon: '&#128218;', desc: '생각을 전한다', effect: { type: 'dialogue', action: 'advise' } },
        talk_comfort: { id: 'talk_comfort', name: '위로하기', type: 'talk', rarity: 'epic', icon: '&#129303;', desc: '따뜻한 위로', effect: { type: 'dialogue', action: 'comfort' } },
        talk_tease: { id: 'talk_tease', name: '놀리기', type: 'talk', rarity: 'rare', icon: '&#128540;', desc: '장난스럽게 놀린다', effect: { type: 'dialogue', action: 'tease' } },
        talk_serious: { id: 'talk_serious', name: '진지한 대화', type: 'talk', rarity: 'epic', icon: '&#129488;', desc: '진지한 이야기를 꺼낸다', effect: { type: 'dialogue', action: 'serious' } },
        talk_share: { id: 'talk_share', name: '경험 나누기', type: 'talk', rarity: 'epic', icon: '&#128214;', desc: '서로의 이야기를 나눈다', effect: { type: 'dialogue', action: 'share' } },
    },

    // ===== SPECIAL ITEMS (buffs/consumables - NOT cards or food) =====
    specialItems: {
        warm_fire: { id: 'warm_fire', name: '따뜻한 불빛', category: 'buff', rarity: 'rare', icon: '&#128293;', desc: '전원 스트레스 소량 감소', duration: 0, effect: { type: 'team_stress', value: -5 } },
        safe_sleep: { id: 'safe_sleep', name: '안전한 잠자리', category: 'buff', rarity: 'rare', icon: '&#128716;', desc: '체력 회복량 증가', duration: 0, effect: { type: 'rest_bonus', value: 10 } },
        hope_fire: { id: 'hope_fire', name: '희망의 불꽃', category: 'buff', rarity: 'unique', icon: '&#128165;', desc: '특수한 힘이 느껴진다', duration: 0, effect: { type: 'special', value: 'hope_fire' } },
        stress_reduce_3d: { id: 'stress_reduce_3d', name: '스트레스 소모량 감소', category: 'timed_buff', rarity: 'epic', icon: '&#128154;', desc: '3일간 스트레스 증가량 30% 감소', duration: 3, effect: { type: 'stress_reduction', value: 0.3 } },
        fire_blessing: { id: 'fire_blessing', name: '모닥불의 축복', category: 'timed_buff', rarity: 'rare', icon: '&#128293;', desc: '2일간 체력 소모 20% 감소', duration: 2, effect: { type: 'hp_cost_reduction', value: 0.2 } },
        starlight_guide: { id: 'starlight_guide', name: '별빛의 인도', category: 'buff', rarity: 'epic', icon: '&#11088;', desc: '다음 수색에서 희귀 아이템 확률 증가', duration: 0, effect: { type: 'rare_bonus', value: 0.15 } },
    },

    // ===== DAY WORK OPTIONS =====
    dayWorks: [
        { id: 'build_shelter', name: '움막 짓기', desc: '거처를 만든다. 장기적으로 유리.', cost: { hp: 25 }, effect: { type: 'build', shelterProgress: 10 }, unlockDay: 1 },
        { id: 'fishing', name: '낚시', desc: '물고기를 잡는다.', cost: { hp: 10 }, effect: { type: 'fish', hunger: -15, prob: 0.6 }, unlockDay: 1 },
        { id: 'gather_water', name: '물 모으기', desc: '식수를 확보한다.', cost: { hp: 10 }, effect: { type: 'gather_water', thirst: -20 }, unlockDay: 1 },
        { id: 'day_rest', name: '낮잠 자기', desc: '그늘에서 쉰다. 체력이 절반 정도 회복.', cost: { hp: 0 }, effect: { type: 'day_rest', hp: 20, stress: -5 }, unlockDay: 1 },
        { id: 'craft_tool', name: '도구 제작', desc: '재료로 도구를 만든다.', cost: { hp: 15 }, effect: { type: 'craft', tool: true }, unlockDay: 2 },
        { id: 'cook', name: '요리', desc: '음식을 조리한다. 효과 2배.', cost: { hp: 10 }, effect: { type: 'cook' }, unlockDay: 3 },
    ],

    // ===== NIGHT WORK OPTIONS =====
    nightWorks: [
        { id: 'rest', name: '휴식', desc: '체력을 회복하고 스트레스를 줄인다.', cost: { hp: 0 }, effect: { type: 'rest', hp: 25, stress: -15 }, icon: '&#128564;' },
        { id: 'keep_fire', name: '모닥불 지키기', desc: '불을 유지한다. 다음날 체력 소모 감소.', cost: { hp: 5 }, effect: { type: 'fire_keep', nextDayBonus: true }, icon: '&#128293;', cardReward: { prob: 0.3, card: 'warm_fire', altProb: 0.7, altCard: null } },
        { id: 'star_watch', name: '별 관측', desc: '밤하늘을 관찰한다.', cost: { hp: 5 }, effect: { type: 'star_watch', searchBonus: 1 }, icon: '&#11088;', cardReward: { prob: 0.3, card: 'constellation', altProb: 0.7, altCard: null } },
        { id: 'set_trap', name: '덫 설치', desc: '다음날 식량 획득 확률 증가.', cost: { hp: 10 }, effect: { type: 'trap', nextDayFood: true }, icon: '&#129704;', cardReward: { prob: 0.4, card: 'night_catch', altProb: 0.6, altCard: null } },
        { id: 'herb_prep', name: '약초 손질', desc: '약초를 가공한다.', cost: { hp: 5 }, effect: { type: 'herb_prep', healBonus: true }, icon: '&#127811;', cardReward: { prob: 0.25, card: 'talk_comfort', altProb: 0.75, altCard: null } },
        { id: 'craft_night', name: '도구 제작', desc: '밤에도 도구를 만들 수 있다.', cost: { hp: 10 }, effect: { type: 'craft_night' }, icon: '&#128296;', cardReward: { prob: 0.3, card: 'sharp_stone', altProb: 0.7, altCard: null } },
        { id: 'write_journal', name: '일지 쓰기', desc: '하루를 정리한다. 스트레스 감소.', cost: { hp: 0 }, effect: { type: 'journal', stress: -8 }, icon: '&#128221;', cardReward: { prob: 0.2, card: 'talk_listen', altProb: 0.8, altCard: null } },
        { id: 'patrol', name: '해안 순찰', desc: '밤바다를 탐색한다.', cost: { hp: 10 }, effect: { type: 'patrol' }, icon: '&#127754;', cardReward: { prob: 0.2, card: 'safe_sleep', altProb: 0.8, altCard: null } },
        { id: 'night_fish', name: '밤낚시', desc: '밤에 다른 어종을 잡는다.', cost: { hp: 10 }, effect: { type: 'night_fish', hunger: -10, thirst: -5 }, icon: '&#127907;', cardReward: { prob: 0.35, card: 'night_catch', altProb: 0.65, altCard: null } },
        { id: 'signal_build', name: '신호 장치 만들기', desc: '구조 신호를 준비한다.', cost: { hp: 15 }, effect: { type: 'signal', signalProgress: 10 }, icon: '&#128260;', cardReward: { prob: 0.15, card: 'hope_fire', altProb: 0.85, altCard: null }, unlockDay: 15 }
    ],

    // ===== INITIAL DECK =====
    initialDeck: [
        'talk_empathize', 'talk_empathize',
        'talk_encourage', 'talk_encourage',
        'talk_joke',
        'talk_listen', 'talk_listen',
        'talk_advise',
        'talk_tease'
    ],

    // ===== PROLOGUE =====
    prologue: [
        { speaker: '', text: '수학여행 2일째...' },
        { speaker: '', text: '배가 갑자기 심하게 흔들렸다.' },
        { speaker: '', text: '정신을 차렸을 때, 우리는 무인도에 있었다.' },
        { speaker: '', text: '나, 그리고 같은 반 여자아이 4명.' },
        { speaker: '', text: '구조가 올 때까지... 살아남아야 한다.' },
        { speaker: '', text: '그때는 몰랐다. 이 섬에서의 30일이 모든 것을 바꿀 거라는 것을.' },
    ],

    // ===== CONSUMABLE ITEMS (Distinct food/water types with descriptions) =====
    consumables: {
        // === FOOD TYPES ===
        raw_seashell: { id: 'raw_seashell', name: '생조개', type: 'food', icon: '🐚', desc: '갯벌에서 주운 생조개. 약간의 허기를 달랜다.', hungerRestore: 8, effect: '허기 -8' },
        raw_berry: { id: 'raw_berry', name: '야생 열매', type: 'food', icon: '🫐', desc: '숲에서 딴 야생 열매. 달콤하다.', hungerRestore: 10, effect: '허기 -10' },
        raw_crab: { id: 'raw_crab', name: '잡은 게', type: 'food', icon: '🦀', desc: '갯바위에서 잡은 게. 영양가가 높다.', hungerRestore: 15, effect: '허기 -15' },
        raw_fish_small: { id: 'raw_fish_small', name: '작은 물고기', type: 'food', icon: '🐟', desc: '개울에서 잡은 작은 물고기.', hungerRestore: 8, effect: '허기 -8' },
        raw_seaweed: { id: 'raw_seaweed', name: '해초', type: 'food', icon: '🌿', desc: '바다에서 건진 해초. 수분도 약간 보충된다.', hungerRestore: 5, thirstRestore: 5, effect: '허기 -5, 갈증 -5' },
        raw_bird_egg: { id: 'raw_bird_egg', name: '새알', type: 'food', icon: '🥚', desc: '절벽 둥지에서 가져온 새알. 영양 만점.', hungerRestore: 12, effect: '허기 -12' },
        canned_food_item: { id: 'canned_food_item', name: '떠밀려온 통조림', type: 'food', icon: '🥫', desc: '난파선에서 건진 통조림. 소중한 보존 식량!', hungerRestore: 25, effect: '허기 -25' },
        raw_mushroom: { id: 'raw_mushroom', name: '야생 버섯', type: 'food', icon: '🍄', desc: '깊은 숲의 버섯. 먹을 수 있을까...?', hungerRestore: 10, effect: '허기 -10 (독버섯 위험)' },
        raw_big_fish: { id: 'raw_big_fish', name: '큰 물고기', type: 'food', icon: '🐠', desc: '산호초에서 잡은 큰 물고기. 대량의 식량!', hungerRestore: 30, effect: '허기 -30' },
        cooked_fish: { id: 'cooked_fish', name: '구운 물고기', type: 'food', icon: '🍖', desc: '불에 구운 물고기. 효과가 배가된다.', hungerRestore: 20, effect: '허기 -20' },
        dried_seaweed: { id: 'dried_seaweed', name: '말린 해초', type: 'food', icon: '🥬', desc: '햇볕에 말린 해초. 보존이 된다.', hungerRestore: 8, thirstRestore: 3, effect: '허기 -8, 갈증 -3' },
        trapped_catch: { id: 'trapped_catch', name: '덫에 걸린 먹이', type: 'food', icon: '🐿️', desc: '밤새 덫에 걸린 작은 동물.', hungerRestore: 15, effect: '허기 -15' },

        // === WATER TYPES ===
        fresh_stream_water: { id: 'fresh_stream_water', name: '깨끗한 개울물', type: 'water', icon: '💧', desc: '개울에서 떠온 맑은 물.', thirstRestore: 20, effect: '갈증 -20' },
        coconut_water: { id: 'coconut_water', name: '코코넛 수액', type: 'water', icon: '🥥', desc: '코코넛에서 짜낸 달콤한 수액.', thirstRestore: 15, hungerRestore: 3, effect: '갈증 -15, 허기 -3' },
        morning_dew: { id: 'morning_dew', name: '아침 이슬', type: 'water', icon: '🌅', desc: '잎사귀에 맺힌 이슬을 모았다.', thirstRestore: 10, effect: '갈증 -10' },
        rain_water: { id: 'rain_water', name: '빗물', type: 'water', icon: '🌧️', desc: '나뭇잎으로 모은 빗물.', thirstRestore: 18, effect: '갈증 -18' },
        boiled_water: { id: 'boiled_water', name: '끓인 물', type: 'water', icon: '♨️', desc: '불에 끓여 정수한 깨끗한 물.', thirstRestore: 25, effect: '갈증 -25' },
        drifted_bottle: { id: 'drifted_bottle', name: '떠밀려온 생수', type: 'water', icon: '🍶', desc: '해변에 떠밀려온 밀봉된 생수병.', thirstRestore: 30, effect: '갈증 -30' },
        bamboo_water: { id: 'bamboo_water', name: '대나무 통 물', type: 'water', icon: '🎋', desc: '대나무 통에 모은 물.', thirstRestore: 12, effect: '갈증 -12' },

        // === EXPLORATION-ONLY SPECIAL FOODS (affect affection, courage, etc.) ===
        starfruit: { id: 'starfruit', name: '별 열매', type: 'food', icon: '⭐', desc: '산꼭대기에서만 자라는 빛나는 열매. 용기가 솟는다.', hungerRestore: 8, bonusStat: 'courage', bonusValue: 5, effect: '허기 -8, 용기 +5' },
        honey_comb: { id: 'honey_comb', name: '야생 벌꿀', type: 'food', icon: '🍯', desc: '깊은 숲의 벌집에서 채취한 꿀. 달콤한 향에 마음이 따뜻해진다.', hungerRestore: 12, bonusStat: 'affection', bonusValue: 5, effect: '허기 -12, 호감 +5' },
        glowing_moss: { id: 'glowing_moss', name: '빛나는 이끼', type: 'food', icon: '🌟', desc: '동굴 깊숙이에서 발견된 발광 이끼. 희망이 피어오른다.', hungerRestore: 5, bonusStat: 'hope', bonusValue: 8, effect: '허기 -5, 희망 +8' },
        ocean_pearl_jelly: { id: 'ocean_pearl_jelly', name: '해월', type: 'food', icon: '🪸', desc: '산호초 사이에서 발견한 투명 젤리. 이성이 맑아진다.', hungerRestore: 6, bonusStat: 'reason', bonusValue: 5, effect: '허기 -6, 이성 +5' },
        sunset_nectar: { id: 'sunset_nectar', name: '석양 꽃 꿀', type: 'water', icon: '🌺', desc: '절벽에 피는 꽃의 꿀. 스트레스가 줄어든다.', thirstRestore: 10, bonusStat: 'stress', bonusValue: -8, effect: '갈증 -10, 스트레스 -8' },
    },

    // Mapping: which consumables are found from search locations
    searchConsumableLoot: {
        beach: { food: ['raw_seashell'], water: ['morning_dew', 'drifted_bottle'] },
        forest_edge: { food: ['raw_berry', 'raw_mushroom'], water: ['morning_dew'] },
        tidepools: { food: ['raw_crab', 'raw_seaweed'], water: [] },
        stream: { food: ['raw_fish_small'], water: ['fresh_stream_water'] },
        cave: { food: ['glowing_moss'], water: ['fresh_stream_water'] },
        cliff: { food: ['raw_bird_egg'], water: ['morning_dew', 'sunset_nectar'] },
        wreckage: { food: ['canned_food_item'], water: ['drifted_bottle'] },
        deep_forest: { food: ['raw_mushroom', 'raw_berry', 'honey_comb'], water: ['bamboo_water', 'coconut_water'] },
        mountain: { food: ['starfruit'], water: ['fresh_stream_water', 'rain_water'] },
        reef: { food: ['raw_big_fish', 'raw_crab', 'ocean_pearl_jelly'], water: [] },
    },

    // ===== SPECIAL EVENT EXTENDED DIALOGUES (15 lines each) =====
    specialEventScripts: {
        minye: {
            title: '민예의 고백',
            lines: [
                { speaker: '', text: '밤. 모닥불이 조용히 타오르고 있다.' },
                { speaker: '', text: '다들 잠든 시간. 민예가 혼자 불을 바라보고 있다.' },
                { speaker: '허민예', text: '...뭐야, 너도 안 자?', color: '#D4A017' },
                { speaker: '', text: '(민예 옆에 앉았다.)' },
                { speaker: '허민예', text: '...좀 이상하지? 나 이런 거 안 하는데.', color: '#D4A017' },
                { speaker: '허민예', text: '태권도... 했었어. 전국대회 나갈 뻔했고.', color: '#D4A017' },
                { speaker: '허민예', text: '근데 무릎이 나갔어. 한 순간에.', color: '#D4A017' },
                { speaker: '허민예', text: '세상이 끝난 줄 알았어. 아니, 실제로 끝났지.', color: '#D4A017' },
                { speaker: '', text: '(민예의 눈가가 빛났다.)' },
                { speaker: '허민예', text: '까칠하게 구는 거... 습관이야. 다가오면 아프니까.', color: '#D4A017' },
                { speaker: '허민예', text: '근데 여기서... 너는 좀 다르더라.', color: '#D4A017' },
                { speaker: '허민예', text: '포기하지 않잖아. 매일. 바보같이.', color: '#D4A017' },
                { speaker: '', text: '(민예가 살짝 웃었다. 처음 보는 표정이었다.)' },
                { speaker: '허민예', text: '...내가 왜 이런 얘기를 너한테 하는 거지?', color: '#D4A017' },
                { speaker: '허민예', text: '...됐어, 잊어. ...고마워.', color: '#D4A017' },
            ]
        },
        gyuwon: {
            title: '규원의 밤바다',
            lines: [
                { speaker: '', text: '밤. 파도 소리만 들리는 해변.' },
                { speaker: '', text: '규원이 바닷가에 혼자 앉아 있다. 발을 물에 담근 채로.' },
                { speaker: '양규원', text: '...아, 깜짝이야. 왔어요?', color: '#34495e' },
                { speaker: '', text: '(규원의 눈이 달빛에 젖어 있었다.)' },
                { speaker: '양규원', text: '바다 소리 들으면... 아빠 생각나요.', color: '#34495e' },
                { speaker: '양규원', text: '아빠는 어부였어요. 바다를 좋아했죠.', color: '#34495e' },
                { speaker: '양규원', text: '저도... 바다를 좋아해요. 바다 냄새가 나면 아빠 생각이 나거든요.', color: '#34495e' },
                { speaker: '양규원', text: '엄마는 떠났어요. 저를 두고. 아빠는... 저를 남자로 키우고 싶었대요.', color: '#34495e' },
                { speaker: '양규원', text: '머리 자르라고... 치마 입지 말라고...', color: '#34495e' },
                { speaker: '', text: '(규원이 무릎을 끌어안았다.)' },
                { speaker: '양규원', text: '사랑받고 싶었어요. 그게... 그렇게 큰 욕심인 건가요?', color: '#34495e' },
                { speaker: '', text: '(조용히 규원의 어깨에 손을 올렸다.)' },
                { speaker: '양규원', text: '...히익. ...이거... 왜 이렇게 따뜻한 거예요.', color: '#34495e' },
                { speaker: '양규원', text: '여기서 처음으로... 저를 봐주는 사람이 생긴 것 같아요.', color: '#34495e' },
                { speaker: '양규원', text: '...고마워요. 정말로.', color: '#34495e' },
            ]
        },
        seula: {
            title: '슬아의 별',
            lines: [
                { speaker: '', text: '깊은 밤. 별이 쏟아지는 하늘 아래.' },
                { speaker: '', text: '슬아가 절벽 위에 혼자 앉아 별을 보고 있다.' },
                { speaker: '윤슬아', text: '...왔어?', color: '#2c6e8a' },
                { speaker: '', text: '(슬아의 목소리가 평소보다 부드러웠다.)' },
                { speaker: '윤슬아', text: '저 별... 베가야. 직녀성.', color: '#2c6e8a' },
                { speaker: '윤슬아', text: '별 보는 거 좋아해. 별은... 거짓말 안 하니까.', color: '#2c6e8a' },
                { speaker: '윤슬아', text: '...전교 1등이 뭐가 좋아. 아무도 옆에 없는데.', color: '#2c6e8a' },
                { speaker: '윤슬아', text: '맞으면서 공부했어. 매일. 완벽하지 않으면 맞았어.', color: '#2c6e8a' },
                { speaker: '', text: '(슬아의 손이 떨리고 있었다.)' },
                { speaker: '윤슬아', text: '그래서... 사람이 무서웠어. 가까이 오면 아프니까.', color: '#2c6e8a' },
                { speaker: '윤슬아', text: '근데 너는... 계속 왔어. 내가 밀어내도.', color: '#2c6e8a' },
                { speaker: '', text: '(슬아가 처음으로 눈을 마주쳤다.)' },
                { speaker: '윤슬아', text: '저 별... 네 이름으로 부를까?', color: '#2c6e8a' },
                { speaker: '윤슬아', text: '...울지 마. 아 내가 왜 울어... 이상해.', color: '#2c6e8a' },
                { speaker: '윤슬아', text: '...따뜻하다. 이런 건 처음이야.', color: '#2c6e8a' },
            ]
        },
        gyeol: {
            title: '한결의 눈물',
            lines: [
                { speaker: '', text: '밤. 모닥불이 꺼져가는 시간.' },
                { speaker: '', text: '한결이 불을 지키며 조용히 앉아 있다. 평소와 다르게.' },
                { speaker: '한결', text: '...어? 아직 안 잤어?', color: '#7b3fa0' },
                { speaker: '', text: '(한결의 웃음이 평소와 달랐다. 억지로 짓는 것 같았다.)' },
                { speaker: '한결', text: '수학여행... 한 번도 못 간 언니한테, 동생이 모은 용돈으로 보내준 거야.', color: '#7b3fa0' },
                { speaker: '한결', text: '꼭 맛있는 거 사오라고... 사진 많이 찍으라고...', color: '#7b3fa0' },
                { speaker: '한결', text: '그 아이들이 지금 얼마나 걱정하고 있을까.', color: '#7b3fa0' },
                { speaker: '', text: '(한결의 목소리가 떨렸다.)' },
                { speaker: '한결', text: '엄마가 돌아가시고... 아빠도 안 와. 내가 엄마이자 아빠야.', color: '#7b3fa0' },
                { speaker: '한결', text: '나쁜 짓도 했어. 동생들 밥 먹이려고. 후회 안 해.', color: '#7b3fa0' },
                { speaker: '한결', text: '근데... 돌아가지 못하면... 그 아이들은...', color: '#7b3fa0' },
                { speaker: '', text: '(한결이 처음으로 눈물을 보였다.)' },
                { speaker: '한결', text: '미안... 나 이런 모습 보이면 안 되는데.', color: '#7b3fa0' },
                { speaker: '한결', text: '...네가 있어서 다행이야. 진짜로.', color: '#7b3fa0' },
                { speaker: '한결', text: '꼭 돌아가자. 약속해.', color: '#7b3fa0' },
            ]
        }
    },

    // ===== HOUSE LEVELS =====
    houseLevels: [
        { level: 0, name: '빈 터', desc: '아무것도 없는 맨땅.', icon: '🏕️', teamEffect: { stressReduction: 0, restBonus: 0 }, xpRequired: 0 },
        { level: 1, name: '나뭇잎 움막', desc: '나뭇잎과 나뭇가지로 만든 간이 지붕.', icon: '🛖', teamEffect: { stressReduction: 5, restBonus: 3 }, xpRequired: 30 },
        { level: 2, name: '갈대 오두막', desc: '바람을 막아주는 갈대 벽이 생겼다.', icon: '🏚️', teamEffect: { stressReduction: 10, restBonus: 5 }, xpRequired: 80 },
        { level: 3, name: '통나무 거처', desc: '튼튼한 통나무 구조. 비를 막을 수 있다.', icon: '🏠', teamEffect: { stressReduction: 15, restBonus: 8 }, xpRequired: 150 },
        { level: 4, name: '아늑한 집', desc: '지붕과 문이 있는 안전한 공간.', icon: '🏡', teamEffect: { stressReduction: 20, restBonus: 12 }, xpRequired: 250 },
        { level: 5, name: '해변 요새', desc: '견고한 요새. 모두가 안심하고 쉴 수 있다.', icon: '🏰', teamEffect: { stressReduction: 30, restBonus: 18 }, xpRequired: 400 },
    ],

    // ===== NIGHT CARD POOLS (guaranteed card reward from night work) =====
    nightCardPool: {
        rare: ['night_catch', 'talk_empathize', 'talk_encourage', 'talk_joke', 'talk_listen', 'talk_advise', 'talk_tease'],
        epic: ['lullaby', 'constellation', 'talk_comfort', 'talk_serious', 'talk_share', 'medicinal_herb', 'rope'],
        unique: ['signal_material', 'pearl'],
    },
    // Special items that can drop from night work (instead of cards)
    nightSpecialItemPool: {
        rare: ['warm_fire', 'safe_sleep', 'fire_blessing'],
        epic: ['stress_reduce_3d', 'starlight_guide'],
        unique: ['hope_fire'],
    },

    // ===== MADNESS DIALOGUE (stress > 90) =====
    madnessDialogues: {
        minye: [
            { speaker: '허민예', text: '...아아아! 여기서 나가게 해줘! 나가게 해달라고!!', color: '#D4A017' },
            { speaker: '', text: '(민예가 머리를 잡고 비명을 지른다.)' },
            { speaker: '허민예', text: '무릎이... 또 아파... 왜... 왜 나만 이래...', color: '#D4A017' },
            { speaker: '', text: '(눈에 이성의 빛이 사라져간다.)' },
            { speaker: '허민예', text: '...하하. 하하하하. 다 끝났어. 끝이야.', color: '#D4A017' },
        ],
        gyuwon: [
            { speaker: '양규원', text: '...아무도 절 좋아하지 않아요. 아무도...', color: '#34495e' },
            { speaker: '', text: '(규원이 무릎을 끌어안고 흔들린다.)' },
            { speaker: '양규원', text: '아빠도... 엄마도... 여기서도... 혼자야...', color: '#34495e' },
            { speaker: '', text: '(규원의 눈이 초점을 잃어간다.)' },
            { speaker: '양규원', text: '...바다로... 가면... 아빠 만날 수 있을까...', color: '#34495e' },
        ],
        seula: [
            { speaker: '윤슬아', text: '...계산이 안 맞아. 뭐가... 뭐가 틀린 거야...', color: '#2c6e8a' },
            { speaker: '', text: '(슬아가 손톱으로 바닥을 긁기 시작한다.)' },
            { speaker: '윤슬아', text: '완벽해야 해... 완벽하지 않으면... 맞아... 또 맞아...', color: '#2c6e8a' },
            { speaker: '', text: '(슬아의 눈에서 빛이 사라진다.)' },
            { speaker: '윤슬아', text: '...어차피 아무 의미 없어. 어차피 다 죽어.', color: '#2c6e8a' },
        ],
        gyeol: [
            { speaker: '한결', text: '동생들... 밥은 먹고 있을까... 아이들이... 아이들이...', color: '#7b3fa0' },
            { speaker: '', text: '(한결이 벽을 주먹으로 때린다.)' },
            { speaker: '한결', text: '왜 나야?! 왜 항상 나야?! 내가 뭘 잘못했는데!!', color: '#7b3fa0' },
            { speaker: '', text: '(한결의 미소가 완전히 사라졌다.)' },
            { speaker: '한결', text: '...미안. 동생들아. 언니가... 못 돌아가겠다...', color: '#7b3fa0' },
        ],
    },

    // ===== CARD CATEGORIES (for color-coding) =====
    cardCategories: {
        resource:  { name: '자원',   color: '#e67e22', types: ['build_material', 'tool_material', 'fire_material'] },
        food:      { name: '식량',   color: '#27ae60', types: ['food', 'water', 'food_water'] },
        healing:   { name: '회복',   color: '#2ecc71', types: ['heal', 'rest_bonus'] },
        talk:      { name: '대화',   color: '#3a9e6e', types: ['dialogue'] },
        team:      { name: '팀 지원', color: '#3498db', types: ['team_stress', 'team_hope', 'search_bonus'] },
        special:   { name: '특수',   color: '#f39c12', types: ['special', 'gift'] },
    },

    // ===== CARD FLAVOR TEXT (descriptive text for each talk card) =====
    cardFlavorText: {
        talk_empathize: '상대방의 감정을 진심으로 이해하려고 노력합니다. 공감은 마음의 벽을 허물 수 있습니다.',
        talk_encourage: '힘든 상황에서도 포기하지 않도록 용기를 불어넣어 줍니다.',
        talk_joke: '유머로 무거운 분위기를 전환합니다. 웃음은 최고의 약이라고 하죠.',
        talk_listen: '말없이 경청하는 것. 때로는 그것만으로도 충분합니다.',
        talk_advise: '경험과 지식으로 길을 제시합니다. 하지만 조언이 항상 환영받지는 않습니다.',
        talk_comfort: '따뜻한 위로의 말과 행동. 힘들어하는 사람에게 가장 필요한 것일 수 있습니다. 특히 외로움을 느끼는 사람에게 더 큰 효과를 발휘합니다.',
        talk_tease: '장난스러운 놀림. 가까운 사이에서만 통하는 유대감의 표현입니다.',
        talk_serious: '깊은 주제에 대한 진지한 대화. 서로를 더 잘 이해하게 됩니다.',
        talk_share: '자신의 경험과 이야기를 나눕니다. 상호 이해와 유대를 강화합니다.',
    },

    // ===== GAME CONSTANTS =====
    constants: {
        maxDeck: 24,
        actionsPerDayPhase: 3,   // 낮 행동 3개: 수색/일/대화
        nightActions: 2,          // 밤 행동: 밤일 + 대화 (필수 각 1회)
        talkCardsPerTurn: 3,
        talkTargetsShown: 2,
        searchLocationsShown: 3,
        nightWorksShown: 2,
        dailyHungerIncrease: 8,
        dailyThirstIncrease: 10,
        stressFromHunger: 6,      // INCREASED: per 10 hunger above 50 (was 3)
        stressFromThirst: 6,      // INCREASED: (was 3)
        baseStressDecay: 1,       // DECREASED: natural stress decrease per day (was 2)
        baseHopeDecay: 3,         // INCREASED: natural hope decrease per day (was 2)
        maxStat: 100,
        stressDeathThreshold: 100,  // Still 100 but no instant death, triggers madness
        stressMadnessThreshold: 90, // NEW: triggers madness dialogue sequence
        hungerDeathThreshold: 100,
        thirstDeathThreshold: 100,
        hpDeathThreshold: 0,
        gyuwonAffectionDangerHigh: 80,
        gyuwonAffectionDangerLow: 20,
        searchExpPerVisit: 1,
        levelUpThreshold: 3,      // visits to level up
        // House building
        houseXpPerAction: 5,      // XP per build action
        houseRarityBonus: { rare: 0.25, epic: 0.50, unique: 1.00 }, // item rarity XP multiplier
        // Night card acquisition
        nightCardGuaranteed: true,
        nightRareProb: 0.70,      // 70% rare
        nightEpicProb: 0.30,      // 30% epic
        // Unique unlock system
        epicCardsForUnique: 3,    // need 3+ epic cards to unlock unique pool
        uniquePoolRare: 0.30,
        uniquePoolEpic: 0.40,
        uniquePoolUnique: 0.30,
        uniqueHealthCost: 15,     // higher health cost for unique rolls
        // Stress amplification
        stressAmplifier: 1.5,     // multiplier for all stress gains
    }
};
