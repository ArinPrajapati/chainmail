/**
 * NodePalette - Sidebar with available node types
 */

import { useState } from 'react';
import useWorkflowStore from '../store/workflowStore';

const NODE_TYPES = [
    { type: 'trigger', icon: '⚡', label: 'Trigger', description: 'Workflow entry point' },
    { type: 'text', icon: '📝', label: 'Text', description: 'Static or templated text' },
    { type: 'http', icon: '🌐', label: 'HTTP', description: 'Make HTTP requests' },
    { type: 'ai', icon: '🤖', label: 'AI', description: 'Send prompt to LLM' },
];

function NodePalette() {
    const [search, setSearch] = useState('');
    const addNode = useWorkflowStore((state) => state.addNode);

    const filteredNodes = NODE_TYPES.filter(
        (node) =>
            node.label.toLowerCase().includes(search.toLowerCase()) ||
            node.description.toLowerCase().includes(search.toLowerCase())
    );

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleClick = (type) => {
        // Add node at a default position when clicked
        addNode(type, { x: 200 + Math.random() * 100, y: 100 + Math.random() * 100 });
    };

    return (
        <div className="node-palette">
            <h3>Nodes</h3>
            <input
                type="text"
                placeholder="Search nodes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
            />
            <div className="node-list">
                {filteredNodes.map((node) => (
                    <div
                        key={node.type}
                        className="palette-node"
                        draggable
                        onDragStart={(e) => onDragStart(e, node.type)}
                        onClick={() => handleClick(node.type)}
                    >
                        <span className="palette-icon">{node.icon}</span>
                        <div className="palette-info">
                            <span className="palette-label">{node.label}</span>
                            <span className="palette-desc">{node.description}</span>
                        </div>
                    </div>
                ))}
                {filteredNodes.length === 0 && (
                    <p className="no-results">No nodes found</p>
                )}
            </div>
        </div>
    );
}

export default NodePalette;
