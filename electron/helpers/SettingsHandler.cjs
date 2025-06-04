const path = require('path')
const { spawn } = require('child_process')
const db = require('../db/database.cjs')

const PROGRAM_NAME = 'ableton'
const PS_SCRIPT_PATH = path.resolve(__dirname, '../..', 'scripts/findProgram.ps1')

function findProgram() {
  return new Promise((resolve) => {
    const ps = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', PS_SCRIPT_PATH, PROGRAM_NAME], {
      encoding: 'utf-8',
    })

    let output = ''

    ps.stdout.on('data', (data) => {
      output += data.toString()
    })

    ps.stderr.on('data', (data) => {
      console.error(`An error occured while trying to find ${programName}:`, data.toString())
    })

    ps.on('close', () => {
      resolve(output.trim())
    })
  })
}

class SettingsHandler {
  _programPath = ''
  _folders = []

  static async initialize() {
    const savedPath = await new Promise((resolve) => db.getProgramPath(resolve))

    if (!savedPath) {
      const location = await findProgram()
      await db.updateProgramPath(location)
      SettingsHandler._programPath = location
      return
    }

    SettingsHandler._programPath = savedPath
  }

  static get programPath() {
    return SettingsHandler._programPath
  }

  static set programPath(path) {
    SettingsHandler._programPath = path
  }
}

module.exports = SettingsHandler
