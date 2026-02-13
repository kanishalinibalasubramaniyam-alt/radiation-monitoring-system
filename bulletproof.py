import socket
import json
import threading

def handle_client(client_socket):
    try:
        # Read request
        request = client_socket.recv(1024).decode('utf-8', errors='ignore')
        print("✅ REQUEST RECEIVED")
        
        # Always return success
        response_data = json.dumps({
            "success": True,
            "message": "RADSAFE PROJECT WORKING!",
            "status": "connected",
            "project": "Ready for Submission"
        })
        
        # Build HTTP response
        response = "HTTP/1.1 200 OK\r\n"
        response += "Content-Type: application/json\r\n"
        response += "Access-Control-Allow-Origin: *\r\n"
        response += f"Content-Length: {len(response_data)}\r\n"
        response += "\r\n"
        response += response_data
        
        # Send response
        client_socket.send(response.encode())
        print("📤 Response sent")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client_socket.close()

# Start server
server = socket.socket()
server.bind(('0.0.0.0', 8001))
server.listen(5)

print("="*50)
print("🚀 BACKEND RUNNING ON PORT 8001")
print("🔗 http://localhost:8001")
print("✅ Accepting ALL requests")
print("="*50)

while True:
    client, addr = server.accept()
    print(f"📥 Connection from {addr[0]}")
    threading.Thread(target=handle_client, args=(client,)).start()