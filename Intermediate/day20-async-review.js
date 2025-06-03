// Day 20: Async Review and Refactoring
const output = document.getElementById('review-output');

function displayMessage(message) {
    output.innerHTML += `<p>${message}</p>`;
}

function clearOutput() {
    output.innerHTML = '';
}

// Example 1: Callback version
function getUserDataCallback(userId, callback) {
    setTimeout(() => {
        const user = {
            id: userId,
            name: `User ${userId}`,
            email: `user${userId}@example.com`
        };
        callback(null, user);
    }, 1000);
}

function getUserPostsCallback(userId, callback) {
    setTimeout(() => {
        const posts = [
            { id: 1, title: `Post 1 by User ${userId}` },
            { id: 2, title: `Post 2 by User ${userId}` }
        ];
        callback(null, posts);
    }, 1000);
}

function getPostCommentsCallback(postId, callback) {
    setTimeout(() => {
        const comments = [
            { id: 1, text: `Comment 1 on post ${postId}` },
            { id: 2, text: `Comment 2 on post ${postId}` }
        ];
        callback(null, comments);
    }, 1000);
}

// Example 2: Promise version
function getUserDataPromise(userId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = {
                id: userId,
                name: `User ${userId}`,
                email: `user${userId}@example.com`
            };
            resolve(user);
        }, 1000);
    });
}

function getUserPostsPromise(userId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const posts = [
                { id: 1, title: `Post 1 by User ${userId}` },
                { id: 2, title: `Post 2 by User ${userId}` }
            ];
            resolve(posts);
        }, 1000);
    });
}

function getPostCommentsPromise(postId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const comments = [
                { id: 1, text: `Comment 1 on post ${postId}` },
                { id: 2, text: `Comment 2 on post ${postId}` }
            ];
            resolve(comments);
        }, 1000);
    });
}

// Example 3: Async/Await version
async function getUserDataAsync(userId) {
    return await getUserDataPromise(userId);
}

async function getUserPostsAsync(userId) {
    return await getUserPostsPromise(userId);
}

async function getPostCommentsAsync(postId) {
    return await getPostCommentsPromise(postId);
}

// Demonstration of different approaches
function runCallbackVersion() {
    displayMessage('Running callback version...');
    const startTime = Date.now();
    
    getUserDataCallback(1, (err, user) => {
        if (err) {
            displayMessage(`Error: ${err}`);
            return;
        }
        displayMessage(`Found user: ${user.name}`);
        
        getUserPostsCallback(user.id, (err, posts) => {
            if (err) {
                displayMessage(`Error: ${err}`);
                return;
            }
            displayMessage(`Found ${posts.length} posts`);
            
            getPostCommentsCallback(posts[0].id, (err, comments) => {
                if (err) {
                    displayMessage(`Error: ${err}`);
                    return;
                }
                displayMessage(`Found ${comments.length} comments`);
                displayMessage(`Callback version took: ${Date.now() - startTime}ms`);
            });
        });
    });
}

function runPromiseVersion() {
    displayMessage('Running promise version...');
    const startTime = Date.now();
    
    getUserDataPromise(1)
        .then(user => {
            displayMessage(`Found user: ${user.name}`);
            return getUserPostsPromise(user.id);
        })
        .then(posts => {
            displayMessage(`Found ${posts.length} posts`);
            return getPostCommentsPromise(posts[0].id);
        })
        .then(comments => {
            displayMessage(`Found ${comments.length} comments`);
            displayMessage(`Promise version took: ${Date.now() - startTime}ms`);
        })
        .catch(error => {
            displayMessage(`Error: ${error}`);
        });
}

async function runAsyncAwaitVersion() {
    displayMessage('Running async/await version...');
    const startTime = Date.now();
    
    try {
        const user = await getUserDataAsync(1);
        displayMessage(`Found user: ${user.name}`);
        
        const posts = await getUserPostsAsync(user.id);
        displayMessage(`Found ${posts.length} posts`);
        
        const comments = await getPostCommentsAsync(posts[0].id);
        displayMessage(`Found ${comments.length} comments`);
        displayMessage(`Async/await version took: ${Date.now() - startTime}ms`);
    } catch (error) {
        displayMessage(`Error: ${error}`);
    }
}

// Main function to run all examples
async function runAsyncReviewExample() {
    clearOutput();
    
    // Run all versions sequentially
    runCallbackVersion();
    setTimeout(() => {
        displayMessage('-------------------');
        runPromiseVersion();
        setTimeout(() => {
            displayMessage('-------------------');
            runAsyncAwaitVersion();
        }, 4000);
    }, 4000);
} 