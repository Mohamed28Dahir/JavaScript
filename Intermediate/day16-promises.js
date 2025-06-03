// Day 16: Promises
const output = document.getElementById('promise-output');

function displayMessage(message) {
    output.innerHTML += `<p>${message}</p>`;
}

function clearOutput() {
    output.innerHTML = '';
}

function simulateAsyncTask(taskName, delay) {
    return new Promise((resolve, reject) => {
        displayMessage(`Starting ${taskName}...`);
        setTimeout(() => {
            if (Math.random() > 0.1) { // 90% success rate
                displayMessage(`${taskName} completed successfully!`);
                resolve(`${taskName} data`);
            } else {
                displayMessage(`${taskName} failed!`);
                reject(new Error(`${taskName} failed`));
            }
        }, delay);
    });
}

function runPromiseExample() {
    clearOutput();

    // Example 1: Basic Promise
    displayMessage('Example 1: Basic Promise');
    const simplePromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Promise resolved after 1 second!');
        }, 1000);
    });

    simplePromise
        .then(result => displayMessage(result))
        .catch(error => displayMessage(`Error: ${error}`));

    // Example 2: Promise chaining
    displayMessage('Example 2: Promise chaining');
    simulateAsyncTask('Task 1', 2000)
        .then(data => {
            displayMessage(`Received: ${data}`);
            return simulateAsyncTask('Task 2', 1500);
        })
        .then(data => {
            displayMessage(`Received: ${data}`);
            return simulateAsyncTask('Task 3', 1000);
        })
        .then(data => {
            displayMessage(`Received: ${data}`);
            displayMessage('All tasks completed successfully!');
        })
        .catch(error => {
            displayMessage(`Chain broken: ${error.message}`);
        });

    // Example 3: Promise.all()
    displayMessage('Example 3: Promise.all()');
    const promise1 = simulateAsyncTask('Parallel Task 1', 2000);
    const promise2 = simulateAsyncTask('Parallel Task 2', 1500);
    const promise3 = simulateAsyncTask('Parallel Task 3', 1000);

    Promise.all([promise1, promise2, promise3])
        .then(results => {
            displayMessage('All parallel tasks completed!');
            results.forEach((result, index) => {
                displayMessage(`Result ${index + 1}: ${result}`);
            });
        })
        .catch(error => {
            displayMessage(`One of the parallel tasks failed: ${error.message}`);
        });

    // Example 4: Promise.race()
    displayMessage('Example 4: Promise.race()');
    Promise.race([
        simulateAsyncTask('Race Task 1', 2000),
        simulateAsyncTask('Race Task 2', 1500),
        simulateAsyncTask('Race Task 3', 1000)
    ])
        .then(winner => {
            displayMessage(`First task to complete: ${winner}`);
        })
        .catch(error => {
            displayMessage(`Race failed: ${error.message}`);
        });
} 