#!/bin/sh

echo "Waiting for MySQL to be ready..."

while ! python3 -c "import socket; s = socket.socket(socket.AF_INET, socket.SOCK_STREAM); s.connect(('db', 3306)); s.close()" 2>/dev/null; do
  sleep 1
done

echo "MySQL is ready!"
exec "$@"
