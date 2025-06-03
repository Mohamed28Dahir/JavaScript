/*
 * Day 15: Functional Programming in JavaScript
 * Topics covered:
 * 1. Pure Functions
 * 2. Immutability
 * 3. Higher-Order Functions
 * 4. Function Composition
 * 5. Currying
 */

// 1. Pure Functions
const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price, 0);
};

const applyDiscount = (total, discountPercent) => {
    return total * (1 - discountPercent / 100);
};

// 2. Immutability
const addToCart = (cart, item) => {
    return [...cart, item];
};

const removeFromCart = (cart, itemId) => {
    return cart.filter(item => item.id !== itemId);
};

const updateQuantity = (cart, itemId, quantity) => {
    return cart.map(item => 
        item.id === itemId 
            ? { ...item, quantity }
            : item
    );
};

// 3. Higher-Order Functions
const createLogger = (logFn) => (message) => {
    const timestamp = new Date().toISOString();
    logFn(`[${timestamp}] ${message}`);
};

const filterByProperty = (property, value) => (array) => {
    return array.filter(item => item[property] === value);
};

const sortByProperty = (property) => (array) => {
    return [...array].sort((a, b) => 
        a[property] < b[property] ? -1 : 1
    );
};

// 4. Function Composition
const compose = (...fns) => (initialValue) => {
    return fns.reduceRight((value, fn) => fn(value), initialValue);
};

const pipe = (...fns) => (initialValue) => {
    return fns.reduce((value, fn) => fn(value), initialValue);
};

// Example of function composition
const processOrder = compose(
    calculateTotal,
    (total) => applyDiscount(total, 10),
    (final) => ({ total: final, timestamp: Date.now() })
);

// 5. Currying
const curry = (fn) => {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return (...moreArgs) => curried.apply(this, [...args, ...moreArgs]);
    };
};

// Practical Examples

// Example 1: Data Processing Pipeline
const processData = pipe(
    filterByProperty('active', true),
    sortByProperty('timestamp'),
    (items) => items.map(item => ({
        ...item,
        processed: true
    }))
);

// Example 2: Event Handling
const createEventHandler = (eventType) => (handler) => (event) => {
    if (event.type === eventType) {
        handler(event.data);
    }
};

// Example 3: Validation Pipeline
const validate = (validators) => (data) => {
    return validators.reduce((errors, validator) => {
        const error = validator(data);
        return error ? [...errors, error] : errors;
    }, []);
};

// Practice Exercises

// Exercise 1: Implement a memoization higher-order function
const memoize = (fn) => {
    const cache = new Map();
    
    return (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
};

// Exercise 2: Create a functional array methods
const FunctionalArray = {
    map: (arr, fn) => arr.map(fn),
    filter: (arr, fn) => arr.filter(fn),
    reduce: (arr, fn, initial) => arr.reduce(fn, initial),
    find: (arr, fn) => arr.find(fn),
    every: (arr, fn) => arr.every(fn),
    some: (arr, fn) => arr.some(fn),
    flatten: (arr) => arr.reduce((flat, item) => 
        flat.concat(Array.isArray(item) ? FunctionalArray.flatten(item) : item), 
    [])
};

// Exercise 3: Implement a simple state management using functional concepts
const createStore = (reducer, initialState) => {
    let state = initialState;
    let listeners = [];
    
    return {
        getState: () => state,
        dispatch: (action) => {
            state = reducer(state, action);
            listeners.forEach(listener => listener(state));
        },
        subscribe: (listener) => {
            listeners.push(listener);
            return () => {
                listeners = listeners.filter(l => l !== listener);
            };
        }
    };
};

// Usage Examples
const cart = [];
const item = { id: 1, name: 'Product', price: 29.99 };

const updatedCart = pipe(
    (cart) => addToCart(cart, item),
    (cart) => updateQuantity(cart, 1, 2),
    (cart) => removeFromCart(cart, 2)
)(cart);

const logger = createLogger(console.log);
logger('Cart updated');

const numbers = [1, 2, 3, 4, 5];
const double = (x) => x * 2;
const isEven = (x) => x % 2 === 0;

const processNumbers = pipe(
    (nums) => FunctionalArray.map(nums, double),
    (nums) => FunctionalArray.filter(nums, isEven)
);

console.log(processNumbers(numbers)); // [4, 8]

// Export functions for testing
export {
    calculateTotal,
    applyDiscount,
    addToCart,
    removeFromCart,
    updateQuantity,
    createLogger,
    filterByProperty,
    sortByProperty,
    compose,
    pipe,
    curry,
    memoize,
    FunctionalArray,
    createStore
}; 