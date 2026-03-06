const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  deleteBackup: (fileId) => ipcRenderer.invoke("delete-backup", fileId),
  getFolderSize: (path) => ipcRenderer.invoke("get-folder-size", path),
  selectRestoreDest: () => ipcRenderer.invoke("select-restore-dest"),
  saveCredentials: (data) => ipcRenderer.invoke("save-credentials", data),
  getCredentials: () => ipcRenderer.invoke("get-credentials"),
  startBackupNas: (data) => ipcRenderer.invoke("start-backup-nas", data),
  listBackupsNas: (config) => ipcRenderer.invoke("list-backups-nas", config),
  startRestoreNas: (data) => ipcRenderer.invoke("start-restore-nas", data),
  saveNasConfig: (config) => ipcRenderer.invoke("save-nas-config", config),
  getNasConfig: () => ipcRenderer.invoke("get-nas-config"),
  testNas: (config) => ipcRenderer.invoke("test-nas", config),
  getConfig: () => ipcRenderer.invoke("get-config"),
  setConfig: (data) => ipcRenderer.invoke("set-config", data),
  startBackup: (folders) => ipcRenderer.invoke("start-backup", folders),
  startRestore: (backupId) => ipcRenderer.invoke("start-restore", backupId),
  listBackups: () => ipcRenderer.invoke("list-backups"),
  getAuthUrl: () => ipcRenderer.invoke("get-auth-url"),
  setAuthCode: (code) => ipcRenderer.invoke("set-auth-code", code),
  isAuthenticated: () => ipcRenderer.invoke("is-authenticated"),
  onProgress: (callback) =>
    ipcRenderer.on("progress", (_, data) => callback(data)),
});
