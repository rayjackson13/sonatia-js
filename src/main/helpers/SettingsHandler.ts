import { spawn } from 'child_process'
import db from '../db/database'

import script from '../../../resources/findProgram.ps1?asset&asarUnpack'

const PROGRAM_NAME = 'ableton'

function findProgram(): Promise<string> {
  return new Promise((resolve) => {
    const args = ['-ExecutionPolicy', 'Bypass', '-File', script, PROGRAM_NAME]
    const ps = spawn('powershell.exe', args)

    let output = ''

    ps.stdout.on('data', (data) => {
      output += data.toString()
    })

    ps.stderr.on('data', (data) => {
      console.error(`An error occured while trying to find ${PROGRAM_NAME}:`, data.toString())
    })

    ps.on('close', () => {
      resolve(output.trim())
    })
  })
}

export class SettingsHandler {
  static _programPath = ''
  static _folders = []

  static async initialize() {
    const savedPath = await db.getProgramPath()

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
