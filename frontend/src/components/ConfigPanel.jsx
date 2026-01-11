/**
 * ConfigPanel - Edit selected node parameters
 * Now renders fields dynamically based on backend node definitions
 */

import useWorkflowStore from '../store/workflowStore';
import DynamicField from './DynamicField';
import NodeIcon from './NodeIcon';
import { getNodeDefinition } from '../services/nodeDefinitions';

function ConfigPanel() {
    const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
    const nodes = useWorkflowStore((state) => state.nodes);
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

