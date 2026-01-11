/**
 * Text Node - Outputs static or templated text
 */

import { createNode } from './baseNode.js';

export const textNode = createNode({
    meta: {
        type: 'text',
        label: 'Text',
        icon: 'Type',
        description: 'Static or templated text',
        inputs: ['default'],
        outputs: ['default'],
        parameters: [
            {
                name: 'text',
                type: 'textarea',
                label: 'Text Content',
                placeholder: 'Enter text or use {{nodeId.field}} for templating',
                default: ''
            }
        ]
    },
    execute: (parameters, flowStore) => {
        const { text = '' } = parameters;
        return { text };
    }
});
