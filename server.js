const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 10000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

const server = http.createServer((req, res) => {
  // دعم HTTPS على Render
  if (req.headers['x-forwarded-proto'] === 'http') {
    res.writeHead(301, { location: `https://${req.headers.host}${req.url}` });
    return res.end();
  }

  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  // منع الوصول لملفات خارج المجلد
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end('محظور');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('غير موجود');
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600'
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
