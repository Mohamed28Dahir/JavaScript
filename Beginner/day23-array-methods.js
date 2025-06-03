// Day 23: More Array Methods
// =======================

// Sample user data
const users = [
    { id: 1, name: 'John Doe', age: 25, hobbies: ['reading', 'music'] },
    { id: 2, name: 'Jane Smith', age: 17, hobbies: ['painting', 'dancing'] },
    { id: 3, name: 'Bob Johnson', age: 35, hobbies: ['gaming', 'cooking'] },
    { id: 4, name: 'Alice Brown', age: 16, hobbies: ['photography', 'writing'] },
    { id: 5, name: 'Charlie Wilson', age: 28, hobbies: ['sports', 'music'] }
];

// 1. Map Method
function transformUsers() {
    // Transform users into a simplified format
    const simplifiedUsers = users.map(user => ({
        name: user.name,
        isAdult: user.age >= 18,
        hobbyCount: user.hobbies.length
    }));
    
    console.log('Transformed users:', simplifiedUsers);
    return simplifiedUsers;
}

// 2. Filter Method
function filterUsers(minAge = 18) {
    // Filter users by age
    const adults = users.filter(user => user.age >= minAge);
    
    console.log(`Users ${minAge}+ years old:`, adults);
    return adults;
}

// 3. Reduce Method
function calculateAverageAge() {
    // Calculate average age using reduce
    const totalAge = users.reduce((sum, user) => sum + user.age, 0);
    const averageAge = totalAge / users.length;
    
    console.log('Average age:', averageAge.toFixed(1));
    return averageAge;
}

// 4. ForEach Method
function displayUsers(userArray = users) {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    
    userArray.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'card';
        
        userCard.innerHTML = `
            <h3>${user.name}</h3>
            <p>Age: ${user.age}</p>
            <p>Hobbies: ${user.hobbies.join(', ')}</p>
        `;
        
        userList.appendChild(userCard);
    });
}

// 5. Find Method
function findUserById(id) {
    const user = users.find(user => user.id === id);
    console.log('Found user:', user);
    return user;
}

// 6. Some and Every Methods
function checkUserAges() {
    // Check if some users are minors
    const hasMinors = users.some(user => user.age < 18);
    console.log('Has minor users:', hasMinors);
    
    // Check if all users have hobbies
    const allHaveHobbies = users.every(user => user.hobbies.length > 0);
    console.log('All users have hobbies:', allHaveHobbies);
    
    return { hasMinors, allHaveHobbies };
}

// 7. Combining Array Methods
function analyzeUsers() {
    // Get average age of adults who like music
    const musicLovers = users
        .filter(user => user.age >= 18)
        .filter(user => user.hobbies.includes('music'));
    
    const averageAge = musicLovers.reduce((sum, user) => sum + user.age, 0) / musicLovers.length;
    
    console.log('Adult music lovers average age:', averageAge.toFixed(1));
    return averageAge;
}

// 8. Search Implementation
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.hobbies.some(hobby => hobby.toLowerCase().includes(query))
    );
    
    displayUsers(filteredUsers);
});

// 9. Sorting Implementation
const sortByName = document.getElementById('sortByName');
sortByName.addEventListener('click', function() {
    const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name));
    displayUsers(sortedUsers);
});

// 10. Filter Adults Button
const filterAdults = document.getElementById('filterAdults');
filterAdults.addEventListener('click', function() {
    const adults = filterUsers();
    displayUsers(adults);
});

// Initialize the display
displayUsers();

// Additional Array Method Examples
// ==============================

// 11. FlatMap Example
function getAllHobbies() {
    const allHobbies = users
        .flatMap(user => user.hobbies)
        .filter((hobby, index, array) => array.indexOf(hobby) === index);
    
    console.log('All unique hobbies:', allHobbies);
    return allHobbies;
}

// 12. Includes with Arrays
function findUsersWithHobby(hobby) {
    return users.filter(user => user.hobbies.includes(hobby));
}

// 13. Chaining Methods
function getAdultNames() {
    return users
        .filter(user => user.age >= 18)
        .map(user => user.name)
        .sort();
}

// 14. Complex Transformation
function generateUserStats() {
    return users.map(user => ({
        ...user,
        status: user.age >= 18 ? 'adult' : 'minor',
        hobbyCount: user.hobbies.length,
        firstHobby: user.hobbies[0],
        lastHobby: user.hobbies[user.hobbies.length - 1]
    }));
}

// Run examples and log results
console.log('--- Array Method Examples ---');
transformUsers();
filterUsers();
calculateAverageAge();
findUserById(1);
checkUserAges();
analyzeUsers();
getAllHobbies();
console.log('Users who like music:', findUsersWithHobby('music'));
console.log('Adult names:', getAdultNames());
console.log('User stats:', generateUserStats());

// That's it for Day 23! You've learned:
// 1. How to use map() for transformations
// 2. How to use filter() for filtering data
// 3. How to use reduce() for calculations
// 4. How to use forEach() for iteration
// 5. How to use find() for searching
// 6. How to use some() and every() for conditions
// 7. How to chain array methods
// 8. How to implement search and sort
// 9. How to use flatMap() and includes()
// 10. How to combine multiple array methods 