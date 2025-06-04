type ProjectFolder = {
  id: number
  path: string
}

export interface ElectronAPI {
  ping: () => void

  getProjectFolders: () => Promise<ProjectFolder[]>
  removeProjectFolder: (id: number) => Promise<void>
  addProjectFolder: () => Promise<void>

  getProgramLocation: () => Promise<string>
  getProjects: (folders: string[]) => Promise<string[]>
  selectProgram: () => string | null
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
