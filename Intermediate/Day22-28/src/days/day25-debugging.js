// Buggy calculator for debugging practice
class BuggyCalculator {
  add(a, b) {
    // Bug: Converts numbers to strings and concatenates
    return a + b;
  }

  subtract(a, b) {
    // Bug: Doesn't handle negative numbers correctly
    return Math.abs(a - b);
  }

  multiply(a, b) {
    // Bug: Rounds incorrectly
    return Math.floor(a * b);
  }

  divide(a, b) {
    // Bug: Doesn't handle division by zero
    return a / b;
  }
}

// Buggy array operations
class BuggyArrayOps {
  findMax(arr) {
    // Bug: Doesn't handle empty arrays
    let max = arr[0];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i];
      }
    }
    return max;
  }

  removeDuplicates(arr) {
    // Bug: Doesn't handle objects correctly
    return [...new Set(arr)];
  }

  sort(arr) {
    // Bug: Sorts as strings instead of numbers
    return arr.sort();
  }
}

export function initDebuggingDay(container) {
  container.innerHTML = `
    <h2>Day 25: JavaScript Debugging</h2>
    
    <div class="module-example">
      <h3>1. Common Debugging Tools</h3>
      <div class="code-block">
        <pre>
// Console methods
console.log('Basic logging');
console.info('Information');
console.warn('Warning message');
console.error('Error message');
console.table(['data', 'in', 'table']);
console.time('timer');
console.timeEnd('timer');

// Debugger statement
debugger;

// Try-catch with stack trace
try {
  throw new Error('Example error');
} catch (error) {
  console.error(error.stack);
}
        </pre>
      </div>
    </div>

    <div class="module-example">
      <h3>2. Debug This Calculator</h3>
      <div class="debug-calculator">
        <input type="number" id="debug-num1" value="5">
        <select id="debug-operation">
          <option value="add">+</option>
          <option value="subtract">-</option>
          <option value="multiply">×</option>
          <option value="divide">÷</option>
        </select>
        <input type="number" id="debug-num2" value="3">
        <button onclick="runDebugCalculator()">Calculate</button>
        <div id="debug-result" class="code-block">Find the bugs!</div>
      </div>
    </div>

    <div class="module-example">
      <h3>3. Debug Array Operations</h3>
      <div class="debug-arrays">
        <button onclick="testArrayOperations()">Test Array Operations</button>
        <div id="array-result" class="code-block">Click to test and debug</div>
      </div>
    </div>

    <div class="module-example">
      <h3>4. Debugging Tips</h3>
      <ul>
        <li>Use breakpoints in Chrome DevTools (F12)</li>
        <li>Step through code line by line</li>
        <li>Inspect variable values</li>
        <li>Use watch expressions</li>
        <li>Check the call stack</li>
        <li>Use conditional breakpoints</li>
      </ul>
    </div>
  `;

  const calc = new BuggyCalculator();
  const arrayOps = new BuggyArrayOps();

  // Debug calculator
  window.runDebugCalculator = () => {
    const num1 = document.getElementById('debug-num1').value;
    const num2 = document.getElementById('debug-num2').value;
    const operation = document.getElementById('debug-operation').value;
    const resultDiv = document.getElementById('debug-result');

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
      resultDiv.textContent = `Result: ${result}`;
      resultDiv.className = 'code-block';
    } catch (error) {
      resultDiv.textContent = `Error: ${error.message}`;
      resultDiv.className = 'code-block error';
    }
  };

  // Debug array operations
  window.testArrayOperations = () => {
    const resultDiv = document.getElementById('array-result');
    const testArrays = [
      [],
      [1, 5, 3, 2, 4],
      [1, '2', 10, '5'],
      [{ id: 1 }, { id: 1 }, { id: 2 }]
    ];

    let results = '';
    testArrays.forEach((arr, index) => {
      try {
        const max = arrayOps.findMax(arr);
        const unique = arrayOps.removeDuplicates(arr);
        const sorted = arrayOps.sort(arr);

        results += `
          Test ${index + 1}:
          Array: [${arr.join(', ')}]
          Max: ${max}
          Unique: [${unique.join(', ')}]
          Sorted: [${sorted.join(', ')}]
          ---------------
        `;
      } catch (error) {
        results += `
          Test ${index + 1}:
          Error: ${error.message}
          ---------------
        `;
      }
    });

    resultDiv.innerHTML = `<pre>${results}</pre>`;
  };
} 