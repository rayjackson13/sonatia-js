import { app, ipcMain, dialog, BrowserWindow } from "electron";
import path from "path";
import { spawn } from "child_process";
import sqlite3 from "sqlite3";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
const dbPath = path.join(app.getPath("userData"), "projects.db");
class Database {
  static db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("Database connection error:", err);
    else console.log("SQLite database connected:", dbPath);
  });
  static async init() {
    return new Promise((resolve, reject) => {
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
          if (err) reject(err);
          else {
            console.log("init db");
            resolve();
          }
        }
      );
    });
  }
  static async getTables() {
    this.db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
      if (err) throw err;
      console.log(rows);
    });
  }
  static addProjectFolder(path2) {
    return new Promise((resolve, reject) => {
      this.db.run("INSERT OR IGNORE INTO folders (path) VALUES (?)", [path2], (err) => {
        if (err) {
          console.error("Insert error:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  static removeProjectFolder(id) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM folders WHERE id = ?", [id], (err) => {
        if (err) {
          console.error("Delete error:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  static getProjectFolders() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM folders", (err, rows) => {
        if (err) {
          console.error("Query error:", err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  static updateProgramPath(path2) {
    console.log("updateProgramPath");
    return new Promise((resolve, reject) => {
      this.db.run("REPLACE INTO programs (id, path) VALUES (?, ?)", [1, path2], (err) => {
        if (err) {
          console.error("Insert error:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  static getProgramPath() {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT path FROM programs WHERE id = 1", (err, row) => {
        if (err) {
          console.error("Query error:", err);
          reject(null);
        } else {
          console.log("getProgramPath");
          resolve(row ? row.path : null);
        }
      });
    });
  }
}
const PS_SCRIPT_PATH$1 = path.resolve(__dirname, "../..", "scripts/findProjects.ps1");
function findProjects(directories = []) {
  return new Promise((resolve, reject) => {
    const args = ["-ExecutionPolicy", "Bypass", "-Command", PS_SCRIPT_PATH$1, directories.join(",")];
    const ps = spawn("powershell.exe", args);
    let output = "";
    ps.stdout.on("data", (data) => {
      output += data.toString();
    });
    ps.stderr.on("data", (data) => {
      console.error(`An error occured while trying to find projects:`, data.toString());
    });
    ps.on("close", () => {
      try {
        const projectPaths = JSON.parse(output);
        resolve(projectPaths);
      } catch (e) {
        console.error("An error occured while trying to find projects:", e);
        reject([]);
      }
    });
  });
}
class ProjectsHandler {
  static _projects = [];
  static mainWindow;
  static async initialize(mainWindow2) {
    this.mainWindow = mainWindow2;
    this.scan();
  }
  static async scan() {
    const folders = await Database.getProjectFolders();
    const folderPaths = folders.map((item) => `"${item.path}"`);
    ProjectsHandler._projects = await findProjects(folderPaths);
    this.mainWindow.webContents.send("projectsUpdated", this.projects);
  }
  static get projects() {
    return ProjectsHandler._projects;
  }
}
const PROGRAM_NAME = "ableton";
const PS_SCRIPT_PATH = path.resolve(__dirname, "../..", "scripts/findProgram.ps1");
function findProgram() {
  return new Promise((resolve) => {
    const args = ["-ExecutionPolicy", "Bypass", "-File", PS_SCRIPT_PATH, PROGRAM_NAME];
    const ps = spawn("powershell.exe", args);
    let output = "";
    ps.stdout.on("data", (data) => {
      output += data.toString();
    });
    ps.stderr.on("data", (data) => {
      console.error(`An error occured while trying to find ${PROGRAM_NAME}:`, data.toString());
    });
    ps.on("close", () => {
      resolve(output.trim());
    });
  });
}
class SettingsHandler {
  static _programPath = "";
  static _folders = [];
  static async initialize() {
    const savedPath = await Database.getProgramPath();
    console.log("savedPath", savedPath);
    if (!savedPath) {
      const location = await findProgram();
      await Database.updateProgramPath(location);
      SettingsHandler._programPath = location;
      return;
    }
    SettingsHandler._programPath = savedPath;
  }
  static get programPath() {
    return SettingsHandler._programPath;
  }
  static set programPath(path2) {
    SettingsHandler._programPath = path2;
  }
}
function runProgram(args = []) {
  const runtime = spawn(`${SettingsHandler.programPath}`, args, {
    detached: true,
    stdio: "ignore"
  });
  runtime.unref();
  runtime.on("close", (code) => {
    ProjectsHandler.scan();
    console.info(`Ableton process exited with code ${code}`);
  });
}
let mainWindow;
function handleDevTools() {
  mainWindow.webContents.on("before-input-event", (_, input) => {
    if (input.key === "F12" || input.control && input.shift && input.key === "I") {
      mainWindow.webContents.openDevTools();
    }
  });
}
async function loadData() {
  SettingsHandler.initialize();
  ProjectsHandler.initialize(mainWindow);
}
async function initializeWindow() {
  await Database.init();
  Database.getTables();
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    frame: true,
    transparent: false,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#2C2C2C",
      symbolColor: "#FFFFFF",
      height: 40
    },
    minWidth: 500,
    minHeight: 700,
    backgroundColor: "#2C2C2C",
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.mjs"),
      sandbox: false
    }
  });
  await loadData();
  handleDevTools();
  mainWindow.loadURL("http://localhost:5173/");
}
app.whenReady().then(initializeWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
ipcMain.handle("getProgramLocation", async () => {
  return SettingsHandler.programPath;
});
ipcMain.handle("getProjectFolders", async () => {
  return await Database.getProjectFolders();
});
ipcMain.handle("getProjects", async () => {
  return ProjectsHandler.projects;
});
ipcMain.handle("selectProgram", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: [{ name: "Executable Files", extensions: ["exe"] }]
  });
  const location = result.filePaths[0] || null;
  if (location) {
    Database.updateProgramPath(location);
    SettingsHandler.programPath = location;
  }
  return location;
});
ipcMain.handle("addProjectFolder", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"]
  });
  const location = result.filePaths[0] || null;
  if (location) {
    await Database.addProjectFolder(location);
  }
});
ipcMain.handle("removeProjectFolder", async (_, id) => {
  await Database.removeProjectFolder(id);
});
ipcMain.handle("newSession", () => runProgram());
ipcMain.handle("addExistingProject", async () => {
  const file = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: [{ name: "Ableton Projects", extensions: ["als"] }]
  });
  const location = file.filePaths[0] || null;
  if (!location) return;
  const directory = path.dirname(location);
  Database.addProjectFolder(directory);
  ProjectsHandler.scan();
  runProgram([location]);
});
ipcMain.handle("openProject", async (_, path2) => {
  runProgram([path2]);
});
ipcMain.handle("rescanProjects", async () => {
  await ProjectsHandler.scan();
  return ProjectsHandler.projects;
});
