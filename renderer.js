// renderer.js

let tasks = []

window.addEventListener('DOMContentLoaded', init)

document.addEventListener('click', (event) => {
  const target = event.target.closest('a[href]')
  if (target && target.href.startsWith('http')) {
    event.preventDefault()
    window.electronAPI.openExternal(target.href)
  }
})

async function init() {
  try {
    tasks = (await window.electronAPI.loadTasks()) || []
    updateTaskList()
  } catch (error) {
    console.error('Failed to load tasks:', error)
  }
}

function updateTaskList() {
  const taskList = document.getElementById('taskList')
  taskList.innerHTML = ''

  tasks.forEach((task, index) => {
    // Elements
    const section = document.createElement('section')
    const titleEl = document.createElement('span')
    const descEl = document.createElement('span')
    const linkEl = document.createElement('a')
    const addedDateEl = document.createElement('p')
    const completedDateEl = document.createElement('p')
    const taskComplete = document.createElement('button')
    const taskDelete = document.createElement('button')
    const controlBtns = document.createElement('div')
    const todoDates = document.createElement('div')
    const taskControls = document.createElement('div')

    // Content
    titleEl.textContent = task.title
    descEl.textContent = task.description || 'Add details'
    linkEl.innerHTML = `<img src="bc-icon.png" >`
    addedDateEl.textContent = new Date(task.addedDate).toLocaleString()
    completedDateEl.textContent = new Date(task.completedDate).toLocaleString()
    taskComplete.textContent = 'Complete'
    taskDelete.textContent = 'Remove'

    // Classes
    section.classList.add('todo-item')
    titleEl.classList.add('todo-title')
    descEl.classList.add('todo-desc')
    linkEl.classList.add('todo-link')
    taskComplete.classList.add('btn', 'todo-btn-complete')
    addedDateEl.classList.add('added-date')
    completedDateEl.classList.add('completed-date')
    taskDelete.classList.add('btn', 'todo-btn-delete')
    controlBtns.classList.add('todo-control-buttons')
    todoDates.classList.add('todo-dates')
    taskControls.classList.add('todo-controls')

    // Attributes
    titleEl.contentEditable = 'true'
    descEl.contentEditable = 'true'
    linkEl.href = task.link

    // Save edits
    titleEl.addEventListener('blur', () => {
      tasks[index].title = titleEl.textContent.trim()
      window.electronAPI.saveTasks(tasks)
    })

    descEl.addEventListener('blur', () => {
      tasks[index].description = descEl.textContent.trim()
      window.electronAPI.saveTasks(tasks)
    })

    todoDates.appendChild(addedDateEl)

    // Completion handling
    if (task.completed) {
      section.classList.add('completed')
      taskComplete.textContent = 'Re-open'
      todoDates.appendChild(completedDateEl)
    }

    // Button events
    taskComplete.onclick = () => toggleTask(index)
    taskDelete.onclick = () => removeTask(index)

    // Append controls
    if (task.link) {
      controlBtns.appendChild(linkEl)
    }
    controlBtns.appendChild(taskComplete)
    controlBtns.appendChild(taskDelete)
    taskControls.appendChild(todoDates)
    taskControls.appendChild(controlBtns)

    // Final DOM assembly
    section.appendChild(titleEl)
    section.appendChild(descEl)
    section.appendChild(taskControls)
    taskList.appendChild(section)
  })
}

function addTask() {
  const titleInput = document.getElementById('taskTitleInput')
  const descInput = document.getElementById('taskDescInput')
  const linkInput = document.getElementById('taskLinkInput')
  const taskTitle = titleInput.value.trim()
  const taskDesc = descInput.value.trim()
  const taskLink = linkInput.value.trim() 

  if (taskTitle) {
    tasks.push({
      title: taskTitle,
      description: taskDesc,
      link: taskLink,
      addedDate: new Date().toLocaleString(),
      completed: false
    })
    titleInput.value = ''
    descInput.value = ''
    linkInput.value = ''
    window.electronAPI.saveTasks(tasks)
    updateTaskList()
  }
}

function removeTask(index) {
  tasks.splice(index, 1)
  window.electronAPI.saveTasks(tasks)
  updateTaskList()
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed
  if (tasks[index].completed) {
    tasks[index].completedDate = new Date().toISOString()
  } else {
    delete tasks[index].completedDate
  }
  window.electronAPI.saveTasks(tasks)
  updateTaskList()
}
