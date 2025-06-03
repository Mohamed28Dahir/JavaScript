// Module loader utility
const MODULE_PATH = './features/';
const VALID_MODULES = ['analytics', 'editor', 'dashboard'];

export async function loadModule(moduleName) {
    if (!VALID_MODULES.includes(moduleName)) {
        throw new Error(`Invalid module: ${moduleName}`);
    }
    
    try {
        const module = await import(`${MODULE_PATH}${moduleName}.js`);
        console.log(`Module loaded: ${moduleName}`);
        return module;
    } catch (error) {
        console.error(`Failed to load module: ${moduleName}`, error);
        throw error;
    }
}

export function isValidModule(moduleName) {
    return VALID_MODULES.includes(moduleName);
}

export function getAvailableModules() {
    return [...VALID_MODULES];
} 