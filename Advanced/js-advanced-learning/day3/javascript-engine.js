/*
 * Day 3: JavaScript Engine Deep Dive
 * 
 * Main components of a JavaScript Engine (like V8):
 * 1. Parser
 * 2. AST (Abstract Syntax Tree)
 * 3. Interpreter (Ignition in V8)
 * 4. Compiler (TurboFan in V8)
 * 5. Optimizer
 */

// Example 1: Understanding Parsing and AST
// This code will be parsed into an AST before execution
function simpleFunction() {
    const x = 42;
    return x * 2;
}

/*
 * The above function would be represented in AST something like:
 * {
 *   type: "FunctionDeclaration",
 *   id: { type: "Identifier", name: "simpleFunction" },
 *   params: [],
 *   body: {
 *     type: "BlockStatement",
 *     body: [
 *       {
 *         type: "VariableDeclaration",
 *         declarations: [
 *           {
 *             type: "VariableDeclarator",
 *             id: { type: "Identifier", name: "x" },
 *             init: { type: "NumericLiteral", value: 42 }
 *           }
 *         ]
 *       },
 *       {
 *         type: "ReturnStatement",
 *         argument: {
 *           type: "BinaryExpression",
 *           operator: "*",
 *           left: { type: "Identifier", name: "x" },
 *           right: { type: "NumericLiteral", value: 2 }
 *         }
 *       }
 *     ]
 *   }
 * }
 */

// Example 2: JIT Compilation Example
function hotFunction(n) {
    // This function will be optimized if called frequently
    let result = 0;
    for(let i = 0; i < n; i++) {
        result += i;
    }
    return result;
}

// Call the function multiple times to trigger optimization
for(let i = 0; i < 1000; i++) {
    hotFunction(100);
}

// Example 3: Deoptimization
function deoptExample(obj) {
    // This function might be deoptimized if object structure changes
    return obj.x + obj.y;
}

const obj1 = { x: 1, y: 2 };
deoptExample(obj1); // Optimized for this structure

const obj2 = { x: 1, y: 2, z: 3 }; // Different structure
deoptExample(obj2); // Might cause deoptimization

// Example 4: Hidden Classes
function Point(x, y) {
    this.x = x;
    this.y = y;
}

// Good - same hidden class
const p1 = new Point(1, 2);
const p2 = new Point(3, 4);

// Bad - creates different hidden classes
const p3 = { x: 5 };
p3.y = 6; // Adding property later is less optimized

// Example 5: Inline Caching
function getValue(obj) {
    return obj.value; // V8 can optimize this lookup
}

const sameStructure = [
    { value: 1 },
    { value: 2 },
    { value: 3 }
];

// V8 can optimize these calls as they use the same structure
sameStructure.forEach(obj => getValue(obj));

/*
 * Key Concepts to Remember:
 * 
 * 1. JavaScript engines use multiple phases:
 *    - Parsing → AST → Bytecode → Machine Code
 * 
 * 2. JIT compilation combines interpreter and compiler:
 *    - First interprets code for fast startup
 *    - Compiles hot code paths for better performance
 * 
 * 3. Optimization techniques:
 *    - Hidden Classes for object structure
 *    - Inline Caching for property access
 *    - Function inlining for frequent calls
 * 
 * 4. Deoptimization triggers:
 *    - Changing object structures
 *    - Using eval() or with
 *    - Debugging
 */

// Practice: Create a performance test
function performanceTest() {
    const start = performance.now();
    
    // Hot function
    for(let i = 0; i < 1000000; i++) {
        hotFunction(10);
    }
    
    const end = performance.now();
    console.log(`Execution time: ${end - start}ms`);
}

// Uncomment to run the test
// performanceTest(); 