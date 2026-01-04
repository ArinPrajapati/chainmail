/**
 * AiNode - Sends prompt to LLM
 */

import { Handle, Position } from '@xyflow/react';

function AiNode({ data, selected }) {
    return (
        <div className={`node ai-node ${selected ? 'selected' : ''}`}>
            <div className="node-header">
                <span className="node-icon">🤖</span>
                <span className="node-title">AI</span>
            </div>
            <div className="node-body">
                <p className="node-preview">
                    {data.prompt ? data.prompt.substring(0, 30) + (data.prompt.length > 30 ? '...' : '') : 'No prompt configured'}
                </p>
            </div>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

export default AiNode;
