/*
 * Day 11: Web Workers
 * Topics covered:
 * 1. Basic Web Worker Setup
 * 2. Communication Patterns
 * 3. Shared Workers
 * 4. Worker Pools
 * 5. Real-world Examples
 */

// main.js - Main thread code

// 1. Basic Web Worker Setup
function createBasicWorker() {
    const worker = new Worker('worker.js');
    
    // Send message to worker
    worker.postMessage({
        type: 'COMPUTE',
        data: { numbers: [1, 2, 3, 4, 5] }
    });
    
    // Receive message from worker
    worker.onmessage = (event) => {
        console.log('Result from worker:', event.data);
    };
    
    // Handle errors
    worker.onerror = (error) => {
        console.error('Worker error:', error);
    };
}

// 2. Advanced Communication Patterns

// Promise-based worker communication
class PromiseWorker {
    constructor(workerScript) {
        this.worker = new Worker(workerScript);
        this.counter = 0;
        this.promises = new Map();
        
        this.worker.onmessage = (event) => {
            const { id, result, error } = event.data;
            const promise = this.promises.get(id);
            
            if (promise) {
                if (error) {
                    promise.reject(error);
                } else {
                    promise.resolve(result);
                }
                this.promises.delete(id);
            }
        };
    }
    
    postMessage(message) {
        return new Promise((resolve, reject) => {
            const id = this.counter++;
            this.promises.set(id, { resolve, reject });
            this.worker.postMessage({ id, message });
        });
    }
    
    terminate() {
        this.worker.terminate();
        for (const { reject } of this.promises.values()) {
            reject(new Error('Worker terminated'));
        }
        this.promises.clear();
    }
}

// 3. Worker Pool Implementation
class WorkerPool {
    constructor(workerScript, poolSize) {
        this.workers = Array.from(
            { length: poolSize },
            () => new PromiseWorker(workerScript)
        );
        this.currentWorker = 0;
    }
    
    async process(data) {
        const worker = this.workers[this.currentWorker];
        this.currentWorker = (this.currentWorker + 1) % this.workers.length;
        return worker.postMessage(data);
    }
    
    terminate() {
        this.workers.forEach(worker => worker.terminate());
    }
}

// 4. Shared State Management
class SharedStateWorker {
    constructor() {
        this.worker = new SharedWorker('shared-worker.js');
        this.setupMessageHandling();
    }
    
    setupMessageHandling() {
        this.worker.port.onmessage = (event) => {
            const { type, data } = event.data;
            this.handleMessage(type, data);
        };
        
        this.worker.port.start();
    }
    
    handleMessage(type, data) {
        switch (type) {
            case 'STATE_UPDATE':
                this.onStateUpdate(data);
                break;
            case 'ERROR':
                this.onError(data);
                break;
            default:
                console.warn('Unknown message type:', type);
        }
    }
    
    updateState(update) {
        this.worker.port.postMessage({
            type: 'UPDATE_STATE',
            data: update
        });
    }
    
    onStateUpdate(newState) {
        console.log('State updated:', newState);
    }
    
    onError(error) {
        console.error('Shared worker error:', error);
    }
}

// 5. Real-world Examples

// Example 1: Image Processing Worker
class ImageProcessor {
    constructor() {
        this.worker = new Worker('image-processor.js');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.worker.onmessage = (event) => {
            const { type, data } = event.data;
            switch (type) {
                case 'PROGRESS':
                    this.onProgress(data);
                    break;
                case 'COMPLETE':
                    this.onComplete(data);
                    break;
                case 'ERROR':
                    this.onError(data);
                    break;
            }
        };
    }
    
    processImage(imageData, options) {
        this.worker.postMessage({
            type: 'PROCESS_IMAGE',
            data: { imageData, options }
        });
    }
    
    onProgress(progress) {
        console.log('Processing progress:', progress);
    }
    
    onComplete(result) {
        console.log('Processing complete:', result);
    }
    
    onError(error) {
        console.error('Processing error:', error);
    }
}

