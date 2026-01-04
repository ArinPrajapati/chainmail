/**
 * ConfigPanel - Edit selected node parameters
 */

import useWorkflowStore from '../store/workflowStore';

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

    const handleChange = (field, value) => {
        updateNode(selectedNodeId, { [field]: value });
    };

    const handleDelete = () => {
        removeNode(selectedNodeId);
    };

    return (
        <div className="config-panel">
            <h3>Configure {selectedNode.type}</h3>

            <div className="config-form">
                {selectedNode.type === 'trigger' && (
                    <p className="config-info">Trigger node receives the initial payload.</p>
                )}

                {selectedNode.type === 'text' && (
                    <div className="form-group">
                        <label>Text Content</label>
                        <textarea
                            value={selectedNode.data.text || ''}
                            onChange={(e) => handleChange('text', e.target.value)}
                            placeholder="Enter text or use {{nodeId.field}} for templating"
                            rows={4}
                        />
                    </div>
                )}

                {selectedNode.type === 'http' && (
                    <>
                        <div className="form-group">
                            <label>Method</label>
                            <select
                                value={selectedNode.data.method || 'GET'}
                                onChange={(e) => handleChange('method', e.target.value)}
                            >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                                <option value="PATCH">PATCH</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>URL</label>
                            <input
                                type="text"
                                value={selectedNode.data.url || ''}
                                onChange={(e) => handleChange('url', e.target.value)}
                                placeholder="https://api.example.com/data"
                            />
                        </div>
                        <div className="form-group">
                            <label>Headers (JSON)</label>
                            <textarea
                                value={selectedNode.data.headers || '{}'}
                                onChange={(e) => handleChange('headers', e.target.value)}
                                placeholder='{"Content-Type": "application/json"}'
                                rows={2}
                            />
                        </div>
                        <div className="form-group">
                            <label>Body</label>
                            <textarea
                                value={selectedNode.data.body || ''}
                                onChange={(e) => handleChange('body', e.target.value)}
                                placeholder="Request body (for POST/PUT/PATCH)"
                                rows={3}
                            />
                        </div>
                    </>
                )}

                {selectedNode.type === 'ai' && (
                    <div className="form-group">
                        <label>Prompt</label>
                        <textarea
                            value={selectedNode.data.prompt || ''}
                            onChange={(e) => handleChange('prompt', e.target.value)}
                            placeholder="Enter prompt or use {{lastResult}} for previous output"
                            rows={4}
                        />
                    </div>
                )}

                <button className="delete-btn" onClick={handleDelete}>
                    Delete Node
                </button>
            </div>
        </div>
    );
}

export default ConfigPanel;
