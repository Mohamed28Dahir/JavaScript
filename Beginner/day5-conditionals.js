// Day 5: Conditionals in JavaScript
// ==============================

// 1. Basic if statement
let age = 18;

if (age >= 18) {
    console.log("You are an adult!");
}

// 2. if...else statement
let temperature = 25;

if (temperature > 30) {
    console.log("It's hot outside!");
} else {
    console.log("The weather is nice!");
}

// 3. if...else if...else statement
let score = 85;

if (score >= 90) {
    console.log("Grade: A");
} else if (score >= 80) {
    console.log("Grade: B");
} else if (score >= 70) {
    console.log("Grade: C");
} else {
    console.log("Grade: F");
}

// 4. Simple age checker
let userAge = 15;
let hasParentConsent = true;

if (userAge >= 18) {
    console.log("You can enter the website");
} else if (userAge >= 13 && hasParentConsent) {
    console.log("You can enter with parent consent");
} else {
    console.log("You are too young to enter");
}

// 5. Ternary operator (shorthand if...else)
let time = 20;
let greeting = time < 12 ? "Good morning!" : "Good day!";
console.log(greeting);

// More complex ternary example
let userType = age >= 18 ? "Adult" : "Minor";
console.log("User type:", userType);

// 6. Practice: Movie rating checker
let movieRating = "PG-13";
let viewerAge = 12;

if (movieRating === "G") {
    console.log("Suitable for all ages");
} else if (movieRating === "PG-13") {
    if (viewerAge >= 13) {
        console.log("You can watch this movie");
    } else {
        console.log("Parental guidance required");
    }
} else if (movieRating === "R") {
    console.log("Restricted - 17+ only");
}

// That's it for Day 5! You've learned:
// 1. How to use if statements
// 2. How to use if...else statements
// 3. How to use if...else if...else statements
// 4. How to use the ternary operator
// 5. How to nest conditional statements 