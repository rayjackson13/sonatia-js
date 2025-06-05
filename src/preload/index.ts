import type { ElectronAPI, Project } from '../types'
import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'

const api: ElectronAPI = {
  folders: {
    add: () => ipcRenderer.invoke('addProjectFolder'),
    get: () => ipcRenderer.invoke('getProjectFolders'),
    remove: (id: number) => ipcRenderer.invoke('removeProjectFolder', id),
  },

  program: {
    get: () => ipcRenderer.invoke('getProgramLocation'),
    select: () => ipcRenderer.invoke('selectProgram'),
  },

  projects: {
    new: () => ipcRenderer.invoke('newSession'),
    add: () => ipcRenderer.invoke('addExistingProject'),
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
