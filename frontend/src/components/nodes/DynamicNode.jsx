/**
 * DynamicNode - Generic node component that renders based on backend definition
 * 
 * This component receives the node definition from the data prop and passes
 * the appropriate values to BaseNode.
 */

import BaseNode from './BaseNode';
import { getNodeDefinition } from '../../services/nodeDefinitions';

function DynamicNode({ data, selected }) {
    // Get the node definition from cache
    const nodeDef = getNodeDefinition(data.type);

    if (!nodeDef) {
        // Fallback for unknown types
        return (
            <BaseNode
                type={data.type || 'unknown'}
                icon="HelpCircle"
                selected={selected}
                inputs={['default']}
                outputs={['default']}
            />
        );
    }

    return (
        <BaseNode
            type={nodeDef.type}
            icon={nodeDef.icon}
            selected={selected}
            inputs={nodeDef.inputs || ['default']}
            outputs={nodeDef.outputs || ['default']}
        />
    );
}

export default DynamicNode;
