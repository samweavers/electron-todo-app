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
    const section = document.createElement('section')
    const titleEl = document.createElement('span')
    const descEl = document.createElement('span')
    const taskComplete = document.createElement('button')
    const taskDelete = document.createElement('button')
    const controlBtns = document.createElement('div')

    // text contents
    titleEl.textContent = task.text
    descEl.textContent = task.description
    taskComplete.textContent = 'Complete'
    taskDelete.textContent = 'Remove'

    // classes
    section.classList.add('todo-item')
    titleEl.classList.add('todo-title')
    descEl.classList.add('todo-desc')
    taskComplete.classList.add('btn', 'todo-btn-complete')
    taskDelete.classList.add('btn', 'todo-btn-delete')
    controlBtns.classList.add('todo-control-buttons')

    // attributes
    titleEl.contentEditable = 'true'
    descEl.contentEditable = 'true'

    if (task.completed) section.classList.add('completed')
    taskComplete.onclick = () => toggleTask(index)
    taskDelete.onclick = () => removeTask(index)

    section.appendChild(titleEl)
    section.appendChild(descEl)
    section.appendChild(controlBtns)
    controlBtns.appendChild(taskComplete)
    controlBtns.appendChild(taskDelete)
    taskList.appendChild(section)
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

// Run init when DOM is ready
window.addEventListener('DOMContentLoaded', init)
