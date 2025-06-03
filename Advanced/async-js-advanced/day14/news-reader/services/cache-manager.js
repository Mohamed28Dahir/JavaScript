// Cache Manager Service
export class CacheManager {
    constructor() {
        this.dbName = 'newsReaderDB';
        this.dbVersion = 1;
        this.articlesStore = 'articles';
        this.categoriesStore = 'categories';
        this.initDatabase();
    }
    
    async initDatabase() {
        try {
            this.db = await new Promise((resolve, reject) => {
                const request = indexedDB.open(this.dbName, this.dbVersion);
                
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);
                
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    
                    // Create articles store
                    if (!db.objectStoreNames.contains(this.articlesStore)) {
                        const articlesStore = db.createObjectStore(this.articlesStore, {
                            keyPath: 'id'
                        });
                        articlesStore.createIndex('category', 'category');
                        articlesStore.createIndex('timestamp', 'timestamp');
                    }
                    
                    // Create categories store
                    if (!db.objectStoreNames.contains(this.categoriesStore)) {
                        const categoriesStore = db.createObjectStore(this.categoriesStore, {
                            keyPath: 'name'
                        });
                        categoriesStore.createIndex('timestamp', 'timestamp');
                    }
                };
            });
        } catch (error) {
            console.error('Failed to initialize database:', error);
            throw new Error('Failed to initialize cache');
        }
    }
    
    async saveArticles(category, articles) {
        try {
            const timestamp = Date.now();
            const transaction = this.db.transaction([this.articlesStore, this.categoriesStore], 'readwrite');
            
            // Save articles
            const articlesStore = transaction.objectStore(this.articlesStore);
            const enrichedArticles = articles.map(article => ({
                ...article,
                category,
                timestamp
            }));
            
            await Promise.all(
                enrichedArticles.map(article => 
                    this.promisifyRequest(articlesStore.put(article))
                )
            );
            
            // Update category timestamp
            const categoriesStore = transaction.objectStore(this.categoriesStore);
            await this.promisifyRequest(
                categoriesStore.put({ name: category, timestamp })
            );
            
            await this.promisifyTransaction(transaction);
            return true;
        } catch (error) {
            console.error('Failed to save articles:', error);
            throw new Error('Failed to cache articles');
        }
    }
    
    async getArticles(category) {
        try {
            const transaction = this.db.transaction(this.articlesStore, 'readonly');
            const store = transaction.objectStore(this.articlesStore);
            const index = store.index('category');
            
            const articles = await this.promisifyRequest(
                index.getAll(IDBKeyRange.only(category))
            );
            
            return articles.sort((a, b) => b.timestamp - a.timestamp);
        } catch (error) {
            console.error('Failed to get articles:', error);
            throw new Error('Failed to retrieve cached articles');
        }
    }
    
    async hasCategory(category) {
        try {
            const transaction = this.db.transaction(this.categoriesStore, 'readonly');
            const store = transaction.objectStore(this.categoriesStore);
            const categoryData = await this.promisifyRequest(store.get(category));
            
            if (!categoryData) return false;
            
            // Check if cache is older than 1 hour
            const oneHour = 60 * 60 * 1000;
            return Date.now() - categoryData.timestamp < oneHour;
        } catch (error) {
            console.error('Failed to check category:', error);
            return false;
        }
    }
    
    async saveArticle(article) {
        try {
            const transaction = this.db.transaction(this.articlesStore, 'readwrite');
            const store = transaction.objectStore(this.articlesStore);
            
            await this.promisifyRequest(
                store.put({
                    ...article,
                    timestamp: Date.now(),
                    saved: true
                })
            );
            
            await this.promisifyTransaction(transaction);
            return true;
        } catch (error) {
            console.error('Failed to save article:', error);
            throw new Error('Failed to save article');
        }
    }
    
    async removeArticle(articleId) {
        try {
            const transaction = this.db.transaction(this.articlesStore, 'readwrite');
            const store = transaction.objectStore(this.articlesStore);
            
            await this.promisifyRequest(store.delete(articleId));
            await this.promisifyTransaction(transaction);
            return true;
        } catch (error) {
            console.error('Failed to remove article:', error);
            throw new Error('Failed to remove article');
        }
    }
    
    async getSavedArticles() {
        try {
            const transaction = this.db.transaction(this.articlesStore, 'readonly');
            const store = transaction.objectStore(this.articlesStore);
            const articles = await this.promisifyRequest(store.getAll());
            
            return articles
                .filter(article => article.saved)
                .sort((a, b) => b.timestamp - a.timestamp);
        } catch (error) {
            console.error('Failed to get saved articles:', error);
            throw new Error('Failed to retrieve saved articles');
        }
    }
    
    async clearOldCache() {
        try {
            const transaction = this.db.transaction([this.articlesStore, this.categoriesStore], 'readwrite');
            const articlesStore = transaction.objectStore(this.articlesStore);
            const categoriesStore = transaction.objectStore(this.categoriesStore);
            
            // Keep only articles from the last 24 hours, except saved ones
            const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
            const index = articlesStore.index('timestamp');
            
            const oldArticles = await this.promisifyRequest(
                index.getAllKeys(IDBKeyRange.upperBound(oneDayAgo))
            );
            
            await Promise.all(
                oldArticles.map(async (key) => {
                    const article = await this.promisifyRequest(articlesStore.get(key));
                    if (!article.saved) {
                        await this.promisifyRequest(articlesStore.delete(key));
                    }
                })
            );
            
            // Clear old category timestamps
            const oldCategories = await this.promisifyRequest(
                categoriesStore.getAllKeys()
            );
            
            await Promise.all(
                oldCategories.map(async (key) => {
                    const category = await this.promisifyRequest(categoriesStore.get(key));
                    if (category.timestamp < oneDayAgo) {
                        await this.promisifyRequest(categoriesStore.delete(key));
                    }
                })
            );
            
            await this.promisifyTransaction(transaction);
            return true;
        } catch (error) {
            console.error('Failed to clear old cache:', error);
            throw new Error('Failed to clear cache');
        }
    }
    
    // Helper methods for working with IndexedDB
    promisifyRequest(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    promisifyTransaction(transaction) {
        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
            transaction.onabort = () => reject(transaction.error);
        });
    }
} 