const path = require('path')
const { spawn } = require('child_process')
const db = require('../db/database.cjs')

const PS_SCRIPT_PATH = path.resolve(__dirname, '../..', 'scripts/findProjects.ps1')

function findProjects(directories = []) {
  return new Promise((resolve, reject) => {
    const ps = spawn(
      'powershell.exe',
      ['-ExecutionPolicy', 'Bypass', '-Command', PS_SCRIPT_PATH, directories.join(',')],
      {
        encoding: 'utf-8',
      }
    )
    let output = ''

    ps.stdout.on('data', (data) => {
      console.log(data)
      output += data.toString()
    })

    ps.stderr.on('data', (data) => {
      console.error(`An error occured while trying to find projects:`, data.toString())
    })

    ps.on('close', () => {
      try {
        console.log('output', output)
        const projectPaths = JSON.parse(output)
        resolve(projectPaths)
      } catch (e) {
        console.error('An error occured while trying to find projects:', e)
        reject([])
      }
    })
  })
}

class ProjectsHandler {
  _projects = []

  static async scan() {
    const folders = await db.getProjectFolders()
    const folderPaths = folders.map((item) => `"${item.path}"`)
    ProjectsHandler._projects = await findProjects(folderPaths)
  }

  static get projects() {
    return ProjectsHandler._projects
  }
}

module.exports = ProjectsHandler
