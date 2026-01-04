/**
 * TextNode - Outputs static or templated text
 */

import { Handle, Position } from '@xyflow/react';

function TextNode({ data, selected }) {
    return (
        <div className={`node text-node ${selected ? 'selected' : ''}`}>
            <div className="node-header">
                <span className="node-icon">📝</span>
                <span className="node-title">Text</span>
            </div>
            <div className="node-body">
                <p className="node-preview">
                    {data.text ? data.text.substring(0, 30) + (data.text.length > 30 ? '...' : '') : 'No text configured'}
                </p>
            </div>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

export default TextNode;
