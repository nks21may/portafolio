/**
 * Verificador de la salida. Corre sobre dist/, no sobre las fuentes.
 *
 *   node build.mjs && node scripts/check.mjs
 *
 * Comprueba lo que se rompe en silencio: un ancla que no existe, un idioma que
 * perdió una sección, un style="" que tira abajo la CSP, un asset referenciado
 * que no se copió. Sale con código 1 si algo falla, así que sirve en CI.
 *
 * No reemplaza a Lighthouse — comprueba estructura y coherencia entre idiomas,
 * que es justo lo que Lighthouse no mira.
 */

import { readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NONCE_PLACEHOLDER } from '../lib/head.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = [
  { lang: 'es', file: 'index.html', dir: '/' },
  { lang: 'en', file: 'en/index.html', dir: '/en/' },
];

const exists = (p) => access(p).then(() => true, () => false);

let failures = 0;
const fail = (where, msg) => { failures++; console.error(`  ✗ ${where}: ${msg}`); };

/** Cuenta etiquetas de apertura, sin parsear HTML de verdad. */
const count = (html, re) => (html.match(re) || []).length;

async function checkPage(page) {
  const where = page.file;
  const path = join(ROOT, 'dist', page.file);
  if (!(await exists(path))) return fail(where, 'no existe'), null;

  const html = await readFile(path, 'utf8');

  /* — idioma y canónica — */
  const lang = (html.match(/<html lang="([^"]+)"/) || [])[1];
  if (!lang) fail(where, 'falta lang en <html>');
  else if (!lang.startsWith(page.lang)) fail(where, `lang="${lang}" no corresponde a ${page.lang}`);

  const canonical = (html.match(/rel="canonical" href="([^"]+)"/) || [])[1];
  if (!canonical) fail(where, 'falta canonical');
  else if (!canonical.endsWith(page.dir)) fail(where, `canonical "${canonical}" no termina en ${page.dir}`);

  for (const hl of ['es', 'en', 'x-default']) {
    if (!html.includes(`hreflang="${hl}"`)) fail(where, `falta hreflang="${hl}"`);
  }

  /* — Open Graph y tarjeta — */
  for (const prop of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']) {
    if (!html.includes(`property="${prop}"`)) fail(where, `falta ${prop}`);
  }
  if (!html.includes('name="twitter:card"')) fail(where, 'falta twitter:card');

  /* — JSON-LD tiene que parsear — */
  const ld = (html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/) || [])[1];
  if (!ld) fail(where, 'falta el bloque JSON-LD');
  else {
    try {
      const data = JSON.parse(ld);
      if (data['@type'] !== 'Person') fail(where, `JSON-LD @type es "${data['@type']}", esperaba Person`);
      if (!Array.isArray(data.sameAs) || !data.sameAs.length) fail(where, 'JSON-LD sin sameAs');
    } catch (e) {
      fail(where, `JSON-LD no parsea: ${e.message}`);
    }
  }

  /* — CSP y la regla de no usar style="" — */
  if (!html.includes('Content-Security-Policy')) fail(where, 'falta la CSP');
  const inlineStyles = count(html, / style="/g);
  if (inlineStyles) fail(where, `${inlineStyles} atributo(s) style="" — rompen la CSP con hash`);

  /* — encabezados — */
  const h1 = count(html, /<h1[\s>]/g);
  if (h1 !== 1) fail(where, `hay ${h1} <h1>, tiene que haber exactamente 1`);

  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      fail(where, `salto de encabezado h${levels[i - 1]} → h${levels[i]}`);
      break;
    }
  }

  /* — cada ancla del menú tiene que existir — */
  for (const m of html.matchAll(/href="#([^"]+)"/g)) {
    const id = m[1];
    if (id !== 'top' && id !== 'main' && !html.includes(`id="${id}"`)) {
      fail(where, `el ancla #${id} no apunta a ningún id`);
    }
  }

  /* — todo asset referenciado tiene que estar en dist — */
  for (const m of html.matchAll(/(?:href|src)="(\/assets\/[^"]+)"/g)) {
    if (!(await exists(join(ROOT, 'dist', m[1])))) {
      fail(where, `referencia ${m[1]} pero el archivo no está`);
    }
  }

  /* — nada externo: es lo que sostiene default-src 'none' — */
  for (const m of html.matchAll(/(?:href|src)="(https?:\/\/[^"]+)"/g)) {
    const url = m[1];
    const isLink = html.includes(`href="${url}" target="_blank"`) || url.includes('nicolasdalessandro.dev');
    if (!isLink) fail(where, `carga un recurso externo: ${url}`);
  }

  return {
    h2: count(html, /<h2[\s>]/g),
    h3: count(html, /<h3[\s>]/g),
    h4: count(html, /<h4[\s>]/g),
    chips: count(html, /class="chip"/g),
    links: count(html, /<a /g),
  };
}

const shapes = [];
for (const page of PAGES) {
  const shape = await checkPage(page);
  if (shape) shapes.push({ page, shape });
}

/* Los dos idiomas tienen que tener la misma estructura: si uno perdió una
   sección o un proyecto, se nota acá y en ningún otro lado. */
if (shapes.length === 2) {
  const [a, b] = shapes;
  for (const k of Object.keys(a.shape)) {
    if (a.shape[k] !== b.shape[k]) {
      fail('dist', `es y en no coinciden en ${k}: ${a.shape[k]} vs ${b.shape[k]}`);
    }
  }
  if (!failures) {
    const s = a.shape;
    console.log(`  ✓ es/en con la misma estructura — ${s.h2} h2, ${s.h3} h3, ${s.h4} h4, ${s.chips} chips, ${s.links} links`);
  }
}

for (const f of ['sitemap.xml', 'robots.txt', 'site.webmanifest']) {
  if (!(await exists(join(ROOT, 'dist', f)))) fail('dist', `falta ${f}`);
}
const confPath = join(ROOT, 'deploy', 'nginx.conf');
if (!(await exists(confPath))) {
  fail('deploy', 'falta nginx.conf');
} else {
  /* El nonce del <meta> es un marcador que nginx reemplaza al servir. Si una
     página lo trae y el conf no lo reemplaza (o al revés), el script de
     Cloudflare queda bloqueado por una de las dos políticas, en silencio. */
  const conf = await readFile(confPath, 'utf8');
  /* En el atributo la comilla sale escapada (&#39;), así que se busca sin ella. */
  const metaNonce = (await readFile(join(ROOT, 'dist', 'index.html'), 'utf8')).includes(`nonce-${NONCE_PLACEHOLDER}`);
  const confNonce = conf.includes("'nonce-$request_id'") && conf.includes(`sub_filter '${NONCE_PLACEHOLDER}' '$request_id'`);
  if (metaNonce !== confNonce) {
    fail('deploy', metaNonce
      ? 'el <meta> lleva el marcador del nonce pero nginx.conf no lo reemplaza'
      : 'nginx.conf manda un nonce que el <meta> no conoce');
  }
}

console.log('');
if (failures) {
  console.error(`${failures} problema(s).`);
  process.exit(1);
}
console.log('Todo en orden.');
