import { Task, TaskService, TaskFormData, Priority } from './types';

// Local Storage Service
class LocalStorageService {
    private readonly storageKey: string;

    constructor(key: string) {
        this.storageKey = key;
    }

    getData<T>(): T | null {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }

    setData<T>(data: T): void {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    removeData(): void {
        localStorage.removeItem(this.storageKey);
    }
}

// Task Service Implementation
export class TaskServiceImpl implements TaskService {
    private storage: LocalStorageService;
    private tasks: Task[];

    constructor() {
        this.storage = new LocalStorageService('tasks');
        this.tasks = this.storage.getData<Task[]>() || [];
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    private saveTasks(): void {
        this.storage.setData(this.tasks);
    }

    async getTasks(): Promise<Task[]> {
        return Promise.resolve([...this.tasks]);
    }

    async addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
        const now = new Date();
        const task: Task = {
            ...taskData,
            id: this.generateId(),
            createdAt: now,
            updatedAt: now
        };

        this.tasks.push(task);
        this.saveTasks();

        return Promise.resolve(task);
    }

    async updateTask(task: Task): Promise<Task> {
        const index = this.tasks.findIndex((t) => t.id === task.id);
        if (index === -1) {
            throw new Error('Task not found');
        }

        const updatedTask: Task = {
            ...task,
            updatedAt: new Date()
        };

        this.tasks[index] = updatedTask;
        this.saveTasks();

        return Promise.resolve(updatedTask);
    }

    async deleteTask(id: string): Promise<void> {
        const index = this.tasks.findIndex((task) => task.id === id);
        if (index === -1) {
            throw new Error('Task not found');
        }

        this.tasks.splice(index, 1);
        this.saveTasks();

        return Promise.resolve();
    }
}

// Task Form Service
export class TaskFormService {
    validateForm(data: TaskFormData): Record<keyof TaskFormData, string | null> {
        const errors: Record<keyof TaskFormData, string | null> = {
            title: null,
            description: null,
            priority: null,
            dueDate: null,
            tags: null
        };

        if (!data.title.trim()) {
            errors.title = 'Title is required';
        }

        if (!data.description.trim()) {
            errors.description = 'Description is required';
        }

        if (!Object.values(Priority).includes(data.priority)) {
            errors.priority = 'Invalid priority';
        }

        if (!data.dueDate) {
            errors.dueDate = 'Due date is required';
        } else if (data.dueDate < new Date()) {
            errors.dueDate = 'Due date cannot be in the past';
        }

        if (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== 'string')) {
            errors.tags = 'Tags must be an array of strings';
        }

        return errors;
    }

    createTaskFromForm(data: TaskFormData): Omit<Task, 'id' | 'createdAt' | 'updatedAt'> {
        return {
            ...data,
            completed: false
        };
    }
}

// Event Service
export class EventService {
    private listeners: Map<string, Set<(data: unknown) => void>>;

    constructor() {
        this.listeners = new Map();
    }

    on<T>(event: string, handler: (data: T) => void): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)?.add(handler as (data: unknown) => void);
    }

    off<T>(event: string, handler: (data: T) => void): void {
        this.listeners.get(event)?.delete(handler as (data: unknown) => void);
    }

    emit<T>(event: string, data: T): void {
        this.listeners.get(event)?.forEach((handler) => handler(data));
    }
}

// Export service instances
export const taskService = new TaskServiceImpl();
export const taskFormService = new TaskFormService();
export const eventService = new EventService();