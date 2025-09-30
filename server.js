const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

// MIME types para diferentes archivos
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Ruta por defecto
  let filePath = req.url === '/' ? '/index.html' : req.url;
  
  // Si es una ruta de API, manejar diferente
  if (req.url.startsWith('/api/')) {
    handleAPI(req, res);
    return;
  }

  // Construir la ruta completa del archivo
  const fullPath = path.join(__dirname, 'public', filePath);
  
  // Verificar si el archivo existe
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      // Archivo no encontrado, servir index.html para SPA
      const indexPath = path.join(__dirname, 'public', 'index.html');
      serveFile(indexPath, res);
      return;
    }
    
    serveFile(fullPath, res);
  });
});

function serveFile(filePath, res) {
  const extname = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <head><title>404 - No encontrado</title></head>
            <body>
              <h1>404 - Página no encontrada</h1>
              <p>La página que buscas no existe.</p>
              <a href="/">Volver al inicio</a>
            </body>
          </html>
        `);
      } else {
        res.writeHead(500);
        res.end(`Error del servidor: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

function handleAPI(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  
  if (req.url === '/api/status') {
    res.end(JSON.stringify({ 
      status: 'OK', 
      message: 'MI-CHAMBA Server funcionando',
      timestamp: new Date().toISOString()
    }));
  } else if (req.url === '/api/services') {
    res.end(JSON.stringify({
      services: [
        {
          id: 1,
          title: 'Desarrollo Web',
          description: 'Creo sitios web modernos y responsivos',
          price: 25,
          category: 'Tecnología',
          location: 'Madrid, España'
        },
        {
          id: 2,
          title: 'Diseño Gráfico',
          description: 'Diseño logos, flyers y material gráfico',
          price: 20,
          category: 'Diseño',
          location: 'Barcelona, España'
        }
      ]
    }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint no encontrado' }));
  }
}

server.listen(PORT, () => {
  console.log(`🚀 MI-CHAMBA Server ejecutándose en http://localhost:${PORT}`);
  console.log(`📁 Sirviendo archivos desde: ${path.join(__dirname, 'public')}`);
  console.log(`🌐 Abre tu navegador en: http://localhost:${PORT}`);
});
