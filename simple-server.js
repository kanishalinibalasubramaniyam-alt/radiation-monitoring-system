import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3002;

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    
    // Default to mobile.html
    if (filePath === './' || filePath === './index.html') {
        filePath = './public/mobile.html';
    }
    
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            // If file not found, show mobile.html
            fs.readFile('./public/mobile.html', (err, content) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Server error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                }
            });
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(50));
    console.log('📱 PHONE SAFETY - FRONTEND SERVER');
    console.log(`✅ Local: http://localhost:${PORT}`);
    console.log(`✅ Phone: http://192.168.193.100:${PORT}`);
    console.log(`✅ Mobile App: http://192.168.193.100:${PORT}/mobile.html`);
    console.log('='.repeat(50));
    console.log('\n✅ Project ready for submission!');
});