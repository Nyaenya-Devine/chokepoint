const { app, BrowserWindow, Menu, shell, dialog, ipcMain, Notification } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;

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
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
    show: false,
    vibrancy: 'under-window',
    visualEffectState: 'active',
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadURL('https://nyaenya-devine-chokepoint.vercel.app').catch(() => {
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
    shell.openExternal(url);
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

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

const template = [
  {
    label: 'Chokepoint',
    submenu: [
      { role: 'about', label: 'About Chokepoint' },
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
      { type: 'separator' },
      { role: 'close' },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectAll' },
    ],
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
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
      { type: 'separator' },
      { label: 'Command Palette', accelerator: 'CmdOrCtrl+K', click: () => mainWindow.webContents.send('open-command-palette') },
    ],
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' },
    ],
  },
  {
    label: 'Help',
    submenu: [
      { label: 'Training Lab', click: () => mainWindow.webContents.send('open-training') },
      { label: 'Keyboard Shortcuts', accelerator: 'CmdOrCtrl+/', click: () => mainWindow.webContents.send('show-shortcuts') },
      { type: 'separator' },
      { label: 'Chokepoint GitHub', click: () => shell.openExternal('https://github.com/Nyaenya-Devine/chokepoint') },
      { label: 'Report Issue', click: () => shell.openExternal('https://github.com/Nyaenya-Devine/chokepoint/issues') },
    ],
  },
];

app.whenReady().then(() => {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.origin !== 'http://localhost:3000' && parsedUrl.origin !== 'https://nyaenya-devine-chokepoint.vercel.app' && !navigationUrl.startsWith('file://')) {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });
});

app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
});
