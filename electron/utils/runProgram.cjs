const { spawn } = require('child_process')
const SettingsHandler = require('../helpers/SettingsHandler.cjs')
const ProjectsHandler = require('../helpers/ProjectsHandler.cjs')

function runProgram(args = []) {
  const runtime = spawn(`${SettingsHandler.programPath}`, args, {
    detached: true,
    stdio: 'ignore',
  })

  runtime.unref()

  runtime.on('close', (code) => {
    ProjectsHandler.scan()
    console.info(`Ableton process exited with code ${code}`)
  })
}

module.exports = runProgram
