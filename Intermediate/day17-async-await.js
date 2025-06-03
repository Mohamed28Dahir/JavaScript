// Day 17: Async/Await
const output = document.getElementById('async-await-output');

function displayMessage(message) {
    output.innerHTML += `<p>${message}</p>`;
}

function clearOutput() {
    output.innerHTML = '';
}

// Simulate an API call
async function fetchUserData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve({
                    id: userId,
                    name: `User ${userId}`,
                    email: `user${userId}@example.com`
                });
            } else {
                reject(new Error('Invalid user ID'));
            }
        }, 1000);
    });
}

// Simulate fetching user posts
async function fetchUserPosts(userId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, title: `Post 1 by User ${userId}` },
                { id: 2, title: `Post 2 by User ${userId}` },
                { id: 3, title: `Post 3 by User ${userId}` }
            ]);
        }, 1000);
    });
}

// Example 1: Basic async/await
async function basicExample() {
    displayMessage('Example 1: Basic async/await');
    try {
        const user = await fetchUserData(1);
        displayMessage(`User found: ${user.name} (${user.email})`);
    } catch (error) {
        displayMessage(`Error: ${error.message}`);
    }
}

// Example 2: Sequential vs Parallel execution
async function sequentialVsParallel() {
    displayMessage('Example 2: Sequential vs Parallel execution');
    
    // Sequential execution
    displayMessage('Starting sequential execution...');
    const startSeq = Date.now();
    
    try {
        const user1 = await fetchUserData(1);
        displayMessage(`Found user 1: ${user1.name}`);
        
        const user2 = await fetchUserData(2);
        displayMessage(`Found user 2: ${user2.name}`);
        
        displayMessage(`Sequential execution took: ${Date.now() - startSeq}ms`);
    } catch (error) {
        displayMessage(`Error: ${error.message}`);
    }

    // Parallel execution
    displayMessage('Starting parallel execution...');
    const startPar = Date.now();
    
    try {
        const [user1, user2] = await Promise.all([
            fetchUserData(1),
            fetchUserData(2)
        ]);
        
        displayMessage(`Found users: ${user1.name} and ${user2.name}`);
        displayMessage(`Parallel execution took: ${Date.now() - startPar}ms`);
    } catch (error) {
        displayMessage(`Error: ${error.message}`);
    }
}

// Example 3: Complex data fetching
async function complexDataFetching() {
    displayMessage('Example 3: Complex data fetching');
    
    try {
        // Get user data
        const user = await fetchUserData(1);
        displayMessage(`Found user: ${user.name}`);
        
        // Get user's posts
        const posts = await fetchUserPosts(user.id);
        displayMessage('User posts:');
        posts.forEach(post => {
            displayMessage(`- ${post.title}`);
        });
    } catch (error) {
        displayMessage(`Error: ${error.message}`);
    }
}

// Main function to run all examples
async function runAsyncAwaitExample() {
    clearOutput();
    
    await basicExample();
    displayMessage('-------------------');
    
    await sequentialVsParallel();
    displayMessage('-------------------');
    
    await complexDataFetching();
} 