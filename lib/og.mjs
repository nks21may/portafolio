/**
 * La tarjeta de Open Graph: 1200×630, una por idioma.
 *
 * Es lo único que ve alguien cuando pegás el link en LinkedIn o en un mail, y
 * suele decidir si lo abre. Así que dice lo mismo que el hero — la frase de
 * posicionamiento — y no un logo con el nombre del sitio.
 *
 * Se renderiza como HTML y se captura con Chrome a 1200×630 (ver
 * scripts/make-og.mjs). Esta página NO pasa por la CSP del sitio: nunca se
 * publica, sólo se fotografía, así que acá los estilos inline están bien.
 */

import { esc } from './html.mjs';

/**
 * @param {object} o
 * @param {object} o.model     modelo de vista del idioma
 * @param {object} o.palette   tokens.light o tokens.dark, según el modo nativo
 * @param {string} o.fontCss   @font-face del sitio
 * @param {object} o.style     { display, meta, weight, tracking }
 */
export function renderOgCard({ model, palette, fontCss, style }) {
  const { site, hero } = model;
  const p = (k) => palette[k];

  return `<!doctype html>
<html lang="${esc(model.htmlLang)}">
<head>
<meta charset="utf-8">
<style>
${fontCss}
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; }
body {
  background: ${p('paper')};
  color: ${p('ink')};
  font-family: ${style.meta};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 68px 76px;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}
.top { display: flex; align-items: center; gap: 14px; font-size: 20px; color: ${p('ink-3')}; }
.dot { width: 11px; height: 11px; border-radius: 50%; background: ${p('live')}; }
.domain { color: ${p('accent')}; }
h1 {
  font-family: ${style.display};
  font-size: ${style.size};
  font-weight: ${style.weight};
  line-height: ${style.leading};
  letter-spacing: ${style.tracking};
}
h1 span { display: block; }
h1 span:last-child { color: ${p('accent')}; font-style: ${style.turn || 'normal'}; }
.foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  padding-top: 26px;
  border-top: 1px solid ${p('rule-strong')};
}
.who { display: flex; flex-direction: column; gap: 5px; }
.name { font-size: 27px; font-weight: 700; letter-spacing: -0.02em; }
.role { font-size: 20px; color: ${p('ink-2')}; }
.where { font-size: 19px; color: ${p('ink-3')}; text-align: right; line-height: 1.5; }
</style>
</head>
<body>
<div class="top"><span class="dot"></span><span class="domain">${esc(site.domain)}</span></div>
<h1>${hero.headline.map((l) => `<span>${esc(l)}</span>`).join('')}</h1>
<div class="foot">
<div class="who">
<span class="name">${esc(site.name)}</span>
<span class="role">${esc(hero.role)}</span>
</div>
<div class="where">${esc(hero.location)}<br>${esc(hero.availability)}</div>
</div>
</body>
</html>`;
}
