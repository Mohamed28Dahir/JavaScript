import { format, addDays, isToday, differenceInDays } from 'date-fns';
import validator from 'validator';

export function initNpmDay(container) {
  container.innerHTML = `
    <h2>Day 23: NPM and External Packages</h2>
    
    <div class="module-example">
      <h3>1. Date Manipulation with date-fns</h3>
      <div class="date-demo">
        <div class="code-block">
          <h4>Current Date Formatting:</h4>
          <div id="current-date"></div>
          
          <h4>Date Calculator:</h4>
          <input type="date" id="start-date">
          <input type="number" id="days-to-add" value="7" min="1" max="365">
          <button onclick="calculateNewDate()">Add Days</button>
          <div id="date-result" class="code-block">Select a date and click calculate</div>
        </div>
      </div>
    </div>

    <div class="module-example">
      <h3>2. Form Validation with validator.js</h3>
      <div class="validation-demo">
        <div class="form-group">
          <label>Email:</label>
          <input type="text" id="email-input" placeholder="Enter email">
          <div id="email-result" class="code-block"></div>
        </div>

        <div class="form-group">
          <label>Password:</label>
          <input type="password" id="password-input" placeholder="Enter password">
          <div id="password-result" class="code-block"></div>
        </div>

        <div class="form-group">
          <label>URL:</label>
          <input type="text" id="url-input" placeholder="Enter URL">
          <div id="url-result" class="code-block"></div>
        </div>
      </div>
    </div>

    <div class="module-example">
      <h3>3. Package Management</h3>
      <div class="code-block">
        <pre>
// Installing packages
npm install date-fns validator

// package.json dependencies
{
  "dependencies": {
    "date-fns": "^2.30.0",
    "validator": "^13.9.0"
  }
}

// Importing specific functions
import { format, addDays } from 'date-fns';
import validator from 'validator';

// Using the packages
format(new Date(), 'yyyy-MM-dd');
validator.isEmail('test@example.com');
        </pre>
      </div>
    </div>
  `;

  // Initialize date-fns demo
  const currentDateDiv = document.getElementById('current-date');
  currentDateDiv.textContent = `Formatted: ${format(new Date(), 'EEEE, MMMM do yyyy')}`;

  window.calculateNewDate = () => {
    const startDate = new Date(document.getElementById('start-date').value);
    const daysToAdd = parseInt(document.getElementById('days-to-add').value);
    const resultDiv = document.getElementById('date-result');

    if (isNaN(startDate.getTime())) {
      resultDiv.textContent = 'Please select a valid date';
      resultDiv.className = 'code-block error';
      return;
    }

    const newDate = addDays(startDate, daysToAdd);
    const daysDiff = differenceInDays(newDate, startDate);
    
    resultDiv.innerHTML = `
      Original: ${format(startDate, 'MMM do yyyy')}<br>
      + ${daysDiff} days = ${format(newDate, 'MMM do yyyy')}<br>
      ${isToday(newDate) ? '(This is today!)' : ''}
    `;
    resultDiv.className = 'code-block success';
  };

  // Initialize validator.js demo
  const setupValidation = (inputId, resultId, validationFn, errorMsg) => {
    const input = document.getElementById(inputId);
    const result = document.getElementById(resultId);

    input.addEventListener('input', () => {
      const value = input.value.trim();
      const isValid = value ? validationFn(value) : false;
      
      result.textContent = value 
        ? (isValid ? '✓ Valid' : `✗ ${errorMsg}`)
        : 'Enter a value to validate';
      result.className = `code-block ${isValid ? 'success' : 'error'}`;
    });
  };

  setupValidation(
    'email-input',
    'email-result',
    validator.isEmail,
    'Invalid email format'
  );

  setupValidation(
    'password-input',
    'password-result',
    (value) => validator.isStrongPassword(value, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    }),
    'Password must be at least 8 chars with 1 lowercase, uppercase, number, and symbol'
  );

  setupValidation(
    'url-input',
    'url-result',
    validator.isURL,
    'Invalid URL format'
  );
} 