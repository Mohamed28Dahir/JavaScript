// Import styles
import './styles.css';

// Modern JavaScript features
const greeting = 'Hello, Webpack!';
const numbers = [1, 2, 3, 4, 5];

// Arrow function
const double = x => x * 2;

// Array methods
const doubled = numbers.map(double);

// Template literals
const message = `${greeting} Here are some doubled numbers: ${doubled.join(', ')}`;

// Async/await
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

// Class with private fields
class Counter {
    #count = 0;
    
    increment() {
        this.#count++;
        return this.#count;
    }
    
    getCount() {
        return this.#count;
    }
}

// DOM manipulation
document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    
    // Create elements
    const messageElement = document.createElement('h1');
    messageElement.textContent = message;
    
    const button = document.createElement('button');
    button.textContent = 'Click me!';
    
    const counter = new Counter();
    button.addEventListener('click', () => {
        const count = counter.increment();
        button.textContent = `Clicked ${count} times`;
    });
    
    // Append elements
    app.appendChild(messageElement);
    app.appendChild(button);
}); 