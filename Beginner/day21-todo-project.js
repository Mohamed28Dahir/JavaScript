// Day 21: Todo List Project
// =======================

// Todo List Application that combines everything we've learned

class TodoApp {
    constructor() {
        // Initialize properties
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.todoForm = document.getElementById('todoForm');
        this.todoInput = document.getElementById('todoInput');
        this.todoList = document.getElementById('todoList');
        
        // Bind event handlers
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTodoClick = this.handleTodoClick.bind(this);
        this.handleTodoDelete = this.handleTodoDelete.bind(this);
        
        // Initialize the application
        this.initialize();
    }
    
    // Initialize the application
    initialize() {
        // Add event listeners
        this.todoForm.addEventListener('submit', this.handleSubmit);
        this.todoList.addEventListener('click', this.handleTodoClick);
        
        // Render existing todos
        this.renderTodos();
        
        // Add input validation
        this.addInputValidation();
    }
    
    // Handle form submission
    handleSubmit(event) {
        event.preventDefault();
        
        const todoText = this.todoInput.value.trim();
        
        if (todoText) {
            // Add new todo
            this.addTodo(todoText);
            
            // Clear input
            this.todoInput.value = '';
            
            // Show success message
            this.showMessage('Todo added successfully!', 'success');
        }
    }
    
    // Add new todo
    addTodo(text) {
        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toLocaleString()
        };
        
        // Add to array
        this.todos.unshift(todo);
        
        // Save to localStorage
        this.saveTodos();
        
        // Render single todo
        this.renderTodo(todo);
    }
    
    // Handle todo item click
    handleTodoClick(event) {
        const todoItem = event.target.closest('.todo-item');
        if (!todoItem) return;
        
        const id = parseInt(todoItem.dataset.id);
        
        // Handle delete button click
        if (event.target.classList.contains('delete-btn')) {
            this.handleTodoDelete(id);
            return;
        }
        
        // Toggle todo completion
        this.toggleTodo(id);
    }
    
    // Handle todo deletion
    handleTodoDelete(id) {
        // Remove todo from array
        this.todos = this.todos.filter(todo => todo.id !== id);
        
        // Save to localStorage
        this.saveTodos();
        
        // Remove from DOM
        const todoItem = this.todoList.querySelector(`[data-id="${id}"]`);
        if (todoItem) {
            todoItem.remove();
            this.showMessage('Todo deleted successfully!', 'success');
        }
    }
    
    // Toggle todo completion status
    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            
            // Update DOM
            const todoItem = this.todoList.querySelector(`[data-id="${id}"]`);
            if (todoItem) {
                todoItem.classList.toggle('completed');
                this.showMessage(
                    todo.completed ? 'Todo completed!' : 'Todo uncompleted!',
                    'success'
                );
            }
            
            // Save to localStorage
            this.saveTodos();
        }
    }
    
    // Render all todos
    renderTodos() {
        this.todoList.innerHTML = '';
        this.todos.forEach(todo => this.renderTodo(todo));
    }
    
    // Render single todo
    renderTodo(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;
        
        li.innerHTML = `
            <span class="todo-text">${todo.text}</span>
            <div class="todo-actions">
                <small class="todo-date">${todo.createdAt}</small>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        
        // Add to list
        this.todoList.insertBefore(li, this.todoList.firstChild);
        
        // Add animation
        requestAnimationFrame(() => li.style.opacity = '1');
    }
    
    // Save todos to localStorage
    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
    
    // Add input validation
    addInputValidation() {
        this.todoInput.addEventListener('input', () => {
            const value = this.todoInput.value.trim();
            
            if (value.length < 3) {
                this.todoInput.classList.add('error');
                this.todoInput.classList.remove('success');
            } else {
                this.todoInput.classList.add('success');
                this.todoInput.classList.remove('error');
            }
        });
    }
    
    // Show message
    showMessage(text, type) {
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        // Add to DOM
        document.getElementById('todoApp').insertBefore(message, this.todoForm);
        
        // Remove after 3 seconds
        setTimeout(() => message.remove(), 3000);
    }
}

// Initialize Todo App
const todoApp = new TodoApp();

// Add custom styles
const style = document.createElement('style');
style.textContent = `
    .todo-item {
        opacity: 0;
        transition: all 0.3s ease;
    }
    .todo-actions {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .todo-date {
        color: #666;
    }
    .delete-btn {
        background-color: #ff4444;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
    }
    .delete-btn:hover {
        background-color: #cc0000;
    }
    .message {
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
    }
    .message.success {
        background-color: #dff0d8;
        color: #3c763d;
        border: 1px solid #d6e9c6;
    }
    .message.error {
        background-color: #f2dede;
        color: #a94442;
        border: 1px solid #ebccd1;
    }
    #todoInput.error {
        border-color: #ff4444;
    }
    #todoInput.success {
        border-color: #00C851;
    }
`;
document.head.appendChild(style);

// That's it for Day 21! This project demonstrates:
// 1. DOM manipulation
// 2. Event handling
// 3. Local storage
// 4. Form validation
// 5. CSS styling and animations
// 6. Object-oriented programming
// 7. Error handling and user feedback 