const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const Store = require("electron-store").default;

const store = new Store({ projectName: "backupapp" });
const isDev = process.env.NODE_ENV === "development";

let mainWindow;

const { registerBackupHandlers } = require("./backup");
const { registerAuthHandlers } = require("./google-auth");

registerBackupHandlers(ipcMain, () => mainWindow);
registerAuthHandlers(ipcMain, () => mainWindow);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 650,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.resolve(__dirname, "preload.js"),
      sandbox: false,
    },
  });

  if (isDev) {
    const tryLoad = () => {
      mainWindow.loadURL("http://localhost:5173").catch(() => {
        setTimeout(tryLoad, 500);
      });
    };
    tryLoad();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../dist/renderer/index.html"));
  }

  console.log("Preload path:", path.resolve(__dirname, "preload.js"));
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });
  return result.filePaths[0] || null;
});

ipcMain.handle("select-restore-dest", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
    title: "Elegir carpeta de destino",
  });
  return result.filePaths[0] || null;
});

ipcMain.handle("get-config", () => store.get("config", {}));
ipcMain.handle("set-config", (_, data) => store.set("config", data));
