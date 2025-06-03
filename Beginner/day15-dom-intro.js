// Day 15: Introduction to the DOM (Document Object Model)
// ================================================

// 1. Selecting Elements by ID
const introText = document.getElementById('intro-text');
console.log('Element by ID:', introText);

// 2. Selecting Elements by Class Name
const sampleClass = document.getElementsByClassName('sample-class');
console.log('Elements by Class:', sampleClass);

// 3. Selecting Elements by Tag Name
const paragraphs = document.getElementsByTagName('p');
console.log('Elements by Tag:', paragraphs);

// 4. Using querySelector (returns first matching element)
const firstButton = document.querySelector('button');
console.log('First button:', firstButton);

// 5. Using querySelectorAll (returns all matching elements)
const allButtons = document.querySelectorAll('button');
console.log('All buttons:', allButtons);

// 6. Modifying Text Content
const changeTextBtn = document.getElementById('changeTextBtn');
changeTextBtn.addEventListener('click', function() {
    // Using textContent
    introText.textContent = 'Text has been changed!';
    
    // Using innerHTML (can include HTML tags)
    setTimeout(() => {
        introText.innerHTML = 'Text changed with <strong>HTML</strong>!';
    }, 2000);
});

// 7. Modifying Attributes
function modifyAttributes() {
    // Get the intro text element
    const introElement = document.getElementById('intro-text');
    
    // Add a title attribute
    introElement.setAttribute('title', 'This is a tooltip');
    
    // Add a custom attribute
    introElement.setAttribute('data-custom', 'custom-value');
    
    // Get attribute value
    console.log('Title attribute:', introElement.getAttribute('title'));
    
    // Check if attribute exists
    console.log('Has title:', introElement.hasAttribute('title'));
    
    // Remove attribute
    setTimeout(() => {
        introElement.removeAttribute('title');
        console.log('Title removed!');
    }, 3000);
}

// Run attribute modifications
modifyAttributes();

// 8. Creating New Elements
function createNewElement() {
    // Create a new paragraph element
    const newParagraph = document.createElement('p');
    
    // Add text content
    newParagraph.textContent = 'This is a dynamically created paragraph!';
    
    // Add a class
    newParagraph.className = 'dynamic-content';
    
    // Add it to the day15 section
    const day15Section = document.getElementById('day15');
    day15Section.appendChild(newParagraph);
}

// Create new element after 4 seconds
setTimeout(createNewElement, 4000);

// 9. Removing Elements
function removeElement() {
    const elementToRemove = document.querySelector('.dynamic-content');
    if (elementToRemove) {
        elementToRemove.remove();
    }
}

// Remove the dynamic element after 7 seconds
setTimeout(removeElement, 7000);

// That's it for Day 15! You've learned:
// 1. How to select elements using different methods
// 2. How to modify text content
// 3. How to work with attributes
// 4. How to create and remove elements
// 5. Basic DOM manipulation techniques 