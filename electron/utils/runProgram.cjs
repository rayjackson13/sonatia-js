const { spawn } = require('child_process')
const SettingsHandler = require('../helpers/SettingsHandler.cjs')

function runProgram(args = []) {
  const runtime = spawn(`${SettingsHandler.programPath}`, args, {
    detached: true,
    stdio: 'ignore',
  })

  runtime.unref()

  runtime.on('close', (code) => {
    // TODO: rescan project files
    console.info(`Ableton process exited with code ${code}`)
  })
}

module.exports = runProgram
