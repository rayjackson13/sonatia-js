const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  addProjectFolder: () => ipcRenderer.invoke('addProjectFolder'),
  getProjectFolders: () => ipcRenderer.invoke('getProjectFolders'),
  removeProjectFolder: (id) => ipcRenderer.invoke('removeProjectFolder', id),
  getProgramLocation: () => ipcRenderer.invoke('getProgramLocation'),
  getProjects: (folders) => ipcRenderer.invoke('getProjects', folders),
  selectProgram: () => ipcRenderer.invoke('selectProgram'),
})
