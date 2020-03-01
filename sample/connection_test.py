import sys
from websocket import create_connection
# ws = create_connection("ws://localhost:8000/websocket")
ws = create_connection("ws://192.168.100.103:8000/websocket")

if len(sys.argv) > 1:
    message = sys.argv[1]
else:
    message = "I'm client.py"

print (ws.send(message))
print (ws.recv())

ws.close()
