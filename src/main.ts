import './style.css'

interface Todo {
  id: number
  text: string
  completed: boolean
  dueDate?: string
}

let todos: Todo[] = []

// DOM elements
const todoInput = document.querySelector('.todo-input') as HTMLInputElement
const todoDate = document.querySelector('.todo-date') as HTMLInputElement
const todoForm = document.querySelector('.todo-form') as HTMLFormElement
const todoList = document.querySelector('.todo-list') as HTMLUListElement
const totalCount = document.querySelector('#total-count') as HTMLElement
const completedCount = document.querySelector('#completed-count') as HTMLElement

// Function to add a new todo
const addTodo = (text: string, dueDate?: string): void => {
  const newTodo: Todo = {
    id: Date.now(),
    text,
    completed: false,
    dueDate
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

// Render todos with due-date color coding
const renderTodos = (): void => {
  todoList.innerHTML = ''

  todos.forEach((todo) => {
    const li = document.createElement('li')
    li.className = 'todo-item'

    // Determine color class based on due date
    let colorClass = ''
    if (todo.dueDate) {
      const today = new Date()
      const due = new Date(todo.dueDate)
      today.setHours(0, 0, 0, 0)
      due.setHours(0, 0, 0, 0)

      const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays < 0) {
        colorClass = 'overdue' // red
      } else if (diffDays === 0) {
        colorClass = 'today' // orange
      } else if (diffDays === 1) {
        colorClass = 'tomorrow' // green
      } else {
        colorClass = 'future' // light green
      }
    }

    li.innerHTML = `
      <input type="checkbox" ${todo.completed ? 'checked' : ''}>
      <span class="todo-text ${colorClass}" style="text-decoration:${todo.completed ? 'line-through' : 'none'};">
        ${todo.text} ${todo.dueDate ? `(Due: ${todo.dueDate})` : ''}
      </span>
      <button class="remove-btn">Remove</button>
    `

    // Checkbox functionality
    const checkbox = li.querySelector('input') as HTMLInputElement
    checkbox.addEventListener('change', () => {
      todo.completed = checkbox.checked
      renderTodos()
    })

    // Remove button
    const removeButton = li.querySelector('.remove-btn') as HTMLButtonElement
    removeButton.addEventListener('click', () => removeTodo(todo.id))

    todoList.appendChild(li)
  })

  updateTaskCounter()
}

// Remove a todo
const removeTodo = (id: number): void => {
  todos = todos.filter((todo) => todo.id !== id)
  renderTodos()
}

// Function to update the task counter
const updateTaskCounter = (): void => {
  const total = todos.length
  const completed = todos.filter((todo) => todo.completed).length

  totalCount.textContent = total.toString()
  completedCount.textContent = completed.toString()
}

// Initial render
renderTodos()
