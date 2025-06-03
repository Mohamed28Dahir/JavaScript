class TodoManager {
    constructor() {
        this.STORAGE_KEY = 'todos_v1';
        this.todos = [];
        this.currentFilter = 'all';
        this.currentSort = 'date';
        this.loadFromStorage();
    }

    addTodo(todoData) {
        const todo = new Todo(
            todoData.title,
            todoData.description,
            todoData.dueDate,
            todoData.priority
        );
        this.todos.unshift(todo);
        this.saveToStorage();
        return todo;
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveToStorage();
    }

    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.toggleComplete();
            this.saveToStorage();
        }
    }

    updateTodo(id, data) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.update(data);
            this.saveToStorage();
        }
    }

    getFilteredAndSortedTodos() {
        let filteredTodos = this.todos;

        // Apply filter
        switch (this.currentFilter) {
            case 'active':
                filteredTodos = filteredTodos.filter(todo => !todo.completed);
                break;
            case 'completed':
                filteredTodos = filteredTodos.filter(todo => todo.completed);
                break;
        }

        // Apply sort
        switch (this.currentSort) {
            case 'date':
                filteredTodos.sort((a, b) => {
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                });
                break;
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                filteredTodos.sort((a, b) => 
                    priorityOrder[a.priority] - priorityOrder[b.priority]
                );
                break;
            case 'title':
                filteredTodos.sort((a, b) => 
                    a.title.localeCompare(b.title)
                );
                break;
        }

        return filteredTodos;
    }

    setFilter(filter) {
        this.currentFilter = filter;
    }

    setSort(sort) {
        this.currentSort = sort;
    }

    getStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const active = total - completed;
        const overdue = this.todos.filter(todo => todo.isOverdue()).length;

        return { total, completed, active, overdue };
    }

    saveToStorage() {
        try {
            const data = this.todos.map(todo => todo.toJSON());
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                const todoData = JSON.parse(data);
                this.todos = todoData.map(item => Todo.fromJSON(item));
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            this.todos = [];
        }
    }

    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveToStorage();
    }
} 