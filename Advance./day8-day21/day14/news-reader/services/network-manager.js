// Network Manager Service
export class NetworkManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.pendingRequests = new Map();
        this.retryQueue = [];
        this.maxRetries = 3;
        this.retryDelay = 1000;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        window.addEventListener('online', () => this.handleNetworkChange(true));
        window.addEventListener('offline', () => this.handleNetworkChange(false));
    }
    
    handleNetworkChange(isOnline) {
        this.isOnline = isOnline;
        
        if (isOnline) {
            this.processRetryQueue();
        }
    }
    
    async fetchWithRetry(url, options = {}) {
        const requestId = this.generateRequestId(url, options);
        
        // Check if request is already pending
        if (this.pendingRequests.has(requestId)) {
            return this.pendingRequests.get(requestId);
        }
        
        const requestPromise = this.executeRequest(url, options);
        this.pendingRequests.set(requestId, requestPromise);
        
        try {
            const response = await requestPromise;
            this.pendingRequests.delete(requestId);
            return response;
        } catch (error) {
            this.pendingRequests.delete(requestId);
            throw error;
        }
    }
    
    async executeRequest(url, options, attempt = 1) {
        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return response;
        } catch (error) {
            if (attempt < this.maxRetries && this.shouldRetry(error)) {
                await this.delay(this.getRetryDelay(attempt));
                return this.executeRequest(url, options, attempt + 1);
            }
            
            if (!this.isOnline) {
                this.addToRetryQueue({ url, options });
            }
            
            throw error;
        }
    }
    
    async processRetryQueue() {
        if (!this.isOnline || this.retryQueue.length === 0) return;
        
        const requests = [...this.retryQueue];
        this.retryQueue = [];
        
        for (const request of requests) {
            try {
                await this.fetchWithRetry(request.url, request.options);
            } catch (error) {
                console.error('Retry failed:', error);
                // Add back to queue if it's a network error
                if (this.shouldRetry(error)) {
                    this.addToRetryQueue(request);
                }
            }
        }
    }
    
    addToRetryQueue(request) {
        if (!this.retryQueue.some(r => r.url === request.url)) {
            this.retryQueue.push(request);
        }
    }
    
    shouldRetry(error) {
        // Retry on network errors or 5xx server errors
        return (
            error.name === 'TypeError' || // Network error
            (error.response && error.response.status >= 500)
        );
    }
    
    getRetryDelay(attempt) {
        // Exponential backoff with jitter
        const baseDelay = this.retryDelay * Math.pow(2, attempt - 1);
        const jitter = Math.random() * 1000;
        return Math.min(baseDelay + jitter, 10000); // Cap at 10 seconds
    }
    
    generateRequestId(url, options) {
        // Create a unique ID for the request based on URL and options
        const key = `${options.method || 'GET'}-${url}-${JSON.stringify(options.body || '')}`;
        return btoa(key).replace(/[^a-zA-Z0-9]/g, '');
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Background sync registration
    async registerBackgroundSync(tag) {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                await registration.sync.register(tag);
                return true;
            } catch (error) {
                console.error('Background sync registration failed:', error);
                return false;
            }
        }
        return false;
    }
    
    // Network status helpers
    isOnline() {
        return this.isOnline;
    }
    
    getNetworkType() {
        if ('connection' in navigator) {
            return navigator.connection.effectiveType;
        }
        return 'unknown';
    }
    
    async checkConnectivity() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch('/ping', {
                method: 'HEAD',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    // Request prioritization
    setPriority(url, priority) {
        if ('connection' in navigator && 'fetch' in window) {
            const importance = priority === 'high' ? 'high' : 'low';
            return fetch(url, { importance });
        }
        return fetch(url);
    }
    
    // Save data mode
    isSaveData() {
        if ('connection' in navigator) {
            return navigator.connection.saveData;
        }
        return false;
    }
    
    // Network-aware loading
    async loadWithNetworkAwareness(url, options = {}) {
        const networkType = this.getNetworkType();
        const isSaveData = this.isSaveData();
        
        // Adjust quality/size based on network conditions
        if (networkType === 'slow-2g' || networkType === '2g' || isSaveData) {
            options.quality = 'low';
        } else if (networkType === '3g') {
            options.quality = 'medium';
        } else {
            options.quality = 'high';
        }
        
        return this.fetchWithRetry(url, options);
    }
} 