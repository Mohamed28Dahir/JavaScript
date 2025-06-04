// Get DOM elements
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const periodElement = document.getElementById('period');
const formatSwitch = document.getElementById('format-switch');

// Function to update the clock
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Handle 24-hour format toggle
    if (!formatSwitch.checked) {
        // 12-hour format
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        periodElement.textContent = period;
        periodElement.style.display = 'inline';
    } else {
        // 24-hour format
        periodElement.style.display = 'none';
    }

    // Add leading zeros
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
}

// Update clock immediately and then every second
updateClock();
setInterval(updateClock, 1000);

// Handle format switch changes
formatSwitch.addEventListener('change', updateClock); 