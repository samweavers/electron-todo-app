// renderer.js
let tasks = []

async function init() {
  try {
    tasks = (await window.electronAPI.loadTasks()) || []
    updateTaskList()
  } catch (error) {
    console.error('Failed to load tasks:', error)
  }
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed
  window.electronAPI.saveTasks(tasks) // Save after toggling
  updateTaskList()
}

function updateTaskList() {
  const taskList = document.getElementById('taskList')
  taskList.innerHTML = ''
  tasks.forEach((task, index) => {
    // initialize elements
    const div = document.createElement('div')
    const titleEl = document.createElement('span')
    const descEl = document.createElement('span')
    const taskComplete = document.createElement('button')
    const taskDelete = document.createElement('button')

    // text contents
    titleEl.textContent = task.text
    descEl.textContent = task.description
    taskComplete.textContent = 'Complete'
    taskDelete.textContent = 'Remove'

    // classes
    div.classList.add('todo-item')
    titleEl.classList.add('todo-title')
    descEl.classList.add('todo-desc')
    taskComplete.classList.add('btn', 'todo-btn-complete')
    taskDelete.classList.add('btn', 'todo-btn-delete')

    if (task.completed) div.classList.add('completed')
    taskComplete.onclick = () => toggleTask(index)
    taskDelete.onclick = () => removeTask(index)

    div.appendChild(titleEl)
    div.appendChild(descEl)
    div.appendChild(taskComplete)
    div.appendChild(taskDelete)
    taskList.appendChild(div)
  })
}

function addTask() {
  const titleInput = document.getElementById('taskTitleInput')
  const descInput = document.getElementById('taskDescInput')
  const taskTitle = titleInput.value.trim()
  const taskDesc = descInput.value.trim()

  if (taskTitle) {
    tasks.push({ text: taskTitle, description: taskDesc, completed: false })
    titleInput.value = ''
    descInput.value = ''
    window.electronAPI.saveTasks(tasks) // Save after adding
    updateTaskList()
  }
}
function removeTask(index) {
  tasks.splice(index, 1)
  window.electronAPI.saveTasks(tasks) // Save after adding
  updateTaskList()
}

// function removeTask(taskTitleToRemove) {
//   // Find the index of the task with the given title
//   const index = tasks.findIndex((task) => task.text === taskTitleToRemove)

//   if (index !== -1) {
//     tasks.splice(index, 1) // Remove the task from the array
//     window.electronAPI.saveTasks(tasks) // Save updated tasks
//     updateTaskList() // Refresh the UI
//   }
// }

// Run init when DOM is ready
window.addEventListener('DOMContentLoaded', init)
