/*
Day 2: Closures in JavaScript
============================

A closure is a function that has access to variables in its outer (enclosing) scope,
even after the outer function has returned.
*/

// Basic Closure Example
console.log('--- Basic Closure Example ---');

function createCounter() {
    let count = 0;  // Private variable
    
    return {
        increment: function() {
            count++;
            return count;
        },
        decrement: function() {
            count--;
            return count;
        },
        getCount: function() {
            return count;
        }
    };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount());  // 1

// Data Privacy Example
console.log('\n--- Data Privacy Example ---');

function createBankAccount(initialBalance) {
    let balance = initialBalance;  // Private variable
    
    return {
        deposit: function(amount) {
            if (amount > 0) {
                balance += amount;
                return `Deposited ${amount}. New balance: ${balance}`;
            }
            return 'Invalid deposit amount';
        },
        withdraw: function(amount) {
            if (amount > 0 && amount <= balance) {
                balance -= amount;
                return `Withdrawn ${amount}. New balance: ${balance}`;
            }
            return 'Invalid withdrawal amount';
        },
        getBalance: function() {
            return `Current balance: ${balance}`;
        }
    };
}

const account = createBankAccount(100);
console.log(account.getBalance());    // Current balance: 100
console.log(account.deposit(50));     // Deposited 50. New balance: 150
console.log(account.withdraw(30));    // Withdrawn 30. New balance: 120
// Can't access balance directly
console.log(account.balance);         // undefined

// Function Factory Example
console.log('\n--- Function Factory Example ---');

function multiply(x) {
    return function(y) {
        return x * y;
    };
}

const multiplyByTwo = multiply(2);
const multiplyByThree = multiply(3);

console.log(multiplyByTwo(5));    // 10
console.log(multiplyByThree(5));  // 15

// Practical Example: Event Handler
console.log('\n--- Event Handler Example ---');

function createButtonHandler(buttonId) {
    let clickCount = 0;
    
    return function() {
        clickCount++;
        console.log(`Button ${buttonId} was clicked ${clickCount} times`);
    };
}

// Simulating button clicks
const handleButton1 = createButtonHandler('btn1');
handleButton1(); // Button btn1 was clicked 1 times
handleButton1(); // Button btn1 was clicked 2 times

// Practice Exercise: Shopping Cart
console.log('\n--- Practice Exercise: Shopping Cart ---');

function createShoppingCart() {
    const items = [];
    let total = 0;
    
    return {
        addItem: function(name, price) {
            items.push({ name, price });
            total += price;
            return `Added ${name} for $${price}`;
        },
        removeItem: function(name) {
            const index = items.findIndex(item => item.name === name);
            if (index !== -1) {
                total -= items[index].price;
                items.splice(index, 1);
                return `Removed ${name}`;
            }
            return `${name} not found`;
        },
        getTotal: function() {
            return `Total: $${total}`;
        },
        listItems: function() {
            return items.map(item => `${item.name}: $${item.price}`).join('\n');
        }
    };
}

const cart = createShoppingCart();
console.log(cart.addItem('Book', 20));
console.log(cart.addItem('Coffee', 5));
console.log('\nCart Contents:');
console.log(cart.listItems());
console.log(cart.getTotal());

/*
Key Takeaways:
1. Closures provide data privacy and encapsulation
2. They can remember values even after the outer function returns
3. Useful for creating function factories and maintaining state
4. Common in event handlers and callbacks

Practice:
1. Modify the shopping cart to include quantity
2. Create a temperature converter that remembers the last conversion
3. Build a todo list manager using closures
*/ 