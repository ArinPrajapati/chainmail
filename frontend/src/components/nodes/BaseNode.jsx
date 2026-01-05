/**
 * BaseNode - Root component that reduces boilerplate for all node types
 * 
 * Usage:
 * <BaseNode
 *   type="text"              // Node type (used for CSS class: `text-node`)
 *   icon="📝"                // Icon to display in header
 *   title="Text"             // Title to display in header
 *   selected={selected}      // Whether node is selected
 *   inputs={['default']}     // Array of input handles (default: ['default'])
 *   outputs={['default']}    // Array of output handles (default: ['default'])
 * >
 *   {children}               // Body content
 * </BaseNode>
 * 
 * Handle format options:
 * - String: just the handle ID, uses default position
 *   inputs={['a', 'b']}
 * 
 * - Object: full control over handle
 *   inputs={[
 *     { id: 'condition-true', position: 'left', style: { top: '30%' } },
 *     { id: 'condition-false', position: 'right', style: { top: '30%' } }
 *   ]}
 * 
 * Set to empty array [] for no handles:
 *   inputs={[]}  // No input handles (like TriggerNode)
 */

import { Handle, Position } from '@xyflow/react';

// Map string positions to Position enum
const POSITION_MAP = {
    top: Position.Top,
    bottom: Position.Bottom,
    left: Position.Left,
    right: Position.Right,
};

// Calculate offset for evenly spaced handles
function getHandleStyle(index, total, isVertical) {
    if (total <= 1) return {};

    const percentage = ((index + 1) / (total + 1)) * 100;
    return isVertical
        ? { left: `${percentage}%` }
        : { top: `${percentage}%` };
}

function BaseNode({
    type,
    icon,
    selected,
    inputs = ['default'],
    outputs = ['default'],
}) {
    // Normalize handle config to array of objects
    const normalizeHandles = (handles, defaultPosition) => {
        return handles.map((handle, index) => {
            if (typeof handle === 'string') {
                return { id: handle, position: defaultPosition };
            }
            return {
                id: handle.id,
                position: handle.position || defaultPosition,
                style: handle.style || {},
            };
        });
    };

    const inputHandles = normalizeHandles(inputs, 'top');
    const outputHandles = normalizeHandles(outputs, 'bottom');

    return (
        <div className={`node ${type}-node ${selected ? 'selected' : ''}`}>
            <div className="node-icon-wrapper">
                <span className="node-icon">{icon}</span>
            </div>

            {/* Input handles */}
            {inputHandles.map((handle, index) => {
                const position = POSITION_MAP[handle.position] || Position.Top;
                const isVertical = position === Position.Top || position === Position.Bottom;
                const autoStyle = getHandleStyle(index, inputHandles.length, isVertical);

                return (
                    <Handle
                        key={`input-${handle.id}`}
                        type="target"
                        position={position}
                        id={handle.id}
                        style={{ ...autoStyle, ...handle.style }}
                    />
                );
            })}

            {/* Output handles */}
            {outputHandles.map((handle, index) => {
                const position = POSITION_MAP[handle.position] || Position.Bottom;
                const isVertical = position === Position.Top || position === Position.Bottom;
                const autoStyle = getHandleStyle(index, outputHandles.length, isVertical);

                return (
                    <Handle
                        key={`output-${handle.id}`}
                        type="source"
                        position={position}
                        id={handle.id}
                        style={{ ...autoStyle, ...handle.style }}
                    />
                );
            })}
        </div>
    );
}

export default BaseNode;
