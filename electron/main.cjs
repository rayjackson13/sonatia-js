const { app, BrowserWindow } = require('electron')
const path = require('path')

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  mainWindow.loadURL('http://localhost:5173/')
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
