// Day 3: Data Types in JavaScript
// ===========================

// 1. String - for text
let name = "John";
let message = 'Hello';
let phrase = `Welcome ${name}`; // Template string
console.log("Strings:", name, message, phrase);
console.log("Type of name:", typeof name);

// 2. Number - for numbers (both integers and decimals)
let age = 25;
let price = 19.99;
let temperature = -5;
console.log("Numbers:", age, price, temperature);
console.log("Type of age:", typeof age);

// 3. Boolean - true or false
let isHappy = true;
let isSad = false;
console.log("Booleans:", isHappy, isSad);
console.log("Type of isHappy:", typeof isHappy);

// 4. Null - intentionally empty value
let empty = null;
console.log("Null value:", empty);
console.log("Type of empty:", typeof empty);

// 5. Undefined - unassigned value
let notDefined;
console.log("Undefined value:", notDefined);
console.log("Type of notDefined:", typeof notDefined);

// 6. Object - collection of data
let person = {
    name: "John",
    age: 25,
    isStudent: true
};
console.log("Object:", person);
console.log("Type of person:", typeof person);

// 7. Array - list of items (technically an object)
let colors = ["red", "green", "blue"];
console.log("Array:", colors);
console.log("Type of colors:", typeof colors);

// Practice with typeof
console.log("\nPractice with typeof:");
console.log("Type of '123':", typeof "123");        // string
console.log("Type of 123:", typeof 123);            // number
console.log("Type of true:", typeof true);          // boolean
console.log("Type of []:", typeof []);              // object
console.log("Type of {}:", typeof {});              // object

// That's it for Day 3! You've learned:
// 1. Different data types in JavaScript
// 2. How to use typeof to check data types
// 3. The difference between null and undefined
// 4. Basic objects and arrays 