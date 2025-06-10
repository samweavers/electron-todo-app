const { contextBridge } = require('electron')
const fs = require('fs').promises
const path = require('path')

contextBridge.exposeInMainWorld('electronAPI', {
  saveTasks: async (tasks) => {
    const filePath = path.join(__dirname, 'tasks.json')
    await fs.writeFile(filePath, JSON.stringify(tasks, null, 2))
  },
  loadTasks: async () => {
    const filePath = path.join(__dirname, 'tasks.json')
    try {
      const date = await fs.readFile(filePath, utf8)
      return JSON.parse(date)
    } catch (error) {
      return []
    }
  }
})
