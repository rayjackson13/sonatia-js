type ProjectFolder = {
  id: number
  path: string
}

export interface ElectronAPI {
  ping: () => void
  getProgramLocation: () => Promise<string>
  getProjects: (folders: string[]) => Promise<string[]>
  getProjectFolders: () => Promise<ProjectFolder[]>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
