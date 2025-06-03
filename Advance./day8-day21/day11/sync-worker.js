// Background Sync Worker Implementation

let syncInterval;
let syncConfig = {
    interval: 5000, // 5 seconds
    retryAttempts: 3,
    retryDelay: 1000,
    endpoints: []
};

self.onmessage = (event) => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'START_SYNC':
            startSync(data);
            break;
        case 'STOP_SYNC':
            stopSync();
            break;
        case 'UPDATE_CONFIG':
            updateConfig(data);
            break;
        default:
            console.error('Unknown message type:', type);
    }
};

function startSync(config = {}) {
    stopSync(); // Clear any existing sync
    
    // Update config with provided values
    updateConfig(config);
    
    // Start periodic sync
    syncInterval = setInterval(performSync, syncConfig.interval);
    
    // Perform initial sync
    performSync();
}

function stopSync() {
    if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
    }
}

function updateConfig(config) {
    syncConfig = {
        ...syncConfig,
        ...config
    };
}

async function performSync() {
    try {
        // Get pending changes
        const changes = await getPendingChanges();
        
        if (changes.length === 0) {
            self.postMessage({
                type: 'SYNC_COMPLETE',
                data: { status: 'no-changes' }
            });
            return;
        }
        
        // Process changes in batches
        const batches = chunkArray(changes, 10);
        let processed = 0;
        
        for (const batch of batches) {
            await processBatch(batch);
            processed += batch.length;
            
            // Report progress
            self.postMessage({
                type: 'SYNC_PROGRESS',
                data: {
                    processed,
                    total: changes.length,
                    percent: Math.round((processed / changes.length) * 100)
                }
            });
        }
        
        self.postMessage({
            type: 'SYNC_COMPLETE',
            data: {
                status: 'success',
                syncedItems: processed
            }
        });
        
    } catch (error) {
        self.postMessage({
            type: 'SYNC_ERROR',
            data: {
                message: error.message,
                timestamp: Date.now()
            }
        });
    }
}

async function processBatch(batch) {
    const results = await Promise.allSettled(
        batch.map(item => syncItem(item))
    );
    
    // Handle failed items
    const failed = results
        .map((result, index) => ({ result, item: batch[index] }))
        .filter(({ result }) => result.status === 'rejected');
    
    if (failed.length > 0) {
        await handleFailedItems(failed);
    }
}

async function syncItem(item) {
    let lastError;
    
    for (let attempt = 1; attempt <= syncConfig.retryAttempts; attempt++) {
        try {
            return await sendRequest(item);
        } catch (error) {
            lastError = error;
            
            if (attempt < syncConfig.retryAttempts) {
                await new Promise(resolve => 
                    setTimeout(resolve, syncConfig.retryDelay * attempt)
                );
            }
        }
    }
    
    throw lastError;
}

async function sendRequest(item) {
    // Simulate network request
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.9) { // 10% chance of failure
                reject(new Error('Network error'));
            } else {
                resolve({
                    id: item.id,
                    synced: true,
                    timestamp: Date.now()
                });
            }
        }, Math.random() * 1000);
    });
}

async function getPendingChanges() {
    // Simulate fetching pending changes
    return Array.from({ length: Math.floor(Math.random() * 50) }, (_, i) => ({
        id: i + 1,
        type: 'update',
        data: { value: Math.random() }
    }));
}

async function handleFailedItems(failedItems) {
    // Store failed items for retry
    const retryQueue = failedItems.map(({ item, result }) => ({
        item,
        error: result.reason.message,
        timestamp: Date.now()
    }));
    
    // Log failed items
    console.error('Failed items:', retryQueue);
}

// Utility function to chunk array into smaller arrays
function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
} 