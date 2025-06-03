/*
Day 4: Modern JavaScript (ES6+) Syntax
===================================

This file covers modern JavaScript features including:
1. let and const
2. Arrow Functions
3. Template Literals
4. Default Parameters
5. Rest and Spread Operators
6. Object/Array Destructuring
7. Classes and Modules
*/

// 1. let and const
console.log('--- let and const ---');

// let - block-scoped variable that can be reassigned
let count = 1;
count = 2;
console.log(count); // 2

// const - block-scoped variable that cannot be reassigned
const PI = 3.14159;
// PI = 3; // This would throw an error

// Block scope demonstration
{
    let blockScoped = 'only available in this block';
    const alsoBlockScoped = 'me too';
}
// console.log(blockScoped); // ReferenceError

// 2. Arrow Functions
console.log('\n--- Arrow Functions ---');

// Traditional function
function add(a, b) {
    return a + b;
}

// Arrow function equivalent
const addArrow = (a, b) => a + b;

// Arrow function with single parameter (parentheses optional)
const square = x => x * x;

// Arrow function with block body
const greet = name => {
    const greeting = `Hello, ${name}!`;
    return greeting;
};

console.log(addArrow(2, 3));     // 5
console.log(square(4));          // 16
console.log(greet('Alice'));     // Hello, Alice!

// 3. Template Literals
console.log('\n--- Template Literals ---');

const user = {
    name: 'John',
    age: 30,
    city: 'New York'
};

// Multi-line strings
const message = `
    User Information:
    Name: ${user.name}
    Age: ${user.age}
    City: ${user.city}
`;

console.log(message);

// Tagged template literals
const highlight = (strings, ...values) => {
    return strings.reduce((result, str, i) => 
        `${result}${str}${values[i] ? `**${values[i]}**` : ''}`, '');
};

console.log(highlight`The user ${user.name} is ${user.age} years old`);

// 4. Default Parameters
console.log('\n--- Default Parameters ---');

const createUser = (name = 'Anonymous', age = 0, city = 'Unknown') => {
    return { name, age, city };
};

console.log(createUser());                    // All defaults
console.log(createUser('Jane', 25));         // Default city
console.log(createUser('Bob', 35, 'London')); // No defaults

// 5. Rest and Spread Operators
console.log('\n--- Rest and Spread Operators ---');

// Rest operator in functions
const sum = (...numbers) => numbers.reduce((total, num) => total + num, 0);
console.log(sum(1, 2, 3, 4, 5)); // 15

// Spread operator with arrays
const fruits = ['apple', 'banana'];
const moreFruits = ['orange', ...fruits, 'grape'];
console.log(moreFruits);

// Spread operator with objects
const baseConfig = { theme: 'dark', language: 'en' };
const userConfig = { ...baseConfig, theme: 'light' };
console.log(userConfig);

// 6. Destructuring
console.log('\n--- Destructuring ---');

// Array destructuring
const coordinates = [10, 20, 30];
const [x, y, z] = coordinates;
console.log(`x: ${x}, y: ${y}, z: ${z}`);

// Object destructuring
const { name, age } = user;
console.log(`${name} is ${age} years old`);

// Nested destructuring
const company = {
    details: {
        founded: 2000,
        location: {
            city: 'San Francisco',
            country: 'USA'
        }
    }
};

const { details: { location: { city: companyCity } } } = company;
console.log(companyCity); // San Francisco

// 7. Classes
console.log('\n--- Classes ---');

class Animal {
    constructor(name) {
        this.name = name;
    }
    
    speak() {
        return `${this.name} makes a sound`;
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }
    
    speak() {
        return `${this.name} barks!`;
    }
    
    getInfo() {
        return `${this.name} is a ${this.breed}`;
    }
}

const dog = new Dog('Rex', 'German Shepherd');
console.log(dog.speak());
console.log(dog.getInfo());

// Practice Exercise: Modern Shopping Cart
console.log('\n--- Practice Exercise: Shopping Cart ---');

class ShoppingCart {
    #items = [];  // Private field
    
    addItem = (...items) => {
        this.#items.push(...items);
    }
    
    get total() {
        return this.#items.reduce((sum, { price }) => sum + price, 0);
    }
    
    getItems() {
        return [...this.#items];  // Return copy to maintain encapsulation
    }
}

const cart = new ShoppingCart();
cart.addItem(
    { name: 'Book', price: 20 },
    { name: 'Coffee', price: 5 }
);

console.log('Items:', cart.getItems());
console.log('Total:', cart.total);

/*
Key Takeaways:
1. Modern JS provides cleaner, more expressive syntax
2. Arrow functions offer concise alternatives to traditional functions
3. Template literals make string interpolation easy
4. Destructuring simplifies working with objects and arrays
5. Classes provide a cleaner way to work with OOP

Practice:
1. Create a data transformation using modern syntax
2. Build a configuration system using default parameters and spread
3. Implement a class hierarchy using inheritance
*/ 