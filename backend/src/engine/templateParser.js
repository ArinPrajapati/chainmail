/**
 * Template Parser - Resolves {{nodeId.path}} expressions
 */

/**
 * Parse and resolve all {{...}} templates in a value
 * @param {*} value - String, object, or array containing templates
 * @param {FlowStore} flowStore - The flow store with node results
 * @returns {*} The value with all templates resolved
 */
export function resolveTemplates(value, flowStore) {
    if (typeof value === 'string') {
        return resolveStringTemplate(value, flowStore);
    }

    if (Array.isArray(value)) {
        return value.map(item => resolveTemplates(item, flowStore));
    }

    if (value && typeof value === 'object') {
        const resolved = {};
        for (const [key, val] of Object.entries(value)) {
            resolved[key] = resolveTemplates(val, flowStore);
        }
        return resolved;
    }

    return value;
}

/**
 * Resolve templates in a string
 * @param {string} str - String with {{...}} templates
 * @param {FlowStore} flowStore - The flow store
 * @returns {string} Resolved string
 */
function resolveStringTemplate(str, flowStore) {
    const templateRegex = /\{\{([^}]+)\}\}/g;

    return str.replace(templateRegex, (match, path) => {
        const trimmedPath = path.trim();
        const value = resolvePath(trimmedPath, flowStore);

        // If the entire string is just one template, return the actual value (preserve type)
        if (match === str && value !== undefined) {
            return typeof value === 'object' ? JSON.stringify(value) : String(value);
        }

        return value !== undefined ? String(value) : match;
    });
}

/**
 * Resolve a dot-notation path like "nodeId.data.users[0].name"
 * @param {string} path - The path to resolve
 * @param {FlowStore} flowStore - The flow store
 * @returns {*} The resolved value
 */
function resolvePath(path, flowStore) {
    if (path.startsWith('lastResult')) {
        const lastResult = flowStore.getLastResult();
        if (path === 'lastResult') return lastResult;
        const subPath = path.slice('lastResult.'.length);
        return getNestedValue(lastResult, subPath);
    }

    const dotIndex = path.indexOf('.');
    if (dotIndex === -1) {
        return flowStore.get(path);
    }

    const nodeId = path.slice(0, dotIndex);
    const subPath = path.slice(dotIndex + 1);
    const nodeResult = flowStore.get(nodeId);

    return getNestedValue(nodeResult, subPath);
}

/**
 * Get a nested value from an object using dot notation with array support
 * @param {*} obj - The object to traverse
 * @param {string} path - Path like "data.users[0].name"
 * @returns {*} The nested value
 */
function getNestedValue(obj, path) {
    if (obj === undefined || obj === null) return undefined;

    // Split path handling both dots and array brackets
    const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');

    let current = obj;
    for (const part of parts) {
        if (current === undefined || current === null) return undefined;
        current = current[part];
    }

    return current;
}
