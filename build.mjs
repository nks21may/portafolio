/**
 * Generador estático. Cero dependencias: sólo Node.
 *
 *   node build.mjs
 *
 * El sitio aporta tres archivos y nada más:
 *   site/tokens.mjs   paleta clara y oscura + pares de contraste + fuentes
 *   site/styles.css   la hoja, escrita contra var(--token)
 *   site/page.mjs     renderBody(model) -> el interior de <body>
 *
 * El contenido sale de content/ a través de lib/model.mjs, y las dos páginas
 * —español e inglés— se arman del mismo modelo: si una dice un dato distinto
 * a la otra, es un bug.
 *
 * El resultado (dist/) es HTML, CSS y un puñado de assets: no necesita este
 * script para funcionar, sólo para regenerarse.
 */

import { mkdir, writeFile, copyFile, rm, readFile, access } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { minifyCss, minifyJs, attr } from './lib/html.mjs';
import { buildModel } from './lib/model.mjs';
import { renderHead, buildCsp, cloudflareSources } from './lib/head.mjs';
import { renderNginx } from './lib/nginx.mjs';
import { THEME_SCRIPT } from './lib/theme.mjs';
import { auditPalette } from './lib/contrast.mjs';
import { ensureFonts } from './lib/fonts.mjs';

import * as shared from './content/shared.js';
import es from './content/es.js';
import en from './content/en.js';

const ROOT = dirname(fileURLToPath(import.meta.url));
const LOCALES = [es, en];

const exists = (p) => access(p).then(() => true, () => false);
const load = (p) => import(pathToFileURL(join(ROOT, p)).href);

const warnings = [];
const warn = (m) => { warnings.push(m); };

/* ── tokens -> custom properties ─────────────────────────────────────────
   Claro en :root pelado. Oscuro por preferencia de sistema, pero blindado
   con :not([data-theme="light"]) para que una elección explícita gane. Y los
   dos otra vez bajo [data-theme] para que el botón mande en ambos sentidos. */

function emitTokens(light, dark) {
  const decl = (o) => Object.entries(o).map(([k, v]) => `--${k}:${v}`).join(';');
  return (
    `:root{${decl(light)};color-scheme:light}` +
    `@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){${decl(dark)};color-scheme:dark}}` +
    `:root[data-theme="dark"]{${decl(dark)};color-scheme:dark}` +
    `:root[data-theme="light"]{${decl(light)};color-scheme:light}`
  );
}

/* ── archivos sueltos del sitio ──────────────────────────────────────────── */

function sitemap(site) {
  const today = new Date().toISOString().slice(0, 10);
  const url = (dir) =>
    `  <url>\n` +
    `    <loc>${site.url}${dir}</loc>\n` +
    `    <xhtml:link rel="alternate" hreflang="es" href="${site.url}/"/>\n` +
    `    <xhtml:link rel="alternate" hreflang="en" href="${site.url}/en/"/>\n` +
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${site.url}/"/>\n` +
    `    <lastmod>${today}</lastmod>\n` +
    `  </url>`;
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    `${url('/')}\n${url('/en/')}\n</urlset>\n`
  );
}

const robots = (site) => `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`;

