## Plan Zapier Clone

Goal to create zapier and n8n like engine where i can add more node types latter 
current goal is create 3 types of nodes

base line : that it shoudl latest do thhis much 

Text Node: has Text inside from user typed or from input handle , passes that text to output node, this is a very basic and base line tell for the engine 

Http Node: this node can go http request of any type , body and header can taken from input , this is also base line of the engine 

AI node : has prompt user typed prompt inside , get the data from the input handle passes that prompt to ai proiveder 

currenlty we want to keep it simple don't wnat and any complex it int he implemenation so that , complliete feature like auth etc are not need in ai , we will use excuteLLM function that will handle LLM for as currently



maybe from frontend we can send data like this and engine read 

{
  "nodes": [
    { "id": "1", "type": "webhook", "parameters": { "path": "start" } },
    { "id": "2", "type": "httpRequest", "parameters": { "url": "https://api.example.com" } }
  ],
  "connections": [
    { "from": "1", "to": "2" }
  ]
}