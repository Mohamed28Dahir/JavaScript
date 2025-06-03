// Task Types
export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: Priority;
    dueDate: Date;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

export enum Priority {
    Low = 'LOW',
    Medium = 'MEDIUM',
    High = 'HIGH'
}

// Store Types
export interface TaskState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
}

export type TaskAction =
    | { type: 'ADD_TASK'; payload: Task }
    | { type: 'UPDATE_TASK'; payload: Task }
    | { type: 'DELETE_TASK'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'CLEAR_ERROR' };

// Service Types
export interface TaskService {
    getTasks(): Promise<Task[]>;
    addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>;
    updateTask(task: Task): Promise<Task>;
    deleteTask(id: string): Promise<void>;
}

// UI Types
export interface TaskFormData {
    title: string;
    description: string;
    priority: Priority;
    dueDate: Date;
    tags: string[];
}

export interface TaskFilterOptions {
    completed?: boolean;
    priority?: Priority;
    tags?: string[];
    startDate?: Date;
    endDate?: Date;
}

export interface TaskSortOptions {
    field: keyof Task;
    direction: 'asc' | 'desc';
}

// Event Types
export interface TaskEventMap {
    'task:add': Task;
    'task:update': Task;
    'task:delete': string;
    'task:complete': string;
    'task:error': string;
}

export type TaskEventHandler<K extends keyof TaskEventMap> = (event: TaskEventMap[K]) => void;

// Utility Types
export type TaskFields = keyof Task;
export type TaskValidation = Partial<Record<TaskFields, string>>;
export type TaskStats = {
    total: number;
    completed: number;
    overdue: number;
    byPriority: Record<Priority, number>;
    byTag: Record<string, number>;
}; 