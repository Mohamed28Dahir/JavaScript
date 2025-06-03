// Day 13: Objects in JavaScript
// ===========================

// 1. Creating Objects
let person = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    isStudent: false
};

console.log("Basic object:", person);

// 2. Accessing Object Properties
console.log("\nAccessing properties:");
// Dot notation
console.log("First name (dot notation):", person.firstName);
// Bracket notation
console.log("Last name (bracket notation):", person["lastName"]);

// 3. Modifying Objects
console.log("\nModifying objects:");
person.age = 31;
person["isStudent"] = true;
console.log("After modifications:", person);

// 4. Adding New Properties
console.log("\nAdding new properties:");
person.email = "john.doe@example.com";
person["phone"] = "123-456-7890";
console.log("After adding properties:", person);

// 5. Deleting Properties
console.log("\nDeleting properties:");
delete person.phone;
console.log("After deleting phone:", person);

// 6. Nested Objects
let student = {
    name: "Sarah",
    age: 20,
    grades: {
        math: 95,
        science: 88,
        history: 92
    },
    hobbies: ["reading", "swimming"]
};

console.log("\nNested object:", student);
console.log("Math grade:", student.grades.math);
console.log("First hobby:", student.hobbies[0]);

// 7. Object Methods
let calculator = {
    add: function(a, b) {
        return a + b;
    },
    subtract: function(a, b) {
        return a - b;
    },
    // Shorthand method syntax
    multiply(a, b) {
        return a * b;
    }
};

console.log("\nObject methods:");
console.log("Addition:", calculator.add(5, 3));
console.log("Subtraction:", calculator.subtract(10, 4));
console.log("Multiplication:", calculator.multiply(6, 2));

// 8. Object.keys(), Object.values(), Object.entries()
console.log("\nObject operations:");
console.log("Keys:", Object.keys(person));
console.log("Values:", Object.values(person));
console.log("Entries:", Object.entries(person));

// 9. Practical Example: Contact Card
let contact = {
    name: "Alice Johnson",
    email: "alice@example.com",
    address: {
        street: "123 Main St",
        city: "Boston",
        state: "MA",
        zip: "02101"
    },
    phone: {
        home: "555-1234",
        work: "555-5678",
        mobile: "555-9012"
    },
    // Method to format full address
    getFullAddress() {
        return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zip}`;
    },
    // Method to get preferred contact method
    getPreferredContact() {
        return this.phone.mobile || this.email;
    }
};

console.log("\nContact Card Example:");
console.log("Contact:", contact);
console.log("Full Address:", contact.getFullAddress());
console.log("Preferred Contact:", contact.getPreferredContact());

// 10. Object Destructuring
console.log("\nObject Destructuring:");
const { name, email, address: { city } } = contact;
console.log("Destructured values:", { name, email, city });

// That's it for Day 13! You've learned:
// 1. How to create objects
// 2. How to access object properties
// 3. How to modify objects
// 4. How to work with nested objects
// 5. How to use object methods
// 6. How to use Object.keys(), values(), and entries()
// 7. How to use object destructuring
// 8. Practical applications of objects 