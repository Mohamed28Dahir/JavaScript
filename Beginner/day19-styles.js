// Day 19: Style Manipulation in JavaScript
// ===================================

// 1. Direct Style Manipulation
const styleBox = document.getElementById('styleBox');
const toggleButton = document.getElementById('toggleButton');
const changeStyleButton = document.getElementById('changeStyleButton');

// Toggle visibility
toggleButton.addEventListener('click', function() {
    if (styleBox.style.display === 'none') {
        styleBox.style.display = 'block';
        toggleButton.textContent = 'Hide Box';
    } else {
        styleBox.style.display = 'none';
        toggleButton.textContent = 'Show Box';
    }
});

// Change multiple styles
changeStyleButton.addEventListener('click', function() {
    // Generate random color
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    
    // Apply multiple styles
    styleBox.style.backgroundColor = randomColor;
    styleBox.style.transform = `rotate(${Math.random() * 360}deg)`;
    styleBox.style.borderRadius = `${Math.random() * 50}px`;
    styleBox.style.transition = 'all 0.3s ease';
});

// 2. Working with Classes
function demonstrateClassManipulation() {
    // Add class
    styleBox.classList.add('highlight');
    
    // Remove class after 1 second
    setTimeout(() => {
        styleBox.classList.remove('highlight');
    }, 1000);
    
    // Toggle class after 2 seconds
    setTimeout(() => {
        styleBox.classList.toggle('highlight');
    }, 2000);
    
    // Replace class after 3 seconds
    setTimeout(() => {
        styleBox.classList.replace('highlight', 'success');
    }, 3000);
}

// Run class manipulation demo when clicking the box
styleBox.addEventListener('click', demonstrateClassManipulation);

// 3. Computed Styles
function showComputedStyles() {
    const computedStyle = window.getComputedStyle(styleBox);
    console.log('Computed Styles:');
    console.log('Width:', computedStyle.width);
    console.log('Height:', computedStyle.height);
    console.log('Background Color:', computedStyle.backgroundColor);
    console.log('Border Radius:', computedStyle.borderRadius);
}

// Show computed styles every 5 seconds
setInterval(showComputedStyles, 5000);

// 4. CSS Custom Properties (Variables)
function updateCSSVariable() {
    // Set CSS variable
    document.documentElement.style.setProperty('--main-bg-color', 'lightblue');
    
    // Get CSS variable
    const mainColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--main-bg-color');
    
    console.log('Current main color:', mainColor);
}

// Update CSS variable when changing styles
changeStyleButton.addEventListener('click', updateCSSVariable);

// 5. Animation with RequestAnimationFrame
let rotationAngle = 0;
let animationId;

function animateBox() {
    rotationAngle += 2;
    styleBox.style.transform = `rotate(${rotationAngle}deg)`;
    
    if (rotationAngle < 360) {
        animationId = requestAnimationFrame(animateBox);
    } else {
        rotationAngle = 0;
    }
}

// Start animation on double click
styleBox.addEventListener('dblclick', function() {
    cancelAnimationFrame(animationId); // Cancel any existing animation
    animateBox();
});

// 6. Responsive Style Changes
function handleResize() {
    const width = window.innerWidth;
    
    if (width < 600) {
        styleBox.style.width = '50px';
        styleBox.style.height = '50px';
    } else if (width < 1200) {
        styleBox.style.width = '100px';
        styleBox.style.height = '100px';
    } else {
        styleBox.style.width = '150px';
        styleBox.style.height = '150px';
    }
}

// Listen for window resize
window.addEventListener('resize', handleResize);

// 7. Style Transitions
function addTransitionEffects() {
    styleBox.style.transition = 'all 0.5s ease-in-out';
    
    // Add hover effect
    styleBox.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2)';
        this.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    });
    
    styleBox.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
    });
}

// Initialize transition effects
addTransitionEffects();

// 8. Style Information Object
const styleInfo = {
    originalStyles: {
        width: '100px',
        height: '100px',
        backgroundColor: 'blue'
    },
    
    // Reset to original styles
    reset() {
        Object.assign(styleBox.style, this.originalStyles);
    },
    
    // Save current styles
    saveCurrentStyles() {
        const computed = window.getComputedStyle(styleBox);
        this.originalStyles = {
            width: computed.width,
            height: computed.height,
            backgroundColor: computed.backgroundColor
        };
    }
};

// Add reset button functionality
const resetButton = document.createElement('button');
resetButton.textContent = 'Reset Styles';
resetButton.addEventListener('click', () => styleInfo.reset());
document.getElementById('day19').appendChild(resetButton);

// That's it for Day 19! You've learned:
// 1. How to manipulate styles directly
// 2. How to work with CSS classes
// 3. How to use computed styles
// 4. How to work with CSS variables
// 5. How to create animations
// 6. How to handle responsive styles
// 7. How to work with transitions
// 8. How to manage style information 