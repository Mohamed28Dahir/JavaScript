// Day 16: Events in JavaScript
// =========================

// 1. Click Events
const colorButton = document.getElementById('colorButton');
let clickCount = 0;
const eventText = document.getElementById('eventText');

// Using addEventListener
colorButton.addEventListener('click', function(event) {
    // Change button color randomly
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    event.target.style.backgroundColor = randomColor;
    
    // Update click count
    clickCount++;
    eventText.textContent = `Click count: ${clickCount}`;
});

// 2. Mouse Events
const mouseArea = document.getElementById('mouseArea');

// Mouse enter event
mouseArea.addEventListener('mouseenter', function(event) {
    event.target.style.backgroundColor = 'lightblue';
    event.target.textContent = 'Mouse is over me!';
});

// Mouse leave event
mouseArea.addEventListener('mouseleave', function(event) {
    event.target.style.backgroundColor = 'lightgray';
    event.target.textContent = 'Hover over me!';
});

// Mouse move event
mouseArea.addEventListener('mousemove', function(event) {
    // Show coordinates in the element
    const x = event.offsetX;
    const y = event.offsetY;
    event.target.textContent = `X: ${x}, Y: ${y}`;
});

// 3. Keyboard Events
document.addEventListener('keydown', function(event) {
    console.log('Key pressed:', event.key);
    
    // Update text when specific keys are pressed
    if (event.key === 'Enter') {
        eventText.textContent = 'Enter key was pressed!';
    }
});

// 4. Event Object Properties
colorButton.addEventListener('click', function(event) {
    console.log('Event type:', event.type);
    console.log('Target element:', event.target);
    console.log('Current target:', event.currentTarget);
    console.log('Mouse coordinates:', event.clientX, event.clientY);
});

// 5. Preventing Default Behavior
const link = document.createElement('a');
link.href = 'https://www.example.com';
link.textContent = 'Click me (prevented)';
document.getElementById('day16').appendChild(link);

link.addEventListener('click', function(event) {
    event.preventDefault();
    console.log('Link click prevented!');
});

// 6. Event Bubbling and Capturing
const parent = document.createElement('div');
parent.style.padding = '20px';
parent.style.backgroundColor = '#f0f0f0';
parent.textContent = 'Parent';

const child = document.createElement('div');
child.style.padding = '20px';
child.style.backgroundColor = '#ddd';
child.textContent = 'Child';

parent.appendChild(child);
document.getElementById('day16').appendChild(parent);

// Bubbling phase (default)
parent.addEventListener('click', function(event) {
    console.log('Parent clicked (bubble)');
});

child.addEventListener('click', function(event) {
    console.log('Child clicked (bubble)');
});

// Capturing phase
parent.addEventListener('click', function(event) {
    console.log('Parent clicked (capture)');
}, true);

child.addEventListener('click', function(event) {
    console.log('Child clicked (capture)');
}, true);

// 7. Event Delegation
const container = document.createElement('div');
container.innerHTML = `
    <button class="delegated-button">Button 1</button>
    <button class="delegated-button">Button 2</button>
    <button class="delegated-button">Button 3</button>
`;
document.getElementById('day16').appendChild(container);

// Instead of adding event listeners to each button,
// we add one listener to the container
container.addEventListener('click', function(event) {
    if (event.target.classList.contains('delegated-button')) {
        console.log('Delegated button clicked:', event.target.textContent);
    }
});

// That's it for Day 16! You've learned:
// 1. How to handle click events
// 2. How to work with mouse events
// 3. How to handle keyboard events
// 4. Understanding the event object
// 5. How to prevent default behavior
// 6. Event bubbling and capturing
// 7. Event delegation 