/*
Main Application
==============
This file demonstrates how to use the Counter component
and showcases the concepts learned throughout the week.
*/

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Create a new counter instance with custom configuration
    const counter = new Counter('counter1', {
        step: 1,
        max: 10
    });
    
    // Example of adding a keyboard shortcut handler using closure
    const createKeyHandler = (counter) => {
        const keyMap = {
            ArrowUp: () => counter.increment(),
            ArrowDown: () => counter.decrement(),
            'r': () => counter.reset()
        };
        
        return (event) => {
            const handler = keyMap[event.key];
            if (handler) {
                event.preventDefault();
                handler();
            }
        };
    };
    
    // Add keyboard controls
    document.addEventListener('keydown', createKeyHandler(counter));
    
    // Example of creating an analytics wrapper using closure and destructuring
    const withAnalytics = (counter) => {
        const { increment, decrement, reset } = counter;
        
        // Add analytics tracking
        const trackAction = (action) => {
            console.log(`Analytics: ${action} at ${new Date().toISOString()}`);
        };
        
        // Override methods to include analytics
        counter.increment = (...args) => {
            trackAction('increment');
            return increment.apply(counter, args);
        };
        
        counter.decrement = (...args) => {
            trackAction('decrement');
            return decrement.apply(counter, args);
        };
        
        counter.reset = (...args) => {
            trackAction('reset');
            return reset.apply(counter, args);
        };
        
        return counter;
    };
    
    // Add analytics tracking to our counter
    withAnalytics(counter);
    
    // Example of creating a state observer using closure and ES6 classes
    class CounterObserver {
        #subscribers = new Set();
        
        subscribe = (callback) => {
            this.#subscribers.add(callback);
            return () => this.#subscribers.delete(callback);
        };
        
        notify = (value) => {
            this.#subscribers.forEach(callback => callback(value));
        };
    }
    
    // Create an observer instance
    const observer = new CounterObserver();
    
    // Subscribe to counter changes
    observer.subscribe((value) => {
        console.log(`Counter value changed to: ${value}`);
    });
    
    // Example of extending the counter with a save/load feature using localStorage
    const addPersistence = (counter) => {
        // Load saved state
        const savedState = localStorage.getItem('counterState');
        if (savedState) {
            const { value, config } = JSON.parse(savedState);
            counter.updateConfig(config);
            // We can't set the value directly as it's private,
            // so we'll increment until we reach it
            while (counter.value < value) {
                counter.increment();
            }
        }
        
        // Save state periodically
        setInterval(() => {
            const state = {
                value: counter.value,
                config: {
                    step: parseInt(document.querySelector('.step-value').value),
                    max: parseInt(document.querySelector('.max-value').value)
                }
            };
            localStorage.setItem('counterState', JSON.stringify(state));
        }, 1000);
        
        return counter;
    };
    
    // Add persistence to our counter
    addPersistence(counter);
});

/*
This implementation demonstrates:
1. Closures for private state and function factories
2. ES6 Classes with private fields and methods
3. Event handling and 'this' binding
4. Destructuring and spread operators
5. Modern JavaScript features (arrow functions, template literals)
6. Modular design patterns
7. Local storage for persistence
*/ 