import { randomUUID } from 'crypto';
import { FlowStore } from './flowStore.js';
import { resolveTemplates } from './templateParser.js';

// Node type registry - will be populated with node implementations
const nodeRegistry = new Map();

/**
 * Register a node type
 * @param {string} type - Node type name
 * @param {Function} executor - Async function(parameters, flowStore) => result
 */
export function registerNode(type, executor) {
    nodeRegistry.set(type, executor);
}

/**
 * Execute a workflow
 * @param {Object} workflow - The workflow definition
 * @param {Object} triggerPayload - Initial data from trigger
 * @returns {Object} Execution result with all node outputs
 */
export async function executeWorkflow(workflow, triggerPayload = {}) {
    const flowStore = new FlowStore();
    const { nodes, connections, onError = 'stop' } = workflow;

    const idMap = new Map();
    const processedNodes = nodes.map((node, index) => {
        const generatedId = node.id || `${node.type}-${randomUUID().slice(0, 8)}`;
        idMap.set(index, generatedId);
        return { ...node, id: generatedId };
    });

    const processedConnections = (connections || []).map(conn => ({
        from: typeof conn.from === 'number' ? idMap.get(conn.from) : conn.from,
        to: typeof conn.to === 'number' ? idMap.get(conn.to) : conn.to
    }));

    const executionOrder = buildExecutionOrder(processedNodes, processedConnections);

    const executionLog = {
        workflowId: workflow.id,
        startedAt: new Date().toISOString(),
        results: {},
        errors: [],
        status: 'running'
    };

    for (const node of executionOrder) {
        try {
            const result = await executeNode(node, flowStore, triggerPayload);
            flowStore.set(node.id, result);
            executionLog.results[node.id] = { success: true, output: result };
        } catch (error) {
            const errorInfo = {
                nodeId: node.id,
                nodeType: node.type,
                error: error.message
            };
            executionLog.errors.push(errorInfo);
            executionLog.results[node.id] = { success: false, error: error.message };

            if (onError === 'stop') {
                executionLog.status = 'failed';
                executionLog.stoppedAt = node.id;
                break;
            }
            // onError === 'continue': skip this node and proceed
        }
    }

    if (executionLog.status === 'running') {
        executionLog.status = executionLog.errors.length > 0 ? 'completed_with_errors' : 'completed';
    }

    executionLog.completedAt = new Date().toISOString();
    executionLog.flowStore = flowStore.getAll();

    return executionLog;
}

/**
 * Execute a single node
 */
async function executeNode(node, flowStore, triggerPayload) {
    const nodeDef = nodeRegistry.get(node.type);

    if (!nodeDef) {
        throw new Error(`Unknown node type: ${node.type}`);
    }

    // Resolve templates in parameters
    const resolvedParams = resolveTemplates(node.parameters || {}, flowStore);

    // For trigger node, merge in the trigger payload
    if (node.type === 'trigger') {
        return nodeDef.execute(resolvedParams, flowStore, triggerPayload);
    }

    return nodeDef.execute(resolvedParams, flowStore);
}

/**
 * Build execution order using topological sort based on connections
 */
function buildExecutionOrder(nodes, connections) {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const inDegree = new Map();
    const adjacency = new Map();

    // Initialize
    for (const node of nodes) {
        inDegree.set(node.id, 0);
        adjacency.set(node.id, []);
    }

    // Build graph
    for (const conn of connections || []) {
        const fromAdj = adjacency.get(conn.from);
        if (fromAdj) {
            fromAdj.push(conn.to);
        }
        if (inDegree.has(conn.to)) {
            inDegree.set(conn.to, inDegree.get(conn.to) + 1);
        }
    }

    // Kahn's algorithm
    const queue = [];
    for (const [nodeId, degree] of inDegree) {
        if (degree === 0) queue.push(nodeId);
    }

    const order = [];
    while (queue.length > 0) {
        const current = queue.shift();
        order.push(nodeMap.get(current));

        for (const neighbor of adjacency.get(current) || []) {
            inDegree.set(neighbor, inDegree.get(neighbor) - 1);
            if (inDegree.get(neighbor) === 0) {
                queue.push(neighbor);
            }
        }
    }

    // If not all nodes are in order, there might be a cycle or disconnected nodes
    // Add any remaining nodes
    for (const node of nodes) {
        if (!order.includes(node)) {
            order.push(node);
        }
    }

    return order;
}
