/**
 * TriggerNode - Entry point for workflow execution
 */

import { Handle, Position } from '@xyflow/react';

function TriggerNode({ data, selected }) {
    return (
        <div className={`node trigger-node ${selected ? 'selected' : ''}`}>
            <div className="node-header">
                <span className="node-icon">⚡</span>
                <span className="node-title">Trigger</span>
            </div>
            <div className="node-body">
                <p>Workflow entry point</p>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

export default TriggerNode;
