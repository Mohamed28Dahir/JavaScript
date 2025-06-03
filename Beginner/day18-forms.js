// Day 18: Forms and Inputs in JavaScript
// ================================

// 1. Basic Form Handling
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

loginForm.addEventListener('submit', function(event) {
    // Prevent the form from submitting traditionally
    event.preventDefault();
    
    // Get form values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (username.length < 3) {
        showMessage('Username must be at least 3 characters long', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Simulate login
    simulateLogin(username, password);
});

// Helper function to show messages
function showMessage(message, type = 'success') {
    loginMessage.textContent = message;
    loginMessage.className = type;
    
    // Clear message after 3 seconds
    setTimeout(() => {
        loginMessage.textContent = '';
        loginMessage.className = '';
    }, 3000);
}

// Simulate login process
function simulateLogin(username, password) {
    // Simulate API call
    setTimeout(() => {
        if (username === 'admin' && password === 'password123') {
            showMessage('Login successful!', 'success');
            // Clear form
            loginForm.reset();
        } else {
            showMessage('Invalid username or password', 'error');
        }
    }, 1000);
}

// 2. Input Event Handling
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Real-time username validation
usernameInput.addEventListener('input', function(event) {
    const value = event.target.value;
    
    if (value.length < 3) {
        event.target.style.borderColor = 'red';
    } else {
        event.target.style.borderColor = 'green';
    }
});

// Password strength indicator
passwordInput.addEventListener('input', function(event) {
    const value = event.target.value;
    let strength = 'weak';
    
    if (value.length >= 8) {
        if (/[A-Z]/.test(value) && /[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value)) {
            strength = 'strong';
        } else if (/[A-Z]/.test(value) || /[0-9]/.test(value)) {
            strength = 'medium';
        }
    }
    
    // Update password input style based on strength
    switch (strength) {
        case 'weak':
            event.target.style.borderColor = 'red';
            break;
        case 'medium':
            event.target.style.borderColor = 'orange';
            break;
        case 'strong':
            event.target.style.borderColor = 'green';
            break;
    }
});

// 3. Form Reset Handling
loginForm.addEventListener('reset', function(event) {
    // Clear any error messages
    loginMessage.textContent = '';
    loginMessage.className = '';
    
    // Reset input styles
    usernameInput.style.borderColor = '';
    passwordInput.style.borderColor = '';
});

// 4. Focus and Blur Events
usernameInput.addEventListener('focus', function(event) {
    event.target.style.backgroundColor = '#f0f0f0';
});

usernameInput.addEventListener('blur', function(event) {
    event.target.style.backgroundColor = '';
});

// 5. Custom Form Validation
function validateForm() {
    let isValid = true;
    const username = usernameInput.value;
    const password = passwordInput.value;
    
    // Username validation
    if (username.length < 3) {
        showError(usernameInput, 'Username too short');
        isValid = false;
    } else {
        clearError(usernameInput);
    }
    
    // Password validation
    if (password.length < 6) {
        showError(passwordInput, 'Password too short');
        isValid = false;
    } else {
        clearError(passwordInput);
    }
    
    return isValid;
}

function showError(input, message) {
    const formControl = input.parentElement;
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Remove any existing error message
    const existing = formControl.querySelector('.error-message');
    if (existing) {
        existing.remove();
    }
    
    formControl.appendChild(errorDiv);
    input.style.borderColor = 'red';
}

function clearError(input) {
    const formControl = input.parentElement;
    const existing = formControl.querySelector('.error-message');
    if (existing) {
        existing.remove();
    }
    input.style.borderColor = '';
}

// 6. Form Data API
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    if (validateForm()) {
        // Create FormData object
        const formData = new FormData(loginForm);
        
        // Log form data entries
        console.log('Form Data:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
    }
});

// That's it for Day 18! You've learned:
// 1. How to handle form submissions
// 2. How to validate form inputs
// 3. How to work with input events
// 4. How to handle form reset
// 5. How to work with focus and blur events
// 6. How to implement custom validation
// 7. How to use the FormData API 