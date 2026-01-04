/**
 * Text Node - Outputs static or templated text
 */

import { createNode } from './baseNode.js';

export const textNode = createNode((parameters, flowStore) => {
    const { text = '' } = parameters;

    return {
        text: text
    };
});
