/*
 * Day 6: Module Patterns in JavaScript
 * 
 * Types of Module Patterns:
 * 1. IIFE (Immediately Invoked Function Expression)
 * 2. Revealing Module Pattern
 * 3. CommonJS Modules
 * 4. ES6 Modules
 * 5. AMD (Asynchronous Module Definition)
 */

// 1. IIFE Pattern
const Calculator = (function() {
    // Private variables and methods
    let result = 0;
    
    function validate(num) {
        return typeof num === 'number' && !isNaN(num);
    }
    
    // Public interface
    return {
        add: function(num) {
            if (validate(num)) {
                result += num;
                return result;
            }
            throw new Error('Invalid number');
        },
        
        subtract: function(num) {
            if (validate(num)) {
                result -= num;
                return result;
            }
            throw new Error('Invalid number');
        },
        
        getResult: function() {
            return result;
        }
    };
})();

// Usage of IIFE Pattern
console.log(Calculator.add(5));      // 5
console.log(Calculator.subtract(2)); // 3
console.log(Calculator.getResult()); // 3

// 2. Revealing Module Pattern
const UserManager = (function() {
    // Private members
    const users = new Map();
    
    function validateUser(user) {
        return user && user.name && user.email;
    }
    
    function createUser(user) {
        if (!validateUser(user)) {
            throw new Error('Invalid user data');
        }
        users.set(user.email, user);
    }
    
    function getUser(email) {
        return users.get(email);
    }
    
    function deleteUser(email) {
        return users.delete(email);
    }
    
    // Reveal public methods
    return {
        create: createUser,
        get: getUser,
        delete: deleteUser
    };
})();

// Usage of Revealing Module Pattern
UserManager.create({ name: 'John', email: 'john@example.com' });
console.log(UserManager.get('john@example.com'));

// 3. CommonJS Module Pattern (Node.js)
// In a separate file named 'logger.js':
/*
const Logger = {
    log: function(message) {
        console.log(`[LOG]: ${message}`);
    },
    error: function(message) {
        console.error(`[ERROR]: ${message}`);
    }
};

module.exports = Logger;
*/

// Usage in another file:
/*
const Logger = require('./logger');
Logger.log('Test message');
*/

// 4. ES6 Modules
// In a separate file named 'mathUtils.js':
/*
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => b !== 0 ? a / b : throw new Error('Division by zero');

// Default export
export default class MathUtils {
    static sum(...numbers) {
        return numbers.reduce((acc, curr) => acc + curr, 0);
    }
}
*/

// Usage in another file:
/*
import MathUtils, { add, subtract } from './mathUtils.js';

console.log(add(5, 3));         // 8
console.log(subtract(10, 4));   // 6
console.log(MathUtils.sum(1, 2, 3, 4, 5)); // 15
*/

// 5. AMD Pattern (for browser, using RequireJS)
/*
define('mathModule', [], function() {
    return {
        add: function(a, b) {
            return a + b;
        },
        subtract: function(a, b) {
            return a - b;
        }
    };
});

require(['mathModule'], function(math) {
    console.log(math.add(5, 3));
});
*/

// Modern Module Pattern Example
// File: dataService.js
export class DataService {
    constructor() {
        this.data = new Map();
    }
    
    set(key, value) {
        this.data.set(key, value);
    }
    
    get(key) {
        return this.data.get(key);
    }
    
    delete(key) {
        return this.data.delete(key);
    }
    
    clear() {
        this.data.clear();
    }
}

// File: cacheService.js
export class CacheService {
    constructor(ttl = 3600000) { // 1 hour default TTL
        this.cache = new Map();
        this.ttl = ttl;
    }
    
    set(key, value) {
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }
    
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return item.value;
    }
}

// File: main.js
/*
import { DataService } from './dataService.js';
import { CacheService } from './cacheService.js';

const dataService = new DataService();
const cacheService = new CacheService(60000); // 1 minute TTL

// Usage
dataService.set('user', { name: 'John', age: 30 });
cacheService.set('tempData', { count: 42 });

console.log(dataService.get('user'));
console.log(cacheService.get('tempData'));
*/

// Practice Exercise: Creating a Module-based Logger System
// File: logger/types.js
export const LogLevel = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    DEBUG: 'DEBUG'
};

// File: logger/formatters.js
export const formatters = {
    simple: (level, message) => `[${level}] ${message}`,
    detailed: (level, message) => {
        const timestamp = new Date().toISOString();
        return `${timestamp} [${level}] ${message}`;
    },
    json: (level, message) => {
        return JSON.stringify({
            level,
            message,
            timestamp: new Date().toISOString()
        });
    }
};

// File: logger/logger.js
export class Logger {
    constructor(formatter = formatters.simple) {
        this.formatter = formatter;
    }
    
    log(level, message) {
        const formattedMessage = this.formatter(level, message);
        console.log(formattedMessage);
    }
    
    info(message) {
        this.log(LogLevel.INFO, message);
    }
    
    warn(message) {
        this.log(LogLevel.WARN, message);
    }
    
    error(message) {
        this.log(LogLevel.ERROR, message);
    }
    
    debug(message) {
        this.log(LogLevel.DEBUG, message);
    }
}

// Usage example:
/*
import { Logger } from './logger/logger.js';
import { formatters } from './logger/formatters.js';

const logger = new Logger(formatters.detailed);

logger.info('Application started');
logger.warn('Resource usage high');
logger.error('Database connection failed');
logger.debug('Processing request #1234');
*/ 