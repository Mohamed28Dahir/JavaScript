/*
 * Day 2: Scope Chain & Closures Deep Dive
 * 
 * Scope Chain: The way JavaScript looks for variables in nested scopes
 * Closures: A function that has access to variables in its outer scope
 */

// Scope Chain Example
const globalVar = "I'm global";

function outerFunction() {
    const outerVar = "I'm from outer";
    
    function innerFunction() {
        const innerVar = "I'm from inner";
        console.log(innerVar);    // Local scope
        console.log(outerVar);    // Outer scope
        console.log(globalVar);   // Global scope
    }
    
    innerFunction();
}

// Closure Example 1: Basic Closure
function createCounter() {
    let count = 0;  // This variable is "closed over"
    
    return {
        increment: function() {
            count++;
            return count;
        },
        decrement: function() {
            count--;
            return count;
        },
        getCount: function() {
            return count;
        }
    };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1

// Closure Example 2: Memory Efficiency with Event Handlers
function createButtonHandler(message) {
    // The message variable is closed over
    return function() {
        console.log(message);
    };
}

// Usage in browser:
// const button = document.createElement('button');
// button.addEventListener('click', createButtonHandler('Button clicked!'));

// Closure Example 3: Data Privacy
function createBankAccount(initialBalance) {
    let balance = initialBalance; // Private variable
    
    return {
        deposit: function(amount) {
            if (amount > 0) {
                balance += amount;
                return `Deposited ${amount}. New balance: ${balance}`;
            }
            return "Invalid deposit amount";
        },
        withdraw: function(amount) {
            if (amount > 0 && amount <= balance) {
                balance -= amount;
                return `Withdrawn ${amount}. New balance: ${balance}`;
            }
            return "Invalid withdrawal amount";
        },
        getBalance: function() {
            return balance;
        }
    };
}

// Garbage Collection and Memory Management
function potentialMemoryLeak() {
    const heavyData = new Array(1000000);
    
    return function() {
        console.log(heavyData.length);
    };
}

// Better version - only keep what's needed
function optimizedVersion() {
    const heavyData = new Array(1000000);
    const length = heavyData.length;
    
    return function() {
        console.log(length);
    };
    // heavyData will be garbage collected
}

/*
 * Practice Exercise:
 * Create a function that generates unique IDs using closure
 */

function createIdGenerator() {
    let id = 0;
    
    return function generateId() {
        id++;
        return `ID_${id}`;
    };
}

const generateId = createIdGenerator();
console.log(generateId()); // "ID_1"
console.log(generateId()); // "ID_2"
console.log(generateId()); // "ID_3" 