/**
 * Node Definitions Service - Fetches node types from backend API
 */

const API_URL = 'http://localhost:3000/api/nodes';

let cache = null;

/**
 * Fetch all node definitions from the backend
 * @param {boolean} forceRefresh - Skip cache and fetch fresh
 * @returns {Promise<Array>} Array of node definitions
 */
export async function fetchNodeDefinitions(forceRefresh = false) {
    if (cache && !forceRefresh) {
        return cache;
    }

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch nodes: ${response.status}`);
        }
        cache = await response.json();
        return cache;
    } catch (error) {
        console.error('Error fetching node definitions:', error);
        // Return empty array if backend unavailable
        return [];
    }
}

/**
 * Get cached node definitions (sync)
 * @returns {Array|null}
 */
export function getCachedDefinitions() {
    return cache;
}

/**
 * Find a node definition by type
 * @param {string} type
 * @returns {Object|undefined}
 */
export function getNodeDefinition(type) {
    return cache?.find(n => n.type === type);
}
