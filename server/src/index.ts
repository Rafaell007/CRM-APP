
import { createServer } from "node:http";

const PORT = 3000;

const server = createServer((request, response)=>{
    console.log(request.method, request.url);

    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify({ message: "Hello from the CRM server" }));
});

server.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);   
});