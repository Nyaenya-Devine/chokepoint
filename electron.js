const { app, BrowserWindow, Menu, shell, Notification, ipcMain } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const DEV_ORIGIN = 'http://localhost:3000';
const PROD_ORIGIN = 'https://nyaenya-devine-chokepoint.vercel.app';
let mainWindow;

function isAllowedNavigation(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (url.protocol === 'file:') return true;
    if (isDev && url.origin === DEV_ORIGIN) return true;
    return url.origin === PROD_ORIGIN;
  } catch {
    return false;
  }
}

function openExternalSafe(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== 'https:') return;
    if (url.origin === PROD_ORIGIN || (isDev && url.origin === DEV_ORIGIN)) return;
    shell.openExternal(url.toString());
  } catch {
    // Ignore malformed or unsafe external URLs.
  }
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
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
    show: false,
    vibrancy: 'under-window',
    visualEffectState: 'active',
  });

  if (isDev) {
    mainWindow.loadURL(DEV_ORIGIN);
    if (process.env.ENABLE_DEVTOOLS === 'true') {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
  } else {
    mainWindow.loadURL(PROD_ORIGIN).catch(() => {
      mainWindow.loadFile(path.join(__dirname, 'out/index.html'));
    });
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    if (Notification.isSupported()) {
      new Notification({
        title: 'Chokepoint — Live Security Operations Lab',
        body: 'Desktop app ready — Real-time requests, voice approvals, remote verification, per-tenant policies',
        icon: path.join(__dirname, 'public/icon-512.png'),
        silent: false,
      }).show();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    openExternalSafe(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    if (!isAllowedNavigation(navigationUrl)) {
      event.preventDefault();
      openExternalSafe(navigationUrl);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

ipcMain.on('incoming-request', (event, request) => {
  if (!mainWindow || event.sender !== mainWindow.webContents) return;
  if (!request || typeof request !== 'object' || Array.isArray(request)) return;

  const priority = String(request.priority ?? 'P2').slice(0, 20);
  const tenantName = String(request.tenantName ?? 'Unknown tenant').slice(0, 120);
  const requestedByName = String(request.requestedByName ?? 'Unknown user').slice(0, 120);
  const title = String(request.title ?? 'Approval request').slice(0, 200);
  const risk = String(request.risk ?? 'unknown').slice(0, 30);
  const rawTime = Number(request.timeLeftMs);
  const timeLeftMs = Number.isFinite(rawTime) ? Math.max(0, Math.min(rawTime, 86400000)) : 0;

  if (!Notification.isSupported()) return;
  const notification = new Notification({
    title: `🚨 Incoming ${priority} Request — ${tenantName}`,
    body: `${requestedByName}: ${title} — ${Math.floor(timeLeftMs / 60000)}m left • ${risk} risk`,
    icon: path.join(__dirname, 'public/icon-512.png'),
    urgency: priority === 'P1' ? 'critical' : 'normal',
    actions: [{ type: 'button', text: 'Approve — Voice Call' }],
    closeButtonText: 'Review Later',
  });

  notification.on('action', () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    mainWindow.webContents.send('accept-request', request);
    mainWindow.show();
    mainWindow.focus();
  });
  notification.show();
});

const sendToWindow = (channel) => () => {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send(channel);
};

const template = [
  { label: 'Chokepoint', submenu: [
    { role: 'about', label: 'About Chokepoint' }, { type: 'separator' },
    { label: 'Preferences', accelerator: 'CmdOrCtrl+,', click: sendToWindow('open-settings') },
    { type: 'separator' }, { role: 'services' }, { type: 'separator' },
    { role: 'hide' }, { role: 'hideOthers' }, { role: 'unhide' }, { type: 'separator' }, { role: 'quit' },
  ]},
  { label: 'File', submenu: [
    { label: 'New Approval Request', accelerator: 'CmdOrCtrl+N', click: sendToWindow('new-request') },
    { label: 'Export Audit Log', accelerator: 'CmdOrCtrl+E', click: sendToWindow('export-audit') },
    { type: 'separator' }, { role: 'close' },
  ]},
  { label: 'Edit', submenu: [
    { role: 'undo' }, { role: 'redo' }, { type: 'separator' }, { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' },
  ]},
  { label: 'Approvals', submenu: [
    { label: 'Accept Incoming Request', accelerator: 'CmdOrCtrl+Shift+A', click: sendToWindow('accept-incoming') },
    { label: 'Approve with Voice', accelerator: 'CmdOrCtrl+Shift+V', click: sendToWindow('approve-voice') },
    { label: 'What If Simulation', accelerator: 'CmdOrCtrl+W', click: sendToWindow('what-if') },
    { label: 'Verify Break Glass', accelerator: 'CmdOrCtrl+B', click: sendToWindow('verify-breakglass') },
    { type: 'separator' }, { label: 'Reject Request', accelerator: 'CmdOrCtrl+R', click: sendToWindow('reject-request') },
  ]},
  { label: 'View', submenu: [
    { role: 'reload' }, { role: 'forceReload' }, { role: 'toggleDevTools' }, { type: 'separator' },
    { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }, { type: 'separator' },
    { role: 'togglefullscreen' }, { type: 'separator' }, { label: 'Command Palette', accelerator: 'CmdOrCtrl+K', click: sendToWindow('open-command-palette') },
  ]},
  { label: 'Window', submenu: [{ role: 'minimize' }, { role: 'zoom' }, { type: 'separator' }, { role: 'front' }]},
  { label: 'Help', submenu: [
    { label: 'Training Lab', click: sendToWindow('open-training') },
    { label: 'Keyboard Shortcuts', accelerator: 'CmdOrCtrl+/', click: sendToWindow('show-shortcuts') },
    { type: 'separator' },
    { label: 'Chokepoint GitHub', click: () => openExternalSafe('https://github.com/Nyaenya-Devine/chokepoint') },
    { label: 'Report Issue', click: () => openExternalSafe('https://github.com/Nyaenya-Devine/chokepoint/issues') },
  ]},
];

app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
