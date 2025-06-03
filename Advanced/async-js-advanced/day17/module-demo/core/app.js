// Core application module
export function initializeApp() {
    console.log('Initializing application...');
    setupUI();
    setupEventListeners();
}

function setupUI() {
    const app = document.createElement('div');
    app.id = 'app';
    
    const buttons = `
        <button id="loadAnalytics">Load Analytics</button>
        <button id="loadEditor">Load Editor</button>
    `;
    
    app.innerHTML = buttons;
    document.body.appendChild(app);
}

function setupEventListeners() {
    window.addEventListener('load', () => {
        console.log('Application loaded');
    });
    
    window.addEventListener('error', (error) => {
        console.error('Application error:', error);
    });
} 