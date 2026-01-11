/**
 * ConfigPanel - Edit selected node parameters
 * Now renders fields dynamically based on backend node definitions
 * Includes upstream node detection for variable picker
 */

import useWorkflowStore from '../store/workflowStore';
import DynamicField from './DynamicField';
import NodeIcon from './NodeIcon';
import { getNodeDefinition, getCachedDefinitions } from '../services/nodeDefinitions';

/**
 * Get all upstream nodes for a given node by traversing edges backwards
 */
function getUpstreamNodes(nodeId, nodes, edges) {
    const upstream = [];
    const visited = new Set();

    function traverse(currentId) {
        // Find all edges where the target is currentId
        const incomingEdges = edges.filter(e => e.target === currentId);

        for (const edge of incomingEdges) {
            if (!visited.has(edge.source)) {
                visited.add(edge.source);

                // Find the source node
                const sourceNode = nodes.find(n => n.id === edge.source);
                if (sourceNode) {
                    // Get node definition for outputSchema
                    const nodeDef = getNodeDefinition(sourceNode.type);
                    upstream.push({
                        id: sourceNode.id,
                        type: sourceNode.type,
                        label: sourceNode.data?.label || nodeDef?.label || sourceNode.type,
                        outputSchema: nodeDef?.outputSchema
                    });

                    // Recursively get upstream nodes of this node
                    traverse(edge.source);
                }
            }
        }
    }

    traverse(nodeId);
    return upstream;
}

function ConfigPanel() {
    const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
    const nodes = useWorkflowStore((state) => state.nodes);
    const edges = useWorkflowStore((state) => state.edges);
    const updateNode = useWorkflowStore((state) => state.updateNode);
    const removeNode = useWorkflowStore((state) => state.removeNode);

    const selectedNode = nodes.find((n) => n.id === selectedNodeId);

    if (!selectedNode) {
        return (
            <div className="config-panel">
                <h3>Configuration</h3>
                <p className="no-selection">Select a node to configure</p>
            </div>
        );
    }

    // Get node definition from cache
    const nodeDef = getNodeDefinition(selectedNode.type);

    // Get upstream nodes for variable picker
    const upstreamNodes = getUpstreamNodes(selectedNodeId, nodes, edges);

    const handleChange = (field, value) => {
        updateNode(selectedNodeId, { [field]: value });
    };

    const handleDelete = () => {
        removeNode(selectedNodeId);
    };

    return (
        <div className="config-panel">
            <h3>
                <NodeIcon name={nodeDef?.icon} size={20} />
                {' '}{nodeDef?.label || selectedNode.type}
            </h3>

            <div className="config-form">
                {/* Show description if available */}
                {nodeDef?.description && (
                    <p className="config-info">{nodeDef.description}</p>
                )}

                {/* No parameters message */}
                {(!nodeDef?.parameters || nodeDef.parameters.length === 0) && (
                    <p className="config-info">No configuration required.</p>
                )}

                {/* Dynamically render fields based on node definition */}
                {nodeDef?.parameters?.map(param => (
                    <DynamicField
                        key={param.name}
                        param={param}
                        value={selectedNode.data[param.name]}
                        onChange={(val) => handleChange(param.name, val)}
                        upstreamNodes={upstreamNodes}
                    />
                ))}

                <button className="delete-btn" onClick={handleDelete}>
                    Delete Node
                </button>
            </div>
        </div>
    );
}

export default ConfigPanel;
