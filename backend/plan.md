# Chainmail Workflow Engine

A Zapier/n8n-like workflow execution engine.

---

## ✅ Completed

### Core Engine (`/src/engine/`)
- [x] **FlowStore** - Stores node execution results, accessible via `{{nodeId.field}}`
- [x] **TemplateParser** - Resolves `{{nodeId.path.to.field}}` and `{{lastResult}}` syntax
- [x] **Executor** - Sequential async execution with topological sort
- [x] **Error Handling** - Configurable `onError: "stop"` or `"continue"`
- [x] **Auto-generated IDs** - Nodes don't need IDs, backend generates them

### Node Types (`/src/nodes/`)
- [x] **Trigger Node** - Entry point, receives payload from API
- [x] **Text Node** - Static or templated text output
- [x] **HTTP Node** - All methods (GET, POST, PUT, DELETE, PATCH), templated headers/body
- [x] **AI Node** - Sends prompt to LLM (mock implementation)

### API (`/src/routes/`)
- [x] `POST /api/workflow/execute` - Execute a workflow
- [x] `POST /api/workflow/validate` - Validate workflow structure

---

## Example Workflow JSON

```json
{
  "workflow": {
    "id": "my-workflow",
    "onError": "stop",
    "nodes": [
      { "type": "trigger", "parameters": {} },
      { "type": "http", "parameters": { 
        "method": "GET", 
        "url": "https://jsonplaceholder.typicode.com/users/1" 
      }},
      { "type": "ai", "parameters": { 
        "prompt": "Summarize: {{lastResult.data.name}}" 
      }}
    ],
    "connections": [
      { "from": 0, "to": 1 },
      { "from": 1, "to": 2 }
    ]
  },
  "triggerPayload": {}
}
```

---

## 🔜 Future Enhancements
- [ ] Real LLM integration (replace mock `executeLLM`)
- [ ] Webhook trigger node (listen for external events)
- [ ] Schedule trigger (cron-based)
- [ ] If/Else branching node
- [ ] Loop node
- [ ] Persist workflows to database
- [ ] Frontend UI for visual workflow builder