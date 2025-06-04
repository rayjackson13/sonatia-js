type WindowStateChangeCallback = (state: string) => void

export interface ElectronAPI {
  ping: () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
