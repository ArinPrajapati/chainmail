/**
 * Base Node - Common utilities for all node types
 * 
 * New format (with metadata):
 *   createNode({
 *     meta: { type, label, icon, description, inputs, outputs, parameters },
 *     execute: async (parameters, flowStore) => result
 *   })
 * 
 * Legacy format (backward compatible):
 *   createNode(async (parameters, flowStore) => result)
 */

import { resolveTemplates } from '../engine/templateParser.js';

/**
 * Create a node with metadata and executor
 * @param {Object|Function} definition - Node definition or legacy executor function
 * @returns {Object} Node object with { meta, execute }
 */
export function createNode(definition) {
    // Support legacy format: createNode(executeFn)
    if (typeof definition === 'function') {
        const executor = async (parameters, flowStore, ...extra) => {
            const resolved = resolveTemplates(parameters, flowStore);
            return definition(resolved, flowStore, ...extra);
        };
        return { meta: null, execute: executor };
    }

    // New format: createNode({ meta, execute })
    const { meta, execute } = definition;

    const executor = async (parameters, flowStore, ...extra) => {
        const resolved = resolveTemplates(parameters, flowStore);
        return execute(resolved, flowStore, ...extra);
    };

    return { meta, execute: executor };
}
