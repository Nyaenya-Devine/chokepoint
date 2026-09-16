const { app, BrowserWindow, Menu, shell, dialog, ipcMain, Notification, session } = require('electron');
const path = require('path');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

log.transports.file.level = 'info';
autoUpdater.logger = log;
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow;

function openSafeExternal(url) {
  if (typeof url !== 'string' || !/^https:\/\//i.test(url)) {
    log.warn(`Blocked unsafe external URL: ${String(url).slice(0, 200)}`);
    return false;
  }
  shell.openExternal(url).catch((err) => log.warn(`External URL failed: ${err.message}`));
  return true;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#0a0a0a',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 15, y: 15 },
    icon: path.join(__dirname, 'public/icon-512.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
    show: false,
    vibrancy: 'under-window',
    visualEffectState: 'active',
  });

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' https://chokepoint-demo.vercel.app; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://chokepoint-demo.vercel.app; frame-ancestors 'none';"
        ],
      }
    });
  });

  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'notifications') callback(true);
    else {
      log.warn(`Permission denied: ${permission} — zero-trust block`);
      callback(false);
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadURL('https://chokepoint-demo.vercel.app').catch(() => {
      mainWindow.loadFile(path.join(__dirname, 'out/index.html')).catch(() => {
        mainWindow.loadURL('https://chokepoint-demo.vercel.app');
      });
    });
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    if (Notification.isSupported()) {
      new Notification({
        title: 'Chokepoint — Least-Privilege Dual-Control v3.1',
        body: 'Desktop ready — Auto-update enabled • Tamper-evident ledger • Dual-control',
        icon: path.join(__dirname, 'public/icon-512.png'),
        silent: false,
      }).show();
    }
    if (!isDev) {
      setTimeout(() => {
        log.info('Checking for updates...');
        autoUpdater.checkForUpdates().catch(err => log.error('Update check failed', err));
      }, 3000);
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    openSafeExternal(url);
    return { action: 'deny' };
  });

  ipcMain.on('incoming-request', (event, request) => {
    if (Notification.isSupported()) {
      const notification = new Notification({
        title: `🚨 Incoming ${request.priority} Request — ${request.tenantName}`,
        body: `${request.requestedByName}: ${request.title} — ${Math.floor(request.timeLeftMs/60000)}m left • ${request.risk} risk`,
        icon: path.join(__dirname, 'public/icon-512.png'),
        urgency: request.priority === 'P1' ? 'critical' : 'normal',
        actions: [{ type: 'button', text: 'Approve — Voice Call' }],
        closeButtonText: 'Review Later',
      });
      notification.on('action', () => {
        mainWindow.webContents.send('accept-request', request);
        mainWindow.show();
        mainWindow.focus();
      });
      notification.show();
    }
  });
}

autoUpdater.on('checking-for-update', () => { log.info('Checking for update...'); if (mainWindow) mainWindow.webContents.send('update-checking'); });
autoUpdater.on('update-available', (info) => {
  log.info(`Update available: ${info.version}`);
  if (mainWindow) {
    mainWindow.webContents.send('update-available', info);
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Available — Chokepoint v' + info.version,
      message: `Chokepoint ${info.version} available. Current: ${app.getVersion()}. Download now?`,
      detail: `Release notes: ${info.releaseNotes || 'Security hardening, dual-control improvements, tamper-evident ledger'}\n\nZero-trust: Verified via GitHub Releases signature.`,
      buttons: ['Download Now', 'Later'],
      defaultId: 0,
    }).then(result => { if (result.response === 0) { autoUpdater.downloadUpdate(); mainWindow.webContents.send('update-downloading'); } });
  }
});
autoUpdater.on('update-not-available', () => { log.info('Update not available'); if (mainWindow) mainWindow.webContents.send('update-not-available'); });
autoUpdater.on('download-progress', (progress) => { log.info(`Download ${progress.percent.toFixed(1)}%`); if (mainWindow) mainWindow.webContents.send('update-progress', progress); });
autoUpdater.on('update-downloaded', (info) => {
  log.info(`Update downloaded: ${info.version}`);
  if (mainWindow) {
    mainWindow.webContents.send('update-downloaded', info);
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Ready — Restart to Install',
      message: `Chokepoint ${info.version} downloaded — restart?`,
      detail: 'Verified signature, will install on quit. Audit ledger preserved — tamper-evident.',
      buttons: ['Restart Now', 'On Next Launch'],
      defaultId: 0,
    }).then(result => { if (result.response === 0) autoUpdater.quitAndInstall(); });
  }
});
autoUpdater.on('error', (err) => { log.error('Auto-updater error', err); if (mainWindow) mainWindow.webContents.send('update-error', err.message); });

ipcMain.handle('check-for-updates', async () => {
  if (isDev) return { status: 'dev-mode' };
  try { const result = await autoUpdater.checkForUpdates(); return { status: 'checked', info: result?.updateInfo }; }
  catch (e) { log.error('Update check failed', e); return { status: 'error', message: e.message }; }
});
ipcMain.handle('download-update', async () => { try { await autoUpdater.downloadUpdate(); return { status: 'downloading' }; } catch (e) { return { status: 'error', message: e.message }; } });
ipcMain.handle('install-update', () => autoUpdater.quitAndInstall());
ipcMain.handle('get-app-version', () => app.getVersion());
ipcMain.handle('get-app-info', () => ({ version: app.getVersion(), electron: process.versions.electron, platform: process.platform, isPackaged: app.isPackaged }));

