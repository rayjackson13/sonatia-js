const sqlite3 = require('sqlite3')
const path = require('path')
const { app } = require('electron')

const dbPath = path.join(app.getPath('userData'), 'projects.db')

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) console.error('❌ Database connection error:', err)
      else console.log('✅ SQLite database connected:', dbPath)
    })

    this.init()
  }

  init() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS folders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          path TEXT UNIQUE NOT NULL
      )
    `)

    this.addProjectFolder('D:\\Music')
  }

  addProjectFolder(path) {
    this.db.run('INSERT INTO folders (path) VALUES (?)', [path], (err) => err && console.error('❌ Insert error:', err))
  }

  getProjectFolders(callback) {
    this.db.all('SELECT * FROM folders', (err, rows) => {
      if (err) console.error('❌ Query error:', err)
      else callback(rows)
    })
  }
}

module.exports = Database
