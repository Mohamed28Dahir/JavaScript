// Day 24: Function Review and Arrow Functions
// =====================================

// 1. Traditional Function Declaration vs Arrow Function
// Traditional
function add(a, b) {
    return a + b;
}

// Arrow function
const addArrow = (a, b) => a + b;

// 2. Calculator Implementation
class Calculator {
    constructor() {
        this.result = document.getElementById('result');
        this.num1Input = document.getElementById('num1');
        this.num2Input = document.getElementById('num2');
        
        // Bind event handlers
        this.initializeCalculator();
    }
    
    // Traditional method
    initializeCalculator() {
        document.getElementById('add').addEventListener('click', () => this.performOperation(this.add));
        document.getElementById('subtract').addEventListener('click', () => this.performOperation(this.subtract));
        document.getElementById('multiply').addEventListener('click', () => this.performOperation(this.multiply));
        document.getElementById('divide').addEventListener('click', () => this.performOperation(this.divide));
    }
    
    // Arrow function properties
    add = (a, b) => a + b;
    subtract = (a, b) => a - b;
    multiply = (a, b) => a * b;
    divide = (a, b) => b !== 0 ? a / b : 'Cannot divide by zero';
    
    // Method to get input values
    getInputValues = () => ({
        num1: parseFloat(this.num1Input.value) || 0,
        num2: parseFloat(this.num2Input.value) || 0
    });
    
    // Display result with error handling
    displayResult = (result) => {
        this.result.textContent = `Result: ${result}`;
    };
    
    // Perform operation with validation
    performOperation = (operation) => {
        const { num1, num2 } = this.getInputValues();
        const result = operation(num1, num2);
        this.displayResult(result);
    };
}

// 3. Higher-Order Functions
const withValidation = (fn) => {
    return (...args) => {
        if (args.some(arg => typeof arg !== 'number')) {
            throw new Error('All arguments must be numbers');
        }
        return fn(...args);
    };
};

const withLogging = (fn) => {
    return (...args) => {
        console.log(`Calling function with args:`, args);
        const result = fn(...args);
        console.log(`Function result:`, result);
        return result;
    };
};

// 4. Function Composition
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);

// Example functions for composition
const double = x => x * 2;
const addOne = x => x + 1;
const square = x => x * x;

const computeValue = compose(square, addOne, double);

// 5. Callback Functions
const processArray = (arr, callback) => {
    return arr.map(callback);
};

// Example callbacks
const formatNumber = num => num.toFixed(2);
const addPrefix = str => `$${str}`;

// 6. Promise with Arrow Functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchData = async () => {
    try {
        await delay(1000); // Simulate API call
        return { success: true, data: 'Sample data' };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 7. IIFE (Immediately Invoked Function Expression) with Arrow Function
(() => {
    console.log('IIFE executed');
    // Initialize calculator
    const calculator = new Calculator();
    
    // Example of function composition
    console.log('Composed function result:', computeValue(5)); // Should be 121
    
    // Example of higher-order functions
    const validatedAdd = withValidation(add);
    const loggedAdd = withLogging(add);
    
    try {
        console.log('Validated add:', validatedAdd(5, 3));
        console.log('Logged add:', loggedAdd(5, 3));
    } catch (error) {
        console.error('Validation error:', error.message);
    }
    
    // Example of callback usage
    const numbers = [10.123, 20.456, 30.789];
    const formattedPrices = processArray(numbers, compose(addPrefix, formatNumber));
    console.log('Formatted prices:', formattedPrices);
    
    // Example of async/await with arrow functions
    (async () => {
        const result = await fetchData();
        console.log('Async result:', result);
    })();
})();

// 8. Function Currying with Arrow Functions
const multiply = (a) => (b) => a * b;
const multiplyByTwo = multiply(2);
const multiplyByTen = multiply(10);

// 9. Event Handling with Arrow Functions
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    
    // Example of event handling
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.opacity = '0.8';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.opacity = '1';
        });
    });
});

// 10. Error Handling with Arrow Functions
const tryCatch = (fn) => async (...args) => {
    try {
        return await fn(...args);
    } catch (error) {
        console.error('Error in function:', error);
        throw error;
    }
};

// That's it for Day 24! You've learned:
// 1. Traditional vs Arrow Functions
// 2. Calculator Implementation
// 3. Higher-Order Functions
// 4. Function Composition
// 5. Callback Functions
// 6. Promises with Arrow Functions
// 7. IIFE Pattern
// 8. Function Currying
// 9. Event Handling
// 10. Error Handling 