const template = [
  {
    label: 'Chokepoint',
    submenu: [
      { role: 'about', label: 'About Chokepoint' },
      { type: 'separator' },
      { label: 'Check for Updates...', click: () => { if (!isDev) autoUpdater.checkForUpdates(); else dialog.showMessageBox({ message: 'Updates disabled in dev', type: 'info' }); } },
      { label: `Version ${app.getVersion()}`, enabled: false },
      { type: 'separator' },
      { label: 'Preferences', accelerator: 'CmdOrCtrl+,', click: () => mainWindow.webContents.send('open-settings') },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  },
  {
    label: 'File',
    submenu: [
      { label: 'New Approval Request', accelerator: 'CmdOrCtrl+N', click: () => mainWindow.webContents.send('new-request') },
      { label: 'Export Audit Log', accelerator: 'CmdOrCtrl+E', click: () => mainWindow.webContents.send('export-audit') },
      { label: 'Export SBOM', click: () => openSafeExternal('https://github.com/Nyaenya-Devine/chokepoint/blob/main/sbom.json') },
      { type: 'separator' },
      { role: 'close' },
    ],
  },
  {
    label: 'Edit',
    submenu: [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' }, { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }],
  },
  {
    label: 'Approvals',
    submenu: [
      { label: 'Accept Incoming Request', accelerator: 'CmdOrCtrl+Shift+A', click: () => mainWindow.webContents.send('accept-incoming') },
      { label: 'Approve with Voice', accelerator: 'CmdOrCtrl+Shift+V', click: () => mainWindow.webContents.send('approve-voice') },
      { label: 'What If Simulation', accelerator: 'CmdOrCtrl+W', click: () => mainWindow.webContents.send('what-if') },
      { label: 'Verify Break Glass', accelerator: 'CmdOrCtrl+B', click: () => mainWindow.webContents.send('verify-breakglass') },
      { type: 'separator' },
      { label: 'Reject Request', accelerator: 'CmdOrCtrl+R', click: () => mainWindow.webContents.send('reject-request') },
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' }, { role: 'forceReload' }, { role: 'toggleDevTools' }, { type: 'separator' },
      { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }, { type: 'separator' },
      { role: 'togglefullscreen' }, { type: 'separator' },
      { label: 'Command Palette', accelerator: 'CmdOrCtrl+K', click: () => mainWindow.webContents.send('open-command-palette') },
    ],
  },
  {
    label: 'Security',
    submenu: [
      { label: 'Security Policy', click: () => openSafeExternal('https://github.com/Nyaenya-Devine/chokepoint/blob/main/SECURITY.md') },
      { label: 'Threat Model', click: () => openSafeExternal('https://github.com/Nyaenya-Devine/chokepoint/blob/main/THREAT_MODEL.md') },
      { label: 'Audit Ledger (HMAC)', click: () => mainWindow.webContents.send('open-ledger') },
      { label: 'Check for Updates — Secure', click: () => { if (!isDev) autoUpdater.checkForUpdates(); } },
      { type: 'separator' },
      { label: 'Report Security Issue', click: () => openSafeExternal('https://github.com/Nyaenya-Devine/chokepoint/security/advisories/new') },
    ],
  },
  {
    label: 'Window',
    submenu: [{ role: 'minimize' }, { role: 'zoom' }, { type: 'separator' }, { role: 'front' }],
  },
  {
    label: 'Help',
    submenu: [
      { label: 'Training Lab', click: () => mainWindow.webContents.send('open-training') },
      { label: 'Keyboard Shortcuts', accelerator: 'CmdOrCtrl+/', click: () => mainWindow.webContents.send('show-shortcuts') },
      { type: 'separator' },
      { label: 'Chokepoint GitHub', click: () => openSafeExternal('https://github.com/Nyaenya-Devine/chokepoint') },
      { label: 'Report Issue', click: () => openSafeExternal('https://github.com/Nyaenya-Devine/chokepoint/issues') },
      { label: 'Release Notes', click: () => openSafeExternal('https://github.com/Nyaenya-Devine/chokepoint/releases') },
    ],
  },
];

app.whenReady().then(() => {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const allowed = ['http://localhost:3000', 'https://chokepoint-demo.vercel.app'];
    const isAllowed = allowed.some(o => navigationUrl.startsWith(o)) || navigationUrl.startsWith('file://');
    if (!isAllowed) { event.preventDefault(); openSafeExternal(navigationUrl); }
  });
  contents.setWindowOpenHandler(({ url }) => { openSafeExternal(url); return { action: 'deny' }; });
});

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();
else app.on('second-instance', () => { if (mainWindow) { if (mainWindow.isMinimized()) mainWindow.restore(); mainWindow.focus(); } });
