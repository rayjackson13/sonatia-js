type Project = {
  path: string
  name: string
  lastModified: number
}

type ProjectFolder = {
  id: number
  path: string
}

export interface ElectronAPI {
  newSession: () => void
  addExistingProject: () => Promise<void>

  getProjectFolders: () => Promise<ProjectFolder[]>
  removeProjectFolder: (id: number) => Promise<void>
  addProjectFolder: () => Promise<void>

  getProgramLocation: () => Promise<string>
  selectProgram: () => string | null

  projects: {
    get: () => Promise<Project[]>
    open: (path: string) => Promise<void>
    rescan: () => Promise<Project[]>
    subscribe: (cb: (data: Project[]) => void) => void
  }
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
