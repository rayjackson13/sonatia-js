import type { ElectronAPI, Project } from '../types'
import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'

const api: ElectronAPI = {
  newSession: () => ipcRenderer.invoke('newSession'),
  addExistingProject: () => ipcRenderer.invoke('addExistingProject'),

  addProjectFolder: () => ipcRenderer.invoke('addProjectFolder'),
  getProjectFolders: () => ipcRenderer.invoke('getProjectFolders'),
  removeProjectFolder: (id: number) => ipcRenderer.invoke('removeProjectFolder', id),

  getProgramLocation: () => ipcRenderer.invoke('getProgramLocation'),
  selectProgram: () => ipcRenderer.invoke('selectProgram'),

  projects: {
    get: () => ipcRenderer.invoke('getProjects'),
    open: (path: string) => ipcRenderer.invoke('openProject', path),
    rescan: () => ipcRenderer.invoke('rescanProjects'),
    subscribe: (callback) => {
      const handler = (_: IpcRendererEvent, data: Project[]) => callback(data)
      ipcRenderer.on('projectsUpdated', handler)
      return () => ipcRenderer.removeListener('projectsUpdated', handler)
    },
  },
}

contextBridge.exposeInMainWorld('electronAPI', api)
