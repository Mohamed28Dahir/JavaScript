// Article Manager Service
export class ArticleManager {
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
        this.syncInProgress = false;
        this.syncQueue = [];
    }
    
    async saveArticle(articleId) {
        try {
            const article = await this.getArticle(articleId);
            if (!article) {
                throw new Error('Article not found');
            }
            
            await this.cacheManager.saveArticle(article);
            await this.addToSyncQueue('save', article);
            
            return true;
        } catch (error) {
            console.error('Failed to save article:', error);
            throw new Error('Failed to save article');
        }
    }
    
    async unsaveArticle(articleId) {
        try {
            await this.cacheManager.removeArticle(articleId);
            await this.addToSyncQueue('remove', { id: articleId });
            
            return true;
        } catch (error) {
            console.error('Failed to unsave article:', error);
            throw new Error('Failed to unsave article');
        }
    }
    
    async getArticle(articleId) {
        try {
            const articles = await this.cacheManager.getArticles();
            return articles.find(article => article.id === articleId);
        } catch (error) {
            console.error('Failed to get article:', error);
            throw new Error('Failed to get article');
        }
    }
    
    async getSavedArticles() {
        try {
            return await this.cacheManager.getSavedArticles();
        } catch (error) {
            console.error('Failed to get saved articles:', error);
            throw new Error('Failed to get saved articles');
        }
    }
    
    async addToSyncQueue(action, article) {
        this.syncQueue.push({
            action,
            article,
            timestamp: Date.now()
        });
        
        // Store sync queue in IndexedDB
        await this.storeSyncQueue();
        
        // Register background sync if available
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            const registration = await navigator.serviceWorker.ready;
            await registration.sync.register('sync-articles');
        }
    }
    
    async syncArticles() {
        if (this.syncInProgress) return;
        
        try {
            this.syncInProgress = true;
            
            // Load sync queue from storage
            await this.loadSyncQueue();
            
            if (this.syncQueue.length === 0) return;
            
            // Process queue
            const queue = [...this.syncQueue];
            this.syncQueue = [];
            
            for (const item of queue) {
                try {
                    await this.processSyncItem(item);
                } catch (error) {
                    console.error('Failed to sync item:', error);
                    // Add back to queue if it's a network error
                    if (error.name === 'TypeError') {
                        this.syncQueue.push(item);
                    }
                }
            }
            
            // Update stored queue
            await this.storeSyncQueue();
        } finally {
            this.syncInProgress = false;
        }
    }
    
    async processSyncItem(item) {
        const { action, article } = item;
        
        switch (action) {
            case 'save':
                await this.syncSaveArticle(article);
                break;
            case 'remove':
                await this.syncRemoveArticle(article.id);
                break;
            default:
                console.warn('Unknown sync action:', action);
        }
    }
    
    async syncSaveArticle(article) {
        const response = await fetch('/api/articles/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(article)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
    
    async syncRemoveArticle(articleId) {
        const response = await fetch(`/api/articles/${articleId}/save`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
    
    async storeSyncQueue() {
        try {
            const db = await this.openDatabase();
            const transaction = db.transaction(['syncQueue'], 'readwrite');
            const store = transaction.objectStore('syncQueue');
            
            await this.promisifyRequest(store.put({
                id: 'queue',
                items: this.syncQueue
            }));
        } catch (error) {
            console.error('Failed to store sync queue:', error);
        }
    }
    
    async loadSyncQueue() {
        try {
            const db = await this.openDatabase();
            const transaction = db.transaction(['syncQueue'], 'readonly');
            const store = transaction.objectStore('syncQueue');
            
            const data = await this.promisifyRequest(store.get('queue'));
            if (data) {
                this.syncQueue = data.items;
            }
        } catch (error) {
            console.error('Failed to load sync queue:', error);
        }
    }
    
    async openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('articleSync', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('syncQueue')) {
                    db.createObjectStore('syncQueue', { keyPath: 'id' });
                }
            };
        });
    }
    
    promisifyRequest(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    // Article processing methods
    async processArticleContent(article) {
        // Extract main content
        const content = article.content || '';
        
        // Remove unwanted elements
        const cleanContent = this.removeAds(content);
        
        // Format content
        const formattedContent = await this.formatContent(cleanContent);
        
        return {
            ...article,
            processedContent: formattedContent
        };
    }
    
    removeAds(content) {
        // Simple ad removal logic
        return content.replace(/<div class="ad">.*?<\/div>/g, '');
    }
    
    async formatContent(content) {
        // Format paragraphs
        let formatted = content.replace(/\n\n/g, '</p><p>');
        formatted = `<p>${formatted}</p>`;
        
        // Format headings
        formatted = formatted.replace(/#{1,6}\s+([^\n]+)/g, (match, text) => {
            const level = match.indexOf(' ');
            return `<h${level}>${text}</h${level}>`;
        });
        
        return formatted;
    }
    
    // Article validation methods
    validateArticle(article) {
        const required = ['id', 'title', 'url'];
        const errors = [];
        
        required.forEach(field => {
            if (!article[field]) {
                errors.push(`Missing required field: ${field}`);
            }
        });
        
        if (errors.length > 0) {
            throw new Error(`Invalid article: ${errors.join(', ')}`);
        }
        
        return true;
    }
} 