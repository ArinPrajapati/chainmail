/**
 * Workflow Store - Zustand state management for the workflow builder
 */

import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';

let nodeId = 0;
const getNodeId = () => `node-${++nodeId}`;

const useWorkflowStore = create((set, get) => ({
    // State
    nodes: [],
    edges: [],
    selectedNodeId: null,

    // Node actions
    addNode: (type, position = { x: 100, y: 100 }) => {
        const id = getNodeId();
        const newNode = {
            id,
            type,
            position,
            data: {
                type,  // Include type in data for DynamicNode to access
                ...getDefaultData(type)
            },
        };
        set((state) => ({
            nodes: [...state.nodes, newNode],
            selectedNodeId: id,
        }));
        return id;
    },

    updateNode: (id, data) => {
        set((state) => ({
            nodes: state.nodes.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, ...data } } : node
            ),
        }));
    },

    removeNode: (id) => {
        set((state) => ({
            nodes: state.nodes.filter((node) => node.id !== id),
            edges: state.edges.filter(
                (edge) => edge.source !== id && edge.target !== id
            ),
            selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
        }));
    },

    setSelectedNode: (id) => {
        set({ selectedNodeId: id });
    },

    // ReactFlow event handlers
    onNodesChange: (changes) => {
        set((state) => ({
            nodes: applyNodeChanges(changes, state.nodes),
        }));
    },

    onEdgesChange: (changes) => {
        set((state) => ({
            edges: applyEdgeChanges(changes, state.edges),
        }));
    },

    onConnect: (connection) => {
        set((state) => ({
            edges: addEdge(connection, state.edges),
        }));
    },

    // Get selected node
    getSelectedNode: () => {
        const { nodes, selectedNodeId } = get();
        return nodes.find((n) => n.id === selectedNodeId) || null;
    },

    // Convert to backend format
    getWorkflowJSON: () => {
        const { nodes, edges } = get();

        // Create index map for node IDs
        const nodeIndexMap = {};
        nodes.forEach((node, index) => {
            nodeIndexMap[node.id] = index;
        });

        // Convert nodes to backend format
        const backendNodes = nodes.map((node) => ({
            type: node.type,
            parameters: { ...node.data },
        }));

        // Convert edges to connections
        const connections = edges.map((edge) => ({
            from: nodeIndexMap[edge.source],
            to: nodeIndexMap[edge.target],
        }));

        return {
            workflow: {
                id: `workflow-${Date.now()}`,
                onError: 'stop',
                nodes: backendNodes,
                connections,
            },
            triggerPayload: {},
        };
    },

    // Clear workflow
    clearWorkflow: () => {
        set({ nodes: [], edges: [], selectedNodeId: null });
        nodeId = 0;
    },
}));

// Default data for each node type
function getDefaultData(type) {
    switch (type) {
        case 'trigger':
            return { label: 'Trigger' };
        case 'text':
            return { label: 'Text', text: '' };
        case 'http':
            return { label: 'HTTP', method: 'GET', url: '', headers: '{}', body: '' };
        case 'ai':
            return { label: 'AI', prompt: '' };
        default:
            return { label: type };
    }
}

export default useWorkflowStore;
