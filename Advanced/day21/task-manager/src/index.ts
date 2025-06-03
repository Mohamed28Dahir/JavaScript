import './styles.css';
import { initializeUI } from './ui';
import { store } from './store';
import { eventService } from './services';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI components
    initializeUI();

    // Set up event listeners for filters and sorting
    setupFilterListeners();
    setupSortListeners();

    // Subscribe to task events
    setupEventSubscriptions();
});

function setupFilterListeners(): void {
    const showCompletedCheckbox = document.getElementById('showCompleted') as HTMLInputElement;
    const priorityFilter = document.getElementById('priorityFilter') as HTMLSelectElement;

    showCompletedCheckbox.addEventListener('change', () => {
        store.dispatch({
            type: 'SET_FILTER',
            payload: { completed: showCompletedCheckbox.checked }
        });
    });

    priorityFilter.addEventListener('change', () => {
        store.dispatch({
            type: 'SET_FILTER',
            payload: { priority: priorityFilter.value || undefined }
        });
    });
}

function setupSortListeners(): void {
    const sortField = document.getElementById('sortField') as HTMLSelectElement;
    const sortDirection = document.getElementById('sortDirection') as HTMLSelectElement;

    const updateSort = () => {
        store.dispatch({
            type: 'SET_SORT',
            payload: {
                field: sortField.value as keyof Task,
                direction: sortDirection.value as 'asc' | 'desc'
            }
        });
    };

    sortField.addEventListener('change', updateSort);
    sortDirection.addEventListener('change', updateSort);
}

function setupEventSubscriptions(): void {
    // Subscribe to task events
    eventService.on('task:add', (task) => {
        store.dispatch({ type: 'ADD_TASK', payload: task });
    });

    eventService.on('task:update', (task) => {
        store.dispatch({ type: 'UPDATE_TASK', payload: task });
    });

    eventService.on('task:delete', (taskId) => {
        store.dispatch({ type: 'DELETE_TASK', payload: taskId });
    });

    eventService.on('task:error', (error) => {
        store.dispatch({ type: 'SET_ERROR', payload: error });
        // Show error notification
        showNotification(error, 'error');
    });
}

function showNotification(message: string, type: 'success' | 'error'): void {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}