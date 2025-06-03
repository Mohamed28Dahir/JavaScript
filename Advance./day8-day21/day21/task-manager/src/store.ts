import { TaskState, TaskAction, Task, Priority, TaskFilterOptions, TaskSortOptions } from './types';

// Initial state
const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null
};

// Reducer
export function taskReducer(state: TaskState = initialState, action: TaskAction): TaskState {
    switch (action.type) {
        case 'ADD_TASK':
            return {
                ...state,
                tasks: [...state.tasks, action.payload]
            };
        case 'UPDATE_TASK':
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.payload.id ? action.payload : task
                )
            };
        case 'DELETE_TASK':
            return {
                ...state,
                tasks: state.tasks.filter((task) => task.id !== action.payload)
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
}

// Selectors
export const selectTasks = (state: TaskState): Task[] => state.tasks;
export const selectLoading = (state: TaskState): boolean => state.loading;
export const selectError = (state: TaskState): string | null => state.error;

// Filter functions
export const filterTasks = (tasks: Task[], options: TaskFilterOptions): Task[] => {
    return tasks.filter((task) => {
        if (options.completed !== undefined && task.completed !== options.completed) {
            return false;
        }
        if (options.priority && task.priority !== options.priority) {
            return false;
        }
        if (options.tags && options.tags.length > 0) {
            if (!options.tags.some((tag) => task.tags.includes(tag))) {
                return false;
            }
        }
        if (options.startDate && task.dueDate < options.startDate) {
            return false;
        }
        if (options.endDate && task.dueDate > options.endDate) {
            return false;
        }
        return true;
    });
};

// Sort function
export const sortTasks = (tasks: Task[], options: TaskSortOptions): Task[] => {
    return [...tasks].sort((a, b) => {
        const aValue = a[options.field];
        const bValue = b[options.field];
        
        if (aValue < bValue) {
            return options.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return options.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
};

// Statistics functions
export const calculateTaskStats = (tasks: Task[]): {
    total: number;
    completed: number;
    overdue: number;
    byPriority: Record<Priority, number>;
} => {
    const now = new Date();
    
    return {
        total: tasks.length,
        completed: tasks.filter((task) => task.completed).length,
        overdue: tasks.filter((task) => !task.completed && task.dueDate < now).length,
        byPriority: tasks.reduce(
            (acc, task) => ({
                ...acc,
                [task.priority]: (acc[task.priority] || 0) + 1
            }),
            {} as Record<Priority, number>
        )
    };
};

// Store creation
export function createStore(reducer: typeof taskReducer) {
    let state = initialState;
    let listeners: (() => void)[] = [];
    
    return {
        getState: (): TaskState => state,
        
        dispatch: (action: TaskAction): void => {
            state = reducer(state, action);
            listeners.forEach((listener) => listener());
        },
        
        subscribe: (listener: () => void): (() => void) => {
            listeners.push(listener);
            return () => {
                listeners = listeners.filter((l) => l !== listener);
            };
        }
    };
}

// Create and export store instance
export const store = createStore(taskReducer); 