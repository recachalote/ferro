/* Ferro — servidor local simples (sem dependências) */
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 8080;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function lanIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return '127.0.0.1';
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const file = path.normalize(path.join(ROOT, urlPath));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Não encontrado');
    return;
  }
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=60',
  });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('  FERRO — treino e progresso');
  console.log('  ─────────────────────────────');
  console.log('  Neste computador:  http://localhost:' + PORT);
  console.log('  No iPhone (mesma Wi-Fi):  http://' + lanIP() + ':' + PORT);
  console.log('');
  console.log('  Para parar: Ctrl+C');
  console.log('');
  if (process.platform === 'win32' && !process.env.NO_OPEN) {
    exec('start "" http://localhost:' + PORT);
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('A porta ' + PORT + ' está ocupada. Tenta: set PORT=8090 && node serve.cjs');
  } else {
    console.error(err.message);
  }
});
