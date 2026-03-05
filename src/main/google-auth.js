const { google } = require("googleapis");
const { shell } = require("electron");

const Store = require("electron-store").default;
const store = new Store({ projectName: "backupapp" });

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

function createOAuthClient(credentials) {
  return new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret,
    "urn:ietf:wg:oauth:2.0:oob",
  );
}

function registerAuthHandlers(ipcMain, getWindow) {
  ipcMain.handle("get-auth-url", async () => {
    console.log("Store path:", store.path);
    console.log("Credentials:", store.get("credentials"));
    const credentials = store.get("credentials");

    const oauth2Client = createOAuthClient(credentials);
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });

    console.log("AUTH URL:", url);
    shell.openExternal(url);
    return { success: true, url };
  });

  ipcMain.handle("set-auth-code", async (_, code) => {
    const credentials = store.get("credentials");
    if (!credentials) return { error: "No hay credenciales" };

    const oauth2Client = createOAuthClient(credentials);
    const { tokens } = await oauth2Client.getToken(code);
    store.set("tokens", tokens);
    return { success: true };
  });

  ipcMain.handle("is-authenticated", () => {
    const tokens = store.get("tokens");
    return !!tokens;
  });

  ipcMain.handle("save-credentials", async (_, { clientId, clientSecret }) => {
    store.set("credentials", {
      client_id: clientId,
      client_secret: clientSecret,
    });
    return { success: true };
  });

  ipcMain.handle("get-credentials", () => {
    const creds = store.get("credentials");
    return creds || null;
  });
}

function getAuthenticatedClient() {
  const credentials = store.get("credentials");
  const tokens = store.get("tokens");

  if (!credentials || !tokens) throw new Error("No autenticado");

  const oauth2Client = createOAuthClient(credentials);
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
}

module.exports = { registerAuthHandlers, getAuthenticatedClient };
