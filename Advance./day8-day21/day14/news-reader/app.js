// Import modules
import { NewsAPI } from './services/news-api.js';
import { CacheManager } from './services/cache-manager.js';
import { UIManager } from './services/ui-manager.js';
import { NetworkManager } from './services/network-manager.js';
import { ArticleManager } from './services/article-manager.js';

class NewsReader {
    constructor() {
        // Initialize services
        this.newsAPI = new NewsAPI();
        this.cacheManager = new CacheManager();
        this.uiManager = new UIManager();
        this.networkManager = new NetworkManager();
        this.articleManager = new ArticleManager(this.cacheManager);
        
        // Initialize state
        this.currentCategory = 'general';
        this.isLoading = false;
        
        // Register service worker
        this.registerServiceWorker();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initial load
        this.init();
    }
    
    async init() {
        try {
            // Load categories
            await this.loadCategories();
            
            // Load initial articles
            await this.loadArticles();
            
            // Setup offline support
            await this.setupOfflineSupport();
        } catch (error) {
            console.error('Initialization error:', error);
            this.uiManager.showError('Failed to initialize the app');
        }
    }
    
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('Service Worker registered:', registration);
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }
    
    setupEventListeners() {
        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadArticles(true);
        });
        
        // Sync button
        document.getElementById('syncBtn').addEventListener('click', () => {
            this.syncArticles();
        });
        
        // Category selection
        document.getElementById('categories').addEventListener('click', (event) => {
            if (event.target.classList.contains('category')) {
                this.changeCategory(event.target.dataset.category);
            }
        });
        
        // Article actions
        document.getElementById('articles').addEventListener('click', (event) => {
            const article = event.target.closest('.article');
            if (!article) return;
            
            if (event.target.classList.contains('save-button')) {
                this.toggleArticleSave(article);
            } else if (event.target.classList.contains('share-button')) {
                this.shareArticle(article);
            }
        });
        
        // Network status
        window.addEventListener('online', () => this.handleNetworkChange(true));
        window.addEventListener('offline', () => this.handleNetworkChange(false));
    }
    
    async loadCategories() {
        const categories = ['general', 'business', 'technology', 'sports', 'entertainment', 'health', 'science'];
        this.uiManager.renderCategories(categories, this.currentCategory);
    }
    
    async loadArticles(forceRefresh = false) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.uiManager.showLoading();
        
        try {
            let articles;
            
            if (forceRefresh || !await this.cacheManager.hasCategory(this.currentCategory)) {
                articles = await this.newsAPI.getArticles(this.currentCategory);
                await this.cacheManager.saveArticles(this.currentCategory, articles);
            } else {
                articles = await this.cacheManager.getArticles(this.currentCategory);
            }
            
            this.uiManager.renderArticles(articles);
        } catch (error) {
            console.error('Failed to load articles:', error);
            this.uiManager.showError('Failed to load articles');
        } finally {
            this.isLoading = false;
            this.uiManager.hideLoading();
        }
    }
    
    async changeCategory(category) {
        if (category === this.currentCategory) return;
        
        this.currentCategory = category;
        this.uiManager.updateActiveCategory(category);
        await this.loadArticles();
    }
    
    async toggleArticleSave(articleElement) {
        const articleId = articleElement.dataset.id;
        const isSaved = articleElement.classList.contains('saved');
        
        try {
            if (isSaved) {
                await this.articleManager.unsaveArticle(articleId);
                this.uiManager.updateArticleStatus(articleElement, false);
            } else {
                await this.articleManager.saveArticle(articleId);
                this.uiManager.updateArticleStatus(articleElement, true);
            }
        } catch (error) {
            console.error('Failed to toggle article save:', error);
            this.uiManager.showError('Failed to save article');
        }
    }
    
    async shareArticle(articleElement) {
        const articleData = {
            title: articleElement.querySelector('.article-title').textContent,
            url: articleElement.dataset.url
        };
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: articleData.title,
                    url: articleData.url
                });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Share failed:', error);
                    this.uiManager.showError('Failed to share article');
                }
            }
        } else {
            // Fallback to copy to clipboard
            await navigator.clipboard.writeText(articleData.url);
            this.uiManager.showMessage('Link copied to clipboard');
        }
    }
    
    async syncArticles() {
        if (!navigator.onLine) {
            this.uiManager.showError('Cannot sync while offline');
            return;
        }
        
        try {
            this.uiManager.showLoading('Syncing...');
            await this.articleManager.syncArticles();
            this.uiManager.showMessage('Sync complete');
        } catch (error) {
            console.error('Sync failed:', error);
            this.uiManager.showError('Failed to sync articles');
        } finally {
            this.uiManager.hideLoading();
        }
    }
    
    handleNetworkChange(isOnline) {
        this.networkManager.updateNetworkStatus(isOnline);
        this.uiManager.updateNetworkStatus(isOnline);
        
        if (isOnline) {
            this.syncArticles();
        }
    }
    
    async setupOfflineSupport() {
        // Register background sync
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                await registration.sync.register('sync-articles');
            } catch (error) {
                console.error('Background sync registration failed:', error);
            }
        }
        
        // Setup periodic sync if available
        if ('serviceWorker' in navigator && 'periodicSync' in registration) {
            try {
                const status = await navigator.permissions.query({
                    name: 'periodic-background-sync'
                });
                
                if (status.state === 'granted') {
                    await registration.periodicSync.register('refresh-articles', {
                        minInterval: 24 * 60 * 60 * 1000 // 24 hours
                    });
                }
            } catch (error) {
                console.error('Periodic sync registration failed:', error);
            }
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new NewsReader();
}); 