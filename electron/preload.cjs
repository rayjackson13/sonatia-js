const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  newSession: () => ipcRenderer.invoke('newSession'),
  addExistingProject: () => ipcRenderer.invoke('addExistingProject'),

  addProjectFolder: () => ipcRenderer.invoke('addProjectFolder'),
  getProjectFolders: () => ipcRenderer.invoke('getProjectFolders'),
  removeProjectFolder: (id) => ipcRenderer.invoke('removeProjectFolder', id),

  getProjects: () => ipcRenderer.invoke('getProjects'),
  openProject: (path) => ipcRenderer.invoke('openProject', path),
  rescanProjects: () => ipcRenderer.invoke('rescanProjects'),

  getProgramLocation: () => ipcRenderer.invoke('getProgramLocation'),
  selectProgram: () => ipcRenderer.invoke('selectProgram'),
})
