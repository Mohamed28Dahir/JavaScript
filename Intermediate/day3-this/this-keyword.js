/*
Day 3: The 'this' Keyword in JavaScript
=====================================

'this' refers to the current execution context.
Its value depends on how and where a function is called, not where it's defined.
*/

// 1. Global Context
console.log('--- Global Context ---');
console.log(this === window); // In browser: true, In Node: false

// 2. Object Method Context
console.log('\n--- Object Method Context ---');

const person = {
    name: 'John',
    greet: function() {
        return `Hello, I'm ${this.name}`;
    },
    // Arrow function doesn't have its own 'this'
    greetArrow: () => {
        return `Hello, I'm ${this.name}`;  // 'this' refers to outer scope
    }
};

console.log(person.greet());        // "Hello, I'm John"
console.log(person.greetArrow());   // "Hello, I'm undefined"

// 3. Constructor Function Context
console.log('\n--- Constructor Function Context ---');

function Car(make, model) {
    this.make = make;
    this.model = model;
    
    this.getInfo = function() {
        return `${this.make} ${this.model}`;
    };
    
    // Arrow function maintains 'this' from constructor
    this.getInfoArrow = () => {
        return `${this.make} ${this.model}`;
    };
}

const myCar = new Car('Toyota', 'Camry');
console.log(myCar.getInfo());      // "Toyota Camry"
console.log(myCar.getInfoArrow()); // "Toyota Camry"

// 4. Event Handlers and 'this'
console.log('\n--- Event Handler Context ---');

const button = {
    text: 'Click me',
    handleClick: function() {
        console.log(`Button "${this.text}" was clicked`);
    },
    handleClickArrow: () => {
        console.log(`Button "${this.text}" was clicked`);
    }
};

// Simulating different contexts
button.handleClick();           // "Button 'Click me' was clicked"
const handler = button.handleClick;
// handler();                   // "Button 'undefined' was clicked"

// 5. Explicit Context with call, apply, and bind
console.log('\n--- Explicit Context ---');

function introduce(greeting, punctuation) {
    return `${greeting}, I'm ${this.name}${punctuation}`;
}

const john = { name: 'John' };
const jane = { name: 'Jane' };

// Using call (passing arguments individually)
console.log(introduce.call(john, 'Hi', '!'));     // "Hi, I'm John!"
console.log(introduce.call(jane, 'Hello', '.')); // "Hello, I'm Jane."

// Using apply (passing arguments as array)
console.log(introduce.apply(john, ['Hi', '!']));  // "Hi, I'm John!"

// Using bind (creating new function with fixed 'this')
const introduceJohn = introduce.bind(john);
console.log(introduceJohn('Hey', '!'));          // "Hey, I'm John!"

// 6. Class Context
console.log('\n--- Class Context ---');

class Counter {
    constructor() {
        this.count = 0;
        // Binding method to ensure 'this' works in all contexts
        this.increment = this.increment.bind(this);
    }
    
    increment() {
        this.count++;
        return this.count;
    }
    
    // Arrow function automatically binds 'this'
    decrement = () => {
        this.count--;
        return this.count;
    }
}

const myCounter = new Counter();
console.log(myCounter.increment()); // 1
console.log(myCounter.decrement()); // 0

// Practice Exercise
console.log('\n--- Practice Exercise ---');

class TodoList {
    constructor() {
        this.todos = [];
    }
    
    addTodo(text) {
        this.todos.push({
            text,
            completed: false,
            complete: function() {
                this.completed = true;
            }
        });
    }
    
    completeTodo(index) {
        if (this.todos[index]) {
            this.todos[index].complete.call(this.todos[index]);
        }
    }
    
    getTodos() {
        return this.todos.map(todo => 
            `${todo.text}: ${todo.completed ? 'Done' : 'Pending'}`
        ).join('\n');
    }
}

const todoList = new TodoList();
todoList.addTodo('Learn this keyword');
todoList.addTodo('Practice JavaScript');
todoList.completeTodo(0);
console.log(todoList.getTodos());

/*
Key Takeaways:
1. 'this' value depends on how a function is called
2. Arrow functions inherit 'this' from their enclosing scope
3. Methods like call, apply, and bind can explicitly set 'this'
4. Constructor functions and classes create new 'this' contexts
5. Event handlers often need special handling of 'this'

Practice:
1. Create a calculator object with methods using 'this'
2. Implement a game character with properties and methods
3. Build a form validator using different 'this' contexts
*/ 