/*
 * Day 1: Execution Context & Call Stack
 * 
 * The JavaScript engine creates an execution context whenever code is executed.
 * There are two types of execution contexts:
 * 1. Global Execution Context (GEC)
 * 2. Function Execution Context (FEC)
 */

// Global Execution Context Example
const globalVariable = "I'm in global scope";

// This function demonstrates the creation of a new execution context
function firstFunction() {
    const firstVar = "I'm in first function";
    secondFunction(); // Creates another execution context
    
    console.log(firstVar); // This will be executed after secondFunction completes
}

function secondFunction() {
    const secondVar = "I'm in second function";
    console.log(secondVar);
    // When this function completes, its execution context is popped off the stack
}

// Example of Call Stack in action
console.log("1. Program starts - Global Execution Context");
firstFunction();
console.log("4. Program ends - Back to Global Execution Context");

/*
 * Call Stack Visualization:
 * 
 * Initial State:
 * [Global Execution Context]
 * 
 * After calling firstFunction:
 * [firstFunction Execution Context]
 * [Global Execution Context]
 * 
 * After calling secondFunction from within firstFunction:
 * [secondFunction Execution Context]
 * [firstFunction Execution Context]
 * [Global Execution Context]
 * 
 * After secondFunction completes:
 * [firstFunction Execution Context]
 * [Global Execution Context]
 * 
 * After firstFunction completes:
 * [Global Execution Context]
 */

// Memory Creation Phase Example
console.log(hoistedVar); // undefined
var hoistedVar = "I am hoisted";

function memoryExample() {
    console.log(localVar); // undefined
    var localVar = "Local variable";
}

memoryExample();

/*
 * Practice Exercise:
 * Try to predict the output of the following code and understand why:
 */

function outer() {
    console.log("Outer function");
    
    function inner() {
        console.log("Inner function");
    }
    
    inner();
}

outer(); 