// Get DOM elements
const billInput = document.getElementById('bill');
const tipInput = document.getElementById('tip');
const tipAmountDisplay = document.getElementById('tipAmount');
const totalAmountDisplay = document.getElementById('totalAmount');
const clearButton = document.getElementById('clear');

// Function to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

// Function to calculate tip and total
const calculateTip = () => {
    // Get input values
    const billAmount = parseFloat(billInput.value) || 0;
    const tipPercentage = parseFloat(tipInput.value) || 0;

    // Calculate tip and total
    const tipAmount = billAmount * (tipPercentage / 100);
    const totalAmount = billAmount + tipAmount;

    // Update display
    tipAmountDisplay.textContent = formatCurrency(tipAmount);
    totalAmountDisplay.textContent = formatCurrency(totalAmount);
};

// Function to clear all inputs and results
const clearCalculator = () => {
    billInput.value = '';
    tipInput.value = '';
    tipAmountDisplay.textContent = '$0.00';
    totalAmountDisplay.textContent = '$0.00';
    billInput.focus();
};

// Add event listeners
billInput.addEventListener('input', calculateTip);
tipInput.addEventListener('input', calculateTip);
clearButton.addEventListener('click', clearCalculator);

// Input validation
billInput.addEventListener('input', (e) => {
    if (e.target.value < 0) {
        e.target.value = 0;
    }
});

tipInput.addEventListener('input', (e) => {
    if (e.target.value < 0) {
        e.target.value = 0;
    } else if (e.target.value > 100) {
        e.target.value = 100;
    }
}); 