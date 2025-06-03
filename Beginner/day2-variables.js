// Day 2: Variables in JavaScript
// ==========================

// 1. Using 'let' - for variables that can change
let age = 25;
console.log("Age:", age);
age = 26;  // We can change the value
console.log("New age:", age);

// 2. Using 'const' - for variables that cannot change
const birthYear = 1998;
console.log("Birth year:", birthYear);
// birthYear = 1999;  // This would cause an error!

// 3. Using 'var' (old way, not recommended for modern JavaScript)
var oldWayVariable = "Hello";
console.log("Old way:", oldWayVariable);

// Examples of different variable uses
let userName = "John";           // String
let userAge = 30;               // Number
let isStudent = true;           // Boolean
let favoriteColors = ["blue", "red"]; // Array

// Printing all our variables
console.log("Name:", userName);
console.log("Age:", userAge);
console.log("Is student?", isStudent);
console.log("Favorite colors:", favoriteColors);

// Variable naming rules:
let goodName = "Valid";         // Valid name
let $specialName = "Valid";     // Can start with $
let _anotherName = "Valid";     // Can start with _
// let 123name = "Invalid";     // Cannot start with number
// let my-name = "Invalid";     // Cannot use dash

// That's it for Day 2! You've learned:
// 1. How to use let, const, and var
// 2. How to declare variables
// 3. How to change variable values
// 4. Variable naming rules 