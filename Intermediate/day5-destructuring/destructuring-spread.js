/*
Day 5: Destructuring and Spread Operators
======================================

Deep dive into:
1. Array Destructuring
2. Object Destructuring
3. Spread Operator
4. Rest Parameters
5. Practical Applications
*/

// 1. Array Destructuring
console.log('--- Array Destructuring ---');

// Basic array destructuring
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log(first, second, rest);  // 1 2 [3, 4, 5]

// Skipping elements
const colors = ['red', 'green', 'blue', 'yellow'];
const [primaryColor, , tertiaryColor] = colors;
console.log(primaryColor, tertiaryColor);  // red blue

// Default values
const [name = 'Anonymous', age = 25] = ['Alice'];
console.log(name, age);  // Alice 25

// Swapping variables
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b);  // 2 1

// 2. Object Destructuring
console.log('\n--- Object Destructuring ---');

const person = {
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    address: {
        street: '123 Main St',
        city: 'Boston',
        country: 'USA'
    }
};

// Basic object destructuring
const { firstName, lastName } = person;
console.log(firstName, lastName);  // John Doe

// Renaming variables
const { firstName: fName, lastName: lName } = person;
console.log(fName, lName);  // John Doe

// Nested object destructuring
const { address: { city, country } } = person;
console.log(city, country);  // Boston USA

// Default values with object destructuring
const { occupation = 'Unknown' } = person;
console.log(occupation);  // Unknown

// 3. Spread Operator
console.log('\n--- Spread Operator ---');

// Spreading arrays
const baseNumbers = [1, 2, 3];
const extendedNumbers = [...baseNumbers, 4, 5];
console.log(extendedNumbers);  // [1, 2, 3, 4, 5]

// Combining arrays
const evenNumbers = [2, 4, 6];
const oddNumbers = [1, 3, 5];
const allNumbers = [...evenNumbers, ...oddNumbers].sort();
console.log(allNumbers);  // [1, 2, 3, 4, 5, 6]

// Spreading objects
const baseConfig = {
    theme: 'dark',
    fontSize: 14
};

const userConfig = {
    ...baseConfig,
    theme: 'light',  // Override base theme
    userName: 'John'
};

console.log(userConfig);

// 4. Rest Parameters
console.log('\n--- Rest Parameters ---');

// Rest in function parameters
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4, 5));  // 15

// Rest in object destructuring
const { firstName: name1, ...personDetails } = person;
console.log(name1);          // John
console.log(personDetails);  // Rest of the person object

// 5. Practical Applications
console.log('\n--- Practical Applications ---');

// Function parameter destructuring
function printUserInfo({ name, age, address: { city } = {} } = {}) {
    console.log(`${name}, ${age} years old, from ${city}`);
}

printUserInfo({
    name: 'Alice',
    age: 25,
    address: { city: 'New York' }
});

// API Response handling
const apiResponse = {
    status: 200,
    data: {
        users: [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' }
        ],
        metadata: {
            total: 2,
            page: 1
        }
    }
};

const { 
    data: { 
        users: [firstUser, secondUser],
        metadata: { total }
    } 
} = apiResponse;

console.log(firstUser, secondUser, total);

// Immutable state updates (Redux-style)
const initialState = {
    user: {
        name: 'John',
        preferences: {
            theme: 'dark'
        }
    },
    settings: {
        notifications: true
    }
};

// Updating nested state immutably
const updatedState = {
    ...initialState,
    user: {
        ...initialState.user,
        preferences: {
            ...initialState.user.preferences,
            theme: 'light'
        }
    }
};

console.log(updatedState.user.preferences.theme);  // light
console.log(initialState.user.preferences.theme);  // dark

// Practice Exercise: Data Transformation
console.log('\n--- Practice Exercise ---');

const rawData = {
    users: [
        { id: 1, info: { name: 'John', age: 30 } },
        { id: 2, info: { name: 'Jane', age: 25 } }
    ],
    settings: {
        darkMode: true,
        notifications: {
            email: true,
            sms: false
        }
    }
};

// Transform the data using destructuring and spread
function transformData({ users, settings: { darkMode, notifications } }) {
    const [firstUser, ...otherUsers] = users;
    const { info: { name: firstName } } = firstUser;
    
    return {
        mainUser: firstName,
        otherUsers: otherUsers.map(({ info: { name } }) => name),
        config: {
            theme: darkMode ? 'dark' : 'light',
            ...notifications
        }
    };
}

console.log(transformData(rawData));

/*
Key Takeaways:
1. Destructuring makes working with complex data structures easier
2. Spread operator helps create new arrays and objects immutably
3. Rest parameters collect multiple elements into an array
4. These features are essential for modern JavaScript development
5. They're particularly useful in React and other modern frameworks

Practice:
1. Create a deep clone function using spread operators
2. Build a function that merges multiple configuration objects
3. Transform complex API responses using destructuring
*/ 