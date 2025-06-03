document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const successMessage = document.getElementById('successMessage');

    // Regular expressions for validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // Real-time validation functions
    function validateEmail() {
        const email = emailInput.value.trim();
        const errorElement = document.getElementById('emailError');
        
        if (!email) {
            showError(emailInput, errorElement, 'Email is required');
            return false;
        }
        if (!emailRegex.test(email)) {
            showError(emailInput, errorElement, 'Please enter a valid email address');
            return false;
        }
        
        clearError(emailInput, errorElement);
        return true;
    }

    function validatePassword() {
        const password = passwordInput.value;
        const errorElement = document.getElementById('passwordError');
        
        if (!password) {
            showError(passwordInput, errorElement, 'Password is required');
            return false;
        }
        if (!passwordRegex.test(password)) {
            showError(passwordInput, errorElement, 
                'Password must be at least 8 characters long and contain at least one letter and one number');
            return false;
        }
        
        clearError(passwordInput, errorElement);
        return true;
    }

    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const errorElement = document.getElementById('confirmPasswordError');
        
        if (!confirmPassword) {
            showError(confirmPasswordInput, errorElement, 'Please confirm your password');
            return false;
        }
        if (password !== confirmPassword) {
            showError(confirmPasswordInput, errorElement, 'Passwords do not match');
            return false;
        }
        
        clearError(confirmPasswordInput, errorElement);
        return true;
    }

    // Helper functions
    function showError(input, errorElement, message) {
        input.classList.add('invalid');
        errorElement.textContent = message;
    }

    function clearError(input, errorElement) {
        input.classList.remove('invalid');
        errorElement.textContent = '';
    }

    // Event listeners for real-time validation
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', () => {
        validatePassword();
        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }
    });
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all fields
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();

        if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
            // Show success message
            successMessage.style.display = 'block';
            
            // Reset form
            form.reset();
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        }
    });
}); 