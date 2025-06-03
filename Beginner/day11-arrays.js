// Day 11: Arrays in JavaScript
// =========================

// 1. Creating Arrays
let fruits = ["apple", "banana", "orange"];
let numbers = [1, 2, 3, 4, 5];
let mixed = ["text", 42, true, null];

console.log("Basic arrays:");
console.log("Fruits:", fruits);
console.log("Numbers:", numbers);
console.log("Mixed types:", mixed);

// 2. Accessing Array Elements
console.log("\nAccessing array elements:");
console.log("First fruit:", fruits[0]);
console.log("Second fruit:", fruits[1]);
console.log("Last fruit:", fruits[fruits.length - 1]);

// 3. Modifying Arrays
console.log("\nModifying arrays:");
fruits[1] = "grape";
console.log("After changing banana to grape:", fruits);

// 4. Array Length
console.log("\nArray length:");
console.log("Number of fruits:", fruits.length);

// 5. Adding Elements
console.log("\nAdding elements:");
// Add to end
fruits.push("mango");
console.log("After push:", fruits);

// Add to beginning
fruits.unshift("pear");
console.log("After unshift:", fruits);

// 6. Removing Elements
console.log("\nRemoving elements:");
// Remove from end
let lastFruit = fruits.pop();
console.log("Removed last fruit:", lastFruit);
console.log("After pop:", fruits);

// Remove from beginning
let firstFruit = fruits.shift();
console.log("Removed first fruit:", firstFruit);
console.log("After shift:", fruits);

// 7. Finding Elements
console.log("\nFinding elements:");
let appleIndex = fruits.indexOf("apple");
console.log("Index of apple:", appleIndex);

let hasOrange = fruits.includes("orange");
console.log("Has orange?", hasOrange);

// 8. Slicing Arrays
console.log("\nSlicing arrays:");
let slicedFruits = fruits.slice(1, 3);
console.log("Sliced fruits (index 1 to 2):", slicedFruits);

// 9. Combining Arrays
console.log("\nCombining arrays:");
let moreFruits = ["kiwi", "pineapple"];
let allFruits = fruits.concat(moreFruits);
console.log("Combined fruits:", allFruits);

// 10. Practical Example: Shopping List
console.log("\nShopping List Example:");
let shoppingList = [];

// Add items
console.log("Adding items to shopping list...");
shoppingList.push("milk");
shoppingList.push("bread");
shoppingList.push("eggs");
console.log("Shopping list:", shoppingList);

// Mark item as bought (remove it)
let boughtItem = shoppingList.shift();
console.log(`Bought ${boughtItem}`);
console.log("Updated shopping list:", shoppingList);

// Check if we need to buy something
let needsEggs = shoppingList.includes("eggs");
console.log("Do we need eggs?", needsEggs);

// That's it for Day 11! You've learned:
// 1. How to create arrays
// 2. How to access array elements
// 3. How to modify arrays
// 4. How to add and remove elements
// 5. How to find elements
// 6. How to slice and combine arrays
// 7. Practical array usage 