// Day 9: Functions in JavaScript
// ==========================

// 1. Basic Function Declaration
function sayHello() {
    console.log("Hello!");
}

// Calling the function
console.log("Basic function:");
sayHello();

// 2. Function with Parameters
function greet(name) {
    console.log(`Hello, ${name}!`);
}

console.log("\nFunction with parameters:");
greet("John");
greet("Sarah");

// 3. Function with Return Value
function add(a, b) {
    return a + b;
}

console.log("\nFunction with return value:");
let result = add(5, 3);
console.log("5 + 3 =", result);

// 4. Multiple Parameters and Return
function getFullName(firstName, lastName) {
    return `${firstName} ${lastName}`;
}

console.log("\nMultiple parameters:");
let fullName = getFullName("John", "Doe");
console.log("Full name:", fullName);

// 5. Default Parameters
function greetWithDefault(name = "Guest") {
    console.log(`Welcome, ${name}!`);
}

console.log("\nDefault parameters:");
greetWithDefault();          // Uses default value
greetWithDefault("Alice");   // Uses provided value

// 6. Simple Calculator Functions
console.log("\nCalculator Functions:");

function add(x, y) {
    return x + y;
}

function subtract(x, y) {
    return x - y;
}

function multiply(x, y) {
    return x * y;
}

function divide(x, y) {
    if (y === 0) {
        return "Cannot divide by zero!";
    }
    return x / y;
}

// Testing calculator functions
console.log("Addition: 10 + 5 =", add(10, 5));
console.log("Subtraction: 10 - 5 =", subtract(10, 5));
console.log("Multiplication: 10 * 5 =", multiply(10, 5));
console.log("Division: 10 / 5 =", divide(10, 5));
console.log("Division by zero:", divide(10, 0));

// 7. Function Expression
const square = function(number) {
    return number * number;
};

console.log("\nFunction expression:");
console.log("Square of 5:", square(5));

// 8. Arrow Function
const cube = (number) => number * number * number;

console.log("\nArrow function:");
console.log("Cube of 3:", cube(3));

// That's it for Day 9! You've learned:
// 1. How to declare functions
// 2. How to use parameters
// 3. How to return values
// 4. How to use default parameters
// 5. How to create a simple calculator
// 6. Different ways to write functions (declaration, expression, arrow) 