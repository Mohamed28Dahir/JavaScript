import './styles.css';
import { initModulesDay } from './days/day22-modules';
import { initNpmDay } from './days/day23-npm';
import { initWebpackDay } from './days/day24-webpack';
import { initDebuggingDay } from './days/day25-debugging';
import { initCodeQualityDay } from './days/day26-code-quality';
import { initReviewDay } from './days/day27-review';
import { initFinalProject } from './days/day28-project';

// Content container
const contentContainer = document.getElementById('content');
const buttons = document.querySelectorAll('.day-nav button');

// Day initialization functions
const dayInitializers = {
  '22': initModulesDay,
  '23': initNpmDay,
  '24': initWebpackDay,
  '25': initDebuggingDay,
  '26': initCodeQualityDay,
  '27': initReviewDay,
  '28': initFinalProject,
};

// Handle day selection
function handleDaySelection(day) {
  // Remove active class from all buttons
  buttons.forEach(btn => btn.classList.remove('active'));
  
  // Add active class to selected button
  const selectedButton = document.querySelector(`[data-day="${day}"]`);
  if (selectedButton) {
    selectedButton.classList.add('active');
  }

  // Clear content
  contentContainer.innerHTML = '';

  // Initialize selected day
  const initializer = dayInitializers[day];
  if (initializer) {
    initializer(contentContainer);
  }
}

// Add click handlers to buttons
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const day = button.dataset.day;
    handleDaySelection(day);
  });
});

// Initialize with Day 22 (Modules)
handleDaySelection('22'); 