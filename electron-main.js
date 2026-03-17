/* =============================================
   STRANDED - Electron Main Process
   데스크톱 앱 메인 프로세스
   ============================================= */

const { app, BrowserWindow, Menu, globalShortcut, ipcMain, dialog } = require('electron');
const path = require('path');

// 개발 모드 확인
const isDev = process.argv.includes('--dev');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    title: 'STRANDED - 30 Days on the Island',
    icon: path.join(__dirname, 'icons', 'icon.png'),
    backgroundColor: '#08080f',
    show: false,
    fullscreen: false,
    fullscreenable: true,
    resizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      spellcheck: false,
      devTools: isDev
    }
  });

  // 메뉴바 숨기기 (게임용)
  if (!isDev) {
    Menu.setApplicationMenu(null);
  }

  // 게임 HTML 로드
  mainWindow.loadFile('index.html');

  // 창이 준비되면 보여주기
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // 시작 시 최대화 (옵션)
    // mainWindow.maximize();
  });

  // 전체화면 토글 (F11)
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F11') {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
      event.preventDefault();
    }
    // F5 새로고침 방지 (게임 데이터 보호)
    if (input.key === 'F5' && !isDev) {
      event.preventDefault();
    }
    // 개발자 도구 (개발 모드에서만)
    if (input.key === 'F12' && isDev) {
      mainWindow.webContents.toggleDevTools();
    }
  });

  // 창 닫기 전 확인
  mainWindow.on('close', (e) => {
    if (!isDev) {
      const choice = dialog.showMessageBoxSync(mainWindow, {
        type: 'question',
        buttons: ['종료', '취소'],
        defaultId: 1,
        cancelId: 1,
        title: 'STRANDED',
        message: '게임을 종료하시겠습니까?\n저장하지 않은 진행상황은 사라집니다.'
      });
      if (choice === 1) {
        e.preventDefault();
      }
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 단일 인스턴스 잠금 (중복 실행 방지)
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    // macOS: dock 클릭 시 창 재생성
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

// IPC 핸들러 (렌더러 ↔ 메인 프로세스 통신)
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('toggle-fullscreen', () => {
  if (mainWindow) {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
    return mainWindow.isFullScreen();
  }
  return false;
});

ipcMain.handle('is-fullscreen', () => {
  return mainWindow ? mainWindow.isFullScreen() : false;
});
