/**
 * Chainmail Workflow Engine
 * A Zapier/n8n-like workflow execution engine
 */

import express from 'express';
import cors from 'cors';
import { workflowRouter } from './routes/workflowRoutes.js';

// Register all node types
import { registerNode } from './engine/executor.js';
import { triggerNode } from './nodes/triggerNode.js';
import { textNode } from './nodes/textNode.js';
import { httpNode } from './nodes/httpNode.js';
import { aiNode } from './nodes/aiNode.js';

// Register nodes
registerNode('trigger', triggerNode);
registerNode('text', textNode);
registerNode('http', httpNode);
registerNode('ai', aiNode);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/workflow', workflowRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Chainmail Workflow Engine running on http://localhost:${PORT}`);
    console.log(`📡 Execute workflows: POST /api/workflow/execute`);
    console.log(`✅ Validate workflows: POST /api/workflow/validate`);
});
