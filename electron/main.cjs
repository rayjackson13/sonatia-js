const { app, BrowserWindow, ipcMain } = require('electron')
const { exec } = require('child_process')
const path = require('path')

const ProjectsHandler = require('./helpers/ProjectsHandler.cjs')
const SettingsHandler = require('./helpers/SettingsHandler.cjs')
const Database = require('./db/database.cjs')

const viteProcess = exec('yarn vite')

let mainWindow
const db = new Database()

function handleDevTools() {
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' || (input.control && input.shift && input.key === 'I')) {
      mainWindow.webContents.openDevTools()
    }
  })
}

function initializeWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    frame: true,
    transparent: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2C2C2C',
      symbolColor: '#FFFFFF',
      height: 40,
    },
    backgroundColor: '#2C2C2C',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
    },
  })

  handleDevTools()

  mainWindow.loadURL('http://localhost:5173/')
}

async function loadData() {
  await Promise.allSettled([SettingsHandler.initialize(), ProjectsHandler.initialize('D:\\Music')])
}

app.whenReady().then(async () => {
  await loadData()

  initializeWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  viteProcess.kill()
})

ipcMain.handle('getProgramLocation', async () => {
  return SettingsHandler.programPath
})

ipcMain.handle('getProjectFolders', async () => {
  return new Promise(resolve => db.getProjectFolders(resolve))
})

ipcMain.handle('getProjects', async () => {
  return ProjectsHandler.projects
})
