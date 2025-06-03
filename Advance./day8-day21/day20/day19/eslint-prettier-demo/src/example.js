// Example file demonstrating ESLint and Prettier rules

// Good practices
const PI = 3.14159;
const calculateArea = (radius) => PI * radius ** 2;

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((num) => num * 2);

// Object destructuring
const person = { name: 'John', age: 30 };
const { name, age } = person;

// Template literals
const greeting = `Hello, ${name}! You are ${age} years old.`;

// Class with proper spacing and indentation
class Calculator {
    constructor() {
        this.value = 0;
    }

    add(num) {
        this.value += num;
        return this;
    }

    subtract(num) {
        this.value -= num;
        return this;
    }

    getResult() {
        return this.value;
    }
}

// Async/await with proper error handling
async function fetchUserData(userId) {
    try {
        const response = await fetch(`https://api.example.com/users/${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        throw error;
    }
}

// Export named functions
export { calculateArea, doubled, Calculator, fetchUserData }; 