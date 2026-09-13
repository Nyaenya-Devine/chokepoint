const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onAcceptRequest: (callback) => ipcRenderer.on('accept-request', callback),
  onNewRequest: (callback) => ipcRenderer.on('new-request', callback),
  onOpenSettings: (callback) => ipcRenderer.on('open-settings', callback),
  sendIncomingRequest: (request) => ipcRenderer.send('incoming-request', request),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});

contextBridge.exposeInMainWorld('isElectron', true);
