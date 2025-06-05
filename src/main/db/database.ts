import sqlite3 from 'sqlite3'
import path from 'path'
import { app } from 'electron'
import type { ProjectFolder } from '../../types'

const dbPath = path.join(app.getPath('userData'), 'projects.db')

class Database {
  static db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Database connection error:', err)
    else console.info('SQLite database connected:', dbPath)
  })

  static async init() {
    return new Promise<void>((resolve, reject) => {
      this.db.exec(
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
        },
      )
    })
  }

  static addProjectFolder(path: string) {
    return new Promise<void>((resolve, reject) => {
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

  static removeProjectFolder(id: number) {
    return new Promise<void>((resolve, reject) => {
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

  static getProjectFolders() {
    return new Promise<ProjectFolder[]>((resolve, reject) => {
      this.db.all('SELECT * FROM folders', (err, rows: ProjectFolder[]) => {
        if (err) {
          console.error('Query error:', err)
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }

  static updateProgramPath(path: string) {
    return new Promise<void>((resolve, reject) => {
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

  static getProgramPath() {
    return new Promise<string | null>((resolve, reject) => {
      this.db.get('SELECT path FROM programs WHERE id = 1', (err, row: { path: string }) => {
        if (err) {
          console.error('Query error:', err)
          reject(null)
        } else {
          resolve(row ? row.path : null)
        }
      })
    })
  }
}

export default Database
