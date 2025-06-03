/*
 * Day 17: JavaScript Modules
 * Topics covered:
 * 1. Dynamic Imports
 * 2. Code Splitting
 * 3. Module Patterns
 * 4. Lazy Loading
 */

// Main application entry point
import { initializeApp } from './core/app.js';
import { loadModule } from './utils/module-loader.js';

// Initialize core functionality
initializeApp();

// Example of dynamic module loading
async function loadFeature(featureName) {
    try {
        const module = await loadModule(featureName);
        return module.initialize();
    } catch (error) {
        console.error(`Failed to load feature: ${featureName}`, error);
        throw error;
    }
}

// Event handlers for feature loading
document.getElementById('loadAnalytics').addEventListener('click', async () => {
    const analytics = await import('./features/analytics.js');
    analytics.initialize();
});

document.getElementById('loadEditor').addEventListener('click', async () => {
    const editor = await import('./features/editor.js');
    editor.initialize();
});

// Export functionality
export {
    loadFeature
}; 