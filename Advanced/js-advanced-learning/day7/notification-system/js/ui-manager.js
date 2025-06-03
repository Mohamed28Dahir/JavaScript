export class UIManager {
    constructor(notificationManager) {
        this.notificationManager = notificationManager;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Add subscriber form
        document.querySelector('button[onclick="notificationSystem.addSubscriber()"]')
            .addEventListener('click', (e) => {
                e.preventDefault();
                this.handleAddSubscriber();
            });

        // Send notification form
        document.querySelector('button[onclick="notificationSystem.sendNotification()"]')
            .addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSendNotification();
            });
    }

    handleAddSubscriber() {
        const type = document.getElementById('subscriber-type').value;
        const contact = document.getElementById('subscriber-contact').value;

        if (!contact) {
            this.showNotification('Contact information is required', 'error');
            return;
        }

        const result = this.notificationManager.addSubscriber(type, contact);

        if (result.success) {
            this.showNotification(`${type} subscriber added successfully`, 'success');
            document.getElementById('subscriber-contact').value = '';
            this.updateSubscribersList();
        } else {
            this.showNotification(result.error, 'error');
        }
    }

    handleSendNotification() {
        const type = document.getElementById('notification-type').value;
        const message = document.getElementById('notification-message').value;

        if (!message) {
            this.showNotification('Message is required', 'error');
            return;
        }

        const result = this.notificationManager.notify(message, type);

        if (result.success) {
            this.showNotification('Notification sent successfully', 'success');
            document.getElementById('notification-message').value = '';
        } else {
            this.showNotification(result.error, 'error');
        }
    }

    updateSubscribersList() {
        const subscribers = this.notificationManager.getSubscribers();
        const subscribersList = document.getElementById('subscribers-list');
        
        subscribersList.innerHTML = subscribers.map(subscriber => `
            <div class="subscriber-item" data-id="${subscriber.id}">
                <span>${subscriber.type} - ${subscriber.contact}</span>
                <button class="remove-subscriber" onclick="notificationSystem.removeSubscriber('${subscriber.id}')">
                    Remove
                </button>
            </div>
        `).join('');

        // Add event listeners for remove buttons
        subscribersList.querySelectorAll('.remove-subscriber').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const subscriberId = e.target.parentElement.dataset.id;
                this.handleRemoveSubscriber(subscriberId);
            });
        });
    }

    handleRemoveSubscriber(subscriberId) {
        const result = this.notificationManager.removeSubscriber(subscriberId);
        
        if (result.success) {
            this.showNotification('Subscriber removed successfully', 'success');
            this.updateSubscribersList();
        } else {
            this.showNotification(result.message, 'error');
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications-container');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="close-btn" onclick="this.parentElement.remove()">&times;</button>
        `;
        
        container.appendChild(notification);

        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
} 