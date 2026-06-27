#!/usr/bin/env python3
import socket
import sys
import time

def wait_for_db(host, port, timeout=30):
    """Wait for database to be ready"""
    start = time.time()
    while time.time() - start < timeout:
        try:
            sock = socket.create_connection((host, port), timeout=5)
            sock.close()
            print(f"✓ Database {host}:{port} is ready!")
            return True
        except (socket.timeout, socket.error, ConnectionRefusedError) as e:
            elapsed = time.time() - start
            print(f"  Waiting for {host}:{port}... ({elapsed:.0f}s)")
            time.sleep(1)
    
    print(f"✗ Timeout: Database {host}:{port} did not become ready")
    return False

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python wait-for-db.py <host> <port> [timeout]")
        sys.exit(1)
    
    host = sys.argv[1]
    port = int(sys.argv[2])
    timeout = int(sys.argv[3]) if len(sys.argv) > 3 else 30
    
    if not wait_for_db(host, port, timeout):
        sys.exit(1)
