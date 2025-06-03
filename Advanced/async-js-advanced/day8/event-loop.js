/*
 * Day 8: Event Loop & Microtasks
 * Topics covered:
 * 1. Call Stack
 * 2. Macrotasks (Tasks)
 * 3. Microtasks
 * 4. Event Loop Timing
 */

// 1. Understanding the Call Stack
function firstFunction() {
    console.log('Inside first function');
    secondFunction();
}

function secondFunction() {
    console.log('Inside second function');
    thirdFunction();
}

function thirdFunction() {
    console.log('Inside third function');
    console.trace('Call stack trace');
}

// Uncomment to see call stack in action
// firstFunction();

// 2. Macrotasks vs Microtasks
console.log('Script start'); // 1

// Macrotask (setTimeout)
setTimeout(() => {
    console.log('Timeout 1'); // 5
}, 0);

// Microtask (Promise)
Promise.resolve()
    .then(() => {
        console.log('Promise 1'); // 3
    });

// Microtask (queueMicrotask)
queueMicrotask(() => {
    console.log('Microtask 1'); // 4
});

console.log('Script end'); // 2

// 3. Complex Event Loop Example
console.log('Start'); // 1

setTimeout(() => {
    console.log('Timeout 1'); // 6
    Promise.resolve().then(() => {
        console.log('Promise inside timeout'); // 7
    });
}, 0);

Promise.resolve()
    .then(() => {
        console.log('Promise 1'); // 3
        setTimeout(() => {
            console.log('Timeout 2'); // 8
        }, 0);
    })
    .then(() => {
        console.log('Promise 2'); // 4
    });

queueMicrotask(() => {
    console.log('Microtask 1'); // 5
});

console.log('End'); // 2

// 4. Practical Examples

// Example 1: UI Update Timing
function simulateUIUpdate() {
    console.log('Starting UI update');
    
    // Macrotask: UI render
    setTimeout(() => {
        console.log('UI rendered');
        
        // Microtask: Post-render cleanup
        Promise.resolve().then(() => {
            console.log('Cleanup after render');
        });
    }, 0);
    
    // Microtask: Prepare data
    Promise.resolve().then(() => {
        console.log('Data prepared');
    });
}

// Example 2: Data Processing Pipeline
function processDataWithMicrotasks(data) {
    console.log('Starting data processing');
    
    Promise.resolve(data)
        .then(step1)
        .then(step2)
        .then(finalStep);
    
    queueMicrotask(() => {
        console.log('Microtask: Monitoring started');
    });
    
    setTimeout(() => {
        console.log('Macrotask: Processing complete');
    }, 0);
}

function step1(data) {
    return `${data} - step1`;
}

function step2(data) {
    return `${data} - step2`;
}

function finalStep(data) {
    console.log('Final result:', data);
}

// 5. Advanced Timing Control

// Example: Controlled execution order
async function controlledExecution() {
    console.log('Start controlled execution');
    
    // First batch of microtasks
    await Promise.resolve();
    console.log('First microtask batch');
    
    // Force next macrotask
    await new Promise(resolve => setTimeout(resolve, 0));
    console.log('First macrotask batch');
    
    // Second batch of microtasks
    await Promise.resolve();
    console.log('Second microtask batch');
}

// 6. Practice Exercises

// Exercise 1: Predict the output order
function exercise1() {
    console.log('Exercise 1 start');
    
    setTimeout(() => console.log('Timeout 1'), 0);
    setTimeout(() => console.log('Timeout 2'), 0);
    
    Promise.resolve()
        .then(() => console.log('Promise 1'))
        .then(() => console.log('Promise 2'));
    
    queueMicrotask(() => console.log('Microtask 1'));
    
    console.log('Exercise 1 end');
}

// Exercise 2: Fix the execution order
function exercise2() {
    const steps = [];
    
    setTimeout(() => steps.push('Step 3'), 0);
    steps.push('Step 1');
    Promise.resolve().then(() => steps.push('Step 2'));
    
    // How would you log steps in order: Step 1, Step 2, Step 3?
}

// Exercise 3: Create a delayed execution queue
class TaskQueue {
    constructor() {
        this.queue = [];
    }
    
    addTask(task) {
        this.queue.push(task);
        return this;
    }
    
    execute() {
        // Implement execution logic using microtasks and macrotasks
        // to process the queue with proper timing
    }
}

// 7. Best Practices
/*
 * 1. Use microtasks for:
 *    - Immediate state updates
 *    - Data processing that should happen before next render
 *    - Cleanup operations
 *
 * 2. Use macrotasks for:
 *    - UI updates
 *    - Heavy computations
 *    - Operations that can be delayed
 *
 * 3. Avoid mixing microtasks and macrotasks unless necessary
 *
 * 4. Be careful with nested microtasks (can block the event loop)
 *
 * 5. Use async/await for better readability when dealing with
 *    complex microtask chains
 */

// 8. Testing Event Loop Behavior
function testEventLoop() {
    const start = performance.now();
    
    function logTiming(label) {
        console.log(`${label}: ${(performance.now() - start).toFixed(2)}ms`);
    }
    
    logTiming('Start');
    
    setTimeout(() => logTiming('Timeout'), 0);
    
    Promise.resolve()
        .then(() => logTiming('Promise'))
        .then(() => logTiming('Promise chain'));
    
    queueMicrotask(() => logTiming('Microtask'));
    
    requestAnimationFrame(() => logTiming('Animation frame'));
    
    logTiming('End');
}

// Uncomment to run examples
// simulateUIUpdate();
// processDataWithMicrotasks('test-data');
// controlledExecution();
// exercise1();
// exercise2();
// testEventLoop(); 