// Example 2: Data Processing Pipeline
class DataProcessor {
    constructor(workerCount = 4) {
        this.pool = new WorkerPool('data-processor.js', workerCount);
        this.processing = false;
    }
    
    async processDataStream(stream, batchSize = 1000) {
        this.processing = true;
        const results = [];
        
        try {
            for await (const chunk of this.chunkedStream(stream, batchSize)) {
                const processedChunk = await this.pool.process(chunk);
                results.push(processedChunk);
                
                if (!this.processing) break;
            }
        } finally {
            this.processing = false;
        }
        
        return results;
    }
    
    async *chunkedStream(stream, size) {
        let chunk = [];
        
        for await (const item of stream) {
            chunk.push(item);
            
            if (chunk.length >= size) {
                yield chunk;
                chunk = [];
            }
        }
        
        if (chunk.length > 0) {
            yield chunk;
        }
    }
    
    stop() {
        this.processing = false;
    }
    
    terminate() {
        this.pool.terminate();
    }
}

// Example 3: Background Sync
class BackgroundSync {
    constructor() {
        this.worker = new Worker('sync-worker.js');
        this.setupSync();
    }
    
    setupSync() {
        this.worker.onmessage = (event) => {
            const { type, data } = event.data;
            switch (type) {
                case 'SYNC_COMPLETE':
                    this.onSyncComplete(data);
                    break;
                case 'SYNC_ERROR':
                    this.onSyncError(data);
                    break;
                case 'SYNC_PROGRESS':
                    this.onSyncProgress(data);
                    break;
            }
        };
    }
    
    startSync(options = {}) {
        this.worker.postMessage({
            type: 'START_SYNC',
            data: options
        });
    }
    
    stopSync() {
        this.worker.postMessage({ type: 'STOP_SYNC' });
    }
    
    onSyncComplete(result) {
        console.log('Sync complete:', result);
    }
    
    onSyncError(error) {
        console.error('Sync error:', error);
    }
    
    onSyncProgress(progress) {
        console.log('Sync progress:', progress);
    }
}

// 6. Practice Exercises

// Exercise 1: Implement a worker-based task queue
class WorkerTaskQueue {
    constructor() {
        // Implement task queue with worker
    }
    
    addTask(task) {
        // Add task to queue
    }
    
    processTasks() {
        // Process tasks using worker
    }
}

// Exercise 2: Create a worker-based caching system
class WorkerCache {
    constructor() {
        // Implement caching system with worker
    }
    
    set(key, value) {
        // Set cache value
    }
    
    get(key) {
        // Get cache value
    }
}

// Exercise 3: Build a worker-based event aggregator
class WorkerEventAggregator {
    constructor() {
        // Implement event aggregation with worker
    }
    
    publish(event) {
        // Publish event
    }
    
    subscribe(eventType, callback) {
        // Subscribe to event
    }
}

// Helper function to create a dummy data stream
async function* createDataStream(size) {
    for (let i = 0; i < size; i++) {
        yield {
            id: i,
            value: Math.random()
        };
        await new Promise(resolve => setTimeout(resolve, 10));
    }
}

// Example usage
async function runExamples() {
    // Test basic worker
    createBasicWorker();
    
    // Test promise-based worker
    const promiseWorker = new PromiseWorker('worker.js');
    const result = await promiseWorker.postMessage({ type: 'COMPUTE', data: [1, 2, 3] });
    console.log('Promise worker result:', result);
    
    // Test worker pool
    const pool = new WorkerPool('worker.js', 4);
    const poolResults = await Promise.all([
        pool.process([1, 2, 3]),
        pool.process([4, 5, 6]),
        pool.process([7, 8, 9])
    ]);
    console.log('Pool results:', poolResults);
    
    // Test data processing
    const processor = new DataProcessor();
    const stream = createDataStream(100);
    const processedData = await processor.processDataStream(stream);
    console.log('Processed data:', processedData);
    
    // Cleanup
    promiseWorker.terminate();
    pool.terminate();
    processor.terminate();
}

// Uncomment to run examples
// runExamples(); 