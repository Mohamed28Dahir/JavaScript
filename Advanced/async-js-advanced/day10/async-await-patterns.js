/*
 * Day 10: Async/Await Best Practices
 * Topics covered:
 * 1. Sequential vs Parallel Execution
 * 2. Error Handling Patterns
 * 3. Performance Optimization
 * 4. Common Patterns
 * 5. Real-world Examples
 */

// 1. Sequential vs Parallel Execution

// Sequential execution (slower)
async function fetchUserDataSequential(userIds) {
    console.time('Sequential');
    const users = [];
    
    for (const id of userIds) {
        const user = await fetchUser(id);
        const posts = await fetchUserPosts(id);
        const friends = await fetchUserFriends(id);
        
        users.push({
            ...user,
            posts,
            friends
        });
    }
    
    console.timeEnd('Sequential');
    return users;
}

// Parallel execution (faster)
async function fetchUserDataParallel(userIds) {
    console.time('Parallel');
    
    const userPromises = userIds.map(async (id) => {
        const [user, posts, friends] = await Promise.all([
            fetchUser(id),
            fetchUserPosts(id),
            fetchUserFriends(id)
        ]);
        
        return {
            ...user,
            posts,
            friends
        };
    });
    
    const users = await Promise.all(userPromises);
    console.timeEnd('Parallel');
    return users;
}

// 2. Error Handling Patterns

// Basic error handling
async function fetchDataSafely(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return null; // Return a default value
    }
}

// Advanced error handling with custom error classes
class APIError extends Error {
    constructor(message, status, code) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.code = code;
    }
}

async function fetchWithErrorHandling(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            throw new APIError(
                data.message || 'API Error',
                response.status,
                data.code
            );
        }
        
        return data;
    } catch (error) {
        if (error instanceof APIError) {
            // Handle API-specific errors
            handleAPIError(error);
        } else if (error instanceof TypeError) {
            // Handle network errors
            handleNetworkError(error);
        } else {
            // Handle other errors
            handleGenericError(error);
        }
        throw error;
    }
}

// 3. Performance Optimization

// Caching results
const memoize = (fn) => {
    const cache = new Map();
    
    return async (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        const result = await fn(...args);
        cache.set(key, result);
        return result;
    };
};

// Batch processing with concurrency control
async function processBatch(items, batchSize = 5) {
    const results = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchPromises = batch.map(processItem);
        results.push(...await Promise.all(batchPromises));
        
        // Optional: Add delay between batches
        if (i + batchSize < items.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    return results;
}

// 4. Common Patterns

// Retry pattern with exponential backoff
async function fetchWithRetry(url, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fetch(url);
        } catch (error) {
            if (attempt === maxRetries) throw error;
            
            const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
            await new Promise(resolve => setTimeout(resolve, delay));
            
            console.log(`Retry attempt ${attempt} after ${delay}ms`);
        }
    }
}

// Timeout pattern
async function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw error;
    }
}

// Cancellation pattern
class CancellableOperation {
    constructor() {
        this.controller = new AbortController();
    }
    
    async execute(url) {
        try {
            const response = await fetch(url, {
                signal: this.controller.signal
            });
            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Operation cancelled');
                return null;
            }
            throw error;
        }
    }
    
    cancel() {
        this.controller.abort();
    }
}

// 5. Real-world Examples

// Example 1: Data fetching with loading states
class DataFetcher {
    constructor() {
        this.loading = false;
        this.error = null;
        this.data = null;
    }
    
    async fetch(url) {
        this.loading = true;
        this.error = null;
        
        try {
            const response = await fetch(url);
            this.data = await response.json();
        } catch (error) {
            this.error = error;
            this.data = null;
        } finally {
            this.loading = false;
        }
        
        return {
            loading: this.loading,
            error: this.error,
            data: this.data
        };
    }
}

// Example 2: Resource cleanup
class ResourceManager {
    constructor() {
        this.resources = new Set();
    }
    
    async acquire(resource) {
        await resource.init();
        this.resources.add(resource);
    }
    
    async release(resource) {
        await resource.cleanup();
        this.resources.delete(resource);
    }
    
    async useResource(resource, operation) {
        try {
            await this.acquire(resource);
            return await operation(resource);
        } finally {
            await this.release(resource);
        }
    }
}

// Example 3: Progressive data loading
class DataLoader {
    constructor(pageSize = 10) {
        this.pageSize = pageSize;
        this.currentPage = 0;
        this.loading = false;
        this.hasMore = true;
    }
    
    async loadMore(url) {
        if (this.loading || !this.hasMore) return null;
        
        this.loading = true;
        try {
            const response = await fetch(
                `${url}?page=${this.currentPage}&size=${this.pageSize}`
            );
            const data = await response.json();
            
            this.currentPage++;
            this.hasMore = data.length === this.pageSize;
            
            return data;
        } finally {
            this.loading = false;
        }
    }
}

// 6. Practice Exercises

// Exercise 1: Implement parallel processing with rate limiting
async function processWithRateLimit(items, concurrency, processItem) {
    // Implement rate-limited parallel processing
}

// Exercise 2: Create a resource pool
class AsyncResourcePool {
    constructor(factory, poolSize) {
        // Implement resource pool
    }
    
    async acquire() {
        // Implement resource acquisition
    }
    
    async release(resource) {
        // Implement resource release
    }
}

// Exercise 3: Implement a task queue with priorities
class PriorityTaskQueue {
    constructor() {
        // Implement priority queue
    }
    
    async addTask(task, priority) {
        // Implement task addition
    }
    
    async processTasks() {
        // Implement task processing
    }
}

// Helper functions
async function fetchUser(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ id, name: `User ${id}` });
        }, Math.random() * 1000);
    });
}

async function fetchUserPosts(userId) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                { id: 1, title: `Post 1 by User ${userId}` },
                { id: 2, title: `Post 2 by User ${userId}` }
            ]);
        }, Math.random() * 1000);
    });
}

async function fetchUserFriends(userId) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                { id: 1, name: 'Friend 1' },
                { id: 2, name: 'Friend 2' }
            ]);
        }, Math.random() * 1000);
    });
}

async function processItem(item) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ ...item, processed: true });
        }, Math.random() * 500);
    });
}

function handleAPIError(error) {
    console.error('API Error:', error.message, error.status, error.code);
}

function handleNetworkError(error) {
    console.error('Network Error:', error.message);
}

function handleGenericError(error) {
    console.error('Generic Error:', error.message);
}

// Example usage
async function runExamples() {
    // Test sequential vs parallel
    const userIds = [1, 2, 3];
    await fetchUserDataSequential(userIds);
    await fetchUserDataParallel(userIds);
    
    // Test error handling
    const data = await fetchDataSafely('https://api.example.com/data');
    console.log('Fetched data:', data);
    
    // Test batch processing
    const items = Array.from({ length: 20 }, (_, i) => ({ id: i + 1 }));
    const results = await processBatch(items, 5);
    console.log('Batch results:', results);
}

// Uncomment to run examples
// runExamples(); 