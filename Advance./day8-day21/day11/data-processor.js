// Data Processor Worker Implementation

self.onmessage = async (event) => {
    const { id, message } = event.data;
    
    try {
        const result = await processData(message);
        self.postMessage({ id, result });
    } catch (error) {
        self.postMessage({ id, error: error.message });
    }
};

async function processData(data) {
    if (!Array.isArray(data)) {
        throw new Error('Expected array of data items');
    }
    
    // Process each item in the array
    const results = await Promise.all(
        data.map(async (item) => {
            // Simulate some CPU-intensive work
            const processed = await performCalculations(item);
            
            // Simulate data transformation
            return transformData(processed);
        })
    );
    
    // Aggregate results
    return {
        items: results,
        summary: summarizeResults(results),
        timestamp: Date.now()
    };
}

async function performCalculations(item) {
    // Simulate CPU-intensive calculations
    const result = {
        id: item.id,
        value: item.value,
        calculated: {}
    };
    
    // Perform various calculations
    result.calculated.squared = Math.pow(item.value, 2);
    result.calculated.squareRoot = Math.sqrt(Math.abs(item.value));
    result.calculated.rounded = Math.round(item.value * 100) / 100;
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    
    return result;
}

function transformData(data) {
    return {
        ...data,
        transformed: {
            isPositive: data.value > 0,
            magnitude: Math.abs(data.value),
            category: categorizeValue(data.value)
        }
    };
}

function categorizeValue(value) {
    if (value < -1) return 'very negative';
    if (value < 0) return 'negative';
    if (value === 0) return 'zero';
    if (value <= 1) return 'positive';
    return 'very positive';
}

function summarizeResults(results) {
    const values = results.map(r => r.value);
    
    return {
        count: results.length,
        min: Math.min(...values),
        max: Math.max(...values),
        average: values.reduce((a, b) => a + b, 0) / values.length,
        categories: results.reduce((acc, r) => {
            const category = r.transformed.category;
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {})
    };
} 