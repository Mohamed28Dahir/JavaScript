// Shared Worker Implementation

const ports = new Set();
let state = {
    counter: 0,
    data: {},
    lastUpdate: Date.now()
};

self.onconnect = (event) => {
    const port = event.ports[0];
    ports.add(port);
    
    // Send initial state
    port.postMessage({
        type: 'STATE_UPDATE',
        data: state
    });
    
    port.onmessage = (event) => {
        const { type, data } = event.data;
        
        try {
            switch (type) {
                case 'UPDATE_STATE':
                    updateState(data);
                    break;
                case 'GET_STATE':
                    port.postMessage({
                        type: 'STATE_UPDATE',
                        data: state
                    });
                    break;
                default:
                    throw new Error(`Unknown message type: ${type}`);
            }
        } catch (error) {
            port.postMessage({
                type: 'ERROR',
                data: error.message
            });
        }
    };
    
    port.start();
};

function updateState(update) {
    state = {
        ...state,
        ...update,
        lastUpdate: Date.now()
    };
    
    // Broadcast state update to all connected ports
    broadcastState();
}

function broadcastState() {
    const message = {
        type: 'STATE_UPDATE',
        data: state
    };
    
    ports.forEach(port => {
        try {
            port.postMessage(message);
        } catch (error) {
            console.error('Error broadcasting to port:', error);
            ports.delete(port);
        }
    });
} 