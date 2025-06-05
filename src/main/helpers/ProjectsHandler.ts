import { spawn } from 'child_process'
import db from '../db/database'
import type { BrowserWindow } from 'electron'
import type { Project } from '../../types'

import script from '../../../resources/findProjects.ps1?asset&asarUnpack'

function findProjects(directories: string[] = []): Promise<Project[]> {
  return new Promise<Project[]>((resolve, reject) => {
    if (!directories.length) {
      resolve([])
      return
    }

    const args = ['-ExecutionPolicy', 'Bypass', '-Command', script, directories.join(',')]
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
