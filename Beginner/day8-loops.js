// Day 8: Loops in JavaScript
// =======================

// 1. For Loop
console.log("Basic for loop (counting 1-5):");
for (let i = 1; i <= 5; i++) {
    console.log(i);
}

// 2. For loop to sum numbers
let sum = 0;
for (let i = 1; i <= 10; i++) {
    sum += i;
}
console.log("\nSum of numbers 1-10:", sum);

// 3. While loop
console.log("\nWhile loop example:");
let count = 1;
while (count <= 5) {
    console.log(`Count is: ${count}`);
    count++;
}

// 4. Do...while loop (runs at least once)
console.log("\nDo-while loop example:");
let number = 1;
do {
    console.log(`Number is: ${number}`);
    number++;
} while (number <= 3);

// 5. Break statement
console.log("\nUsing break statement:");
for (let i = 1; i <= 10; i++) {
    if (i === 6) {
        console.log("Found 6! Stopping loop.");
        break;
    }
    console.log(i);
}

// 6. Continue statement
console.log("\nUsing continue statement (skipping even numbers):");
for (let i = 1; i <= 5; i++) {
    if (i % 2 === 0) {
        continue; // Skip even numbers
    }
    console.log(i);
}

// 7. Practical Example: Multiplication Table
console.log("\nMultiplication Table for 5:");
for (let i = 1; i <= 10; i++) {
    console.log(`5 × ${i} = ${5 * i}`);
}

// 8. Nested Loops
console.log("\nNested Loops - Small multiplication table:");
for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
        console.log(`${i} × ${j} = ${i * j}`);
    }
    console.log("---");
}

// That's it for Day 8! You've learned:
// 1. How to use for loops
// 2. How to use while loops
// 3. How to use do...while loops
// 4. How to use break and continue
// 5. How to work with nested loops
 