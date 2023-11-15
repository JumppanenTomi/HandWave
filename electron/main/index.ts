import { app, BrowserWindow, shell, ipcMain, Menu, dialog } from 'electron'
import { writeFile } from 'fs/promises'
import { release } from 'node:os'
import { join } from 'node:path'
import { update } from './update'
const { Key, keyboard } = require("@nut-tree/nut-js");

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
const indexHtml = join(process.env.DIST, 'index.html')

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

app.whenReady().then(createWindow)

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

ipcMain.handle('pressKey', async (event, data) => {
  await keyboard.pressKey(Key.Space);
});

ipcMain.handle('releaseKey', async (event, data) => {
 await keyboard.releaseKey(Key.Space);
});

ipcMain.on('REQUEST_SOURCES', () => {
  getSource(win);
});

ipcMain.on("stream-chunk-received", (event, chunk) => {
  // Handle received chunk data here
  // For example, save it to a file or perform processing

  // Saving to a file (example using Node.js fs module)
  const fs = require("fs");
  const filePaath = "recordedFile.webm";
  const { filePath } = dialog.showSaveDialog(win, {
    buttonLabel: "Save video",
    defaultPath: "recording-" + Date.now() + ".webm",
  })

  // Convert Uint8Array chunk to Buffer (assuming chunk is Uint8Array)
  const bufferData = Buffer.from(chunk);

  // Append chunk data to the file or save it as a new file
  fs.appendFile(filePath, bufferData, (err) => {
      if (err) {
          console.error("Error saving chunk:", err);
          // Handle error scenario
      } else {
          console.log("Chunk saved successfully");
          // Perform any necessary actions after saving the chunk
      }
  });
});

const { dialog } = require("electron");

ipcMain.on("recording-stopped", async (event) => {
    try {
        const result = await dialog.showSaveDialog({
            title: "Save Recorded File",
            defaultPath: "recordedFile.webm",
            buttonLabel: "Save",
            filters: [{ name: "WebM Files", extensions: ["webm"] }],
        });

        if (!result.canceled && result.filePath) {
            // File save path selected by the user
            const filePath = result.filePath;

            // Perform actions with the filePath, such as saving recorded data to this file
            // Example: Save recorded data to the selected file
            // Example: Move or process the recorded file as needed
            event.sender.send("file-selection-success", filePath);
        } else {
            event.sender.send("file-selection-cancelled");
        }
    } catch (error) {
        console.error("Error during file selection:", error);
        event.sender.send("file-selection-error", error.message || "An error occurred during file selection.");
    }
});




ipcMain.on("show-select-file", async () => {

	/**
	 * Open file selection dialog
	 */
	const { filePath } = await dialog.showSaveDialog(win, {
		buttonLabel: "Save video",
		defaultPath: "vid-" + Date.now() + ".webm",
	});

	if (filePath) {
		try {
			const buffer = Buffer.concat(win);

			/**
			 * Write file to disk, propably worth to show a save dialog if it worked
			 */
			await writeFile(filePath, buffer);

			await dialog.showMessageBox(win, {
				type: "info",
				buttons: ["Ok"],
				defaultId: 1,
				title: "Success",
				message: "Video has been saved under: " + filePath,
			});

			/**
			 * Clear the chunks after the file has been saved, thus a new video can be recorder
			 * without the data of the previous
			 */
			const mediaChunks = [];
		} catch (error) {
			/**
			 * The file could not be saved for various reasons
			 */
			console.log(error);
			await dialog.showMessageBox(win, {
				type: "error",
				buttons: ["Ok"],
				defaultId: 1,
				title: "Error",
				message: "Video could not been saved under: " + filePath,
				detail: e.message,
			});
		}
	} else {
		/**
		 * No file path has been selected
		 */
		await dialog.showMessageBox(win, {
			type: "error",
			buttons: ["Ok"],
			defaultId: 1,
			title: "Error",
			message: "No path to a file was provided",
		});
	}
});