const path = require('path')
const { spawn } = require('child_process')

const PS_SCRIPT_PATH = path.resolve(__dirname, '../..', 'scripts/findProgram.ps1')

function findProgram(programName) {
  return new Promise((resolve, reject) => {
    const ps = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', PS_SCRIPT_PATH, programName], {
      encoding: 'utf-8',
    })

    let output = ''

    ps.stdout.on('data', (data) => (output += data.toString()))
    ps.stderr.on('data', (data) =>
      console.error(`An error occured while trying to find ${programName}:`, data.toString())
    )
    ps.on('close', () => resolve(output.trim()))
  })
}

module.exports = findProgram
