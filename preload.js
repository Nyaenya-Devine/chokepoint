const { contextBridge, ipcRenderer } = require('electron');

const CHANNELS = new Set([
  'accept-request',
  'new-request',
  'open-settings',
]);

function subscribe(channel, callback) {
  if (!CHANNELS.has(channel) || typeof callback !== 'function') return () => {};
  const listener = (_event, ...args) => callback(...args);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

contextBridge.exposeInMainWorld('electronAPI', {
  onAcceptRequest: (callback) => subscribe('accept-request', callback),
  onNewRequest: (callback) => subscribe('new-request', callback),
  onOpenSettings: (callback) => subscribe('open-settings', callback),
  sendIncomingRequest: (request) => {
    if (!request || typeof request !== 'object' || Array.isArray(request)) return false;
    ipcRenderer.send('incoming-request', request);
    return true;
  },
});

contextBridge.exposeInMainWorld('isElectron', true);
