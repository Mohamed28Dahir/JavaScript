// Editor feature module
class Editor {
    constructor() {
        this.content = '';
        this.element = null;
    }
    
    initialize() {
        console.log('Initializing editor...');
        this.createEditor();
        this.setupEventListeners();
    }
    
    createEditor() {
        const editor = document.createElement('div');
        editor.id = 'editor';
        editor.contentEditable = true;
        editor.className = 'editor';
        
        const toolbar = document.createElement('div');
        toolbar.className = 'editor-toolbar';
        toolbar.innerHTML = `
            <button data-command="bold">Bold</button>
            <button data-command="italic">Italic</button>
            <button data-command="underline">Underline</button>
        `;
        
        const container = document.createElement('div');
        container.className = 'editor-container';
        container.appendChild(toolbar);
        container.appendChild(editor);
        
        document.getElementById('app').appendChild(container);
        this.element = editor;
    }
    
    setupEventListeners() {
        const toolbar = document.querySelector('.editor-toolbar');
        toolbar.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                const command = event.target.dataset.command;
                this.executeCommand(command);
            }
        });
        
        this.element.addEventListener('input', () => {
            this.content = this.element.innerHTML;
            this.autosave();
        });
    }
    
    executeCommand(command) {
        document.execCommand(command, false, null);
        this.element.focus();
    }
    
    getContent() {
        return this.content;
    }
    
    setContent(content) {
        this.content = content;
        this.element.innerHTML = content;
    }
    
    autosave() {
        // Simulated autosave functionality
        console.log('Autosaving...', this.content.length, 'characters');
    }
}

// Add styles
const styles = document.createElement('style');
styles.textContent = `
    .editor-container {
        margin: 20px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    
    .editor-toolbar {
        padding: 10px;
        border-bottom: 1px solid #ccc;
        background: #f5f5f5;
    }
    
    .editor-toolbar button {
        margin-right: 5px;
        padding: 5px 10px;
        border: 1px solid #ccc;
        border-radius: 3px;
        background: white;
        cursor: pointer;
    }
    
    .editor {
        min-height: 200px;
        padding: 15px;
        outline: none;
    }
`;
document.head.appendChild(styles);

export const editor = new Editor();
export const initialize = () => editor.initialize(); 