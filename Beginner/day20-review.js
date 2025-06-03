// Day 20: Review of DOM Concepts with Form Validation
// =============================================

// 1. Form Elements
const registrationForm = document.getElementById('registrationForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const ageInput = document.getElementById('age');
const validationMessage = document.getElementById('validationMessage');

// 2. Validation Rules
const validationRules = {
    fullName: {
        test: value => value.length >= 3 && /^[a-zA-Z\s]+$/.test(value),
        message: 'Name must be at least 3 characters and contain only letters'
    },
    email: {
        test: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address'
    },
    age: {
        test: value => value >= 18 && value <= 120,
        message: 'Age must be between 18 and 120'
    }
};

// 3. Real-time Validation
function addInputValidation(input, ruleName) {
    const rule = validationRules[ruleName];
    
    // Add input event listener
    input.addEventListener('input', function() {
        validateInput(input, rule);
    });
    
    // Add blur event listener
    input.addEventListener('blur', function() {
        validateInput(input, rule);
    });
}

// 4. Input Validation Function
function validateInput(input, rule) {
    const value = input.value.trim();
    const isValid = rule.test(value);
    
    // Update input styling
    if (isValid) {
        input.classList.remove('error');
        input.classList.add('success');
        showInputMessage(input, '', 'success');
    } else {
        input.classList.remove('success');
        input.classList.add('error');
        showInputMessage(input, rule.message, 'error');
    }
    
    return isValid;
}

// 5. Show Validation Messages
function showInputMessage(input, message, type) {
    const container = input.parentElement;
    let messageElement = container.querySelector('.validation-message');
    
    // Create message element if it doesn't exist
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'validation-message';
        container.appendChild(messageElement);
    }
    
    // Update message
    messageElement.textContent = message;
    messageElement.className = `validation-message ${type}`;
}

// 6. Form Submission Handler
registrationForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Validate all inputs
    const isFullNameValid = validateInput(fullNameInput, validationRules.fullName);
    const isEmailValid = validateInput(emailInput, validationRules.email);
    const isAgeValid = validateInput(ageInput, validationRules.age);
    
    // Check if all validations pass
    if (isFullNameValid && isEmailValid && isAgeValid) {
        // Create user object
        const user = {
            fullName: fullNameInput.value.trim(),
            email: emailInput.value.trim(),
            age: parseInt(ageInput.value)
        };
        
        // Show success message
        showFormMessage('Registration successful!', 'success');
        console.log('Registered user:', user);
        
        // Reset form
        registrationForm.reset();
        resetValidationStyles();
    } else {
        showFormMessage('Please fix the errors in the form', 'error');
    }
});

// 7. Show Form Messages
function showFormMessage(message, type) {
    validationMessage.textContent = message;
    validationMessage.className = type;
    
    // Clear message after 3 seconds
    setTimeout(() => {
        validationMessage.textContent = '';
        validationMessage.className = '';
    }, 3000);
}

// 8. Reset Validation Styles
function resetValidationStyles() {
    // Remove all validation styles and messages
    const inputs = registrationForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.classList.remove('error', 'success');
        const container = input.parentElement;
        const message = container.querySelector('.validation-message');
        if (message) {
            message.remove();
        }
    });
}

// 9. Form Reset Handler
registrationForm.addEventListener('reset', function() {
    resetValidationStyles();
    showFormMessage('Form has been reset', 'success');
});

// 10. Initialize Validation
function initializeFormValidation() {
    // Add validation to each input
    addInputValidation(fullNameInput, 'fullName');
    addInputValidation(emailInput, 'email');
    addInputValidation(ageInput, 'age');
    
    // Add custom styling
    const style = document.createElement('style');
    style.textContent = `
        .error { border-color: red !important; }
        .success { border-color: green !important; }
        .validation-message { font-size: 12px; margin-top: 5px; }
        .validation-message.error { color: red; }
        .validation-message.success { color: green; }
    `;
    document.head.appendChild(style);
}

// Initialize the form validation
initializeFormValidation();

// That's it for Day 20! You've learned:
// 1. How to implement comprehensive form validation
// 2. How to handle real-time input validation
// 3. How to display validation messages
// 4. How to style form elements based on validation
// 5. How to handle form submission and reset
// 6. How to create reusable validation rules
// 7. How to manage form state and user feedback 