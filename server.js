const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    // ---------------------------------------------------------
    // API: Salva file config.js
    // ---------------------------------------------------------
    if (req.method === 'POST' && req.url === '/api/save') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                fs.writeFileSync(path.join(__dirname, 'config.js'), body);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // ---------------------------------------------------------
    // API: Esegue deploy e invia logs via Server-Sent Events
    // ---------------------------------------------------------
    if (req.method === 'GET' && req.url === '/api/deploy') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        
        const deployProcess = spawn('npm', ['run', 'deploy'], { cwd: __dirname });
        
        deployProcess.stdout.on('data', (data) => {
            res.write(`data: ${JSON.stringify({ type: 'log', message: data.toString() })}\n\n`);
        });
        
        deployProcess.stderr.on('data', (data) => {
            res.write(`data: ${JSON.stringify({ type: 'log', message: data.toString() })}\n\n`);
        });
        
        deployProcess.on('close', (code) => {
            res.write(`data: ${JSON.stringify({ type: 'done', code })}\n\n`);
            res.end();
        });
        return;
    }

    // ---------------------------------------------------------
    // Static file serving
    // ---------------------------------------------------------
    let filePath = '.' + req.url.split('?')[0];
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Bio Page Server running at http://localhost:${PORT}/`);
    console.log(`🔧 Admin Panel: http://localhost:${PORT}/admin.html`);
});
