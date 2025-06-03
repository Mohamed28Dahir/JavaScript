// Basic Worker Implementation

self.onmessage = (event) => {
    const { id, message } = event.data;
    
    try {
        const result = processMessage(message);
        self.postMessage({ id, result });
    } catch (error) {
        self.postMessage({ id, error: error.message });
    }
};

function processMessage(message) {
    switch (message.type) {
        case 'COMPUTE':
            return computeData(message.data);
        default:
            throw new Error(`Unknown message type: ${message.type}`);
    }
}

function computeData(data) {
    if (Array.isArray(data)) {
        return data.map(x => x * 2);
    }
    
    if (data.numbers && Array.isArray(data.numbers)) {
        return {
            sum: data.numbers.reduce((a, b) => a + b, 0),
            average: data.numbers.reduce((a, b) => a + b, 0) / data.numbers.length,
            doubled: data.numbers.map(x => x * 2)
        };
    }
    
    throw new Error('Invalid data format');
} 