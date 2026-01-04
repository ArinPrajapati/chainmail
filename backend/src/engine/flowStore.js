/**
 * FlowStore - Stores execution results for each node in a workflow run
 */
export class FlowStore {
    constructor() {
        this.results = new Map();
    }

    /**
     * Store a node's execution result
     * @param {string} nodeId - The node identifier
     * @param {*} result - The execution result (usually JSON object)
     */
    set(nodeId, result) {
        this.results.set(nodeId, result);
    }

    /**
     * Get a node's execution result
     * @param {string} nodeId - The node identifier
     * @returns {*} The stored result or undefined
     */
    get(nodeId) {
        return this.results.get(nodeId);
    }

    /**
     * Get all stored results
     * @returns {Object} All results as { nodeId: result }
     */
    getAll() {
        return Object.fromEntries(this.results);
    }

    /**
     * Get the last stored result (for {{lastResult}} shorthand)
     * @returns {*} The last stored result
     */
    getLastResult() {
        const entries = Array.from(this.results.entries());
        if (entries.length === 0) return undefined;
        return entries[entries.length - 1][1];
    }

    /**
     * Clear all stored results
     */
    clear() {
        this.results.clear();
    }
}
