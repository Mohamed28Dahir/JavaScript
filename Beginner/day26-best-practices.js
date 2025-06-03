// Day 26: JavaScript Best Practices
// ==============================

// Load example code blocks
const originalCode = document.getElementById('originalCode');
const refactoredCode = document.getElementById('refactoredCode');

// 1. Naming Conventions
// Bad Example
const x = 'John';
const y = 'Doe';
const z = `${x} ${y}`;

// Good Example
const firstName = 'John';
const lastName = 'Doe';
const fullName = `${firstName} ${lastName}`;

// 2. Function Organization
// Bad Example
function do_something(a,b,c) {
    var result = a+b;
    result = result * c;
    return result
}

// Good Example
function calculateTotal(basePrice, taxRate, quantity) {
    const priceWithTax = basePrice * (1 + taxRate);
    const total = priceWithTax * quantity;
    return total;
}

// 3. Variable Declarations
// Bad Example
var name = 'John';
var age = 30;
var items = ['book', 'pen'];
items.push('pencil');
name = 'Jane';

// Good Example
const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest'
};

let currentUser = 'John';
const maxLoginAttempts = 3;

// 4. Error Handling
// Bad Example
function divideNumbers(a, b) {
    return a / b;
}

// Good Example
function divideSafely(dividend, divisor) {
    if (typeof dividend !== 'number' || typeof divisor !== 'number') {
        throw new TypeError('Both arguments must be numbers');
    }
    
    if (divisor === 0) {
        throw new Error('Cannot divide by zero');
    }
    
    return dividend / divisor;
}

// 5. Async Code
// Bad Example
function fetchUserData(callback) {
    setTimeout(() => {
        const user = { id: 1, name: 'John' };
        callback(user);
    }, 1000);
}

// Good Example
async function fetchUserDataAsync() {
    try {
        const response = await fetch('https://api.example.com/user');
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

// 6. Object and Array Manipulation
// Bad Example
const user = {};
user.name = 'John';
user.age = 30;
user.email = 'john@example.com';

// Good Example
const userProfile = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
    preferences: {
        theme: 'dark',
        notifications: true
    }
};

// 7. Loops and Iterations
// Bad Example
for (var i = 0; i < items.length; i++) {
    console.log(items[i]);
}

// Good Example
const items = ['book', 'pen', 'pencil'];
items.forEach(item => console.log(item));

// Or using for...of
for (const item of items) {
    console.log(item);
}

// 8. Conditional Statements
// Bad Example
function checkValue(value) {
    if (value == true) {
        return 'Yes';
    } else {
        return 'No';
    }
}

// Good Example
function checkValue(value) {
    return value === true ? 'Yes' : 'No';
}

// 9. Module Organization
// Bad Example
function helper1() { /* ... */ }
function helper2() { /* ... */ }
function helper3() { /* ... */ }

// Good Example
const UserHelpers = {
    formatName(firstName, lastName) {
        return `${firstName} ${lastName}`;
    },
    
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    generateUsername(firstName, lastName) {
        return `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    }
};

// 10. Comments and Documentation
// Bad Example
// This function does something
function doSomething() {
    // Do stuff
    const x = 1 + 2;
    return x;
}

// Good Example
/**
 * Calculates the total price including tax and quantity
 * @param {number} basePrice - The base price of the item
 * @param {number} taxRate - The tax rate as a decimal
 * @param {number} quantity - The number of items
 * @returns {number} The total price
 */
function calculateTotalPrice(basePrice, taxRate, quantity) {
    const priceWithTax = basePrice * (1 + taxRate);
    return priceWithTax * quantity;
}

// Display examples in the UI
function displayExamples() {
    // Bad code example
    const badCode = `
// Inconsistent naming and poor organization
var x = 'John';
var y = 'Doe';
var z = x + ' ' + y;

function do_something(a,b,c) {
    var result = a+b;
    result = result * c;
    return result
}

// No error handling
function divideNumbers(a, b) {
    return a / b;
}

// Callback hell
fetchData(function(data) {
    processData(data, function(result) {
        saveData(result, function(response) {
            console.log(response);
        });
    });
});
    `;
    
    // Good code example
    const goodCode = `
// Clear naming and consistent organization
const firstName = 'John';
const lastName = 'Doe';
const fullName = \`\${firstName} \${lastName}\`;

function calculateTotal(basePrice, taxRate, quantity) {
    const priceWithTax = basePrice * (1 + taxRate);
    return priceWithTax * quantity;
}

// Proper error handling
function divideSafely(dividend, divisor) {
    if (typeof dividend !== 'number' || typeof divisor !== 'number') {
        throw new TypeError('Both arguments must be numbers');
    }
    
    if (divisor === 0) {
        throw new Error('Cannot divide by zero');
    }
    
    return dividend / divisor;
}

// Async/await for better readability
async function processDataFlow() {
    try {
        const data = await fetchData();
        const result = await processData(data);
        const response = await saveData(result);
        return response;
    } catch (error) {
        console.error('Error in data flow:', error);
        throw error;
    }
}
    `;
    
    originalCode.textContent = badCode;
    refactoredCode.textContent = goodCode;
}

// Initialize the display
displayExamples();

// That's it for Day 26! You've learned:
// 1. Proper naming conventions
// 2. Function organization
// 3. Variable declarations best practices
// 4. Error handling patterns
// 5. Async code best practices
// 6. Object and array manipulation
// 7. Loop and iteration best practices
// 8. Conditional statement patterns
// 9. Module organization
// 10. Documentation standards 