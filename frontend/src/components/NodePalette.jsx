/**
 * NodePalette - Sidebar with available node types
 * Now fetches from backend API
 */

import { useState, useEffect } from 'react';
import useWorkflowStore from '../store/workflowStore';
import { fetchNodeDefinitions } from '../services/nodeDefinitions';
import NodeIcon from './NodeIcon';

function NodePalette() {
    const [search, setSearch] = useState('');
    const [nodeTypes, setNodeTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const addNode = useWorkflowStore((state) => state.addNode);

    // Fetch node definitions on mount
    useEffect(() => {
        fetchNodeDefinitions()
            .then(defs => {
                setNodeTypes(defs);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to load node types:', err);
                setIsLoading(false);
            });
    }, []);

    const filteredNodes = nodeTypes.filter(
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
                {isLoading ? (
                    <p className="loading-text">Loading...</p>
                ) : (
                    <>
                        {filteredNodes.map((node) => (
                            <div
                                key={node.type}
                                className="palette-node"
                                draggable
                                onDragStart={(e) => onDragStart(e, node.type)}
                                onClick={() => handleClick(node.type)}
                            >
                                <span className="palette-icon">
                                    <NodeIcon name={node.icon} size={20} />
                                </span>
                                <div className="palette-info">
                                    <span className="palette-label">{node.label}</span>
                                    <span className="palette-desc">{node.description}</span>
                                </div>
                            </div>
                        ))}
                        {filteredNodes.length === 0 && (
                            <p className="no-results">No nodes found</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default NodePalette;

