// Chokepoint Preload — Secure IPC Bridge + Auto-Update + Tamper-Evident
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('chokepoint', {
  onAcceptRequest: (cb) => ipcRenderer.on('accept-request', (e, req) => cb(req)),
  onOpenSettings: (cb) => ipcRenderer.on('open-settings', cb),
  onNewRequest: (cb) => ipcRenderer.on('new-request', cb),
  onExportAudit: (cb) => ipcRenderer.on('export-audit', cb),
  onAcceptIncoming: (cb) => ipcRenderer.on('accept-incoming', cb),
  onApproveVoice: (cb) => ipcRenderer.on('approve-voice', cb),
  onWhatIf: (cb) => ipcRenderer.on('what-if', cb),
  onVerifyBreakGlass: (cb) => ipcRenderer.on('verify-breakglass', cb),
  onRejectRequest: (cb) => ipcRenderer.on('reject-request', cb),
  onOpenCommandPalette: (cb) => ipcRenderer.on('open-command-palette', cb),
  onOpenTraining: (cb) => ipcRenderer.on('open-training', cb),
  onShowShortcuts: (cb) => ipcRenderer.on('show-shortcuts', cb),
  onOpenLedger: (cb) => ipcRenderer.on('open-ledger', cb),

  incomingRequest: (req) => ipcRenderer.send('incoming-request', req),

  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),

  onUpdateChecking: (cb) => ipcRenderer.on('update-checking', () => cb()),
  onUpdateAvailable: (cb) => ipcRenderer.on('update-available', (e, info) => cb(info)),
  onUpdateNotAvailable: (cb) => ipcRenderer.on('update-not-available', () => cb()),
  onUpdateDownloading: (cb) => ipcRenderer.on('update-downloading', () => cb()),
  onUpdateProgress: (cb) => ipcRenderer.on('update-progress', (e, p) => cb(p)),
  onUpdateDownloaded: (cb) => ipcRenderer.on('update-downloaded', (e, info) => cb(info)),
  onUpdateError: (cb) => ipcRenderer.on('update-error', (e, err) => cb(err)),

  isDesktop: true,
  platform: process.platform,
  isSecureContext: true,
  sandbox: true,
  product: 'chokepoint',
  owasp: 'ASI03',
});

console.log('Chokepoint Desktop Bridge v3.1 loaded — Secure IPC, Auto-Update, Dual-Control, Tamper-Evident Ledger');
