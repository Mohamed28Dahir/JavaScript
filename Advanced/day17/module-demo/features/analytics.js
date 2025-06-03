// Analytics feature module
class Analytics {
    constructor() {
        this.events = [];
    }
    
    initialize() {
        console.log('Initializing analytics...');
        this.setupTracking();
    }
    
    setupTracking() {
        window.addEventListener('click', this.trackEvent.bind(this));
        console.log('Analytics tracking enabled');
    }
    
    trackEvent(event) {
        const eventData = {
            type: event.type,
            target: event.target.tagName,
            timestamp: Date.now()
        };
        
        this.events.push(eventData);
        console.log('Event tracked:', eventData);
    }
    
    getEvents() {
        return [...this.events];
    }
}

export const analytics = new Analytics();
export const initialize = () => analytics.initialize(); 