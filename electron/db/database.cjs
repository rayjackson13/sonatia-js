const sqlite3 = require('sqlite3')
const path = require('path')
const { app } = require('electron')

const dbPath = path.join(app.getPath('userData'), 'projects.db')

class Database {
  static db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Database connection error:', err)
    else console.log('SQLite database connected:', dbPath)
  })

  static async init() {
    return new Promise((resolve, reject) => {
      this.db.run(
        `
          CREATE TABLE IF NOT EXISTS folders (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              path TEXT UNIQUE NOT NULL
          );
          CREATE TABLE IF NOT EXISTS programs (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              path TEXT UNIQUE NOT NULL
          );
        `,
        (err) => {
          if (err) reject(err)
          else resolve()
        }
      )
    })
  }

  static addProjectFolder(path) {
    return new Promise((resolve, reject) => {
      this.db.run('INSERT OR IGNORE INTO folders (path) VALUES (?)', [path], (err) => {
        if (err) {
          console.error('Insert error:', err)
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  static removeProjectFolder(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM folders WHERE id = ?', [id], (err) => {
        if (err) {
          console.error('Delete error:', err)
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  static getProjectFolders(callback) {
    this.db.all('SELECT * FROM folders', (err, rows) => {
      if (err) console.error('Query error:', err)
      else callback(rows)
    })
  }

  static updateProgramPath(path) {
    return new Promise((resolve, reject) => {
      this.db.run('REPLACE INTO programs (id, path) VALUES (?, ?)', [1, path], (err) => {
        if (err) {
          console.error('Insert error:', err)
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  static getProgramPath(callback) {
    this.db.get('SELECT path FROM programs WHERE id = 1', (err, row) => {
      if (err) {
        console.error('Query error:', err)
        callback(null)
      } else {
        callback(row ? row.path : null)
      }
    })
  }
}

module.exports = Database
