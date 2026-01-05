/**
 * TextNode - Outputs static or templated text
 */

import BaseNode from './BaseNode';

function TextNode({ selected }) {
    return (
        <BaseNode
            type="text"
            icon="📝"
            selected={selected}
        />
    );
}

export default TextNode;
