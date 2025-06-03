// Day 10: Scope in JavaScript
// =========================

// 1. Global Scope
let globalVariable = "I'm a global variable";

console.log("Global scope example:");
console.log(globalVariable);  // Accessible everywhere

// 2. Function Scope
function functionScope() {
    let functionVariable = "I'm a function-scoped variable";
    console.log(functionVariable);  // Accessible inside function
    console.log(globalVariable);    // Global variable is accessible
}

console.log("\nFunction scope example:");
functionScope();
// console.log(functionVariable);  // This would cause an error

// 3. Block Scope (with let and const)
console.log("\nBlock scope example:");
{
    let blockVariable = "I'm block-scoped";
    const alsoBlockScoped = "I'm also block-scoped";
    console.log(blockVariable);
    console.log(alsoBlockScoped);
}
// console.log(blockVariable);      // This would cause an error
// console.log(alsoBlockScoped);    // This would cause an error

// 4. Var vs Let
console.log("\nVar vs Let example:");
function varVsLet() {
    var functionScoped = "I'm function scoped (var)";
    let blockScoped = "I'm block scoped (let)";
    
    if (true) {
        var anotherVar = "I'm still function scoped";
        let anotherLet = "I'm block scoped";
        console.log(anotherLet);  // Accessible
    }
    
    console.log(anotherVar);      // Accessible
    // console.log(anotherLet);   // This would cause an error
}

varVsLet();

// 5. Nested Scope
function outer() {
    let outerVariable = "I'm from outer function";
    
    function inner() {
        let innerVariable = "I'm from inner function";
        console.log(outerVariable);    // Can access outer variable
        console.log(innerVariable);     // Can access own variable
    }
    
    console.log("\nNested scope example:");
    inner();
    // console.log(innerVariable);  // This would cause an error
}

outer();

// 6. Practical Example: Counter
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

console.log("\nPractical counter example:");
const counter = createCounter();
console.log("Initial count:", counter.getCount());
console.log("After increment:", counter.increment());
console.log("After increment:", counter.increment());
console.log("After decrement:", counter.decrement());

// That's it for Day 10! You've learned:
// 1. Global scope
// 2. Function scope
// 3. Block scope
// 4. Differences between var and let
// 5. Nested scope
// 6. Practical applications of scope 