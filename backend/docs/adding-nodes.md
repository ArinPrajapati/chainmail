# Adding New Nodes - Developer Guide

This guide explains how to add custom node types to the Chainmail workflow engine.

---

## Quick Start (3 Steps)

### 1. Create the Node File

Create a new file in `/src/nodes/`:

```javascript
// src/nodes/myCustomNode.js

import { createNode } from './baseNode.js';

export const myCustomNode = createNode(async (parameters, flowStore) => {
  // Your logic here
  const { someParam } = parameters;
  
  // Return JSON output (accessible by next nodes via {{nodeId.field}})
  return {
    result: "your output",
    processedValue: someParam
  };
});
```

### 2. Register the Node

Add it to `/src/index.js`:

```javascript
import { myCustomNode } from './nodes/myCustomNode.js';

registerNode('myCustom', myCustomNode);  // 'myCustom' = type name in JSON
```

### 3. Use It!

```json
{
  "type": "myCustom",
  "parameters": { "someParam": "value" }
}
```

---

## Understanding the Node Function

```javascript
createNode(async (parameters, flowStore, ...extra) => {
  // parameters: Already template-resolved! {{foo}} becomes actual values
  // flowStore: Access other nodes' outputs via flowStore.get('nodeId')
  // extra: For trigger nodes, contains triggerPayload
  
  return { /* JSON output */ };
});

```

### Key Points:
- **Templates are auto-resolved** - If user sets `"url": "{{trigger.apiUrl}}"`, you receive the actual URL
- **Return JSON** - Output must be JSON-serializable (objects, arrays, strings, numbers)
- **Async supported** - Use `await` for HTTP calls, file operations, etc.
- **Throw on error** - Errors are caught by the executor and handled based on `onError` setting

---

## Examples

### Example 1: Math Node
```javascript
// src/nodes/mathNode.js
import { createNode } from './baseNode.js';

export const mathNode = createNode((parameters, flowStore) => {
  const { operation, a, b } = parameters;
  
  let result;
  switch (operation) {
    case 'add': result = a + b; break;
    case 'subtract': result = a - b; break;
    case 'multiply': result = a * b; break;
    case 'divide': result = a / b; break;
    default: throw new Error(`Unknown operation: ${operation}`);
  }
  
  return { result };
});
```

**Usage:**
```json
{
  "type": "math",
  "parameters": { "operation": "add", "a": 10, "b": "{{trigger.value}}" }
}
```

---

### Example 2: Delay Node
```javascript
// src/nodes/delayNode.js
import { createNode } from './baseNode.js';

export const delayNode = createNode(async (parameters, flowStore) => {
  const { ms = 1000 } = parameters;
  
  await new Promise(resolve => setTimeout(resolve, ms));
  
  return { 
    delayed: true, 
    duration: ms 
  };
});
```

---

### Example 3: Transform Node (Array Operations)
```javascript
// src/nodes/transformNode.js
import { createNode } from './baseNode.js';

export const transformNode = createNode((parameters, flowStore) => {
  const { array, operation, field } = parameters;
  
  if (!Array.isArray(array)) {
    throw new Error('Input must be an array');
  }
  
  let result;
  switch (operation) {
    case 'map':
      result = array.map(item => item[field]);
      break;
    case 'filter':
      result = array.filter(item => item[field]);
      break;
    case 'first':
      result = array[0];
      break;
    case 'count':
      result = array.length;
      break;
    default:
      result = array;
  }
  
  return { result };
});
```

**Usage:**
```json
{
  "type": "transform",
  "parameters": { 
    "array": "{{http.data.users}}", 
    "operation": "map", 
    "field": "name" 
  }
}
```

---

### Example 4: Conditional Node
```javascript
// src/nodes/ifNode.js
import { createNode } from './baseNode.js';

export const ifNode = createNode((parameters, flowStore) => {
  const { condition, valueIfTrue, valueIfFalse } = parameters;
  
  // Simple truthy check
  const result = condition ? valueIfTrue : valueIfFalse;
  
  return { 
    condition: !!condition,
    result 
  };
});
```

---

## Accessing Previous Node Data

Use `flowStore` to access any node's output:

```javascript
export const myNode = createNode((parameters, flowStore) => {
  // Get specific node output
  const httpResult = flowStore.get('http-abc123');
  
  // Get last executed node's output
  const lastOutput = flowStore.getLastResult();
  
  // Get all results
  const allResults = flowStore.getAll();
  
  return { combined: httpResult.data };
});
```

---

## Registration Checklist

After creating your node:

```javascript
// src/index.js

// 1. Import
import { mathNode } from './nodes/mathNode.js';
import { delayNode } from './nodes/delayNode.js';
import { transformNode } from './nodes/transformNode.js';
import { ifNode } from './nodes/ifNode.js';

// 2. Register (type name must be unique)
registerNode('math', mathNode);
registerNode('delay', delayNode);
registerNode('transform', transformNode);
registerNode('if', ifNode);
```

---

## Error Handling

Throw errors for validation or runtime failures:

```javascript
export const myNode = createNode((parameters, flowStore) => {
  const { requiredField } = parameters;
  
  if (!requiredField) {
    throw new Error('myNode: requiredField is required');
  }
  
  // If external call fails, let it throw naturally
  // The executor will catch it and handle based on onError setting
});
```

---

## File Structure

```
src/nodes/
├── baseNode.js      # Don't modify - provides createNode helper
├── triggerNode.js   # Entry point
├── textNode.js      # Text output
├── httpNode.js      # HTTP requests
├── aiNode.js        # LLM integration
├── mathNode.js      # ← Your new node
├── delayNode.js     # ← Your new node
└── ...
```
