let tasks = []

function addTask() {
  const titleInput = document.getElementById('taskTitleInput')
  const descInput = document.getElementById('taskDescInput')
  const taskTitle = titleInput.value.trim()
  const taskDesc = descInput.value.trim()
  if (taskTitle) {
    tasks.push({ text: taskTitle, description: taskDesc, completed: false })
    titleInput.value = ''
    descInput.value = ''
    updateTaskList()
  }
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed
  updateTaskList()
}

function updateTaskList() {
  const taskList = document.getElementById('taskList')
  taskList.innerHTML = ''
  tasks.forEach((task, index) => {
    const div = document.createElement('div')
    const titleEl = document.createElement('span')
    const descEl = document.createElement('span')

    titleEl.textContent = task.text
    descEl.textContent = task.description

    div.classList.add('todo-item')
    titleEl.classList.add('todo-title')
    descEl.classList.add('todo-desc')

    div.appendChild(titleEl)
    div.appendChild(descEl)

    if (task.completed) div.classList.add('completed')
    div.onclick = () => toggleTask(index)
    taskList.appendChild(div)
  })
}
