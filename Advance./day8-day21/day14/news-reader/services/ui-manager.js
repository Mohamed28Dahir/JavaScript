// UI Manager Service
export class UIManager {
    constructor() {
        this.categoriesContainer = document.getElementById('categories');
        this.articlesContainer = document.getElementById('articles');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.loadingProgress = document.getElementById('loadingProgress');
        this.offlineBanner = document.getElementById('offlineBanner');
        this.connectionStatus = document.getElementById('connectionStatus');
        this.articleTemplate = document.getElementById('articleTemplate');
    }
    
    renderCategories(categories, activeCategory) {
        this.categoriesContainer.innerHTML = categories
            .map(category => `
                <div class="category ${category === activeCategory ? 'active' : ''}"
                     data-category="${category}">
                    ${this.capitalizeFirst(category)}
                </div>
            `)
            .join('');
    }
    
    renderArticles(articles) {
        this.articlesContainer.innerHTML = '';
        
        articles.forEach(article => {
            const articleElement = this.createArticleElement(article);
            this.articlesContainer.appendChild(articleElement);
        });
    }
    
    createArticleElement(article) {
        const template = this.articleTemplate.content.cloneNode(true);
        const articleElement = template.querySelector('.article');
        
        // Set article data
        articleElement.dataset.id = article.id;
        articleElement.dataset.url = article.url;
        
        if (article.saved) {
            articleElement.classList.add('saved');
        }
        
        // Set image
        const img = articleElement.querySelector('img');
        img.src = article.imageUrl || 'placeholder.jpg';
        img.alt = article.title;
        
        // Set text content
        articleElement.querySelector('.article-title').textContent = article.title;
        articleElement.querySelector('.article-summary').textContent = article.summary;
        articleElement.querySelector('.article-date').textContent = article.publishedAt;
        articleElement.querySelector('.article-source').textContent = article.source;
        
        return articleElement;
    }
    
    updateArticleStatus(articleElement, isSaved) {
        if (isSaved) {
            articleElement.classList.add('saved');
        } else {
            articleElement.classList.remove('saved');
        }
    }
    
    updateActiveCategory(category) {
        const categories = this.categoriesContainer.querySelectorAll('.category');
        categories.forEach(cat => {
            if (cat.dataset.category === category) {
                cat.classList.add('active');
            } else {
                cat.classList.remove('active');
            }
        });
    }
    
    showLoading(message = 'Loading...') {
        this.loadingIndicator.classList.add('active');
        this.loadingProgress.style.width = '0%';
    }
    
    updateLoadingProgress(percent) {
        this.loadingProgress.style.width = `${percent}%`;
    }
    
    hideLoading() {
        this.loadingIndicator.classList.remove('active');
    }
    
    updateNetworkStatus(isOnline) {
        this.connectionStatus.textContent = isOnline ? 'Online' : 'Offline';
        this.connectionStatus.classList.toggle('offline', !isOnline);
        this.offlineBanner.classList.toggle('active', !isOnline);
    }
    
    showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        document.body.appendChild(messageElement);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => messageElement.remove(), 300);
        }, 3000);
    }
    
    showError(message) {
        this.showMessage(message, 'error');
    }
    
    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Animation helpers
    animateArticle(articleElement) {
        articleElement.classList.add('animate-in');
        setTimeout(() => articleElement.classList.remove('animate-in'), 300);
    }
    
    // Responsive helpers
    handleResponsiveLayout() {
        const isMobile = window.innerWidth < 768;
        this.articlesContainer.classList.toggle('mobile-layout', isMobile);
        this.categoriesContainer.classList.toggle('mobile-layout', isMobile);
    }
    
    // Accessibility helpers
    setupAccessibility() {
        // Make categories navigable by keyboard
        this.categoriesContainer.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.target.click();
            }
        });
        
        // Add proper ARIA labels
        this.categoriesContainer.querySelectorAll('.category').forEach(category => {
            category.setAttribute('role', 'button');
            category.setAttribute('tabindex', '0');
            category.setAttribute('aria-label', `${category.textContent} category`);
        });
    }
    
    // Theme support
    setupThemeSupport() {
        // Watch for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener(e => this.updateTheme(e.matches));
        this.updateTheme(mediaQuery.matches);
    }
    
    updateTheme(isDark) {
        document.body.classList.toggle('dark-theme', isDark);
    }
    
    // Performance optimization
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        observer.unobserve(img);
                    }
                });
            });
            
            this.articlesContainer.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
} 