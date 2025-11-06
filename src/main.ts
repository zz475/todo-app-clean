import './style.css'

interface Todo {
  id: number
  text: string
  completed: boolean
}

let todos: Todo[] = []

const todoInput = document.querySelector('.todo-input') as HTMLInputElement
const todoForm = document.querySelector('.todo-form') as HTMLFormElement
const todoList = document.querySelector('.todo-list') as HTMLUListElement

// Function to add a new todo
const addTodo = (text: string): void => {
  const newTodo: Todo = {
    id: Date.now(),
    text,
    completed: false
  }
  todos.push(newTodo)
  renderTodos()
}

// Handle form submission
todoForm.addEventListener('submit', (event: Event): void => {
  event.preventDefault()
  const text = todoInput.value.trim()

  if (text !== '') {
    addTodo(text)
    todoInput.value = ''
  }
})

// Function to display todos
const renderTodos = (): void => {
  todoList.innerHTML = ''

  todos.forEach((todo) => {
    const li = document.createElement('li')
    li.className = 'todo-item'

    li.innerHTML = `
      <input type="checkbox" ${todo.completed ? 'checked' : ''}>
      <span style="text-decoration:${todo.completed ? 'line-through' : 'none'};">
        ${todo.text}
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
}

// Function to remove a todo
const removeTodo = (id: number): void => {
  todos = todos.filter((todo) => todo.id !== id)
  renderTodos()
}

// Initial render
renderTodos()

