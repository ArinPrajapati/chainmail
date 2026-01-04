/**
 * Trigger Node - Entry point that receives initial payload
 */

import { createNode } from './baseNode.js';

export const triggerNode = createNode((parameters, flowStore, triggerPayload) => {
    // Merge any static parameters with the trigger payload
    return {
        ...parameters,
        ...triggerPayload
    };
});
