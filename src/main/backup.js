const { google } = require("googleapis");
const archiver = require("archiver");
const extractZip = require("extract-zip");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { getAuthenticatedClient } = require("./google-auth");
const Store = require("electron-store").default;

const store = new Store({ projectName: "backupapp" });

function registerBackupHandlers(ipcMain, getWindow) {
  const send = (data) => getWindow().webContents.send("progress", data);

  ipcMain.handle("start-backup", async (_, folders) => {
    try {
      const auth = getAuthenticatedClient();
      const drive = google.drive({ version: "v3", auth });
      const results = [];

      for (let i = 0; i < folders.length; i++) {
        const folderPath = folders[i];
        const folderName = path.basename(folderPath);
        const zipPath = path.join(
          os.tmpdir(),
          `${folderName}-${Date.now()}.zip`,
        );

        send({
          status: "compressing",
          folder: folderName,
          progress: 0,
          step: i + 1,
          total: folders.length,
        });

        await compressFolder(folderPath, zipPath, (pct) => {
          send({
            status: "compressing",
            folder: folderName,
            progress: Math.round(pct * 0.5),
            step: i + 1,
            total: folders.length,
          });
        });

        send({
          status: "uploading",
          folder: folderName,
          progress: 50,
          step: i + 1,
          total: folders.length,
        });

        const fileSize = fs.statSync(zipPath).size;
        const fileId = await uploadToDrive(
          drive,
          zipPath,
          folderName,
          (uploaded) => {
            const pct = 50 + Math.round((uploaded / fileSize) * 50);
            send({
              status: "uploading",
              folder: folderName,
              progress: pct,
              step: i + 1,
              total: folders.length,
            });
          },
        );

        fs.unlinkSync(zipPath);
        send({
          status: "done",
          folder: folderName,
          progress: 100,
          step: i + 1,
          total: folders.length,
        });
        results.push({
          folder: folderName,
          fileId,
          date: new Date().toISOString(),
        });
      }

      return { success: true, results };
    } catch (err) {
      return { error: err.message };
    }
  });

  ipcMain.handle("list-backups", async () => {
    try {
      const auth = getAuthenticatedClient();
      const drive = google.drive({ version: "v3", auth });

      const res = await drive.files.list({
        q: "name contains 'backup-' and mimeType='application/zip'",
        fields: "files(id, name, createdTime, size)",
        orderBy: "createdTime desc",
      });

      return { success: true, files: res.data.files };
    } catch (err) {
      return { error: err.message };
    }
  });

  ipcMain.handle("delete-backup", async (_, fileId) => {
    try {
      const auth = getAuthenticatedClient();
      const drive = google.drive({ version: "v3", auth });
      await drive.files.delete({ fileId });
      return { success: true };
    } catch (err) {
      return { error: err.message };
    }
  });

  ipcMain.handle("start-restore", async (_, { fileId, destPath }) => {
    try {
      const auth = getAuthenticatedClient();
      const drive = google.drive({ version: "v3", auth });

      send({ status: "downloading", progress: 0 });

      const fileMeta = await drive.files.get({ fileId, fields: "name, size" });
      const fileName = fileMeta.data.name;
      const fileSize = parseInt(fileMeta.data.size || 0);
      const zipPath = path.join(os.tmpdir(), fileName);

      await downloadFromDrive(drive, fileId, zipPath, fileSize, (pct) => {
        send({ status: "downloading", progress: Math.round(pct * 0.8) });
      });

      send({ status: "extracting", progress: 80 });

      const extractTo =
        destPath || path.join(os.homedir(), "Desktop", "restored-backup");
      fs.mkdirSync(extractTo, { recursive: true });

      await extractZip(zipPath, { dir: extractTo });
      fs.unlinkSync(zipPath);

      send({ status: "done", progress: 100, path: extractTo });
      return { success: true, path: extractTo };
    } catch (err) {
      return { error: err.message };
    }
  });

  ipcMain.handle("get-folder-size", async (_, folderPath) => {
    try {
      const size = getFolderSize(folderPath);
      return { success: true, size };
    } catch (err) {
      return { error: err.message };
    }
  });
}

function getFolderSize(folderPath) {
  let total = 0;
  const items = fs.readdirSync(folderPath, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(folderPath, item.name);
    try {
      if (item.isDirectory()) total += getFolderSize(full);
      else total += fs.statSync(full).size;
    } catch {}
  }
  return total;
}

function compressFolder(folderPath, outputPath, onProgress) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver("zip", { zlib: { level: 6 } });

    const totalSize = getFolderSize(folderPath);
    let processed = 0;

    archive.on("entry", (entry) => {
      processed += entry.stats?.size || 0;
      if (totalSize > 0) onProgress(Math.min(processed / totalSize, 1));
    });

    output.on("close", resolve);
    archive.on("error", reject);
    archive.pipe(output);
    archive.directory(folderPath, path.basename(folderPath));
    archive.finalize();
  });
}

function uploadToDrive(drive, filePath, folderName, onProgress) {
  return new Promise(async (resolve, reject) => {
    try {
      const fileSize = fs.statSync(filePath).size;
      let uploaded = 0;

      const readStream = fs.createReadStream(filePath);
      readStream.on("data", (chunk) => {
        uploaded += chunk.length;
        onProgress(uploaded);
      });

      const res = await drive.files.create({
        requestBody: {
          name: `backup-${folderName}-${Date.now()}.zip`,
          mimeType: "application/zip",
        },
        media: {
          mimeType: "application/zip",
          body: readStream,
        },
        fields: "id",
      });
      resolve(res.data.id);
    } catch (err) {
      reject(err);
    }
  });
}

function downloadFromDrive(drive, fileId, destPath, fileSize, onProgress) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await drive.files.get(
        { fileId, alt: "media" },
        { responseType: "stream" },
      );

      let downloaded = 0;
      const writer = fs.createWriteStream(destPath);

      res.data.on("data", (chunk) => {
        downloaded += chunk.length;
        if (fileSize > 0) onProgress(downloaded / fileSize);
      });

      res.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { registerBackupHandlers };
