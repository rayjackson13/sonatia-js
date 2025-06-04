const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    ping: () => console.log("Electron API works!")
});
