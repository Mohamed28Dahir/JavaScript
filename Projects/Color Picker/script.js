// Get DOM elements
const colorPicker = document.getElementById('colorPicker');
const colorPreview = document.getElementById('colorPreview');
const hexValue = document.getElementById('hexValue');
const backgroundToggle = document.getElementById('backgroundToggle');

// Initialize with default color
updateColor(colorPicker.value);

// Update color when picker changes
colorPicker.addEventListener('input', (e) => {
    updateColor(e.target.value);
});

// Handle background toggle
backgroundToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        document.body.style.backgroundColor = colorPicker.value;
    } else {
        document.body.style.backgroundColor = '';
    }
});

// Function to update color preview and hex value
function updateColor(color) {
    colorPreview.style.backgroundColor = color;
    hexValue.value = color.toUpperCase();
    
    if (backgroundToggle.checked) {
        document.body.style.backgroundColor = color;
    }
} 