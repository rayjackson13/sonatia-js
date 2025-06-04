const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron')
const { exec, spawn } = require('child_process')
const path = require('path')

const ProjectsHandler = require('./helpers/ProjectsHandler.cjs')
const SettingsHandler = require('./helpers/SettingsHandler.cjs')
const runProgram = require('./utils/runProgram.cjs')
const db = require('./db/database.cjs')

const viteProcess = exec('yarn vite')

let mainWindow

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
  await db.init()
  await Promise.all([SettingsHandler.initialize(), ProjectsHandler.initialize('D:\\Music')])
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
  return new Promise((resolve) => db.getProjectFolders(resolve))
})

ipcMain.handle('getProjects', async () => {
  return ProjectsHandler.projects
})

ipcMain.handle('selectProgram', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Executable Files', extensions: ['exe'] }],
  })

  const location = result.filePaths[0] || null

  if (location) {
    db.updateProgramPath(location)
    SettingsHandler.programPath = location
  }

  return location
})

ipcMain.handle('addProjectFolder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  })

  const location = result.filePaths[0] || null

  if (location) {
    await db.addProjectFolder(location)
  }
})

ipcMain.handle('removeProjectFolder', async (event, id) => {
  await db.removeProjectFolder(id)
})

ipcMain.handle('newSession', runProgram)

ipcMain.handle('addExistingProject', async () => {
  const file = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Ableton Projects', extensions: ['als'] }],
  })

  const location = file.filePaths[0] || null
  if (!location) return

  const directory = path.dirname(location)
  db.addProjectFolder(directory)
  // TODO: rescan project files

  runProgram([location])
})
