// Day 6: Logical Operators in JavaScript
// ==================================

// 1. AND operator (&&)
// Returns true only if both conditions are true
let age = 25;
let hasLicense = true;

if (age >= 18 && hasLicense) {
    console.log("You can drive a car");
} else {
    console.log("You cannot drive a car");
}

// 2. OR operator (||)
// Returns true if at least one condition is true
let isWeekend = false;
let isHoliday = true;

if (isWeekend || isHoliday) {
    console.log("You can sleep late!");
} else {
    console.log("Wake up early!");
}

// 3. NOT operator (!)
// Reverses the boolean value
let isLoggedIn = false;
console.log("Is not logged in:", !isLoggedIn); // true

// 4. Combining logical operators
let hour = 15;
let isWorkDay = true;
let isOnVacation = false;

if ((hour >= 9 && hour <= 17) && isWorkDay && !isOnVacation) {
    console.log("You should be working!");
} else {
    console.log("Free time!");
}

// 5. Common use cases
// Checking for valid input
let username = "john_doe";
let password = "12345";

if (username && password) {
    console.log("Both fields are filled");
} else {
    console.log("Please fill all fields");
}

// 6. Default values using OR
let userPreference = null;
let defaultTheme = "light";
let currentTheme = userPreference || defaultTheme;
console.log("Theme:", currentTheme); // "light"

// 7. Practice: User access control
let userAge = 16;
let hasParentPermission = true;
let isSubscribed = true;

// Complex condition checking
if ((userAge >= 18 || hasParentPermission) && isSubscribed) {
    console.log("Access granted to full content");
} else if (userAge >= 18 || hasParentPermission) {
    console.log("Access granted to basic content");
} else {
    console.log("Access denied");
}

// That's it for Day 6! You've learned:
// 1. How to use the AND operator (&&)
// 2. How to use the OR operator (||)
// 3. How to use the NOT operator (!)
// 4. How to combine logical operators
// 5. Common use cases for logical operators
// 6. How to use logical operators for default values 