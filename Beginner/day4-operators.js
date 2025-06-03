// Day 4: Operators in JavaScript
// ===========================

// 1. Arithmetic Operators
let a = 10;
let b = 5;

console.log("Arithmetic Operators:");
console.log("Addition:", a + b);        // 15
console.log("Subtraction:", a - b);     // 5
console.log("Multiplication:", a * b);   // 50
console.log("Division:", a / b);        // 2
console.log("Modulus (remainder):", a % b);  // 0
console.log("Exponentiation:", a ** 2); // 100

// 2. Assignment Operators
console.log("\nAssignment Operators:");
let x = 10;
console.log("Original x:", x);

x += 5;  // Same as: x = x + 5
console.log("After x += 5:", x);

x -= 3;  // Same as: x = x - 3
console.log("After x -= 3:", x);

x *= 2;  // Same as: x = x * 2
console.log("After x *= 2:", x);

x /= 4;  // Same as: x = x / 4
console.log("After x /= 4:", x);

// 3. Comparison Operators
console.log("\nComparison Operators:");
let num1 = 5;
let num2 = "5";

console.log("Equal to (==):", num1 == num2);       // true (converts types)
console.log("Strictly equal (===):", num1 === num2); // false (checks types)
console.log("Not equal (!=):", num1 != num2);      // false
console.log("Strictly not equal (!==):", num1 !== num2); // true
console.log("Greater than (>):", num1 > 3);        // true
console.log("Less than (<):", num1 < 10);          // true
console.log("Greater than or equal (>=):", num1 >= 5); // true
console.log("Less than or equal (<=):", num1 <= 5);    // true

// 4. Increment and Decrement
console.log("\nIncrement and Decrement:");
let count = 1;
console.log("Original count:", count);
count++;  // Increment by 1
console.log("After increment:", count);
count--;  // Decrement by 1
console.log("After decrement:", count);

// That's it for Day 4! You've learned:
// 1. Arithmetic operators (+, -, *, /, %, **)
// 2. Assignment operators (=, +=, -=, *=, /=)
// 3. Comparison operators (==, ===, !=, !==, >, <, >=, <=)
// 4. Increment (++) and Decrement (--) operators 