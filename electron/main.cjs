const { app, BrowserWindow, ipcMain } = require('electron')
const { exec } = require('child_process')
const path = require('path')

const viteProcess = exec('yarn vite')

let mainWindow

const handleDevTools = () => {
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' || (input.control && input.shift && input.key === 'I')) {
      mainWindow.webContents.openDevTools()
    }
  })
}

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    frame: true,
    transparent: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2C2C2C',
      symbolColor: '#FFFFFF',
      height: 48,
    },
    backgroundColor: '#2C2C2C',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
    },
  })

  handleDevTools()

  mainWindow.loadURL('http://localhost:5173/')
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  viteProcess.kill()
})
