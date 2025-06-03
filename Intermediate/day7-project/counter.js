/*
Counter Component Class
=====================
This class demonstrates the use of:
1. Classes and OOP
2. Closures for private state
3. Event handling with 'this'
4. ES6+ features
5. Destructuring and spread
*/

class Counter {
    #state;
    #elements;
    #config;
    
    constructor(containerId, options = {}) {
        // Initialize private fields
        this.#state = {
            value: 0,
            history: []
        };
        
        // Default configuration with destructuring
        this.#config = {
            step: 1,
            max: 10,
            ...options
        };
        
        // Get DOM elements
        const container = document.getElementById(containerId);
        this.#elements = {
            container,
            value: container.querySelector('.counter-value'),
            increment: container.querySelector('.increment'),
            decrement: container.querySelector('.decrement'),
            historyList: container.querySelector('.history-list'),
            stepInput: container.querySelector('.step-value'),
            maxInput: container.querySelector('.max-value')
        };
        
        // Initialize the UI
        this.#initializeUI();
        
        // Bind event handlers
        this.#bindEvents();
    }
    
    // Private method to initialize UI
    #initializeUI() {
        const { step, max } = this.#config;
        this.#elements.stepInput.value = step;
        this.#elements.maxInput.value = max;
        this.#updateDisplay();
    }
    
    // Private method to bind events
    #bindEvents() {
        // Use arrow functions to maintain 'this' context
        this.#elements.increment.addEventListener('click', () => this.increment());
        this.#elements.decrement.addEventListener('click', () => this.decrement());
        
        // Settings change handlers
        this.#elements.stepInput.addEventListener('change', (e) => {
            this.#config.step = parseInt(e.target.value) || 1;
        });
        
        this.#elements.maxInput.addEventListener('change', (e) => {
            this.#config.max = parseInt(e.target.value) || 10;
            this.#updateButtonStates();
        });
    }
    
    // Private method to update the display
    #updateDisplay() {
        const { value } = this.#state;
        this.#elements.value.textContent = value;
        this.#updateButtonStates();
        this.#updateHistory();
    }
    
    // Private method to update button states
    #updateButtonStates() {
        const { value } = this.#state;
        const { max } = this.#config;
        
        this.#elements.increment.disabled = value >= max;
        this.#elements.decrement.disabled = value <= 0;
    }
    
    // Private method to update history
    #updateHistory() {
        const { history } = this.#state;
        const historyHTML = history
            .map(({ action, value, timestamp }) => `
                <div class="history-item">
                    ${action}: ${value} (${new Date(timestamp).toLocaleTimeString()})
                </div>
            `)
            .join('');
        
        this.#elements.historyList.innerHTML = historyHTML;
    }
    
    // Private method to add history entry
    #addToHistory(action) {
        const { value } = this.#state;
        this.#state.history = [
            {
                action,
                value,
                timestamp: new Date()
            },
            ...this.#state.history
        ].slice(0, 5); // Keep only last 5 entries
    }
    
    // Public methods
    increment() {
        const { step, max } = this.#config;
        const newValue = Math.min(this.#state.value + step, max);
        
        if (newValue !== this.#state.value) {
            this.#state.value = newValue;
            this.#addToHistory('Increment');
            this.#updateDisplay();
        }
    }
    
    decrement() {
        const { step } = this.#config;
        const newValue = Math.max(this.#state.value - step, 0);
        
        if (newValue !== this.#state.value) {
            this.#state.value = newValue;
            this.#addToHistory('Decrement');
            this.#updateDisplay();
        }
    }
    
    // Getter for current value
    get value() {
        return this.#state.value;
    }
    
    // Getter for history
    get history() {
        return [...this.#state.history];
    }
    
    // Method to reset counter
    reset() {
        this.#state.value = 0;
        this.#addToHistory('Reset');
        this.#updateDisplay();
    }
    
    // Method to update configuration
    updateConfig(newConfig = {}) {
        this.#config = {
            ...this.#config,
            ...newConfig
        };
        this.#initializeUI();
    }
}

// Export the Counter class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Counter;
} 