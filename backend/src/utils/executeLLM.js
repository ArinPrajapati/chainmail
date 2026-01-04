/**
 * Mock LLM Executor - Stub for testing
 * Replace with real implementation later
 */

/**
 * Execute a prompt against an LLM
 * @param {string} prompt - The prompt to send
 * @returns {Promise<string>} The LLM response
 */
export async function executeLLM(prompt) {
    // Simulate async delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Mock response for testing
    return `[Mock LLM Response] Received prompt: "${prompt.slice(0, 100)}${prompt.length > 100 ? '...' : ''}"`;
}
