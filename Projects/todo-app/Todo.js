class Todo {
    constructor(title, dueDate, priority) {
        this.id = Date.now().toString();
        this.title = title;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
        this.createdAt = new Date();
    }

    toggleComplete() {
        this.completed = !this.completed;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            dueDate: this.dueDate,
            priority: this.priority,
            completed: this.completed,
            createdAt: this.createdAt
        };
    }

    static fromJSON(data) {
        const todo = new Todo(data.title, data.dueDate, data.priority);
        todo.id = data.id;
        todo.completed = data.completed;
        todo.createdAt = new Date(data.createdAt);
        return todo;
    }
} 