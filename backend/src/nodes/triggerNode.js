/**
 * Trigger Node - Entry point that receives initial payload
 */

import { createNode } from './baseNode.js';

export const triggerNode = createNode({
    meta: {
        type: 'trigger',
        label: 'Trigger',
        icon: 'Zap',
        description: 'Workflow entry point',
        inputs: [],  // No inputs - this is the start
        outputs: ['default'],
        parameters: []  // Trigger receives payload at runtime
    },
    execute: (parameters, flowStore, triggerPayload) => {
        // Merge any static parameters with the trigger payload
        return {
            ...parameters,
            ...triggerPayload
        };
    }
});
