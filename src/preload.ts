// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { contextBridge, ipcRenderer } = require("electron")
contextBridge.exposeInMainWorld('myapi', {
    pressKey: async (data) => await ipcRenderer.invoke('pressKey', data),
    releaseKey: async (data) => await ipcRenderer.invoke('releaseKey', data)
})



