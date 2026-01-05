/**
 * HttpNode - Makes HTTP requests
 */

import BaseNode from './BaseNode';

function HttpNode({ selected }) {
    return (
        <BaseNode
            type="http"
            icon="🌐"
            selected={selected}
        />
    );
}

export default HttpNode;
