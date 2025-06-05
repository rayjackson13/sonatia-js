import { spawn } from 'child_process'
import { SettingsHandler } from '../helpers/SettingsHandler'
import { ProjectsHandler } from '../helpers/ProjectsHandler'

export function runProgram(args: string[] = []) {
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
