/**
 * AI Node - Sends prompt to LLM and returns response
 */

import { createNode } from './baseNode.js';
import { executeLLM } from '../utils/executeLLM.js';

export const aiNode = createNode(async (parameters, flowStore) => {
    const { prompt } = parameters;

    if (!prompt) {
        throw new Error('AI Node: prompt is required');
    }

    const response = await executeLLM(prompt);

    return {
        prompt: prompt,
        response: response
    };
});
