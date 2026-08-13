# STRANDED — 30 Days on the Island

30일간의 무인도 서바이벌 카드 게임. 낮/저녁/밤 3페이즈 턴제로 자원을 수색하고, 생존자들과 대화하며, 구조 신호를 완성해 섬을 탈출하는 것이 목표.

## 기술 스택
- HTML/CSS/JavaScript (프레임워크 없음)
- Electron 33 (데스크톱 패키징)
- electron-builder (Windows NSIS/포터블, macOS DMG, Linux AppImage)

## 구조
| 파일 | 역할 |
|---|---|
| `engine.js` | 게임 로직 — 스탯, 턴/페이즈, 날씨, 파견, 대화 상태 |
| `data.js` | 카드·장소·캐릭터·이벤트 데이터 |
| `ui.js` | 화면 렌더링 |
| `main.js` | 진입점, 게임 루프 연결 |
| `index.html` | 레이아웃 + 저장(localStorage) |
| `electron-main.js` / `preload.js` | Electron 셸 |

## 실행
```bash
npm install
npm start          # Electron으로 실행
npm run pack:win   # Windows 빌드 (dist/)
```

## 로드맵
Steam 출시 목표. Steamworks 연동(steamworks.js), 도전과제, 클라우드 저장, 스토어 페이지 에셋 작업 예정.
