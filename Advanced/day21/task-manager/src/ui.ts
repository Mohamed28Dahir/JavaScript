import { Task, TaskFormData, Priority, TaskFilterOptions, TaskSortOptions } from './types';
import { store } from './store';
import { taskService, taskFormService, eventService } from './services';

// UI Component Base Class
abstract class Component {
    protected element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
        this.init();
    }

    protected abstract init(): void;
    protected abstract render(): void;
}

// Task List Component
export class TaskListComponent extends Component {
    private tasks: Task[] = [];
    private filterOptions: TaskFilterOptions = {};
    private sortOptions: TaskSortOptions = { field: 'dueDate', direction: 'asc' };

    protected init(): void {
        store.subscribe(() => this.render());
        this.loadTasks();
    }

    private async loadTasks(): Promise<void> {
        try {
            this.tasks = await taskService.getTasks();
            this.render();
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    }

    setFilter(options: TaskFilterOptions): void {
        this.filterOptions = options;
        this.render();
    }

    setSort(options: TaskSortOptions): void {
        this.sortOptions = options;
        this.render();
    }

    protected render(): void {
        const filteredTasks = this.filterTasks(this.tasks, this.filterOptions);
        const sortedTasks = this.sortTasks(filteredTasks, this.sortOptions);

        this.element.innerHTML = `
            <div class="task-list">
                ${sortedTasks
                    .map(
                        (task) => `
                    <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                        <input type="checkbox" ${task.completed ? 'checked' : ''}>
                        <div class="task-content">
                            <h3>${task.title}</h3>
                            <p>${task.description}</p>
                            <div class="task-meta">
                                <span class="priority ${task.priority.toLowerCase()}">${
                            task.priority
                        }</span>
                                <span class="due-date">${task.dueDate.toLocaleDateString()}</span>
                                <div class="tags">
                                    ${task.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                        <button class="delete-btn">Delete</button>
                    </div>
                `
                    )
                    .join('')}
            </div>
        `;

        this.attachEventListeners();
    }

    private attachEventListeners(): void {
        this.element.querySelectorAll('.task-item').forEach((taskElement) => {
            const id = taskElement.getAttribute('data-id')!;
            const checkbox = taskElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
            const deleteBtn = taskElement.querySelector('.delete-btn') as HTMLButtonElement;

            checkbox.addEventListener('change', () => this.toggleTask(id));
            deleteBtn.addEventListener('click', () => this.deleteTask(id));
        });
    }

    private async toggleTask(id: string): Promise<void> {
        const task = this.tasks.find((t) => t.id === id);
        if (task) {
            const updatedTask = { ...task, completed: !task.completed };
            await taskService.updateTask(updatedTask);
            this.loadTasks();
        }
    }

    private async deleteTask(id: string): Promise<void> {
        await taskService.deleteTask(id);
        this.loadTasks();
    }

    private filterTasks(tasks: Task[], options: TaskFilterOptions): Task[] {
        return tasks.filter((task) => {
            if (options.completed !== undefined && task.completed !== options.completed) {
                return false;
            }
            if (options.priority && task.priority !== options.priority) {
                return false;
            }
            if (options.tags?.length && !options.tags.some((tag) => task.tags.includes(tag))) {
                return false;
            }
            return true;
        });
    }

    private sortTasks(tasks: Task[], options: TaskSortOptions): Task[] {
        return [...tasks].sort((a, b) => {
            const aValue = a[options.field];
            const bValue = b[options.field];
            const modifier = options.direction === 'asc' ? 1 : -1;
            return aValue < bValue ? -modifier : modifier;
        });
    }
}

// Task Form Component
export class TaskFormComponent extends Component {
    private formData: TaskFormData = {
        title: '',
        description: '',
        priority: Priority.Medium,
        dueDate: new Date(),
        tags: []
    };

    protected init(): void {
        this.render();
    }

    protected render(): void {
        this.element.innerHTML = `
            <form class="task-form">
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" id="title" value="${this.formData.title}" required>
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" required>${this.formData.description}</textarea>
                </div>
                <div class="form-group">
                    <label for="priority">Priority</label>
                    <select id="priority">
                        ${Object.values(Priority)
                            .map(
                                (p) => `
                            <option value="${p}" ${this.formData.priority === p ? 'selected' : ''}>
                                ${p}
                            </option>
                        `
                            )
                            .join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="dueDate">Due Date</label>
                    <input type="date" id="dueDate" value="${this.formatDate(
                        this.formData.dueDate
                    )}" required>
                </div>
                <div class="form-group">
                    <label for="tags">Tags (comma-separated)</label>
                    <input type="text" id="tags" value="${this.formData.tags.join(', ')}">
                </div>
                <button type="submit">Add Task</button>
            </form>
        `;

        this.attachEventListeners();
    }

    private attachEventListeners(): void {
        const form = this.element.querySelector('form') as HTMLFormElement;
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    private async handleSubmit(e: Event): Promise<void> {
        e.preventDefault();
        const form = e.target as HTMLFormElement;

        this.formData = {
            title: (form.querySelector('#title') as HTMLInputElement).value,
            description: (form.querySelector('#description') as HTMLTextAreaElement).value,
            priority: (form.querySelector('#priority') as HTMLSelectElement).value as Priority,
            dueDate: new Date((form.querySelector('#dueDate') as HTMLInputElement).value),
            tags: (form.querySelector('#tags') as HTMLInputElement).value
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean)
        };

        const errors = taskFormService.validateForm(this.formData);
        if (Object.values(errors).some(Boolean)) {
            this.showErrors(errors);
            return;
        }

        try {
            const task = await taskService.addTask(taskFormService.createTaskFromForm(this.formData));
            eventService.emit('task:add', task);
            form.reset();
            this.formData = {
                title: '',
                description: '',
                priority: Priority.Medium,
                dueDate: new Date(),
                tags: []
            };
            this.render();
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    }

    private showErrors(errors: Record<string, string | null>): void {
        Object.entries(errors).forEach(([field, error]) => {
            if (error) {
                const input = this.element.querySelector(`#${field}`) as HTMLElement;
                input.classList.add('error');
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = error;
                input.parentElement?.appendChild(errorElement);
            }
        });
    }

    private formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }
}

// Initialize UI
export function initializeUI(): void {
    const taskListElement = document.getElementById('taskList') as HTMLElement;
    const taskFormElement = document.getElementById('taskForm') as HTMLElement;

    new TaskListComponent(taskListElement);
    new TaskFormComponent(taskFormElement);
} 