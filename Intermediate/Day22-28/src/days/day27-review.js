// Example combining various modern JS concepts
class TaskManager {
  constructor() {
    this.tasks = new Map();
    this.subscribers = new Set();
  }

  /**
   * Adds a new task
   * @param {Object} task - The task to add
   * @returns {Promise<string>} Task ID
   */
  async addTask(task) {
    // Validate task
    if (!this.isValidTask(task)) {
      throw new Error('Invalid task data');
    }

    // Generate ID and add task
    const id = this.generateId();
    const newTask = {
      id,
      ...task,
      status: 'pending',
      created: new Date(),
      updated: new Date()
    };

    // Simulate async operation
    await this.simulateDelay();
    
    this.tasks.set(id, newTask);
    this.notifySubscribers('add', newTask);
    
    return id;
  }

  /**
   * Updates a task's status
   * @param {string} id - Task ID
   * @param {string} status - New status
   */
  async updateStatus(id, status) {
    if (!this.tasks.has(id)) {
      throw new Error('Task not found');
    }

    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    await this.simulateDelay();

    const task = this.tasks.get(id);
    const updatedTask = {
      ...task,
      status,
      updated: new Date()
    };

    this.tasks.set(id, updatedTask);
    this.notifySubscribers('update', updatedTask);
  }

  /**
   * Subscribes to task changes
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Private methods
  isValidTask(task) {
    return (
      task &&
      typeof task === 'object' &&
      typeof task.title === 'string' &&
      task.title.length > 0 &&
      typeof task.description === 'string'
    );
  }

  generateId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  notifySubscribers(action, task) {
    this.subscribers.forEach(callback => {
      try {
        callback(action, task);
      } catch (error) {
        console.error('Error in subscriber:', error);
      }
    });
  }

  simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 500));
  }
}

export function initReviewDay(container) {
  container.innerHTML = `
    <h2>Day 27: Modern JavaScript Review</h2>
    
    <div class="module-example">
      <h3>1. Task Management Demo</h3>
      <div class="task-demo">
        <div class="form-group">
          <input type="text" id="task-title" placeholder="Task Title">
          <textarea id="task-description" placeholder="Task Description"></textarea>
          <button onclick="addTaskExample()">Add Task</button>
        </div>
        <div id="task-list" class="code-block">No tasks yet</div>
      </div>
    </div>

    <div class="module-example">
      <h3>2. Concepts Reviewed</h3>
      <ul>
        <li>
          <strong>ES6+ Features</strong>
          <ul>
            <li>Classes and inheritance</li>
            <li>Arrow functions</li>
            <li>Destructuring</li>
            <li>Spread operator</li>
            <li>Template literals</li>
            <li>Map and Set</li>
          </ul>
        </li>
        <li>
          <strong>Async Programming</strong>
          <ul>
            <li>Promises</li>
            <li>Async/await</li>
            <li>Error handling</li>
          </ul>
        </li>
        <li>
          <strong>Code Quality</strong>
          <ul>
            <li>JSDoc comments</li>
            <li>Error handling</li>
            <li>Private methods</li>
            <li>Validation</li>
          </ul>
        </li>
        <li>
          <strong>Design Patterns</strong>
          <ul>
            <li>Observer pattern</li>
            <li>Factory pattern</li>
            <li>Module pattern</li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="module-example">
      <h3>3. Code Examples</h3>
      <div class="code-block">
        <pre>
// ES6+ Features
const { title, description } = task;
const newTask = { ...task, status };

// Async/Await
async function handleTask() {
  try {
    const id = await taskManager.addTask(task);
    await taskManager.updateStatus(id, 'in-progress');
  } catch (error) {
    console.error(error);
  }
}

// Observer Pattern
const unsubscribe = taskManager.subscribe((action, task) => {
  console.log(\`Task \${action}d:\`, task);
});
        </pre>
      </div>
    </div>
  `;

  const taskManager = new TaskManager();
  const taskList = document.getElementById('task-list');

  // Subscribe to task changes
  taskManager.subscribe((action, task) => {
    const tasks = Array.from(taskManager.tasks.values());
    if (tasks.length === 0) {
      taskList.textContent = 'No tasks yet';
      return;
    }

    taskList.innerHTML = tasks.map(t => `
      <div class="task-item \${t.status}">
        <h4>${t.title}</h4>
        <p>${t.description}</p>
        <div class="task-meta">
          Status: ${t.status}
          <select onchange="updateTaskStatus('${t.id}', this.value)">
            <option value="pending" ${t.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="in-progress" ${t.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
            <option value="completed" ${t.status === 'completed' ? 'selected' : ''}>Completed</option>
          </select>
        </div>
      </div>
    `).join('');
  });

  // Add task handler
  window.addTaskExample = async () => {
    const titleInput = document.getElementById('task-title');
    const descriptionInput = document.getElementById('task-description');

    try {
      await taskManager.addTask({
        title: titleInput.value,
        description: descriptionInput.value
      });

      // Clear inputs
      titleInput.value = '';
      descriptionInput.value = '';
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Update task status handler
  window.updateTaskStatus = async (id, status) => {
    try {
      await taskManager.updateStatus(id, status);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
} 