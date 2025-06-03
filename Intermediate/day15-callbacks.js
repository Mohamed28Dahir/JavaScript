// Day 15: Callbacks
const output = document.getElementById('callback-output');

function displayMessage(message) {
    output.innerHTML += `<p>${message}</p>`;
}

function clearOutput() {
    output.innerHTML = '';
}

function simulateAsyncTask(taskName, delay, callback) {
    displayMessage(`Starting ${taskName}...`);
    setTimeout(() => {
        displayMessage(`${taskName} completed!`);
        callback();
    }, delay);
}

function runCallbackExample() {
    clearOutput();
    
    // Example 1: Simple setTimeout
    displayMessage('Example 1: Simple setTimeout');
    setTimeout(() => {
        displayMessage('Hello after 1 second!');
    }, 1000);

    // Example 2: Nested callbacks (callback hell example)
    displayMessage('Example 2: Nested callbacks');
    simulateAsyncTask('Task 1', 2000, () => {
        simulateAsyncTask('Task 2', 1500, () => {
            simulateAsyncTask('Task 3', 1000, () => {
                displayMessage('All tasks completed! Notice the callback nesting...');
            });
        });
    });

    // Example 3: Callback with error handling
    displayMessage('Example 3: Error handling with callbacks');
    function fetchDataWithCallback(success, error) {
        const randomSuccess = Math.random() > 0.5;
        setTimeout(() => {
            if (randomSuccess) {
                success('Data successfully fetched!');
            } else {
                error('Error: Could not fetch data');
            }
        }, 1500);
    }

    fetchDataWithCallback(
        (data) => displayMessage(`Success: ${data}`),
        (err) => displayMessage(`Error: ${err}`)
    );
} 