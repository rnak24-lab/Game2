/* =============================================
   STRANDED - Electron Preload Script
   렌더러 프로세스에서 안전하게 사용할 수 있는 API 노출
   ============================================= */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen'),
  isFullscreen: () => ipcRenderer.invoke('is-fullscreen'),
  isElectron: true
});
