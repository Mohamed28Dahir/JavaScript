export function initWebpackDay(container) {
  container.innerHTML = `
    <h2>Day 24: Webpack and Bundling</h2>
    
    <div class="module-example">
      <h3>1. Basic Webpack Configuration</h3>
      <div class="code-block">
        <pre>
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};
        </pre>
      </div>
    </div>

    <div class="module-example">
      <h3>2. Common Webpack Features</h3>
      <div class="feature-list">
        <div class="feature-item">
          <h4>Loaders</h4>
          <ul>
            <li>babel-loader: Transform modern JS</li>
            <li>css-loader: Handle CSS imports</li>
            <li>style-loader: Inject CSS into DOM</li>
            <li>file-loader: Handle file imports</li>
          </ul>
        </div>

        <div class="feature-item">
          <h4>Plugins</h4>
          <ul>
            <li>HtmlWebpackPlugin: Generate HTML</li>
            <li>MiniCssExtractPlugin: Extract CSS</li>
            <li>CleanWebpackPlugin: Clean build folder</li>
            <li>CopyWebpackPlugin: Copy static files</li>
          </ul>
        </div>

        <div class="feature-item">
          <h4>Optimizations</h4>
          <ul>
            <li>Code splitting</li>
            <li>Tree shaking</li>
            <li>Lazy loading</li>
            <li>Minification</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="module-example">
      <h3>3. Development vs Production</h3>
      <div class="code-block">
        <h4>Development Mode:</h4>
        <pre>
// package.json
{
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production"
  }
}

// Development features:
- Source maps
- Hot Module Replacement (HMR)
- Development server
- Faster builds
        </pre>

        <h4>Production Mode:</h4>
        <pre>
// Production optimizations:
- Minification
- Tree shaking
- Scope hoisting
- Deterministic hashes
- Optimized assets
        </pre>
      </div>
    </div>

    <div class="module-example">
      <h3>4. Live Example: Dynamic Import</h3>
      <button id="load-module">Load Heavy Module</button>
      <div id="module-output" class="code-block">Click button to load module</div>
    </div>
  `;

  // Dynamic import example
  const loadButton = document.getElementById('load-module');
  const outputDiv = document.getElementById('module-output');

  loadButton.addEventListener('click', async () => {
    outputDiv.textContent = 'Loading module...';
    outputDiv.className = 'code-block';

    try {
      // Simulate a heavy module with dynamic import
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      outputDiv.innerHTML = `
        Module loaded successfully!<br>
        This demonstrates dynamic importing,<br>
        which is one of Webpack's code-splitting features.
      `;
      outputDiv.className = 'code-block success';
    } catch (error) {
      outputDiv.textContent = 'Error loading module: ' + error.message;
      outputDiv.className = 'code-block error';
    }
  });
} 