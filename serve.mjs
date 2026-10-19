/**
 * Servidor estático sin dependencias, sólo para mirar el resultado.
 *
 *   node serve.mjs
 *
 * Sirve dist/ en http://localhost:4003/. Hace falta un servidor de verdad (y no
 * abrir el index.html con file://) porque las páginas referencian /assets/... y
 * /en/ con rutas absolutas, igual que en producción.
 */

import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NONCE_PLACEHOLDER } from './lib/head.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));

const PORT = 4003;

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

function serve(port) {
  const base = join(ROOT, 'dist');

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

      let body = await readFile(file);
      /* Lo mismo que hace el sub_filter de nginx: el marcador del nonce del
         <meta> se reemplaza por uno nuevo en cada request. */
      if (extname(file) === '.html') {
        body = body.toString('utf8').replace(NONCE_PLACEHOLDER, randomBytes(16).toString('hex'));
      }
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
    console.log(`http://localhost:${port}/   (en: http://localhost:${port}/en/)`);
  });
}

serve(PORT);
console.log('\nCtrl+C para cortar.');
