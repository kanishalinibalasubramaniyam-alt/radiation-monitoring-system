import socket 
import json 
import time 
 
server = socket.socket() 
server.bind(("localhost", 8000)) 
server.listen(5) 
print("? BACKEND STARTED ON PORT 8000") 
print("? Will accept ALL connections") 
 
while True: 
    client, addr = server.accept() 
    data = client.recv(1024).decode() 
    print(f"?? Request from {addr}") 
 
    response = "HTTP/1.1 201 OK\r\n" 
    response += "Content-Type: application/json\r\n" 
    response += "Access-Control-Allow-Origin: *\r\n" 
    response += "\r\n" 
    response += json.dumps({ 
        "success": True, 
        "message": "RadSafe Project - Connected!", 
        "data": {"user_id": 123, "status": "active"} 
    }) 
 
    client.send(response.encode()) 
    client.close() 
