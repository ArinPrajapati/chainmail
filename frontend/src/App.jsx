/**
 * Chainmail Workflow Builder - Main App
 */

import { useState } from 'react';
import Canvas from './components/Canvas';
import NodePalette from './components/NodePalette';
import ConfigPanel from './components/ConfigPanel';
import useWorkflowStore from './store/workflowStore';
import './App.css';

const API_BASE = 'http://localhost:3000';

function App() {
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const getWorkflowJSON = useWorkflowStore((state) => state.getWorkflowJSON);
  const clearWorkflow = useWorkflowStore((state) => state.clearWorkflow);

  const handleExecute = async () => {
    setExecuting(true);
    setError(null);
    setResult(null);

    try {
      const workflowData = getWorkflowJSON();
      console.log('Executing workflow:', workflowData);

      const response = await fetch(`${API_BASE}/api/workflow/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflowData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Execution failed');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setExecuting(false);
    }
  };

  const handleValidate = async () => {
    setError(null);

    try {
      const workflowData = getWorkflowJSON();

      const response = await fetch(`${API_BASE}/api/workflow/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflowData),
      });

      const data = await response.json();

      if (data.valid) {
        alert('✅ Workflow is valid!');
      } else {
        setError(`Validation errors: ${data.errors.join(', ')}`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>⛓️ Chainmail</h1>
        <div className="header-actions">
          <button onClick={handleValidate} disabled={executing}>
            Validate
          </button>
          <button onClick={handleExecute} disabled={executing} className="primary">
            {executing ? 'Executing...' : 'Execute'}
          </button>
          <button onClick={clearWorkflow} disabled={executing}>
            Clear
          </button>
        </div>
      </header>

      <main className="main">
        <NodePalette />
        <Canvas />
        <ConfigPanel />
      </main>

      {(result || error) && (
        <div className="result-panel">
          <div className="result-header">
            <h3>Execution Result</h3>
            <button onClick={() => { setResult(null); setError(null); }}>×</button>
          </div>
          {error && <div className="error">{error}</div>}
          {result && (
            <pre className="result-json">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
