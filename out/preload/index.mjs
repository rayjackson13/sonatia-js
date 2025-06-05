import { contextBridge, ipcRenderer } from "electron";
const api = {
  newSession: () => ipcRenderer.invoke("newSession"),
  addExistingProject: () => ipcRenderer.invoke("addExistingProject"),
  addProjectFolder: () => ipcRenderer.invoke("addProjectFolder"),
  getProjectFolders: () => ipcRenderer.invoke("getProjectFolders"),
  removeProjectFolder: (id) => ipcRenderer.invoke("removeProjectFolder", id),
  getProgramLocation: () => ipcRenderer.invoke("getProgramLocation"),
  selectProgram: () => ipcRenderer.invoke("selectProgram"),
  projects: {
    get: () => ipcRenderer.invoke("getProjects"),
    open: (path) => ipcRenderer.invoke("openProject", path),
    rescan: () => ipcRenderer.invoke("rescanProjects"),
    subscribe: (callback) => {
      const handler = (_, data) => callback(data);
      ipcRenderer.on("projectsUpdated", handler);
      return () => ipcRenderer.removeListener("projectsUpdated", handler);
    }
  }
};
contextBridge.exposeInMainWorld("electronAPI", api);
