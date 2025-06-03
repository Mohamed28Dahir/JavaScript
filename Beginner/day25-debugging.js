// Day 25: Debugging in JavaScript
// ============================

// 1. Common Bug: Counter with Closure Issues
let buggyCounter = 0;
const debugOutput = document.getElementById('debugOutput');

function displayDebugMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    debugOutput.appendChild(messageElement);
    
    // Keep only last 5 messages
    while (debugOutput.children.length > 5) {
        debugOutput.removeChild(debugOutput.firstChild);
    }
}

// Buggy implementation
document.getElementById('buggyButton1').addEventListener('click', function() {
    // Bug: Variable scope issue
    for (var i = 0; i < 3; i++) {
        setTimeout(function() {
            buggyCounter++;
            displayDebugMessage(`Counter: ${buggyCounter}`);
        }, i * 1000);
    }
});

// Fixed implementation
document.getElementById('buggyButton1').addEventListener('click', function() {
    // Fix: Use let for block scope
    for (let i = 0; i < 3; i++) {
        setTimeout(function() {
            buggyCounter++;
            displayDebugMessage(`Counter (Fixed): ${buggyCounter}`);
        }, i * 1000);
    }
});

// 2. Common Bug: Timer Memory Leak
let timerIds = [];

// Buggy implementation
document.getElementById('buggyButton2').addEventListener('click', function() {
    // Bug: Timer not cleared
    const timerId = setInterval(function() {
        displayDebugMessage('Timer tick');
    }, 1000);
    timerIds.push(timerId);
});

// Fixed implementation
document.getElementById('buggyButton2').addEventListener('click', function() {
    // Fix: Clear previous timers
    timerIds.forEach(clearInterval);
    timerIds = [];
    
    const timerId = setInterval(function() {
        displayDebugMessage('Timer tick (Fixed)');
    }, 1000);
    timerIds.push(timerId);
});

// 3. Common Bug: Calculator with Type Coercion
// Buggy implementation
function buggyCalculate(a, b) {
    // Bug: Type coercion issues
    return a + b;
}

// Fixed implementation
function fixedCalculate(a, b) {
    // Fix: Ensure numbers and handle edge cases
    const num1 = Number(a);
    const num2 = Number(b);
    
    if (isNaN(num1) || isNaN(num2)) {
        throw new Error('Invalid numbers');
    }
    
    return num1 + num2;
}

document.getElementById('buggyButton3').addEventListener('click', function() {
    try {
        // Bug demonstration
        const buggyResult = buggyCalculate('5', '10');
        displayDebugMessage(`Buggy calc: '5' + '10' = ${buggyResult}`);
        
        // Fixed version
        const fixedResult = fixedCalculate('5', '10');
        displayDebugMessage(`Fixed calc: '5' + '10' = ${fixedResult}`);
    } catch (error) {
        displayDebugMessage(`Error: ${error.message}`);
    }
});

// 4. Debugging Techniques
function debuggingDemo() {
    // Console logging
    console.log('Basic log');
    console.info('Info message');
    console.warn('Warning message');
    console.error('Error message');
    
    // Console table
    console.table([
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 }
    ]);
    
    // Console group
    console.group('Calculation Steps');
    console.log('Step 1: Input validation');
    console.log('Step 2: Calculation');
    console.log('Step 3: Output formatting');
    console.groupEnd();
    
    // Console trace
    function trace() {
        console.trace('Trace message');
    }
    trace();
    
    // Console time
    console.time('Loop time');
    for (let i = 0; i < 1000000; i++) {
        // Some operation
    }
    console.timeEnd('Loop time');
}

// 5. Error Handling Best Practices
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

function validateInput(value) {
    // Proper error handling
    try {
        if (typeof value !== 'number') {
            throw new ValidationError('Input must be a number');
        }
        if (value < 0) {
            throw new ValidationError('Input must be positive');
        }
        return true;
    } catch (error) {
        if (error instanceof ValidationError) {
            displayDebugMessage(`Validation Error: ${error.message}`);
        } else {
            displayDebugMessage(`Unexpected Error: ${error.message}`);
        }
        return false;
    }
}

// 6. Async Debugging
async function asyncDebugDemo() {
    try {
        console.log('Starting async operation');
        
        const result = await new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.5) {
                    resolve('Success');
                } else {
                    reject(new Error('Random failure'));
                }
            }, 1000);
        });
        
        console.log('Async result:', result);
    } catch (error) {
        console.error('Async error:', error);
    }
}

// 7. Performance Debugging
function performanceDemo() {
    console.profile('Performance Test');
    
    const startTime = performance.now();
    
    // Inefficient code
    let array = [];
    for (let i = 0; i < 10000; i++) {
        array.push(i);
        array = array.filter(num => num % 2 === 0);
    }
    
    const endTime = performance.now();
    console.log(`Operation took ${endTime - startTime}ms`);
    
    console.profileEnd('Performance Test');
}

// Initialize debugging demos
(() => {
    debuggingDemo();
    asyncDebugDemo();
    performanceDemo();
    
    // Add some initial debug output
    displayDebugMessage('Debugging session started');
    displayDebugMessage('Click buttons to see common bugs and fixes');
})();

// That's it for Day 25! You've learned:
// 1. Common JavaScript bugs and fixes
// 2. Console debugging techniques
// 3. Error handling best practices
// 4. Async debugging
// 5. Performance debugging
// 6. Memory leak prevention
// 7. Type coercion issues 