import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import path from 'path'

import { ProjectsHandler } from './helpers/ProjectsHandler'
import { SettingsHandler } from './helpers/SettingsHandler'
import { runProgram } from './utils/runProgram'
import db from './db/database'

let mainWindow: BrowserWindow

function handleDevTools() {
  mainWindow.webContents.on('before-input-event', (_, input) => {
    if (input.key === 'F12' || (input.control && input.shift && input.key === 'I')) {
      mainWindow.webContents.openDevTools()
    }
  })
}

async function loadData() {
  SettingsHandler.initialize()
  ProjectsHandler.initialize(mainWindow)
}

async function initializeWindow() {
  await db.init()
  db.getTables()

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
    minWidth: 500,
    minHeight: 700,
    backgroundColor: '#2C2C2C',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.mjs'),
      sandbox: false,
    },
  })

  await loadData()
  handleDevTools()

  mainWindow.loadURL('http://localhost:5173/')
}

app.whenReady().then(initializeWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('getProgramLocation', async () => {
  return SettingsHandler.programPath
})

ipcMain.handle('getProjectFolders', async () => {
  return await db.getProjectFolders()
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

ipcMain.handle('removeProjectFolder', async (_, id) => {
  await db.removeProjectFolder(id)
})

ipcMain.handle('newSession', () => runProgram())

ipcMain.handle('addExistingProject', async () => {
  const file = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Ableton Projects', extensions: ['als'] }],
  })

  const location = file.filePaths[0] || null
  if (!location) return

  const directory = path.dirname(location)
  db.addProjectFolder(directory)
  ProjectsHandler.scan()

  runProgram([location])
})

ipcMain.handle('openProject', async (_, path) => {
  runProgram([path])
})

ipcMain.handle('rescanProjects', async () => {
  await ProjectsHandler.scan()
  return ProjectsHandler.projects
})
