/*
Day 6: Comprehensive Review
========================

This file combines all concepts learned:
1. JavaScript Execution (Call Stack, Hoisting, Scope)
2. Closures
3. this Keyword
4. ES6 Syntax
5. Destructuring & Spread
*/

// Exercise 1: Advanced Counter with Closure and ES6
console.log('--- Exercise 1: Advanced Counter ---');

const createAdvancedCounter = (initialValue = 0) => {
    let count = initialValue;
    let history = [];
    
    return {
        increment: (step = 1) => {
            count += step;
            history.push({ action: 'increment', step, timestamp: new Date() });
            return count;
        },
        decrement: (step = 1) => {
            count -= step;
            history.push({ action: 'decrement', step, timestamp: new Date() });
            return count;
        },
        getCount: () => count,
        getHistory: () => [...history]  // Return copy using spread
    };
};

const advCounter = createAdvancedCounter(10);
console.log(advCounter.increment(5));  // 15
console.log(advCounter.decrement(2));  // 13
console.log(advCounter.getHistory());

// Exercise 2: Task Manager with this and Classes
console.log('\n--- Exercise 2: Task Manager ---');

class Task {
    constructor(title, priority = 'normal') {
        this.title = title;
        this.priority = priority;
        this.completed = false;
        this.createdAt = new Date();
    }
    
    complete() {
        this.completed = true;
    }
    
    toString() {
        return `${this.title} (${this.priority}) - ${this.completed ? 'Done' : 'Pending'}`;
    }
}

class TaskManager {
    #tasks = [];  // Private field
    
    addTask = (...tasks) => {
        this.#tasks.push(...tasks);
    }
    
    completeTask(title) {
        const task = this.#tasks.find(task => task.title === title);
        if (task) {
            task.complete();
            return true;
        }
        return false;
    }
    
    getTasksByPriority({ priority } = {}) {
        return this.#tasks
            .filter(task => !priority || task.priority === priority)
            .map(task => task.toString());
    }
}

const taskManager = new TaskManager();
taskManager.addTask(
    new Task('Learn JavaScript', 'high'),
    new Task('Practice coding', 'high'),
    new Task('Take a break', 'low')
);

taskManager.completeTask('Learn JavaScript');
console.log(taskManager.getTasksByPriority({ priority: 'high' }));

// Exercise 3: Data Transformer with Destructuring
console.log('\n--- Exercise 3: Data Transformer ---');

const sampleData = {
    users: [
        { id: 1, profile: { name: 'John', skills: ['JS', 'React'] } },
        { id: 2, profile: { name: 'Jane', skills: ['Python', 'Django'] } }
    ],
    projects: [
        { id: 1, title: 'Web App', assignedTo: 1 },
        { id: 2, title: 'API', assignedTo: 2 }
    ],
    settings: {
        theme: 'dark',
        notifications: true
    }
};

function transformData({ users, projects, settings: { theme } }) {
    // Transform users and their projects
    const transformedUsers = users.map(({ id, profile: { name, skills } }) => {
        const userProjects = projects
            .filter(project => project.assignedTo === id)
            .map(({ title }) => title);
            
        return {
            name,
            skills: [...skills],  // Create new array
            projects: userProjects
        };
    });
    
    return {
        users: transformedUsers,
        theme
    };
}

console.log(transformData(sampleData));

// Exercise 4: Event System with Closures and this
console.log('\n--- Exercise 4: Event System ---');

class EventEmitter {
    #events = new Map();
    
    on = (event, callback) => {
        if (!this.#events.has(event)) {
            this.#events.set(event, []);
        }
        this.#events.get(event).push(callback);
        
        // Return unsubscribe function (closure)
        return () => {
            const callbacks = this.#events.get(event);
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        };
    }
    
    emit = (event, ...args) => {
        if (this.#events.has(event)) {
            this.#events.get(event).forEach(callback => callback(...args));
        }
    }
}

const emitter = new EventEmitter();
const unsubscribe = emitter.on('userAction', ({ type, data }) => {
    console.log(`Action: ${type}, Data:`, data);
});

emitter.emit('userAction', { type: 'click', data: { x: 100, y: 200 } });
unsubscribe();  // Remove listener

// Exercise 5: Configuration Manager
console.log('\n--- Exercise 5: Configuration Manager ---');

class ConfigManager {
    static #instance;
    #config = {};
    
    constructor() {
        if (ConfigManager.#instance) {
            return ConfigManager.#instance;
        }
        ConfigManager.#instance = this;
    }
    
    update = (newConfig) => {
        this.#config = {
            ...this.#config,
            ...newConfig
        };
    }
    
    get = (path) => {
        return path.split('.').reduce((obj, key) => obj?.[key], this.#config);
    }
}

const config = new ConfigManager();
config.update({
    app: {
        name: 'MyApp',
        theme: {
            dark: {
                background: '#000'
            }
        }
    }
});

console.log(config.get('app.theme.dark.background'));  // #000

/*
Key Review Points:
1. Use closures for data privacy and state management
2. Leverage classes and 'this' for object-oriented programming
3. Apply destructuring and spread for clean data manipulation
4. Combine concepts to create robust, maintainable code
5. Use modern ES6+ features for cleaner syntax

Practice:
1. Add error handling to the exercises
2. Implement additional features in TaskManager
3. Create your own exercise combining multiple concepts
*/ 