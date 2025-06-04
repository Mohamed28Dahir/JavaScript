class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        
        // DOM Elements
        this.form = document.getElementById('todoForm');
        this.titleInput = document.getElementById('todoTitle');
        this.dueDateInput = document.getElementById('todoDueDate');
        this.priorityInput = document.getElementById('todoPriority');
        this.todoList = document.getElementById('todoList');
        this.titleError = document.getElementById('titleError');
        this.dateError = document.getElementById('dateError');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        
        // Bind methods
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTodoClick = this.handleTodoClick.bind(this);
        this.handleFilterClick = this.handleFilterClick.bind(this);
        
        // Initialize
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.render();
    }
    
    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', this.handleSubmit);
        
        // Event delegation for todo list
        this.todoList.addEventListener('click', this.handleTodoClick);
        
        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', this.handleFilterClick);
        });
        
        // Input validation
        this.titleInput.addEventListener('input', () => this.validateTitle());
        this.dueDateInput.addEventListener('input', () => this.validateDate());
    }
    
    validateTitle() {
        const title = this.titleInput.value.trim();
        if (title.length < 3) {
            this.titleError.textContent = 'Title must be at least 3 characters long';
            return false;
        }
        this.titleError.textContent = '';
        return true;
    }
    
    validateDate() {
        if (this.dueDateInput.value) {
            const selectedDate = new Date(this.dueDateInput.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                this.dateError.textContent = 'Due date cannot be in the past';
                return false;
            }
        }
        this.dateError.textContent = '';
        return true;
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateTitle() || !this.validateDate()) {
            return;
        }
        
        const todo = new Todo(
            this.titleInput.value.trim(),
            this.dueDateInput.value,
            this.priorityInput.value
        );
        
        this.todos.push(todo);
        this.saveToLocalStorage();
        this.render();
        
        // Reset form
        this.form.reset();
    }
    
    handleTodoClick(e) {
        const todoItem = e.target.closest('.todo-item');
        if (!todoItem) return;
        
        const todoId = todoItem.dataset.id;
        const todo = this.todos.find(t => t.id === todoId);
        
        if (e.target.classList.contains('todo-checkbox')) {
            todo.toggleComplete();
        } else if (e.target.classList.contains('delete-btn')) {
            this.todos = this.todos.filter(t => t.id !== todoId);
        }
        
        this.saveToLocalStorage();
        this.render();
    }
    
    handleFilterClick(e) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.render();
    }
    
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }
    
    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item priority-${todo.priority}${todo.completed ? ' completed' : ''}`;
        li.dataset.id = todo.id;
        
        const date = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No due date';
        
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <div class="todo-content">
                <div class="todo-title">${todo.title}</div>
                <div class="todo-details">
                    Due: ${date} | Priority: ${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                </div>
            </div>
            <div class="todo-actions">
                <button class="delete-btn">Delete</button>
            </div>
        `;
        
        return li;
    }
    
    render() {
        const filteredTodos = this.getFilteredTodos();
        this.todoList.innerHTML = '';
        
        filteredTodos.forEach(todo => {
            this.todoList.appendChild(this.createTodoElement(todo));
        });
        
        // Update stats
        document.getElementById('totalTodos').textContent = `Total: ${this.todos.length}`;
        document.getElementById('completedTodos').textContent = 
            `Completed: ${this.todos.filter(todo => todo.completed).length}`;
    }
    
    saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
    
    loadFromLocalStorage() {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            this.todos = JSON.parse(savedTodos).map(todo => Todo.fromJSON(todo));
        }
    }
}

// Initialize the app
const app = new TodoApp(); 