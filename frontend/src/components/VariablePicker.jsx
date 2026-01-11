/**
 * VariablePicker - Shows available variables from upstream nodes
 * 
 * Displays a dropdown with nodes and their output fields.
 * On selection, inserts {{nodeId.field}} template into the input.
 */

import { useState } from 'react';
import './VariablePicker.css';

function VariablePicker({ upstreamNodes, onInsert, onClose }) {
    const [expandedNode, setExpandedNode] = useState(null);

    if (!upstreamNodes || upstreamNodes.length === 0) {
        return (
            <div className="variable-picker">
                <div className="variable-picker-header">
                    <span>Insert Variable</span>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="variable-picker-empty">
                    No upstream nodes available
                </div>
            </div>
        );
    }

    const handleFieldClick = (nodeId, fieldName) => {
        const template = fieldName === '*'
            ? `{{${nodeId}}}`
            : `{{${nodeId}.${fieldName}}}`;
        onInsert(template);
        onClose();
    };

    const toggleNode = (nodeId) => {
        setExpandedNode(expandedNode === nodeId ? null : nodeId);
    };

    return (
        <div className="variable-picker">
            <div className="variable-picker-header">
                <span>Insert Variable</span>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>
            <div className="variable-picker-content">
                {upstreamNodes.map((node) => (
                    <div key={node.id} className="variable-node">
                        <div
                            className="variable-node-header"
                            onClick={() => toggleNode(node.id)}
                        >
                            <span className="expand-icon">
                                {expandedNode === node.id ? '▼' : '▶'}
                            </span>
                            <span className="node-label">{node.label || node.type}</span>
                            <span className="node-type">({node.type})</span>
                        </div>
                        {expandedNode === node.id && node.outputSchema?.fields && (
                            <div className="variable-fields">
                                {Object.entries(node.outputSchema.fields).map(([fieldName, fieldDef]) => (
                                    <div
                                        key={fieldName}
                                        className="variable-field"
                                        onClick={() => handleFieldClick(node.id, fieldName)}
                                    >
                                        <span className="field-name">
                                            {fieldName === '*' ? '(any field)' : fieldName}
                                        </span>
                                        <span className="field-type">{fieldDef.type}</span>
                                        {fieldDef.description && (
                                            <span className="field-desc">{fieldDef.description}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="variable-picker-footer">
                <button
                    className="insert-last"
                    onClick={() => { onInsert('{{lastResult}}'); onClose(); }}
                >
                    Insert {'{{lastResult}}'}
                </button>
            </div>
        </div>
    );
}

export default VariablePicker;
