/**
 * Canvas - Main ReactFlow workflow canvas
 */

import { useCallback } from 'react';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import useWorkflowStore from '../store/workflowStore';
import TriggerNode from './nodes/TriggerNode';
import TextNode from './nodes/TextNode';
import HttpNode from './nodes/HttpNode';
import AiNode from './nodes/AiNode';

// Register custom node types
const nodeTypes = {
    trigger: TriggerNode,
    text: TextNode,
    http: HttpNode,
    ai: AiNode,
};

function Canvas() {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        setSelectedNode,
        addNode,
    } = useWorkflowStore();

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
