/**
 * Workflow Routes - API endpoints for workflow execution
 */

import { Router } from 'express';
import { executeWorkflow } from '../engine/executor.js';

export const workflowRouter = Router();

/**
 * POST /api/workflow/execute
 * Execute a workflow with optional trigger payload
 */
workflowRouter.post('/execute', async (req, res) => {
    try {
        const { workflow, triggerPayload = {} } = req.body;

        if (!workflow) {
            return res.status(400).json({
                error: 'workflow is required in request body'
            });
        }

        if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
            return res.status(400).json({
                error: 'workflow.nodes must be an array'
            });
        }

        const result = await executeWorkflow(workflow, triggerPayload);

        res.json(result);
    } catch (error) {
        console.error('Workflow execution error:', error);
        res.status(500).json({
            error: 'Workflow execution failed',
            message: error.message
        });
    }
});

/**
 * POST /api/workflow/validate
 * Validate a workflow definition without executing
 */
workflowRouter.post('/validate', (req, res) => {
    try {
        const { workflow } = req.body;

        const errors = [];

        if (!workflow) {
            errors.push('workflow is required');
        } else {
            if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
                errors.push('workflow.nodes must be an array');
            } else {
                // Check each node has required fields (id is optional, auto-generated)
                workflow.nodes.forEach((node, index) => {
                    if (!node.type) errors.push(`nodes[${index}]: type is required`);
                });

                // Check connections reference valid node IDs or indices
                const nodeIds = new Set(workflow.nodes.map(n => n.id).filter(Boolean));
                const nodeCount = workflow.nodes.length;
                (workflow.connections || []).forEach((conn, index) => {
                    // Support both index-based and id-based connections
                    const fromValid = typeof conn.from === 'number'
                        ? conn.from >= 0 && conn.from < nodeCount
                        : nodeIds.has(conn.from);
                    const toValid = typeof conn.to === 'number'
                        ? conn.to >= 0 && conn.to < nodeCount
                        : nodeIds.has(conn.to);

                    if (!fromValid) {
                        errors.push(`connections[${index}]: 'from' references invalid node '${conn.from}'`);
                    }
                    if (!toValid) {
                        errors.push(`connections[${index}]: 'to' references invalid node '${conn.to}'`);
                    }
                });
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({ valid: false, errors });
        }

        res.json({ valid: true });
    } catch (error) {
        res.status(500).json({
            error: 'Validation failed',
            message: error.message
        });
    }
});
