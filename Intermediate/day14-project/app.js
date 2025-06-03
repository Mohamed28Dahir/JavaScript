class TodoApp {
    constructor() {
        this.todoManager = new TodoManager();
        
        // DOM Elements
        this.form = document.getElementById('todoForm');
        this.todoList = document.getElementById('todoList');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.sortSelect = document.getElementById('sortBy');
        
        // Form inputs
        this.titleInput = document.getElementById('todoTitle');
        this.descriptionInput = document.getElementById('todoDescription');
        this.dueDateInput = document.getElementById('todoDueDate');
        this.priorityInput = document.getElementById('todoPriority');
        
        // Error elements
        this.titleError = document.getElementById('titleError');
        this.dateError = document.getElementById('dateError');
        
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Event delegation for todo list
        this.todoList.addEventListener('click', (e) => {
            const todoItem = e.target.closest('.todo-item');
            if (!todoItem) return;

            const todoId = todoItem.dataset.id;

            if (e.target.classList.contains('todo-checkbox')) {
                this.todoManager.toggleTodo(todoId);
                this.render();
            } else if (e.target.classList.contains('delete-btn')) {
                this.todoManager.deleteTodo(todoId);
                this.render();
            } else if (e.target.classList.contains('edit-btn')) {
                this.handleEdit(todoId);
            }
        });

        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.todoManager.setFilter(btn.dataset.filter);
                this.render();
            });
        });

        // Sort selection
        this.sortSelect.addEventListener('change', () => {
            this.todoManager.setSort(this.sortSelect.value);
            this.render();
        });

        // Real-time validation
        this.titleInput.addEventListener('input', () => this.validateTitle());
        this.dueDateInput.addEventListener('input', () => this.validateDueDate());
    }

    validateTitle() {
        const title = this.titleInput.value.trim();
        const isValid = Todo.validateTitle(title);
        
        if (!isValid) {
            this.titleError.textContent = 'Title must be at least 3 characters long';
            return false;
        }
        
        this.titleError.textContent = '';
        return true;
    }

    validateDueDate() {
        const dueDate = this.dueDateInput.value;
        const isValid = Todo.validateDueDate(dueDate);
        
        if (!isValid) {
            this.dateError.textContent = 'Due date cannot be in the past';
            return false;
        }
        
        this.dateError.textContent = '';
        return true;
    }

    handleSubmit() {
        if (!this.validateTitle() || !this.validateDueDate()) {
            return;
        }

        const todoData = {
            title: this.titleInput.value.trim(),
            description: this.descriptionInput.value.trim(),
            dueDate: this.dueDateInput.value || null,
            priority: this.priorityInput.value
        };

        this.todoManager.addTodo(todoData);
        this.form.reset();
        this.render();
    }

    handleEdit(todoId) {
        const todo = this.todoManager.todos.find(t => t.id === todoId);
        if (!todo) return;

        const newTitle = prompt('Edit todo title:', todo.title);
        if (newTitle && Todo.validateTitle(newTitle)) {
            this.todoManager.updateTodo(todoId, { title: newTitle });
            this.render();
        }
    }

    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item priority-${todo.priority}${todo.completed ? ' completed' : ''}`;
        li.dataset.id = todo.id;

        const date = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No due date';
        const isOverdue = todo.isOverdue();

        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <div class="todo-content">
                <div class="todo-title">${todo.title}</div>
                ${todo.description ? `<div class="todo-description">${todo.description}</div>` : ''}
                <div class="todo-meta">
                    <span>Due: ${date}</span>
                    <span>Priority: ${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}</span>
                    ${isOverdue ? '<span class="overdue">Overdue!</span>' : ''}
                </div>
            </div>
            <div class="todo-actions">
                <button class="btn edit-btn">Edit</button>
                <button class="btn delete-btn">Delete</button>
            </div>
        `;

        return li;
    }

    updateStats() {
        const stats = this.todoManager.getStats();
        document.getElementById('totalTodos').textContent = `Total: ${stats.total}`;
        document.getElementById('completedTodos').textContent = `Completed: ${stats.completed}`;
    }

    render() {
        const todos = this.todoManager.getFilteredAndSortedTodos();
        this.todoList.innerHTML = '';
        
        todos.forEach(todo => {
            this.todoList.appendChild(this.createTodoElement(todo));
        });
        
        this.updateStats();
    }
}

// Initialize the app
const app = new TodoApp(); 