const webmanifest = (site, themeColor) =>
  JSON.stringify(
    {
      name: site.name,
      short_name: site.initials,
      start_url: '/',
      scope: '/',
      display: 'minimal-ui',
      background_color: themeColor.light,
      theme_color: themeColor.light,
      icons: [{ src: '/assets/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    null,
    2,
  ) + '\n';

/* ── el sitio ────────────────────────────────────────────────────────────── */

async function buildSite() {
  const tokens = await load('site/tokens.mjs');
  const { renderBody } = await load('site/page.mjs');
  const styles = await readFile(join(ROOT, 'site/styles.css'), 'utf8');

  /* 1. El contraste primero: si falla, no tiene sentido seguir. */
  const audit = auditPalette(tokens);

  /* 2. Tipografías (cacheadas en assets/fonts: la segunda corrida no baja nada). */
  const { css: fontCss, files } = await ensureFonts({
    specs: tokens.fonts,
    outDir: join(ROOT, 'assets/fonts'),
  });

  const css = minifyCss(emitTokens(tokens.light, tokens.dark) + fontCss + styles);
  const js = minifyJs(THEME_SCRIPT);

  const out = join(ROOT, 'dist');
  await rm(out, { recursive: true, force: true });
  await mkdir(join(out, 'assets/fonts'), { recursive: true });

  /* 3. Una página por idioma.
     El <meta> de cada página lleva SUS hashes; el header de nginx tiene que
     llevar la unión, porque el JSON-LD cambia entre español e inglés. */
  /* Los orígenes que Cloudflare necesita para sus reescrituras del borde. Van
     igual en el <meta> de cada página y en el header de nginx. */
  const cspSources = cloudflareSources({ site: shared.site, cloudflare: shared.cloudflare });

  const ldHashes = [];
  let jsHash = null;
  let cssHash = null;
  for (const locale of LOCALES) {
    const model = buildModel({ locale, shared });
    const { html: head, hashes } = renderHead({
      model,
      css,
      js,
      fonts: files,
      themeColor: tokens.themeColor,
      cspSources,
    });
    ldHashes.push(hashes.ld);
    jsHash = hashes.js;
    cssHash = hashes.css;
    const doc =
      `<!doctype html>\n<html lang="${attr(model.htmlLang)}">\n<head>\n${head}\n</head>\n` +
      `<body>\n${renderBody(model)}\n</body>\n</html>\n`;

    const dir = locale.dir === '/' ? out : join(out, 'en');
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'index.html'), doc, 'utf8');
  }

  /* 4. Assets: sólo los que el sitio usa. */
  for (const f of files) {
    await copyFile(join(ROOT, 'assets/fonts', f.file), join(out, 'assets/fonts', f.file));
  }
  for (const f of ['favicon.svg', 'apple-touch-icon.png']) {
    await copyFile(join(ROOT, 'assets/brand', f), join(out, 'assets', f));
  }

  /* Un CV por idioma. El nombre sale de content/shared.js, así el link que
     renderiza la página y el archivo que se copia no pueden separarse. */
  for (const locale of LOCALES) {
    const file = basename(shared.site.cv[locale.lang]);
    const src = join(ROOT, 'assets/brand', file);
    if (await exists(src)) await copyFile(src, join(out, 'assets', file));
    else warn(`falta assets/brand/${file} — el botón de CV va a dar 404 en ${locale.lang}`);
  }

  for (const locale of LOCALES) {
    const src = join(ROOT, 'assets/og', `og-${locale.lang}.png`);
    const dest = join(out, 'assets', locale.lang === 'es' ? 'og.png' : 'og-en.png');
    if (await exists(src)) await copyFile(src, dest);
    else warn(`falta la imagen Open Graph assets/og/og-${locale.lang}.png`);
  }

  /* La config de nginx va FUERA de dist/: dist/ es la raíz web y no tiene
     por qué servir su propia configuración de servidor. */
  await mkdir(join(ROOT, 'deploy'), { recursive: true });
  await writeFile(
    join(ROOT, 'deploy', 'nginx.conf'),
    renderNginx({
      site: shared.site,
      csp: buildCsp({
        styleHashes: [cssHash],
        scriptHashes: [jsHash, ...new Set(ldHashes)],
        scriptSources: cspSources.script,
        connectSources: cspSources.connect,
      }),
    }),
    'utf8',
  );

  await writeFile(join(out, 'sitemap.xml'), sitemap(shared.site), 'utf8');
  await writeFile(join(out, 'robots.txt'), robots(shared.site), 'utf8');
  await writeFile(join(out, 'site.webmanifest'), webmanifest(shared.site, tokens.themeColor), 'utf8');

  return { css: css.length, js: js.length, fonts: files.length, audit };
}

/* ── main ────────────────────────────────────────────────────────────────── */

const kb = (n) => `${(n / 1024).toFixed(1)} kB`;

const r = await buildSite();
console.log(
  `dist/  css ${kb(r.css).padStart(8)}  js ${kb(r.js).padStart(7)}  ` +
    `${r.fonts} woff2  contraste ${r.audit.count} pares, peor ` +
    `${r.audit.worst.value.toFixed(2)}:1 (${r.audit.worst.label}, ${r.audit.worst.theme})`,
);

if (warnings.length) {
  console.log('');
  for (const w of warnings) console.log(`  aviso: ${w}`);
}
