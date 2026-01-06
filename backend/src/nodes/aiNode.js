/**
 * AI Node - Sends prompt to LLM and returns response
 */

import { createNode } from './baseNode.js';
import { executeLLM } from '../utils/executeLLM.js';

export const aiNode = createNode({
    meta: {
        type: 'ai',
        label: 'AI',
        icon: '🤖',
        description: 'Send prompt to LLM',
        inputs: ['default'],
        outputs: ['default'],
        parameters: [
            {
                name: 'prompt',
                type: 'textarea',
                label: 'Prompt',
                placeholder: 'Enter prompt or use {{lastResult}} for previous output',
                required: true
            }
        ]
    },
    execute: async (parameters, flowStore) => {
        const { prompt } = parameters;

        if (!prompt) {
            throw new Error('AI Node: prompt is required');
        }

        const response = await executeLLM(prompt);

        return {
            prompt: prompt,
            response: response
        };
    }
});
