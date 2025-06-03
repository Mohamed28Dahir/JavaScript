// News API Service
export class NewsAPI {
    constructor() {
        this.baseUrl = 'https://newsapi.org/v2';
        this.apiKey = 'YOUR_API_KEY'; // Replace with actual API key
    }
    
    async getArticles(category = 'general', pageSize = 20) {
        try {
            const url = new URL(`${this.baseUrl}/top-headlines`);
            url.searchParams.append('category', category);
            url.searchParams.append('pageSize', pageSize);
            url.searchParams.append('apiKey', this.apiKey);
            
            const response = await this.fetchWithTimeout(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return this.transformArticles(data.articles);
        } catch (error) {
            console.error('Failed to fetch articles:', error);
            throw new Error('Failed to fetch articles');
        }
    }
    
    async fetchWithTimeout(url, timeout = 5000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
    
    transformArticles(articles) {
        return articles.map(article => ({
            id: this.generateId(article),
            title: article.title,
            summary: article.description,
            url: article.url,
            imageUrl: article.urlToImage,
            source: article.source.name,
            publishedAt: new Date(article.publishedAt).toLocaleDateString(),
            category: article.category || 'general'
        }));
    }
    
    generateId(article) {
        // Create a unique ID from the article URL
        return btoa(article.url).replace(/[^a-zA-Z0-9]/g, '');
    }
    
    // Mock API for development/testing
    async getMockArticles(category = 'general') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return Array.from({ length: 10 }, (_, i) => ({
            id: `article-${i}`,
            title: `Sample Article ${i + 1}`,
            summary: 'This is a sample article description for testing purposes.',
            url: `https://example.com/article-${i}`,
            imageUrl: `https://picsum.photos/600/400?random=${i}`,
            source: 'Sample News',
            publishedAt: new Date().toLocaleDateString(),
            category
        }));
    }
} 