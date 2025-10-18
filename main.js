const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Tick",
    // icon: path.join(__dirname, 'assets', 'icon.png'), // <-- taskbar icon
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false // Add this
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(createWindow)
