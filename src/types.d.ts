type WindowStateChangeCallback = (state: string) => void

export interface ElectronAPI {
  ping: () => void
  getProgramLocation: () => Promise<string>
  getProjects: (folders: string[]) => Promise<string[]>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
