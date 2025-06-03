/*
Day 1: JavaScript Execution Concepts
=================================

This file covers three main concepts:
1. Call Stack
2. Hoisting
3. Scope

Let's explore each concept with examples.
*/

// 1. Call Stack
// ============
// The call stack is like a to-do list that JavaScript uses to keep track of function calls
console.log('--- Call Stack Example ---');

function multiply(x, y) {
    return x * y;
}

function square(n) {
    return multiply(n, n);
}

function printSquare(n) {
    const result = square(n);
    console.log(result);
}

// When we call printSquare(4), the call stack will look like:
// 1. printSquare(4)
// 2. square(4)
// 3. multiply(4, 4)
printSquare(4); // Output: 16

// 2. Hoisting
// ===========
// Hoisting is JavaScript's default behavior of moving declarations to the top
console.log('\n--- Hoisting Example ---');

// Variable hoisting
console.log(hoistedVar); // Output: undefined
var hoistedVar = "I'm hoisted!";

// Function hoisting
hoistedFunction(); // This works because function declarations are hoisted

function hoistedFunction() {
    console.log("I can be called before I'm defined!");
}

// let and const are NOT hoisted
try {
    console.log(notHoisted);
} catch (e) {
    console.log('Error: Cannot access notHoisted before initialization');
}
let notHoisted = "I'm not hoisted";

// 3. Scope
// ========
// Scope determines the accessibility of variables
console.log('\n--- Scope Example ---');

// Global scope
const globalVar = "I'm global";

function scopeExample() {
    // Function scope
    const functionVar = "I'm function-scoped";
    
    if (true) {
        // Block scope
        let blockVar = "I'm block-scoped";
        var functionScopedVar = "I'm function-scoped too";
        console.log(blockVar); // Accessible
        console.log(functionVar); // Accessible
        console.log(globalVar); // Accessible
    }
    
    // console.log(blockVar); // Would throw ReferenceError
    console.log(functionScopedVar); // Accessible
    console.log(globalVar); // Accessible
}

scopeExample();

// Practice Exercise
// ================
console.log('\n--- Practice Exercise ---');

function traceExecution() {
    console.log('First');
    
    setTimeout(() => {
        console.log('Third - after 0ms timeout');
    }, 0);
    
    console.log('Second');
}

// Try to predict the order of these logs:
traceExecution();

/*
Key Takeaways:
1. Call Stack: JavaScript uses a call stack to manage function execution order
2. Hoisting: Declarations are moved to the top of their scope
3. Scope: Variables have different levels of accessibility (global, function, block)

Practice:
1. Try commenting out different parts of the code and predict the output
2. Modify the traceExecution function to include more async operations
3. Create your own examples of nested scopes
*/ 