/*
 * Day 9: Advanced Promises
 * Topics covered:
 * 1. Promise Combinators
 * 2. Promise Chaining
 * 3. Error Handling
 * 4. Custom Promise Implementation
 * 5. Real-world Examples
 */

// 1. Promise Combinators

// Promise.all - Wait for all promises to resolve
async function fetchAllUserData(userIds) {
    try {
        const promises = userIds.map(id => fetchUser(id));
        const users = await Promise.all(promises);
        console.log('All users:', users);
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

// Promise.race - Get the first resolved promise
async function fetchWithTimeout(url, timeout) {
    const fetchPromise = fetch(url);
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), timeout);
    });
    
    try {
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Promise.allSettled - Get all results regardless of success/failure
async function attemptMultipleOperations(operations) {
    const results = await Promise.allSettled(operations.map(op => op()));
    
    const summary = results.reduce((acc, result, index) => {
        acc[`Operation ${index + 1}`] = {
            status: result.status,
            value: result.status === 'fulfilled' ? result.value : result.reason
        };
        return acc;
    }, {});
    
    console.log('Operations summary:', summary);
    return summary;
}

// Promise.any - Get the first successful result
async function fetchFromMultipleAPIs(urls) {
    try {
        const firstSuccess = await Promise.any(
            urls.map(url => fetch(url).then(res => res.json()))
        );
        console.log('First successful response:', firstSuccess);
        return firstSuccess;
    } catch (error) {
        console.error('All requests failed:', error);
        throw error;
    }
}

// 2. Advanced Promise Chaining

// Sequential vs Parallel execution
async function processUsersData(userIds) {
    console.log('Starting user data processing');
    
    // Sequential processing
    console.time('Sequential');
    for (const id of userIds) {
        const user = await fetchUser(id);
        await processUser(user);
    }
    console.timeEnd('Sequential');
    
    // Parallel processing
    console.time('Parallel');
    const users = await Promise.all(userIds.map(fetchUser));
    await Promise.all(users.map(processUser));
    console.timeEnd('Parallel');
}

// Chain optimization
function optimizedChain(data) {
    return Promise.resolve(data)
        .then(validate)
        .then(transform)
        .then(process)
        .then(store)
        .catch(handleError)
        .finally(cleanup);
}

// 3. Error Handling Patterns

// Retry mechanism
async function fetchWithRetry(url, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            if (attempt === maxRetries) throw error;
            console.log(`Attempt ${attempt} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Error boundary
class PromiseErrorBoundary {
    constructor(operation) {
        this.operation = operation;
    }
    
    async execute(...args) {
        try {
            const result = await this.operation(...args);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error };
        }
    }
}

// 4. Custom Promise Implementation

class MyPromise {
    constructor(executor) {
        this.state = 'pending';
        this.value = undefined;
        this.handlers = [];
        
        try {
            executor(
                value => this.resolve(value),
                reason => this.reject(reason)
            );
        } catch (error) {
            this.reject(error);
        }
    }
    
    resolve(value) {
        this.updateResult(value, 'fulfilled');
    }
    
    reject(reason) {
        this.updateResult(reason, 'rejected');
    }
    
    updateResult(value, state) {
        queueMicrotask(() => {
            if (this.state !== 'pending') return;
            
            this.state = state;
            this.value = value;
            this.executeHandlers();
        });
    }
    
    executeHandlers() {
        if (this.state === 'pending') return;
        
        this.handlers.forEach(handler => {
            if (this.state === 'fulfilled') {
                handler.onFulfilled(this.value);
            } else {
                handler.onRejected(this.value);
            }
        });
        
        this.handlers = [];
    }
    
    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            this.handlers.push({
                onFulfilled: result => {
                    try {
                        resolve(onFulfilled(result));
                    } catch (error) {
                        reject(error);
                    }
                },
                onRejected: error => {
                    try {
                        reject(onRejected ? onRejected(error) : error);
                    } catch (err) {
                        reject(err);
                    }
                }
            });
            
            this.executeHandlers();
        });
    }
    
    catch(onRejected) {
        return this.then(undefined, onRejected);
    }
    
    finally(callback) {
        return this.then(
            result => {
                callback();
                return result;
            },
            error => {
                callback();
                throw error;
            }
        );
    }
    
    static resolve(value) {
        return new MyPromise(resolve => resolve(value));
    }
    
    static reject(reason) {
        return new MyPromise((_, reject) => reject(reason));
    }
}

// 5. Real-world Examples

// Example 1: Parallel API Requests with Rate Limiting
class RateLimiter {
    constructor(maxConcurrent) {
        this.maxConcurrent = maxConcurrent;
        this.running = 0;
        this.queue = [];
    }
    
    async add(task) {
        if (this.running >= this.maxConcurrent) {
            await new Promise(resolve => this.queue.push(resolve));
        }
        
        this.running++;
        try {
            return await task();
        } finally {
            this.running--;
            if (this.queue.length > 0) {
                this.queue.shift()();
            }
        }
    }
}

// Example 2: Caching Promise Results
class PromiseCache {
    constructor(ttl = 60000) {
        this.cache = new Map();
        this.ttl = ttl;
    }
    
    async get(key, promiseFactory) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.ttl) {
            return cached.value;
        }
        
        const value = await promiseFactory();
        this.cache.set(key, { value, timestamp: Date.now() });
        return value;
    }
}

// Example 3: Progressive Loading
class ProgressiveLoader {
    constructor(chunks) {
        this.chunks = chunks;
        this.loaded = 0;
    }
    
    async load(onProgress) {
        const results = [];
        
        for (const chunk of this.chunks) {
            const result = await this.loadChunk(chunk);
            results.push(result);
            this.loaded++;
            onProgress(this.loaded / this.chunks.length);
        }
        
        return results;
    }
    
    async loadChunk(chunk) {
        // Simulate chunk loading
        return new Promise(resolve => {
            setTimeout(() => resolve(chunk), Math.random() * 1000);
        });
    }
}

// 6. Practice Exercises

// Exercise 1: Implement a Promise Queue
class PromiseQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }
    
    add(task) {
        // Implement queue logic
    }
    
    async process() {
        // Implement processing logic
    }
}

// Exercise 2: Create a Promise Pool
class PromisePool {
    constructor(maxConcurrent) {
        this.maxConcurrent = maxConcurrent;
        this.running = new Set();
        this.waiting = [];
    }
    
    async add(task) {
        // Implement pool logic
    }
}

// Exercise 3: Implement Promise.race with timeout
function raceWithTimeout(promise, timeout) {
    // Implement race with timeout logic
}

// Helper functions for examples
async function fetchUser(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ id, name: `User ${id}` });
        }, Math.random() * 1000);
    });
}

async function processUser(user) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ ...user, processed: true });
        }, Math.random() * 500);
    });
}

function validate(data) {
    return data;
}

function transform(data) {
    return data;
}

function process(data) {
    return data;
}

function store(data) {
    return data;
}

function handleError(error) {
    console.error('Error:', error);
    throw error;
}

function cleanup() {
    console.log('Cleanup complete');
}

// Uncomment to run examples
// fetchAllUserData([1, 2, 3]);
// fetchWithTimeout('https://api.example.com/data', 5000);
// processUsersData([1, 2, 3, 4, 5]);

// Test custom Promise implementation
// new MyPromise(resolve => resolve('test'))
//     .then(console.log)
//     .catch(console.error); 