class JSONHandler {
    constructor() {
        this.userForm = document.getElementById('userForm');
        this.jsonOutput = document.getElementById('jsonOutput');
        this.jsonInput = document.getElementById('jsonInput');
        this.parseResult = document.getElementById('parseResult');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.userForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    }

    handleFormSubmit() {
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            age: parseInt(document.getElementById('age').value),
            role: document.getElementById('role').value,
            id: Date.now(),
            createdAt: new Date().toISOString()
        };

        this.displayJSON(userData);
    }

    displayJSON(data) {
        try {
            const formattedJSON = JSON.stringify(data, null, 2);
            this.jsonOutput.textContent = formattedJSON;
        } catch (error) {
            this.showError(this.jsonOutput, 'Error formatting JSON');
        }
    }

    parseJSON() {
        const jsonStr = this.jsonInput.value.trim();
        
        try {
            // First, validate the JSON structure
            const parsed = JSON.parse(jsonStr);
            
            // Add additional validation if needed
            this.validateUserData(parsed);
            
            // Display the parsed and validated data
            const formattedOutput = this.formatParsedData(parsed);
            this.parseResult.innerHTML = formattedOutput;
            this.parseResult.classList.remove('error');
        } catch (error) {
            this.showError(this.parseResult, `Invalid JSON: ${error.message}`);
        }
    }

    validateUserData(data) {
        // Example validation rules
        if (typeof data !== 'object') {
            throw new Error('JSON must represent an object');
        }

        if (!data.name || typeof data.name !== 'string') {
            throw new Error('Name is required and must be a string');
        }

        if (!data.email || typeof data.email !== 'string') {
            throw new Error('Email is required and must be a string');
        }

        if (data.age && typeof data.age !== 'number') {
            throw new Error('Age must be a number');
        }
    }

    formatParsedData(data) {
        let html = '<div style="color: #2c3e50;">';
        
        // Format each property
        for (const [key, value] of Object.entries(data)) {
            html += `<div style="margin: 0.5rem 0;">
                <strong>${this.capitalize(key)}:</strong> 
                <span style="color: ${this.getValueColor(value)}">
                    ${this.formatValue(value)}
                </span>
            </div>`;
        }
        
        html += '</div>';
        return html;
    }

    formatValue(value) {
        if (value === null) return '<em>null</em>';
        if (value === undefined) return '<em>undefined</em>';
        if (typeof value === 'object') return JSON.stringify(value, null, 2);
        return value.toString();
    }

    getValueColor(value) {
        switch (typeof value) {
            case 'number': return '#2980b9';
            case 'boolean': return '#27ae60';
            case 'string': return '#c0392b';
            case 'object': return '#8e44ad';
            default: return '#2c3e50';
        }
    }

    showError(element, message) {
        element.textContent = message;
        element.classList.add('error');
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize the handler
const jsonHandler = new JSONHandler();

// Global functions for button clicks
window.copyToClipboard = () => {
    const jsonText = document.getElementById('jsonOutput').textContent;
    navigator.clipboard.writeText(jsonText)
        .then(() => alert('JSON copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
};

window.parseJSON = () => {
 