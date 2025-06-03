import { NotificationManager } from './notification-manager.js';
import { UIManager } from './ui-manager.js';

// Initialize the notification system
const notificationManager = new NotificationManager();
const uiManager = new UIManager(notificationManager);

// Make the notification system available globally
window.notificationSystem = {
    addSubscriber: () => uiManager.handleAddSubscriber(),
    sendNotification: () => uiManager.handleSendNotification(),
    removeSubscriber: (id) => uiManager.handleRemoveSubscriber(id)
};

// Add some example subscribers when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add example subscribers
    notificationManager.addSubscriber('email', 'john@example.com');
    notificationManager.addSubscriber('sms', '+1234567890');
    notificationManager.addSubscriber('slack', '#general');
    
    // Update the UI
    uiManager.updateSubscribersList();
    
    // Show welcome notification
    uiManager.showNotification('Notification System initialized successfully', 'info');
}); 