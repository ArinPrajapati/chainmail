/**
 * Nodes Routes - API endpoints for node type definitions
 */

import { Router } from 'express';
import { getAllNodeMeta } from '../engine/executor.js';

export const nodesRouter = Router();

/**
 * GET /api/nodes
 * Returns all registered node types with their metadata
 */
nodesRouter.get('/', (req, res) => {
    const nodes = getAllNodeMeta();
    res.json(nodes);
});
