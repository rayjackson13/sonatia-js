import path from 'path'
import { spawn } from 'child_process'
import db from '../db/database'
import type { BrowserWindow } from 'electron'
import type { Project } from '../../src/constants/types'

const PS_SCRIPT_PATH = path.resolve(__dirname, '../..', 'scripts/findProjects.ps1')

function findProjects(directories: string[] = []) {
  return new Promise<Project[]>((resolve, reject) => {
    const args = ['-ExecutionPolicy', 'Bypass', '-Command', PS_SCRIPT_PATH, directories.join(',')]
    const ps = spawn('powershell.exe', args)
    let output = ''

    ps.stdout.on('data', (data) => {
      output += data.toString()
    })

    ps.stderr.on('data', (data) => {
      console.error(`An error occured while trying to find projects:`, data.toString())
    })

    ps.on('close', () => {
      try {
        const projectPaths = JSON.parse(output)
        resolve(projectPaths)
      } catch (e) {
        console.error('An error occured while trying to find projects:', e)
        reject([])
      }
    })
  })
}

export class ProjectsHandler {
  static _projects: Project[] = []
  static mainWindow: BrowserWindow

  static async initialize(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
    this.scan()
  }

  static async scan() {
    const folders = await db.getProjectFolders()
    const folderPaths = folders.map((item) => `"${item.path}"`)
    ProjectsHandler._projects = await findProjects(folderPaths)
    this.mainWindow.webContents.send('projectsUpdated', this.projects)
  }

  static get projects() {
    return ProjectsHandler._projects
  }
}
