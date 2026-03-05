import { useState, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #f5f3ef;
    --surface: #edeae4;
    --border: #d8d4cc;
    --text: #1a1916;
    --muted: #8c8880;
    --accent: #2a6b4a;
    --accent-light: #e8f2ec;
    --danger: #c0392b;
    --danger-light: #fdecea;
    --mono: 'DM Mono', monospace;
    --sans: 'DM Sans', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--sans); }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  .header {
    padding: 24px 36px 0;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
  }

  .logo { font-family: var(--mono); font-size: 13px; font-weight: 500; letter-spacing: 0.08em; color: var(--text); text-transform: uppercase; padding-bottom: 20px; }
  .logo span { color: var(--accent); }

  .nav { display: flex; }
  .nav-btn { font-family: var(--mono); font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; padding: 14px 20px; border: none; background: transparent; color: var(--muted); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.15s; position: relative; top: 1px; }
  .nav-btn:hover { color: var(--text); }
  .nav-btn.active { color: var(--text); border-bottom-color: var(--accent); }

  .status-dot { display: flex; align-items: center; gap: 6px; font-family: var(--mono); font-size: 11px; color: var(--muted); padding-bottom: 20px; letter-spacing: 0.04em; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: #ccc; }
  .dot.on { background: var(--accent); box-shadow: 0 0 0 3px var(--accent-light); }

  .content { padding: 36px; flex: 1; max-width: 680px; }

  .section-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }

  .alert { font-family: var(--mono); font-size: 12px; padding: 12px 16px; border-radius: 4px; margin-bottom: 20px; border-left: 3px solid; letter-spacing: 0.02em; }
  .alert.info { background: #e8f0ff; border-color: #3b6fd4; color: #1e3a7a; }
  .alert.success { background: var(--accent-light); border-color: var(--accent); color: #1a4a33; }
  .alert.error { background: var(--danger-light); border-color: var(--danger); color: #7a1a1a; }

  .quick-folders { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .quick-btn { font-family: var(--mono); font-size: 11px; letter-spacing: 0.04em; padding: 8px 14px; border: 1px solid var(--border); border-radius: 4px; background: var(--surface); color: var(--muted); cursor: pointer; transition: all 0.15s; }
  .quick-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-light); }
  .quick-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .folder-list { margin-bottom: 20px; }
  .folder-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; margin-bottom: 6px; }
  .folder-name { font-family: var(--mono); font-size: 13px; font-weight: 500; }
  .folder-meta { display: flex; gap: 12px; align-items: center; margin-top: 2px; }
  .folder-path { font-family: var(--mono); font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 360px; }
  .folder-size { font-family: var(--mono); font-size: 11px; color: var(--accent); }

  .btn-remove { background: none; border: none; cursor: pointer; color: var(--muted); font-size: 18px; padding: 2px 8px; border-radius: 4px; transition: all 0.15s; line-height: 1; }
  .btn-remove:hover { color: var(--danger); background: var(--danger-light); }

  .actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }

  .btn { font-family: var(--mono); font-size: 12px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; padding: 11px 20px; border-radius: 5px; border: 1px solid; cursor: pointer; transition: all 0.15s; }
  .btn-primary { background: var(--accent); border-color: var(--accent); color: #fff; }
  .btn-primary:hover { background: #235c3e; border-color: #235c3e; }
  .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
  .btn-secondary { background: transparent; border-color: var(--border); color: var(--text); }
  .btn-secondary:hover { border-color: #b8b4ac; background: var(--surface); }
  .btn-secondary:disabled { opacity: 0.45; cursor: not-allowed; }
  .btn-ghost { background: transparent; border-color: transparent; color: var(--muted); padding: 11px 8px; font-family: var(--mono); font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; border-radius: 5px; border: 1px solid transparent; cursor: pointer; transition: all 0.15s; }
  .btn-ghost:hover { color: var(--text); }
  .btn-danger-ghost { background: transparent; border: none; color: var(--muted); font-family: var(--mono); font-size: 11px; cursor: pointer; padding: 4px 8px; border-radius: 4px; transition: all 0.15s; }
  .btn-danger-ghost:hover { color: var(--danger); background: var(--danger-light); }

  .progress-wrap { margin: 20px 0; }
  .progress-info { display: flex; justify-content: space-between; font-family: var(--mono); font-size: 11px; color: var(--muted); margin-bottom: 8px; }
  .progress-bar-bg { height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; }
  .progress-bar-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.3s ease; }
  .progress-step { font-family: var(--mono); font-size: 10px; color: var(--muted); margin-top: 6px; letter-spacing: 0.04em; }

  .backup-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--border); }
  .backup-item:last-child { border-bottom: none; }
  .backup-name { font-family: var(--mono); font-size: 13px; color: var(--text); }
  .backup-meta { font-family: var(--mono); font-size: 11px; color: var(--muted); margin-top: 3px; }
  .backup-actions { display: flex; gap: 8px; align-items: center; }

  .dest-row { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding: 12px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; }
  .dest-path { font-family: var(--mono); font-size: 12px; color: var(--muted); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .input { font-family: var(--mono); font-size: 13px; width: 100%; padding: 12px 14px; border: 1px solid var(--border); border-radius: 5px; background: var(--surface); color: var(--text); outline: none; margin-bottom: 12px; transition: border-color 0.15s; }
  .input:focus { border-color: var(--accent); }
  .input::placeholder { color: var(--muted); }

  .config-row { padding: 20px 0; border-bottom: 1px solid var(--border); }
  .config-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
  .config-desc { font-size: 13px; color: var(--text); margin-bottom: 14px; line-height: 1.5; }

  .empty { font-family: var(--mono); font-size: 12px; color: var(--muted); padding: 32px 0; text-align: center; letter-spacing: 0.04em; }

  .confirm-overlay { position: fixed; inset: 0; background: rgba(26,25,22,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
  .confirm-box { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 28px; width: 340px; }
  .confirm-title { font-family: var(--mono); font-size: 13px; font-weight: 500; margin-bottom: 8px; }
  .confirm-desc { font-size: 13px; color: var(--muted); margin-bottom: 24px; line-height: 1.5; }
  .confirm-actions { display: flex; gap: 10px; justify-content: flex-end; }
`;

const OS_FOLDERS = [
  { label: "Escritorio", key: "Desktop" },
  { label: "Documentos", key: "Documents" },
  { label: "Descargas", key: "Downloads" },
  { label: "Imágenes", key: "Pictures" },
  { label: "Música", key: "Music" },
];

function ConfigCredentials({ isAuth, onAuthSuccess, showMsg }) {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [hasCreds, setHasCreds] = useState(false);

  useEffect(() => {
    window.api.getCredentials().then((c) => setHasCreds(!!c));
  }, []);

  async function handleSaveCreds() {
    if (!clientId.trim() || !clientSecret.trim())
      return showMsg("Completa ambos campos", "error");
    const res = await window.api.saveCredentials({
      clientId: clientId.trim(),
      clientSecret: clientSecret.trim(),
    });
    if (res.error) return showMsg(res.error, "error");
    setHasCreds(true);
    setClientId("");
    setClientSecret("");
    showMsg("Credenciales guardadas", "success");
  }

  async function handleAuth() {
    const res = await window.api.getAuthUrl();
    if (res?.error) return showMsg(res.error, "error");
    if (res?.url) {
      navigator.clipboard.writeText(res.url);
      showMsg(
        "URL copiada. Pégala en tu navegador si no se abrió sola.",
        "info",
      );
    } else {
      showMsg("Se abrió el navegador. Copia el código y pégalo abajo.", "info");
    }
  }

  async function handleAuthCode() {
    if (!authCode.trim()) return;
    const res = await window.api.setAuthCode(authCode.trim());
    if (res.error) return showMsg(res.error, "error");
    onAuthSuccess();
    setAuthCode("");
    showMsg("Autenticado correctamente", "success");
  }

  return (
    <>
      <div className="config-row">
        <div className="config-label">Credenciales de Google Cloud</div>
        <div className="config-desc">
          {hasCreds
            ? "Credenciales configuradas. Puedes actualizarlas si es necesario."
            : "Ingresa tu Client ID y Client Secret de Google Cloud Console."}
        </div>
        <input
          className="input"
          placeholder="Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        />
        <input
          className="input"
          placeholder="Client Secret"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
        />
        <button className="btn btn-secondary" onClick={handleSaveCreds}>
          {hasCreds ? "Actualizar credenciales" : "Guardar credenciales"}
        </button>
      </div>

      <div className="config-row">
        <div className="config-label">Google Drive</div>
        <div className="config-desc">
          {isAuth
            ? "Tu cuenta está conectada y lista para usar."
            : "Autoriza el acceso a tu Google Drive."}
        </div>
        <div className="actions">
          <button
            className="btn btn-primary"
            onClick={handleAuth}
            disabled={isAuth || !hasCreds}
          >
            {isAuth ? "✓ Conectado" : "Autorizar acceso"}
          </button>
        </div>
      </div>

      {!isAuth && hasCreds && (
        <div className="config-row">
          <div className="config-label">Código de autorización</div>
          <div className="config-desc">
            Pega aquí el código que te dio Google tras autorizar.
          </div>
          <input
            className="input"
            placeholder="4/0AX4XfWh..."
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAuthCode}>
            Verificar
          </button>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [tab, setTab] = useState("backup");
  const [folders, setFolders] = useState([]);
  const [folderSizes, setFolderSizes] = useState({});
  const [backups, setBackups] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [progress, setProgress] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [restoreDest, setRestoreDest] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    checkAuth();
    window.api.onProgress((data) => setProgress(data));
  }, []);

  useEffect(() => {
    if (tab === "restore" && isAuth) loadBackups();
  }, [tab, isAuth]);

  async function checkAuth() {
    const auth = await window.api.isAuthenticated();
    setIsAuth(auth);
  }

  async function addFolder(path) {
    if (!path || folders.find((f) => f.path === path)) return;
    const name = path.split("\\").pop();
    setFolders((prev) => [...prev, { path, name }]);
    const res = await window.api.getFolderSize(path);
    if (res.success) setFolderSizes((prev) => ({ ...prev, [path]: res.size }));
  }

  async function handleAddFolder() {
    const path = await window.api.selectFolder();
    await addFolder(path);
  }

  async function handleQuickFolder(key) {
    const userProfile = "C:\\Users\\" + (await getUserName());
    const path = `${userProfile}\\${key}`;
    await addFolder(path);
  }

  async function getUserName() {
    const res = await window.api.getConfig();
    if (res.username) return res.username;
    return "kiosco1";
  }

  function removeFolder(path) {
    setFolders((prev) => prev.filter((f) => f.path !== path));
    setFolderSizes((prev) => {
      const n = { ...prev };
      delete n[path];
      return n;
    });
  }

  async function handleBackup() {
    if (!folders.length) return showMsg("Agrega al menos una carpeta", "error");
    if (!isAuth)
      return showMsg("Primero autentícate con Google Drive", "error");
    setLoading(true);
    setProgress({ status: "starting", progress: 0 });
    const res = await window.api.startBackup(folders.map((f) => f.path));
    setLoading(false);
    if (res.error) return showMsg(res.error, "error");
    showMsg(
      `${res.results.length} carpeta(s) respaldadas correctamente`,
      "success",
    );
    setProgress(null);
  }

  async function handleRestore(fileId) {
    setLoading(true);
    setProgress({ status: "downloading", progress: 0 });
    const res = await window.api.startRestore({
      fileId,
      destPath: restoreDest,
    });
    setLoading(false);
    if (res.error) return showMsg(res.error, "error");
    showMsg(`Restaurado en: ${res.path}`, "success");
    setProgress(null);
  }

  async function handleSelectRestoreDest() {
    const path = await window.api.selectRestoreDest();
    if (path) setRestoreDest(path);
  }

  async function handleDeleteConfirm() {
    if (!confirmDelete) return;
    const res = await window.api.deleteBackup(confirmDelete.id);
    setConfirmDelete(null);
    if (res.error) return showMsg(res.error, "error");
    setBackups((prev) => prev.filter((b) => b.id !== confirmDelete.id));
    showMsg("Backup eliminado", "success");
  }

  async function handleAuth() {
    const res = await window.api.getAuthUrl();
    if (res?.error) return showMsg(res.error, "error");
    if (res?.url) {
      navigator.clipboard.writeText(res.url);
      showMsg(
        "URL copiada. Pégala en tu navegador si no se abrió sola.",
        "info",
      );
    } else {
      showMsg("Se abrió el navegador. Copia el código y pégalo abajo.", "info");
    }
  }

  async function handleAuthCode() {
    if (!authCode.trim()) return;
    const res = await window.api.setAuthCode(authCode.trim());
    if (res.error) return showMsg(res.error, "error");
    setIsAuth(true);
    setAuthCode("");
    showMsg("Autenticado correctamente", "success");
  }

  async function loadBackups() {
    const res = await window.api.listBackups();
    if (res.success) setBackups(res.files);
  }

  function showMsg(text, type = "info") {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 4000);
  }

  function formatSize(bytes) {
    if (!bytes) return "—";
    const mb = bytes / 1024 / 1024;
    if (mb > 1024) return `${(mb / 1024).toFixed(1)} gb`;
    return mb > 1 ? `${mb.toFixed(1)} mb` : `${(bytes / 1024).toFixed(0)} kb`;
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getProgressLabel() {
    if (!progress) return "";
    if (progress.status === "compressing")
      return `comprimiendo ${progress.folder}...`;
    if (progress.status === "uploading")
      return `subiendo ${progress.folder}...`;
    if (progress.status === "downloading") return "descargando...";
    if (progress.status === "extracting") return "extrayendo archivos...";
    if (progress.status === "done") return "completado";
    return "iniciando...";
  }

  function cleanBackupName(name) {
    return name.replace("backup-", "").replace(/-\d+\.zip$/, "");
  }

  const totalSize = Object.values(folderSizes).reduce((a, b) => a + b, 0);

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {confirmDelete && (
          <div className="confirm-overlay">
            <div className="confirm-box">
              <div className="confirm-title">Eliminar backup</div>
              <div className="confirm-desc">
                ¿Seguro que quieres eliminar{" "}
                <strong>{cleanBackupName(confirmDelete.name)}</strong>? Esta
                acción no se puede deshacer.
              </div>
              <div className="confirm-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  style={{
                    background: "var(--danger)",
                    borderColor: "var(--danger)",
                  }}
                  onClick={handleDeleteConfirm}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="header">
          <div className="logo">
            folder<span>.</span>backup
          </div>
          <nav className="nav">
            {[
              ["backup", "Backup"],
              ["restore", "Restaurar"],
              ["config", "Config"],
            ].map(([id, label]) => (
              <button
                key={id}
                className={`nav-btn ${tab === id ? "active" : ""}`}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="status-dot">
            <span className={`dot ${isAuth ? "on" : ""}`} />
            {isAuth ? "conectado" : "sin conectar"}
          </div>
        </div>

        <div className="content">
          {msg && <div className={`alert ${msg.type}`}>{msg.text}</div>}

          {tab === "backup" && (
            <>
              <div className="section-label">Acceso rápido</div>
              <div className="quick-folders">
                {OS_FOLDERS.map((f) => (
                  <button
                    key={f.key}
                    className="quick-btn"
                    onClick={() => handleQuickFolder(f.key)}
                    disabled={folders.some((x) => x.path.endsWith(f.key))}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="section-label" style={{ marginTop: 8 }}>
                Carpetas seleccionadas
                {totalSize > 0 && (
                  <span style={{ marginLeft: 12, color: "var(--accent)" }}>
                    total: {formatSize(totalSize)}
                  </span>
                )}
              </div>

              <div className="folder-list">
                {folders.length === 0 && (
                  <div className="empty">ninguna carpeta seleccionada</div>
                )}
                {folders.map((f) => (
                  <div key={f.path} className="folder-item">
                    <div>
                      <div className="folder-name">{f.name}</div>
                      <div className="folder-meta">
                        <div className="folder-path">{f.path}</div>
                        {folderSizes[f.path] && (
                          <div className="folder-size">
                            {formatSize(folderSizes[f.path])}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      className="btn-remove"
                      onClick={() => removeFolder(f.path)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {progress && (
                <div className="progress-wrap">
                  <div className="progress-info">
                    <span>{getProgressLabel()}</span>
                    <span>{progress.progress}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                  {progress.total > 1 && (
                    <div className="progress-step">
                      {progress.step} de {progress.total} carpetas
                    </div>
                  )}
                </div>
              )}

              <div className="actions">
                <button className="btn btn-secondary" onClick={handleAddFolder}>
                  + Agregar carpeta
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleBackup}
                  disabled={loading}
                >
                  {loading ? "Subiendo..." : "Iniciar backup"}
                </button>
              </div>
            </>
          )}

          {tab === "restore" && (
            <>
              <div className="section-label">Destino de restauración</div>
              <div className="dest-row">
                <div className="dest-path">
                  {restoreDest || "Escritorio/restored-backup (por defecto)"}
                </div>
                <button
                  className="btn btn-secondary"
                  style={{ whiteSpace: "nowrap" }}
                  onClick={handleSelectRestoreDest}
                >
                  Cambiar
                </button>
              </div>

              <div className="section-label">Backups disponibles</div>
              {!isAuth && (
                <div className="alert error">
                  Conéctate a Google Drive en Configuración
                </div>
              )}
              {isAuth && backups.length === 0 && (
                <div className="empty">no se encontraron backups</div>
              )}

              {backups.map((b) => (
                <div key={b.id} className="backup-item">
                  <div>
                    <div className="backup-name">{cleanBackupName(b.name)}</div>
                    <div className="backup-meta">
                      {formatDate(b.createdTime)} · {formatSize(b.size)}
                    </div>
                  </div>
                  <div className="backup-actions">
                    <button
                      className="btn-danger-ghost"
                      onClick={() => setConfirmDelete(b)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleRestore(b.id)}
                      disabled={loading}
                    >
                      Restaurar
                    </button>
                  </div>
                </div>
              ))}

              {progress && (
                <div className="progress-wrap" style={{ marginTop: 24 }}>
                  <div className="progress-info">
                    <span>{getProgressLabel()}</span>
                    <span>{progress.progress}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {isAuth && (
                <div style={{ marginTop: 20 }}>
                  <button className="btn-ghost" onClick={loadBackups}>
                    ↺ Actualizar lista
                  </button>
                </div>
              )}
            </>
          )}

          {tab === "config" && (
            <>
              <ConfigCredentials
                isAuth={isAuth}
                onAuthSuccess={() => setIsAuth(true)}
                showMsg={showMsg}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
