// Example class with code quality issues
class userManager {
  constructor() {
    this.users = [];
  }

  adduser(user) {
    if(!user.name || !user.email) return false;
    this.users.push(user);
    return true;
  }

  finduser(email) {
    return this.users.find(u => u.email === email);
  }

  deleteuser(email) {
    const idx = this.users.findIndex(u => u.email === email);
    if(idx === -1) return false;
    this.users.splice(idx, 1);
    return true;
  }
}

// Improved version with better code quality
class UserManager {
  constructor() {
    this.users = [];
  }

  /**
   * Adds a new user to the system
   * @param {Object} user - The user object to add
   * @param {string} user.name - The user's name
   * @param {string} user.email - The user's email
   * @returns {boolean} True if user was added successfully
   * @throws {Error} If user data is invalid
   */
  addUser(user) {
    if (!user || typeof user !== 'object') {
      throw new Error('Invalid user data');
    }

    if (!this.isValidUserData(user)) {
      throw new Error('Missing required user fields');
    }

    this.users.push({
      ...user,
      id: this.generateUserId(),
      createdAt: new Date()
    });

    return true;
  }

  /**
   * Finds a user by their email
   * @param {string} email - The email to search for
   * @returns {Object|null} The found user or null
   */
  findUser(email) {
    if (!email || typeof email !== 'string') {
      throw new Error('Invalid email');
    }

    return this.users.find(user => user.email === email) || null;
  }

  /**
   * Deletes a user by their email
   * @param {string} email - The email of the user to delete
   * @returns {boolean} True if user was deleted
   */
  deleteUser(email) {
    if (!email || typeof email !== 'string') {
      throw new Error('Invalid email');
    }

    const index = this.users.findIndex(user => user.email === email);
    
    if (index === -1) {
      return false;
    }

    this.users.splice(index, 1);
    return true;
  }

  /**
   * Validates user data
   * @private
   */
  isValidUserData(user) {
    return (
      user.name &&
      typeof user.name === 'string' &&
      user.name.length > 0 &&
      user.email &&
      typeof user.email === 'string' &&
      user.email.includes('@')
    );
  }

  /**
   * Generates a unique user ID
   * @private
   */
  generateUserId() {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export function initCodeQualityDay(container) {
  container.innerHTML = `
    <h2>Day 26: Code Quality</h2>
    
    <div class="module-example">
      <h3>1. Code Quality Tools</h3>
      <div class="code-block">
        <h4>ESLint Configuration</h4>
        <pre>
// .eslintrc.json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "indent": ["error", 2],
    "quotes": ["error", "single"],
    "semi": ["error", "always"]
  }
}
        </pre>

        <h4>Prettier Configuration</h4>
        <pre>
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
        </pre>
      </div>
    </div>

    <div class="module-example">
      <h3>2. Code Quality Comparison</h3>
      <div class="comparison">
        <div class="bad-example">
          <h4>❌ Poor Quality Code</h4>
          <pre class="code-block">
${userManager.toString()}
          </pre>
        </div>

        <div class="good-example">
          <h4>✓ High Quality Code</h4>
          <pre class="code-block">
${UserManager.toString()}
          </pre>
        </div>
      </div>
    </div>

    <div class="module-example">
      <h3>3. Best Practices</h3>
      <ul>
        <li>Use meaningful variable and function names</li>
        <li>Add JSDoc comments for documentation</li>
        <li>Implement proper error handling</li>
        <li>Follow consistent code style</li>
        <li>Write unit tests</li>
        <li>Keep functions small and focused</li>
        <li>Use TypeScript for type safety</li>
        <li>Implement proper validation</li>
      </ul>
    </div>

    <div class="module-example">
      <h3>4. Live Example</h3>
      <div class="quality-demo">
        <div class="form-group">
          <input type="text" id="user-name" placeholder="Name">
          <input type="email" id="user-email" placeholder="Email">
          <button onclick="addUserExample()">Add User</button>
        </div>
        <div id="user-result" class="code-block">Enter user details</div>
      </div>
    </div>
  `;

  const userManager = new UserManager();

  window.addUserExample = () => {
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const resultDiv = document.getElementById('user-result');

    try {
      const user = {
        name: nameInput.value,
        email: emailInput.value
      };

      userManager.addUser(user);
      
      resultDiv.innerHTML = `
        User added successfully!<br>
        Current users: ${userManager.users.length}<br>
        Latest user: ${JSON.stringify(userManager.findUser(user.email), null, 2)}
      `;
      resultDiv.className = 'code-block success';

      // Clear inputs
      nameInput.value = '';
      emailInput.value = '';
    } catch (error) {
      resultDiv.textContent = `Error: ${error.message}`;
      resultDiv.className = 'code-block error';
    }
  };
} 