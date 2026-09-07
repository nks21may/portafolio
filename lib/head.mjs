/**
 * El <head> es idéntico en los dos idiomas salvo el copy y las URLs alternas.
 * Acá viven SEO, hreflang, Open Graph, JSON-LD y la CSP.
 *
 * La CSP se arma con hashes SHA-256 del CSS y del JS que inlineamos, no con
 * 'unsafe-inline'. Por eso el markup generado NO puede llevar atributos
 * style="": un style inline necesitaría 'unsafe-hashes' y tiraría abajo la
 * política. Todo el estilo va en la hoja.
 */

import { createHash } from 'node:crypto';
import { esc, attr } from './html.mjs';

export const sha256 = (s) => `'sha256-${createHash('sha256').update(s, 'utf8').digest('base64')}'`;

/**
 * Arma la CSP. La usan el <meta> de cada página (con SUS hashes) y el header
 * de nginx (con la unión de los de los dos idiomas): el JSON-LD cambia entre
 * español e inglés, así que su hash también, y el header tiene que cubrir los
 * dos o rompe una de las dos páginas.
 */
export const buildCsp = ({ styleHashes, scriptHashes, extra = [] }) =>
  [
    "default-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    /* Sin esto, un fetch same-origin (el que hace Lighthouse para robots.txt)
       muere contra default-src 'none'. No habilita ningún destino externo. */
    "connect-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    `style-src ${styleHashes.join(' ')}`,
    `script-src ${scriptHashes.join(' ')}`,
    "manifest-src 'self'",
    ...extra,
  ].join('; ');

/** knowsAbout de JSON-LD sale de los grupos de skills: un dato, un lugar. */
const knowsAbout = (model) => model.skills.flatMap((g) => g.items);

function jsonLd(model) {
  const { site, hero } = model;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: site.url + model.dir,
    email: `mailto:${site.email}`,
    jobTitle: hero.role,
    description: model.meta.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Córdoba',
      addressRegion: 'Córdoba',
      addressCountry: 'AR',
    },
    sameAs: [site.linkedin, site.github],
    knowsAbout: knowsAbout(model),
    knowsLanguage: [
      { '@type': 'Language', name: 'Spanish', alternateName: 'es' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
    ],
  };
  /* </script> dentro del JSON cerraría el bloque: lo neutralizamos. */
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/**
 * @param {object}   o
 * @param {object}   o.model        modelo de vista (lib/model.mjs)
 * @param {string}   o.css          CSS ya minificado, se inlinea
 * @param {string}   o.js           JS ya minificado, se inlinea en <head>
 * @param {object[]} o.fonts        [{ file, preload }]
 * @param {object}   o.themeColor   { light, dark }
 * @returns {{ html: string, csp: string, hashes: {css: string, js: string, ld: string} }}
 */
export function renderHead({ model, css, js, fonts, themeColor }) {
  const { site, meta } = model;
  const ld = jsonLd(model);
  const cssHash = sha256(css);
  const jsHash = sha256(js);
  /* Chrome no aplica script-src a los <script> que no son ejecutables, pero
     otros motores sí: hasheamos también el bloque JSON-LD. */
  const ldHash = sha256(ld);

  const csp = buildCsp({ styleHashes: [cssHash], scriptHashes: [jsHash, ldHash] });

  const preloads = fonts
    .filter((f) => f.preload)
    .map(
      (f) =>
        `<link rel="preload" href="/assets/fonts/${attr(f.file)}" as="font" type="font/woff2" crossorigin>`,
    )
    .join('');

  const html = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${attr(csp)}">
<title>${esc(meta.title)}</title>
<meta name="description" content="${attr(meta.description)}">
<meta name="author" content="${attr(site.name)}">
<link rel="canonical" href="${attr(meta.canonical)}">
<link rel="alternate" hreflang="es" href="${attr(site.url)}/">
<link rel="alternate" hreflang="en" href="${attr(site.url)}/en/">
<link rel="alternate" hreflang="x-default" href="${attr(site.url)}/">
<meta property="og:type" content="profile">
<meta property="og:site_name" content="${attr(site.name)}">
<meta property="og:title" content="${attr(meta.title)}">
<meta property="og:description" content="${attr(meta.description)}">
<meta property="og:url" content="${attr(meta.canonical)}">
<meta property="og:image" content="${attr(meta.ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${attr(meta.ogAlt)}">
<meta property="og:locale" content="${attr(meta.ogLocale)}">
<meta property="og:locale:alternate" content="${attr(model.lang === 'es' ? 'en_US' : 'es_AR')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(meta.title)}">
<meta name="twitter:description" content="${attr(meta.description)}">
<meta name="twitter:image" content="${attr(meta.ogImage)}">
<meta name="twitter:image:alt" content="${attr(meta.ogAlt)}">
<meta name="theme-color" content="${attr(themeColor.light)}" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="${attr(themeColor.dark)}" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="${attr(themeColor.light)}">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
${preloads}
<style>${css}</style>
<script>${js}</script>
<script type="application/ld+json">${ld}</script>`;

  return { html, csp, hashes: { css: cssHash, js: jsHash, ld: ldHash } };
}
