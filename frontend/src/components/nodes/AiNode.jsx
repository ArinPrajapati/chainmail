/**
 * AiNode - Sends prompt to LLM
 */

import BaseNode from './BaseNode';

function AiNode({ selected }) {
    return (
        <BaseNode
            type="ai"
            icon="🤖"
            selected={selected}
        />
    );
}

export default AiNode;
