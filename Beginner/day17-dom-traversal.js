// Day 17: DOM Tree and Traversal
// ===========================

// 1. Parent Node Relationships
const child1 = document.getElementById('child1');

function exploreParents(element) {
    console.log('Exploring parent relationships:');
    
    // Get parent node
    console.log('Parent Node:', element.parentNode);
    
    // Get parent element (similar to parentNode but only returns element nodes)
    console.log('Parent Element:', element.parentElement);
    
    // Get closest ancestor matching a selector
    console.log('Closest .section:', element.closest('.section'));
}

exploreParents(child1);

// 2. Child Node Relationships
const parent = document.getElementById('parent');

function exploreChildren(element) {
    console.log('\nExploring child relationships:');
    
    // Get all child nodes (including text nodes)
    console.log('Child Nodes:', element.childNodes);
    
    // Get child elements only
    console.log('Children:', element.children);
    
    // Get first and last child
    console.log('First Child:', element.firstChild);
    console.log('First Element Child:', element.firstElementChild);
    console.log('Last Child:', element.lastChild);
    console.log('Last Element Child:', element.lastElementChild);
}

exploreChildren(parent);

// 3. Sibling Relationships
function exploreSiblings(element) {
    console.log('\nExploring sibling relationships:');
    
    // Get next sibling (including text nodes)
    console.log('Next Sibling:', element.nextSibling);
    
    // Get next element sibling
    console.log('Next Element Sibling:', element.nextElementSibling);
    
    // Get previous sibling (including text nodes)
    console.log('Previous Sibling:', element.previousSibling);
    
    // Get previous element sibling
    console.log('Previous Element Sibling:', element.previousElementSibling);
}

exploreSiblings(child1);

// 4. DOM Navigation Practice
const highlightParentBtn = document.getElementById('highlightParent');
const highlightChildrenBtn = document.getElementById('highlightChildren');

// Highlight parent when clicked
highlightParentBtn.addEventListener('click', function() {
    // Remove highlight from all elements
    removeAllHighlights();
    
    // Highlight the parent
    const parent = document.getElementById('parent');
    parent.classList.add('highlight');
});

// Highlight children when clicked
highlightChildrenBtn.addEventListener('click', function() {
    // Remove highlight from all elements
    removeAllHighlights();
    
    // Highlight all children
    const parent = document.getElementById('parent');
    Array.from(parent.children).forEach(child => {
        child.classList.add('highlight');
    });
});

// Helper function to remove highlights
function removeAllHighlights() {
    const highlighted = document.querySelectorAll('.highlight');
    highlighted.forEach(element => {
        element.classList.remove('highlight');
    });
}

// 5. Walking the DOM Tree
function walkDOM(element, callback) {
    callback(element);
    
    // Recursively walk through all child elements
    element.children.forEach(child => {
        walkDOM(child, callback);
    });
}

// Example usage of walkDOM
console.log('\nWalking the DOM tree:');
const family = document.getElementById('family');
walkDOM(family, element => {
    console.log('Element:', element.tagName, 'ID:', element.id);
});

// 6. Finding Elements Relative to Others
function findRelatives(element) {
    console.log('\nFinding relative elements:');
    
    // Find all previous siblings
    let previousSiblings = [];
    let previous = element.previousElementSibling;
    while (previous) {
        previousSiblings.push(previous);
        previous = previous.previousElementSibling;
    }
    
    // Find all next siblings
    let nextSiblings = [];
    let next = element.nextElementSibling;
    while (next) {
        nextSiblings.push(next);
        next = next.nextElementSibling;
    }
    
    console.log('Previous siblings:', previousSiblings);
    console.log('Next siblings:', nextSiblings);
}

findRelatives(child2);

// 7. Practical Example: Element Movement
function moveElement(element, direction) {
    const parent = element.parentElement;
    
    if (direction === 'up' && element.previousElementSibling) {
        parent.insertBefore(element, element.previousElementSibling);
    } else if (direction === 'down' && element.nextElementSibling) {
        parent.insertBefore(element.nextElementSibling, element);
    }
}

// Add move up/down functionality to children
Array.from(parent.children).forEach(child => {
    child.addEventListener('click', function(event) {
        if (event.shiftKey) {
            moveElement(child, 'up');
        } else if (event.altKey) {
            moveElement(child, 'down');
        }
    });
});

// That's it for Day 17! You've learned:
// 1. How to work with parent nodes
// 2. How to work with child nodes
// 3. How to work with sibling nodes
// 4. How to traverse the DOM tree
// 5. How to find relative elements
// 6. How to manipulate element positions
// 7. Practical DOM traversal applications 