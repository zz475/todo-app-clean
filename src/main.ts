import './style.css'

interface Todo {
  id: number
  text: string
  completed: boolean
  dueDate?: string
}

let todos: Todo[] = []

// DOM Elements
const todoInput = document.querySelector('.todo-input') as HTMLInputElement
const todoDate = document.querySelector('.todo-date') as HTMLInputElement
const todoForm = document.querySelector('.todo-form') as HTMLFormElement
const todoList = document.querySelector('.todo-list') as HTMLUListElement
const totalTasks = document.getElementById('total-tasks') as HTMLElement
const completedTasks = document.getElementById('completed-tasks') as HTMLElement
const progressBar = document.querySelector('.progress-bar') as HTMLElement
const progressText = document.querySelector('.progress-text') as HTMLElement
const colorPicker = document.querySelector('#bg-color') as HTMLInputElement | null

//  Add a new todo
const addTodo = (text: string, dueDate?: string): void => {
  const newTodo: Todo = {
    id: Date.now(),
    text,
    completed: false,
    dueDate,
  }
  todos.push(newTodo)
  renderTodos()
}

// Handle form submission
todoForm.addEventListener('submit', (event: Event): void => {
  event.preventDefault()
  const text = todoInput.value.trim()
  const dueDate = todoDate.value

  if (text !== '') {
    addTodo(text, dueDate)
    todoInput.value = ''
    todoDate.value = ''
  }
})

//  Render todos with due-date color coding
const renderTodos = (): void => {
  todoList.innerHTML = ''

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  todos.forEach((todo) => {
    const li = document.createElement('li')
    li.className = 'todo-item'

    // Color-coding based on due date
    if (todo.dueDate) {
      const due = new Date(todo.dueDate)
      due.setHours(0, 0, 0, 0)
      const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays < 0) {
        li.style.backgroundColor = '#ffcccc' // 🔴 overdue
      } else if (diffDays === 0) {
        li.style.backgroundColor = '#ffeeba' // 🟠 due today
      } else if (diffDays === 1) {
        li.style.backgroundColor = '#d4edda' // 🟢 due tomorrow
      } else {
        li.style.backgroundColor = '#e2f0cb' // 💚 future
      }
    }

    li.innerHTML = `
      <input type="checkbox" ${todo.completed ? 'checked' : ''}>
      <span style="text-decoration:${todo.completed ? 'line-through' : 'none'};">
        ${todo.text} ${todo.dueDate ? `(Due: ${todo.dueDate})` : ''}
      </span>
      <button class="remove-btn">Remove</button>
    `

    const checkbox = li.querySelector('input') as HTMLInputElement
    checkbox.addEventListener('change', () => {
      todo.completed = checkbox.checked
      renderTodos()
    })

    const removeButton = li.querySelector('.remove-btn') as HTMLButtonElement
    removeButton.addEventListener('click', () => removeTodo(todo.id))

    todoList.appendChild(li)
  })

  updateProgress()
}

//  Remove a todo
const removeTodo = (id: number): void => {
  todos = todos.filter((todo) => todo.id !== id)
  renderTodos()
}

//  Update progress bar and counters
const updateProgress = (): void => {
  const total = todos.length
  const completed = todos.filter((t) => t.completed).length
  const percentage = total ? Math.round((completed / total) * 100) : 0

  totalTasks.textContent = total.toString()
  completedTasks.textContent = completed.toString()
  progressBar.style.width = `${percentage}%`
  progressText.textContent = `${percentage}%`

  // Dynamic color based on progress
  if (percentage < 50) {
    progressBar.style.backgroundColor = '#dc3545' // red
  } else if (percentage < 100) {
    progressBar.style.backgroundColor = '#ffc107' // yellow
  } else {
    progressBar.style.backgroundColor = '#28a745' // green
  }
}

// Handle background color change (changes full page)
if (colorPicker) {
  // Load saved color if exists
  const savedColor = localStorage.getItem('bgColor')
  if (savedColor) {
    document.body.style.backgroundColor = savedColor
    colorPicker.value = savedColor
  }

  colorPicker.addEventListener('input', () => {
    document.body.style.backgroundColor = colorPicker.value
    localStorage.setItem('bgColor', colorPicker.value) // saves choice
  })
}

//  Initial render
renderTodos()
