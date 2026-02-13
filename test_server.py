import socket

def test_port():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', 3001))
    if result == 0:
        print("✅ Port 3001 is open")
    else:
        print("❌ Port 3001 is closed")
    sock.close()

test_port()