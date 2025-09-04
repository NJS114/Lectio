#!/usr/bin/env python3
import http.server
import socketserver
import os
from urllib.parse import urlparse

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Check if it's a file request (has extension)
        if '.' in os.path.basename(path):
            # It's a file request, serve normally
            return super().do_GET()
        
        # Check if the path exists as a file
        file_path = self.translate_path(path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return super().do_GET()
        
        # For all other routes (SPA routes), serve index.html
        self.path = '/index.html'
        return super().do_GET()

if __name__ == "__main__":
    PORT = 8080
    os.chdir('dist')
    
    with socketserver.TCPServer(("0.0.0.0", PORT), SPAHandler) as httpd:
        print(f"Serving SPA at http://0.0.0.0:{PORT}")
        httpd.serve_forever()

