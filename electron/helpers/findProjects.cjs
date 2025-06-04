const path = require('path')
const { spawn } = require('child_process')

const PS_SCRIPT_PATH = path.resolve(__dirname, '../..', 'scripts/findProjects.ps1')

function findProjects(directories) {
  return new Promise((resolve, reject) => {
    const ps = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', PS_SCRIPT_PATH, directories], {
      encoding: 'utf-8',
    })
    let output = ''

    ps.stdout.on('data', (data) => (output += data.toString()))
    ps.stderr.on('data', (data) => console.error(`An error occured while trying to find projects:`, data.toString()))
    ps.on('close', () => {
      try {
        const projectPaths = JSON.parse(output)
        resolve(projectPaths)
      } catch (e) {
        console.error('An error occured while trying to find projects:', e)
        reject()
      }
    })
  })
}

module.exports = findProjects
