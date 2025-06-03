/*
 * Day 4: Memory Management in JavaScript
 * 
 * Topics covered:
 * 1. Memory Lifecycle
 * 2. Garbage Collection
 * 3. Memory Leaks
 * 4. Best Practices
 */

// Memory Lifecycle Example
function memoryLifecycle() {
    // 1. Memory Allocation
    const number = 123;              // Allocates memory for a number
    const string = "Hello";          // Allocates memory for a string
    const object = {                 // Allocates memory for an object and its contents
        name: "John",
        age: 30
    };
    const array = [1, 2, 3];         // Allocates memory for an array and its elements
    
    // 2. Memory Use
    console.log(number);             // Using the allocated memory
    object.name = "Jane";            // Using and modifying the allocated memory
    array.push(4);                   // Allocating additional memory for the new element
    
    // 3. Memory Release
    // When this function ends, all these variables go out of scope
    // and become eligible for garbage collection
}

// Memory Leak Example 1: Global Variables
function leakGlobal() {
    globalVar = "I am leaking!";     // Missing 'const' or 'let' - creates global variable
}

// Memory Leak Example 2: Forgotten Timers
function startTimer() {
    const heavyObject = {
        data: new Array(10000).fill('🔴')
    };
    
    setInterval(() => {
        console.log(heavyObject.data.length);
    }, 1000);
    // Timer keeps running and heavyObject can't be garbage collected
}

// Better version with cleanup
function startTimerWithCleanup() {
    const heavyObject = {
        data: new Array(10000).fill('🔴')
    };
    
    const timerId = setInterval(() => {
        console.log(heavyObject.data.length);
    }, 1000);
    
    // Cleanup function
    return function cleanup() {
        clearInterval(timerId);
        // Now heavyObject can be garbage collected
    };
}

// Memory Leak Example 3: Closures
function createLeak() {
    const leak = {
        data: new Array(10000).fill('🔴')
    };
    
    return function() {
        console.log(leak); // Keeps the entire leak object in memory
    };
}

// Better version
function createNonLeak() {
    const leak = {
        data: new Array(10000).fill('🔴')
    };
    const length = leak.data.length;
    
    return function() {
        console.log(length); // Only keeps the length value
    };
}

// Memory Leak Example 4: Event Listeners
function addEventListeners() {
    const button = document.createElement('button');
    const heavyData = new Array(10000).fill('🔴');
    
    button.addEventListener('click', function() {
        console.log(heavyData.length);
    });
    // If button is removed without removing event listener,
    // heavyData can't be garbage collected
}

// Better version
function addEventListenersWithCleanup() {
    const button = document.createElement('button');
    const heavyData = new Array(10000).fill('🔴');
    
    const handler = () => {
        console.log(heavyData.length);
    };
    
    button.addEventListener('click', handler);
    
    return function cleanup() {
        button.removeEventListener('click', handler);
    };
}

// WeakMap and WeakSet Example
function weakCollections() {
    // WeakMap allows garbage collection of its keys
    const weakMap = new WeakMap();
    let object = { data: "some data" };
    
    weakMap.set(object, "metadata");
    object = null; // object becomes eligible for garbage collection
                  // despite being referenced in weakMap
    
    // WeakSet example
    const weakSet = new WeakSet();
    let object2 = { data: "more data" };
    
    weakSet.add(object2);
    object2 = null; // object2 can be garbage collected
}

// Memory Usage Monitoring
function monitorMemory() {
    if (window.performance && window.performance.memory) {
        console.log('Total JS heap size:', window.performance.memory.totalJSHeapSize);
        console.log('Used JS heap size:', window.performance.memory.usedJSHeapSize);
        console.log('JS heap size limit:', window.performance.memory.jsHeapSizeLimit);
    }
}

/*
 * Best Practices for Memory Management:
 * 
 * 1. Avoid global variables
 * 2. Close over only the variables you need in closures
 * 3. Clear intervals and timeouts when not needed
 * 4. Remove event listeners when elements are removed
 * 5. Use WeakMap and WeakSet when appropriate
 * 6. Be careful with circular references
 * 7. Monitor memory usage in development
 */

// Practice Exercise: Memory Leak Detection
function leakDetectionExample() {
    const leaks = [];
    
    function createLeak() {
        const largeArray = new Array(1000000).fill('🔴');
        leaks.push(function() {
            console.log(largeArray.length);
        });
    }
    
    // Create multiple leaks
    for(let i = 0; i < 10; i++) {
        createLeak();
    }
    
    // Fix: Clear the leaks array and remove references
    function cleanup() {
        leaks.length = 0;
    }
    
    return cleanup;
}

// Uncomment to run examples
// const cleanup = leakDetectionExample();
// cleanup(); // Fixes the leak 