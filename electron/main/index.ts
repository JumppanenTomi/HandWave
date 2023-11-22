import { app, BrowserWindow, shell, ipcMain, dialog, Menu, screen } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import { update } from './update'
const { Key, keyboard } = require("@nut-tree/nut-js");
import { sequelize } from "../../src/getdb";

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'


const { desktopCapturer } = require("electron");

const getSource = (mainWindow: BrowserWindow) => {
  desktopCapturer
    .getSources({ types: ["window", "screen"] })
    .then(async (sources) => {
      console.log(sources);
      mainWindow.webContents.send("GET_SOURCES", sources);
      for (const source of sources) {
        if (source.name === "Screen 1") {
          mainWindow.webContents.send("SET_SOURCE", source.id);
          return;
        }
      }
    });
};

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(__dirname, '../../index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      nodeIntegration: true,
     contextIsolation: false,
    },
  })

    win.webContents.on("did-finish-load", () => {
      getSource(win);
      win?.webContents.send("main-process-message", new Date().toLocaleString());
    });

  if (url) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // Apply electron-updater
  update(win)
}

var mouse_offset = {
  x: 0,
  y: 0
}

let alternativeWindow: BrowserWindow | null = null
const alternativeUrl = process.env.VITE_DEV_SERVER_URL_2
const alternativeHtml = join(__dirname, '../../alternative.html')

function createAlternativeWindow() {
   // Create the browser window.
   let active_screen = screen.getPrimaryDisplay();
   const { width, height } = active_screen.workAreaSize;
   const x = active_screen.workArea.x;
   const y = active_screen.workArea.y;
   mouse_offset.x = active_screen.bounds.x;
   mouse_offset.y = active_screen.bounds.y;
 
   alternativeWindow = new BrowserWindow({
    title: 'Alternative window',
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
    width: width,
    height: height,
    x: x,
    y: y,
    hasShadow: false,
    transparent: true,
    frame: false,
    resizable: false,
    webPreferences: {
      preload,
      nodeIntegration: true,
     contextIsolation: false,
    },
  })
  if (alternativeUrl) { // electron-vite-vue#298
    alternativeWindow.loadURL(alternativeUrl)
    // Open devTool if the app is not packaged
    alternativeWindow.webContents.openDevTools()
  } else {
    alternativeWindow.loadFile(alternativeHtml)
  }
}

function createMenu() {
  const menu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      // Add submenu items for each setting...
    },
    {
      label: 'Select Source',
      // Add submenu items for each source...
    },
    {
      label: 'Record',
      click: () => {
        // Start/stop recording...
      },
    },
  ]);

  Menu.setApplicationMenu(menu);
}

sequelize.authenticate().then(() => console.log("connected")
).catch((err: any) => console.log(err))

var is_enable_mouse = false;

app.whenReady().then(() => {createWindow
  let menu = Menu.buildFromTemplate(
    [
      {
        label: app.name,
        submenu: [
          {
            role: 'quit',
            label: `${app.name}`
          }
        ]
      }
    ]);
  Menu.setApplicationMenu(menu);
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

ipcMain.handle('getKeyboardKeys', async () => {
    return Key
});

ipcMain.handle('pressKey', async (event, data) => {
  await keyboard.pressKey(Key.Space);
});

ipcMain.handle('releaseKey', async (event, data) => {
 await keyboard.releaseKey(Key.Space);
});

ipcMain.on('REQUEST_SOURCES', () => {
  getSource(win);
});

const chunks: Buffer[] = [];

ipcMain.on("stream-chunk-received", (event, chunk) => {
  const bufferData = Buffer.from(chunk);
  chunks.push(bufferData);
});

ipcMain.on("recording-stopped", async (event) => {
  const fs = require("fs");
  const { dialog, BrowserWindow } = require('electron');
  const win = BrowserWindow.getFocusedWindow();

  try {
    const result = await dialog.showSaveDialog(win, {
      title: "Save Recorded File",
      defaultPath: `recording-${Date.now()}.webm`,
      buttonLabel: "Save",
      filters: [{ name: "WebM Files", extensions: ["webm"] }],
    });

    if (!result.canceled && result.filePath) {
      const filePath = result.filePath;
      const bufferData = Buffer.concat(chunks);

      fs.writeFile(filePath, bufferData, (err) => {
        if (err) {
          console.error("Error saving recording:", err);
          event.sender.send("file-selection-error", err.message || "An error occurred during file selection.");
        } else {
          console.log("Recording saved successfully");
          event.sender.send("file-selection-success", filePath);
        }
      });
    } else {
      event.sender.send("file-selection-cancelled");
    }
  } catch (error) {
    console.error("Error during file selection:", error);
    event.sender.send("file-selection-error", error.message || "An error occurred during file selection.");
  }
});

ipcMain.on('openAlternativeWindow', () => {
  createAlternativeWindow();
  win.close();
});
