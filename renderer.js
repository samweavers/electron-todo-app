let tasks = []

// Load tasks on startup
window.electronAPI.loadTasks().then((loadedTasks) => {
  tasks = loadedTasks
  updateTaskList()
})

function addTask() {
  const input = document.getElementById('taskInput')
  const taskText = input.value.trim()
  if (taskText) {
    tasks.push({ text: taskText, completed: false })
    input.value = ''
    updateTaskList()
    window.electronAPI.saveTasks(tasks)
  }
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed
  updateTaskList()
  window.electronAPI.saveTasks(tasks)
}

function updateTaskList() {
  const taskList = document.getElementById('taskList')
  taskList.innerHTML = ''
  tasks.forEach((task, index) => {
    const li = document.createElement('li')
    li.textContent = task.text
    if (task.completed) li.classList.add('completed')
    li.onclick = () => toggleTask(index)
    taskList.appendChild(li)
  })
}
