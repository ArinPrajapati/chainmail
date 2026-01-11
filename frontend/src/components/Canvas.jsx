/**
 * Canvas - Main ReactFlow workflow canvas
 * Now uses dynamic node types from backend API
 */

import { useCallback, useState, useEffect, useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import useWorkflowStore from '../store/workflowStore';
import DynamicNode from './nodes/DynamicNode';
import { fetchNodeDefinitions } from '../services/nodeDefinitions';

function Canvas() {
    const [nodeDefinitions, setNodeDefinitions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        setSelectedNode,
        addNode,
    } = useWorkflowStore();

    // Fetch node definitions on mount
    useEffect(() => {
        fetchNodeDefinitions()
            .then(defs => {
                setNodeDefinitions(defs);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to load node definitions:', err);
                setIsLoading(false);
            });
    }, []);

    // Build nodeTypes object dynamically - all types use DynamicNode
    const nodeTypes = useMemo(() => {
        const types = {};
        nodeDefinitions.forEach(def => {
            types[def.type] = DynamicNode;
        });
        return types;
    }, [nodeDefinitions]);

    const onNodeClick = useCallback((event, node) => {
        setSelectedNode(node.id);
    }, [setSelectedNode]);

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, [setSelectedNode]);

    // Handle drop from palette
    const onDrop = useCallback((event) => {
        event.preventDefault();
        const type = event.dataTransfer.getData('application/reactflow');
        if (!type) return;

        const reactFlowBounds = event.target.getBoundingClientRect();
        const position = {
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        };

        addNode(type, position);
    }, [addNode]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    if (isLoading) {
        return (
            <div className="canvas-container">
                <div className="loading">Loading node types...</div>
            </div>
        );
    }

    return (
        <div className="canvas-container">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
                fitView
                deleteKeyCode={['Backspace', 'Delete']}
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
}

export default Canvas;

