// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge } = require('electron');
const { keyboard, Key } = require('/home/anton/code/presentation-tool-with-hand-gestures/node_modules/@nut-tree');
contextBridge.exposeInMainWorld('electron', {
    async pressSpace() {
        await keyboard.pressKey(Key.Space);
    },
});
//# sourceMappingURL=preload.js.map