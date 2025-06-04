const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getProgramLocation: () => ipcRenderer.invoke('getProgramLocation'),
  getProjects: (folders) => ipcRenderer.invoke('getProjects', folders),
  getProjectFolders: () => ipcRenderer.invoke('getProjectFolders'),
})
