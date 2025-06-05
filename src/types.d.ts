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
  folders: {
    get: () => Promise<ProjectFolder[]>
    remove: (id: number) => Promise<void>
    add: () => Promise<void>
  }

  program: {
    select: () => Promise<string>
    get: () => Promise<string>
  }

  projects: {
    new: () => void
    add: () => Promise<void>
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
