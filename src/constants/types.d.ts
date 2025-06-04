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

  getProjects: () => Promise<Project[]>
  openProject: (path: string) => Promise<void>
  rescanProjects: () => Promise<Project[]>

  getProgramLocation: () => Promise<string>
  selectProgram: () => string | null
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
