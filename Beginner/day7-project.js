// Day 7: Mini Project - Movie Recommendation System
// =============================================

// Movie database (using objects and arrays)
const movies = [
    {
        title: "The Lion King",
        rating: "G",
        year: 1994,
        genre: "Animation",
        recommended_age: 0
    },
    {
        title: "Spider-Man",
        rating: "PG-13",
        year: 2002,
        genre: "Action",
        recommended_age: 13
    },
    {
        title: "The Matrix",
        rating: "R",
        year: 1999,
        genre: "Sci-Fi",
        recommended_age: 17
    }
];

// User information
let userAge = 14;
let hasParentConsent = true;
let preferredGenre = "Action";

// Function to check if user can watch a movie
function canWatchMovie(movie, age, parentConsent) {
    if (age >= movie.recommended_age) {
        return true;
    } else if (movie.rating === "PG-13" && age >= 13 && parentConsent) {
        return true;
    } else if (movie.rating === "G") {
        return true;
    }
    return false;
}

// Function to get movie recommendations
function getMovieRecommendations(age, parentConsent, preferredGenre) {
    console.log("\nMovie Recommendations:");
    console.log("=====================");
    
    // Loop through movies
    for (let movie of movies) {
        console.log(`\nAnalyzing "${movie.title}":`);
        console.log("------------------------");
        console.log("Movie details:");
        console.log(`- Rating: ${movie.rating}`);
        console.log(`- Genre: ${movie.genre}`);
        console.log(`- Year: ${movie.year}`);
        
        // Check if user can watch the movie
        if (canWatchMovie(movie, age, parentConsent)) {
            if (movie.genre === preferredGenre) {
                console.log("✅ HIGHLY RECOMMENDED! Matches your preferred genre!");
            } else {
                console.log("✅ You can watch this movie!");
            }
        } else {
            console.log("❌ Sorry, this movie is not suitable for your age.");
        }
    }
}

// Run the recommendation system
console.log("User Profile:");
console.log("============");
console.log(`Age: ${userAge}`);
console.log(`Parent Consent: ${hasParentConsent}`);
console.log(`Preferred Genre: ${preferredGenre}`);

// Get recommendations
getMovieRecommendations(userAge, hasParentConsent, preferredGenre);

// That's it for Day 7! This project combines:
// 1. Variables and Data Types
// 2. Objects and Arrays
// 3. Conditional Statements
// 4. Logical Operators
// 5. Functions
// 6. Loops and iteration 