// Day 12: Array Methods in JavaScript
// ==============================

// Starting with a sample array
let fruits = ["apple", "banana", "orange", "grape", "mango"];
console.log("Original array:", fruits);

// 1. Basic Array Methods
console.log("\n1. Basic Array Methods:");
console.log("Length:", fruits.length);
console.log("Index of 'orange':", fruits.indexOf("orange"));
console.log("Includes 'banana'?", fruits.includes("banana"));
console.log("First element:", fruits[0]);
console.log("Last element:", fruits[fruits.length - 1]);

// 2. Adding and Removing Elements
console.log("\n2. Adding and Removing Elements:");
// Push: Add to end
fruits.push("pear");
console.log("After push:", fruits);

// Pop: Remove from end
let removed = fruits.pop();
console.log("Popped element:", removed);
console.log("After pop:", fruits);

// Unshift: Add to beginning
fruits.unshift("kiwi");
console.log("After unshift:", fruits);

// Shift: Remove from beginning
removed = fruits.shift();
console.log("Shifted element:", removed);
console.log("After shift:", fruits);

// 3. Transforming Arrays
console.log("\n3. Transforming Arrays:");

// Map: Create new array with transformed elements
let upperFruits = fruits.map(fruit => fruit.toUpperCase());
console.log("Uppercase fruits:", upperFruits);

// Filter: Create new array with filtered elements
let longFruits = fruits.filter(fruit => fruit.length > 5);
console.log("Fruits with more than 5 letters:", longFruits);

// 4. Array Order
console.log("\n4. Array Order:");

// Reverse
let reversed = [...fruits].reverse();
console.log("Reversed:", reversed);

// Sort
let sorted = [...fruits].sort();
console.log("Sorted:", sorted);

// 5. Finding Elements
console.log("\n5. Finding Elements:");

// Find: Get first element that matches condition
let findResult = fruits.find(fruit => fruit.startsWith("g"));
console.log("First fruit starting with 'g':", findResult);

// FindIndex: Get index of first element that matches condition
let findIndexResult = fruits.findIndex(fruit => fruit.startsWith("g"));
console.log("Index of first fruit starting with 'g':", findIndexResult);

// 6. Practical Example: Shopping List
console.log("\n6. Shopping List Example:");

let shoppingList = [
    { item: "milk", price: 2.99, quantity: 1 },
    { item: "bread", price: 1.99, quantity: 2 },
    { item: "eggs", price: 3.99, quantity: 1 }
];

// Calculate total cost
let totalCost = shoppingList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
console.log("Shopping list:", shoppingList);
console.log("Total cost:", totalCost.toFixed(2));

// Find expensive items (over $3)
let expensiveItems = shoppingList.filter(item => item.price > 3);
console.log("Expensive items:", expensiveItems);

// Create shopping list text
let shoppingListText = shoppingList
    .map(item => `${item.quantity}x ${item.item}`)
    .join(", ");
console.log("Shopping list text:", shoppingListText);

// 7. Chaining Methods
console.log("\n7. Chaining Methods Example:");
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

let result = numbers
    .filter(num => num % 2 === 0)    // Get even numbers
    .map(num => num * 2)             // Double them
    .reduce((sum, num) => sum + num); // Sum them up

console.log("Original numbers:", numbers);
console.log("Sum of doubled even numbers:", result);

// That's it for Day 12! You've learned:
// 1. Basic array methods (length, indexOf, includes)
// 2. Adding and removing elements (push, pop, shift, unshift)
// 3. Transforming arrays (map, filter)
// 4. Array ordering (sort, reverse)
// 5. Finding elements (find, findIndex)
// 6. Reducing arrays (reduce)
// 7. Method chaining 