/**
 * Base Node - Common utilities for all node types
 */

import { resolveTemplates } from '../engine/templateParser.js';

/**
 * Create a node executor with common functionality
 * @param {Function} executeFn - The node-specific execute function
 * @returns {Function} Wrapped executor function
 */
export function createNode(executeFn) {
    return async (parameters, flowStore, ...extra) => {
        // Resolve any remaining templates in parameters
        const resolved = resolveTemplates(parameters, flowStore);
        return executeFn(resolved, flowStore, ...extra);
    };
}
