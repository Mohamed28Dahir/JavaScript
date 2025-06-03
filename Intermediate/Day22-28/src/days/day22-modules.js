// Example calculator module
export class Calculator {
  add(a, b) {
    return a + b;
  }

  subtract(a, b) {
    return a - b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    return a / b;
  }
}

// Example formatter module
export class NumberFormatter {
  static format(number, decimals = 2) {
    return number.toFixed(decimals);
  }
}

// Example utility functions
export const utils = {
  isEven: number => number % 2 === 0,
  isPositive: number => number > 0,
  sum: array => array.reduce((a, b) => a + b, 0),
};

// Initialize the day's content
export function initModulesDay(container) {
  container.innerHTML = `
    <h2>Day 22: JavaScript Modules</h2>
    
    <div class="module-example">
      <h3>1. Basic Module Export/Import</h3>
      <div class="code-block">
        <pre>
// calculator.js
export class Calculator {
  add(a, b) { return a + b; }
  subtract(a, b) { return a - b; }
}

// main.js
import { Calculator } from './calculator.js';
const calc = new Calculator();
console.log(calc.add(5, 3)); // 8
        </pre>
      </div>
    </div>

    <div class="module-example">
      <h3>2. Live Calculator Demo</h3>
      <div class="calculator-demo">
        <input type="number" id="num1" value="10">
        <select id="operation">
          <option value="add">+</option>
          <option value="subtract">-</option>
          <option value="multiply">×</option>
          <option value="divide">÷</option>
        </select>
        <input type="number" id="num2" value="5">
        <button onclick="calculateResult()">Calculate</button>
        <div id="result" class="code-block">Result will appear here</div>
      </div>
    </div>

    <div class="module-example">
      <h3>3. Utility Functions Demo</h3>
      <div class="utils-demo">
        <button onclick="testUtils()">Test Utilities</button>
        <div id="utils-result" class="code-block">Click to test utilities</div>
      </div>
    </div>
  `;

  // Initialize calculator demo
  const calc = new Calculator();
  
  window.calculateResult = () => {
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);
    const operation = document.getElementById('operation').value;
    const resultDiv = document.getElementById('result');

    try {
      let result;
      switch (operation) {
        case 'add':
          result = calc.add(num1, num2);
          break;
        case 'subtract':
          result = calc.subtract(num1, num2);
          break;
        case 'multiply':
          result = calc.multiply(num1, num2);
          break;
        case 'divide':
          result = calc.divide(num1, num2);
          break;
      }
      resultDiv.textContent = `Result: ${NumberFormatter.format(result)}`;
      resultDiv.className = 'code-block success';
    } catch (error) {
      resultDiv.textContent = `Error: ${error.message}`;
      resultDiv.className = 'code-block error';
    }
  };

  // Initialize utils demo
  window.testUtils = () => {
    const numbers = [1, 2, 3, 4, 5];
    const resultDiv = document.getElementById('utils-result');
    
    resultDiv.innerHTML = `
      Array: [${numbers.join(', ')}]<br>
      Sum: ${utils.sum(numbers)}<br>
      4 is even: ${utils.isEven(4)}<br>
      -5 is positive: ${utils.isPositive(-5)}
    `;
  };
} 