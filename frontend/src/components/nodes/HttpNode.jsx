/**
 * HttpNode - Makes HTTP requests
 */

import { Handle, Position } from '@xyflow/react';

function HttpNode({ data, selected }) {
    const methodColors = {
        GET: '#61affe',
        POST: '#49cc90',
        PUT: '#fca130',
        DELETE: '#f93e3e',
        PATCH: '#50e3c2',
    };

    return (
        <div className={`node http-node ${selected ? 'selected' : ''}`}>
            <div className="node-header">
                <span className="node-icon">🌐</span>
                <span className="node-title">HTTP</span>
            </div>
            <div className="node-body">
                <span
                    className="http-method"
                    style={{ backgroundColor: methodColors[data.method] || '#999' }}
                >
                    {data.method || 'GET'}
                </span>
                <p className="node-preview">
                    {data.url ? data.url.substring(0, 25) + (data.url.length > 25 ? '...' : '') : 'No URL configured'}
                </p>
            </div>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

export default HttpNode;
