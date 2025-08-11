// preload.js
const { contextBridge, shell } = require('electron')
const fs = require('fs').promises // Use promises for async operations
const path = require('path')

const dataPath = path.join(__dirname, 'tasks.json')

async function saveTasks(tasks) {
  try {
    await fs.writeFile(dataPath, JSON.stringify(tasks, null, 2))
  } catch (error) {
    console.error('Error saving tasks:', error)
    throw error
  }
}

async function loadTasks() {
  try {
    const exists = await fs
      .access(dataPath)
      .then(() => true)
      .catch(() => false)
    if (!exists) return []
    const data = await fs.readFile(dataPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading tasks:', error)
    return []
  }
}

contextBridge.exposeInMainWorld('electronAPI', {
  saveTasks,
  loadTasks,
  openExternal: (url) => shell.openExternal(url)
})

console.log('Preload script loaded')
