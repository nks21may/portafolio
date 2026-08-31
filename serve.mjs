/**
 * Servidor estático sin dependencias, sólo para mirar el resultado.
 *
 *   node serve.mjs
 *
 * Levanta una variante por puerto. Hace falta un servidor de verdad (y no
 * abrir el index.html con file://) porque las páginas referencian /assets/... y
 * /en/ con rutas absolutas, igual que en producción.
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));

const PORTS = {
  'b-terminal': 4001,
  'a-editorial': 4002,
  'd-ficha': 4003,
};

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};

function serve(variant, port) {
  const base = join(ROOT, 'dist', variant);

  createServer(async (req, res) => {
    try {
      let path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      /* normalize() más el prefijo chequeado abajo cierra el ../ */
      let file = normalize(join(base, path));
      if (!file.startsWith(base)) {
        res.writeHead(403).end('Forbidden');
        return;
      }

      const info = await stat(file).catch(() => null);
      if (info?.isDirectory()) file = join(file, 'index.html');

      const body = await readFile(file);
      res.writeHead(200, {
        'Content-Type': TYPES[extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      res.end(body);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404');
    }
  }).listen(port, () => {
    console.log(`${variant.padEnd(12)} http://localhost:${port}/   (en: http://localhost:${port}/en/)`);
  });
}

for (const [variant, port] of Object.entries(PORTS)) serve(variant, port);
console.log('\nCtrl+C para cortar.');
