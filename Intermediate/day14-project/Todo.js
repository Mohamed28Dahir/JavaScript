class Todo {
    constructor(title, description = '', dueDate = null, priority = 'low') {
        this.id = Date.now().toString();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
        this.createdAt = new Date();
        this.modifiedAt = new Date();
    }

    toggleComplete() {
        this.completed = !this.completed;
        this.modifiedAt = new Date();
    }

    update(data) {
        const allowedFields = ['title', 'description', 'dueDate', 'priority'];
        for (const [key, value] of Object.entries(data)) {
            if (allowedFields.includes(key)) {
                this[key] = value;
            }
        }
        this.modifiedAt = new Date();
    }

    isOverdue() {
        if (!this.dueDate || this.completed) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(this.dueDate);
        return dueDate < today;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority,
            completed: this.completed,
            createdAt: this.createdAt.toISOString(),
            modifiedAt: this.modifiedAt.toISOString()
        };
    }

    static fromJSON(data) {
        const todo = new Todo(
            data.title,
            data.description,
            data.dueDate,
            data.priority
        );
        todo.id = data.id;
        todo.completed = data.completed;
        todo.createdAt = new Date(data.createdAt);
        todo.modifiedAt = new Date(data.modifiedAt);
        return todo;
    }

    static validateTitle(title) {
        return title.trim().length >= 3;
    }

    static validateDueDate(dueDate) {
        if (!dueDate) return true;
        const selectedDate = new Date(dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    }
} 