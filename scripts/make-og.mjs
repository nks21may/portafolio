/**
 * Escribe las páginas HTML de las tarjetas Open Graph dentro de dist/, para
 * fotografiarlas después con Chrome a 1200×630.
 *
 *   node build.mjs                     (primero: hacen falta las fuentes)
 *   node scripts/make-og.mjs           escribe dist/_og-es.html y dist/_og-en.html
 *   ... capturar con Chrome a assets/og/og-<lang>.png ...
 *   node build.mjs                     de nuevo: dist limpio y con las PNG
 *
 * Van dentro de dist/ y no en un temporal para que /assets/fonts/... resuelva
 * igual que en el sitio real. build.mjs borra dist/ en cada corrida, así que no
 * quedan colgadas.
 */

import { writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { buildModel } from '../lib/model.mjs';
import { renderOgCard } from '../lib/og.mjs';
import { ensureFonts } from '../lib/fonts.mjs';

import * as shared from '../content/shared.js';
import es from '../content/es.js';
import en from '../content/en.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOCALES = [es, en];

const tokens = await import(pathToFileURL(join(ROOT, 'site/tokens.mjs')).href);
const { css: fontCss } = await ensureFonts({
  specs: tokens.fonts,
  outDir: join(ROOT, 'assets/fonts'),
});

const palette = tokens.og.theme === 'dark' ? tokens.dark : tokens.light;

for (const locale of LOCALES) {
  const model = buildModel({ locale, shared });
  const html = renderOgCard({ model, palette, fontCss, style: tokens.og });
  const dest = join(ROOT, 'dist', `_og-${locale.lang}.html`);
  await writeFile(dest, html, 'utf8');
  console.log(`${dest}`);
}
