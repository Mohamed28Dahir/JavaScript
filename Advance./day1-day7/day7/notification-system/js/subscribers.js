// Subscriber Factory and Classes
export class SubscriberFactory {
    createSubscriber(type, contact) {
        switch(type.toLowerCase()) {
            case 'email':
                return new EmailSubscriber(contact);
            case 'sms':
                return new SMSSubscriber(contact);
            case 'slack':
                return new SlackSubscriber(contact);
            default:
                throw new Error(`Unsupported subscriber type: ${type}`);
        }
    }
}

class BaseSubscriber {
    constructor(contact) {
        this.contact = contact;
        this.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    notify(message, type) {
        throw new Error('notify method must be implemented by subclasses');
    }

    getDisplayInfo() {
        return {
            id: this.id,
            contact: this.contact,
            type: this.constructor.name.replace('Subscriber', '')
        };
    }
}

class EmailSubscriber extends BaseSubscriber {
    notify(message, type) {
        console.log(`📧 Sending ${type} email to ${this.contact}: ${message}`);
        return {
            success: true,
            method: 'email',
            recipient: this.contact,
            message: message
        };
    }
}

class SMSSubscriber extends BaseSubscriber {
    notify(message, type) {
        console.log(`📱 Sending ${type} SMS to ${this.contact}: ${message}`);
        return {
            success: true,
            method: 'sms',
            recipient: this.contact,
            message: message
        };
    }
}

class SlackSubscriber extends BaseSubscriber {
    notify(message, type) {
        console.log(`💬 Sending ${type} Slack message to ${this.contact}: ${message}`);
        return {
            success: true,
            method: 'slack',
            recipient: this.contact,
            message: message
        };
    }
} 