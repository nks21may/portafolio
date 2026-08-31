/**
 * Trae las tipografías de Google Fonts UNA vez, en build, y las deja en
 * assets/fonts/ para servirlas nosotros.
 *
 * Por qué no un <link> a fonts.googleapis.com: sería una request externa
 * bloqueante en el head, un dominio más en el critical path y adiós a la CSP
 * con default-src 'none'. Bajando los woff2 el sitio publicado no le pide nada
 * a nadie.
 *
 * Se piden sólo los subconjuntos latin y latin-ext: el español entero (á é í
 * ó ú ñ ü ¿ ¡) entra en latin, y latin-ext queda de red de seguridad. Los
 * cirílicos, griegos y vietnamitas que sirve Google se descartan.
 */

import { mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

const exists = (p) => access(p).then(() => true, () => false);

const slug = (s) =>
  s.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Parte la hoja de Google en bloques, quedándose con el subset de cada uno. */
function parseGoogleCss(css) {
  const chunks = css.split(/\/\*\s*([\w-]+)\s*\*\//).slice(1);
  const faces = [];

  for (let i = 0; i < chunks.length; i += 2) {
    const subset = chunks[i];
    const body = chunks[i + 1] || '';
    const pick = (re) => (body.match(re) || [])[1];

    const family = pick(/font-family:\s*'([^']+)'/);
    const url = pick(/src:\s*url\(([^)]+)\)/);
    if (!family || !url) continue;

    faces.push({
      subset,
      family,
      style: pick(/font-style:\s*([\w-]+)/) || 'normal',
      weight: (pick(/font-weight:\s*([^;]+)/) || '400').trim(),
      unicodeRange: (pick(/unicode-range:\s*([^;]+)/) || '').trim(),
      url,
    });
  }
  return faces;
}

/**
 * @param {object}   o
 * @param {{spec: string, preload?: boolean}[]} o.specs  specs de la API css2;
 *   `preload` marca la familia del titular, la única que se precarga
 * @param {string}   o.outDir    dónde escribir los .woff2
 * @param {string[]} o.subsets   subconjuntos a conservar
 * @returns {Promise<{css: string, files: {file: string, preload: boolean}[]}>}
 */
export async function ensureFonts({ specs, outDir, subsets = ['latin', 'latin-ext'] }) {
  await mkdir(outDir, { recursive: true });

  const blocks = [];
  const files = [];

  for (const { spec, preload: preloadFamily } of specs) {
    const href = `https://fonts.googleapis.com/css2?family=${spec}&display=swap`;
    const res = await fetch(href, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`Google Fonts respondió ${res.status} para "${spec}"`);

    const faces = parseGoogleCss(await res.text()).filter((f) => subsets.includes(f.subset));
    if (!faces.length) throw new Error(`Sin caras latin para "${spec}" — ¿cambió el nombre de la familia?`);

    for (const f of faces) {
      const weightKey = f.weight.replace(/\s+/g, '-');
      const italic = f.style === 'italic' ? '-italic' : '';
      const file = `${slug(f.family)}-${weightKey}${italic}-${f.subset}.woff2`;
      const dest = join(outDir, file);

      if (!(await exists(dest))) {
        const bin = await fetch(f.url, { headers: { 'User-Agent': UA } });
        if (!bin.ok) throw new Error(`No pude bajar ${f.url} (${bin.status})`);
        await writeFile(dest, Buffer.from(await bin.arrayBuffer()));
      }

      const preload = Boolean(preloadFamily) && f.subset === 'latin' && f.style === 'normal';
      files.push({ file, preload });

      blocks.push(
        `@font-face{` +
          `font-family:'${f.family}';` +
          `font-style:${f.style};` +
          `font-weight:${f.weight};` +
          `font-display:swap;` +
          `src:url('/assets/fonts/${file}') format('woff2');` +
          `unicode-range:${f.unicodeRange}}`,
      );
    }
  }

  /* Una sola cara en preload: dos compiten entre sí y contra el LCP. */
  const first = files.findIndex((f) => f.preload);
  files.forEach((f, i) => { f.preload = i === first; });

  return { css: blocks.join(''), files };
}
