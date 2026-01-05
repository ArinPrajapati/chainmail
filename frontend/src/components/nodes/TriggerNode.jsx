/**
 * TriggerNode - Entry point for workflow execution
 */

import BaseNode from './BaseNode';

function TriggerNode({ selected }) {
    return (
        <BaseNode
            type="trigger"
            icon="⚡"
            selected={selected}
            inputs={[]}
            outputs={['default']}
        />
    );
}

export default TriggerNode;
