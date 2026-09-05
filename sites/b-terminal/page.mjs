/**
 * B — terminal densa. Renderiza el interior de <body>.
 *
 * Dos reglas que no son negociables acá:
 *  1. Ningún atributo style="": la CSP va con hash del <style>, y un estilo
 *     inline obligaría a 'unsafe-hashes'. Todo el estilo vive en styles.css.
 *  2. El motivo de terminal ($ prompt, --flags, rutas con barra) es DECORATIVO.
 *     Va siempre en spans con aria-hidden, nunca dentro del texto accesible de
 *     un encabezado. Un lector de pantalla oye "Trabajo", no "signo pesos ls
 *     guión guión work".
 */

import { esc, attr, richText } from '../../lib/html.mjs';
import { icons } from '../../lib/icons.mjs';
import { highlightPython } from '../../lib/pycode.mjs';

/* ── piezas chicas ───────────────────────────────────────────────────────── */

/** Encabezado de sección con prompt y flag decorativos alrededor del título. */
const cmd = (title, flag) =>
  `<span class="sigil" aria-hidden="true">$ </span>${esc(title)}` +
  (flag ? `<span class="flag" aria-hidden="true"> ${esc(flag)}</span>` : '');

/** Link externo: abre en pestaña nueva y lo dice, para quien no ve el icono. */
const ext = (href, label, ui, cls = 'ext') =>
  `<a class="${attr(cls)}" href="${attr(href)}" target="_blank" rel="noopener noreferrer">` +
  `${esc(label)}${icons.external(14)}<span class="sr"> (${esc(ui.newTab)})</span></a>`;

/** <time> sólo cuando el período es una fecha única: un rango no es datetime válido. */
const period = (label, isoValue) =>
  isoValue && !isoValue.includes('/')
    ? `<time class="period" datetime="${attr(isoValue)}">${esc(label)}</time>`
    : `<span class="period">${esc(label)}</span>`;

const list = (items, cls = '') =>
  `<ul${cls ? ` class="${attr(cls)}"` : ''}>` +
  items.map((i) => `<li>${richText(i)}</li>`).join('') +
  `</ul>`;

/* ── cabecera y navegación ───────────────────────────────────────────────── */

function topbar(m) {
  const { ui, site, alt } = m;
  return `<header class="topbar">
<a class="brand" href="${attr(m.dir)}">
<span class="dot" aria-hidden="true"></span>
<span class="brand-name">${esc(site.name)}</span>
<span class="brand-domain">${esc(site.domain)}</span>
</a>
<div class="topbar-actions">
<a class="lang" href="${attr(alt.dir)}" hreflang="${attr(alt.lang)}" lang="${attr(alt.lang)}" aria-label="${attr(alt.label)}">${esc(alt.short)}</a>
<button id="theme-toggle" class="theme" type="button" aria-pressed="false" aria-label="${attr(ui.themeToggle)}" data-label-dark="${attr(ui.themeDark)}" data-label-light="${attr(ui.themeLight)}">
<span class="theme-sun" aria-hidden="true">${icons.sun(16)}</span>
<span class="theme-moon" aria-hidden="true">${icons.moon(16)}</span>
</button>
</div>
</header>`;
}

function rail(m) {
  const { ui, site, hero, nav } = m;
  return `<nav class="rail" aria-label="${attr(ui.navLabel)}">
<div class="rail-id" aria-hidden="true">
<span class="rail-name">${site.name
  .split(' ')
  .map((w) => `<span>${esc(w)}</span>`)
  .join('')}</span>
<span class="rail-meta">${esc(hero.location)}</span>
</div>
<ul class="rail-nav">
${nav.map((n) => `<li><a href="${attr(n.href)}"><span class="sigil" aria-hidden="true">&gt; </span>${esc(n.label)}</a></li>`).join('')}
</ul>
<ul class="rail-links">
<li>${ext(site.github, 'github', ui, 'rail-ext')}</li>
<li>${ext(site.linkedin, 'linkedin', ui, 'rail-ext')}</li>
</ul>
</nav>`;
}

/* ── secciones ───────────────────────────────────────────────────────────── */

/**
 * El nombre es la respuesta literal de `whoami`: el h1 de la página y la pieza
 * más grande del documento. El titular baja un escalón y queda como la frase
 * que sigue a la identidad, sin perder el ámbar de su última línea.
 */
function hero(m) {
  const h = m.hero;
  return `<section class="hero">
<div class="ident">
<p class="prompt" aria-hidden="true">$ whoami</p>
<h1 class="name">${esc(m.site.name)}<span class="caret" aria-hidden="true"></span></h1>
<p class="role">${esc(h.role)}</p>
</div>
<p class="headline">${h.headline.map((l) => `<span class="hl">${esc(l)}</span>`).join(' ')}</p>
<p class="lead">${esc(h.lead)}</p>
<ul class="hero-meta">
<li>${esc(h.location)}</li>
<li class="is-live"><span class="dot" aria-hidden="true"></span>${esc(h.availability)}</li>
</ul>
<div class="cta">
<a class="btn btn-primary" href="mailto:${attr(h.email)}">${esc(h.ctaPrimary)}</a>
<a class="btn btn-ghost" href="${attr(h.cv)}" download>${esc(h.ctaSecondary)}</a>
</div>
${h.cvIsPending ? `<p class="pending">${esc(h.cvPending)}</p>` : ''}
</section>`;
}

function layers(m) {
  return `<section class="layers" aria-labelledby="layers-title">
<h2 class="cmd" id="layers-title">${cmd(m.layers.title, '--stack')}</h2>
<dl class="layer-list">
${m.layers.items
  .map(
    (l) =>
      `<div class="layer"><dt>${esc(l.name)}<span class="slash" aria-hidden="true">/</span></dt><dd>${esc(l.text)}</dd></div>`,
  )
  .join('')}
</dl>
</section>`;
}

function projectCode(m, p) {
  if (!p.code) return '';
  return `<figure class="code">
<pre><code>${highlightPython(p.code.source)}</code></pre>
<figcaption>${esc(m.ui.codeCaption)}</figcaption>
</figure>`;
}

function project(m, p, index) {
  const { ui } = m;
  const n = String(index + 1).padStart(2, '0');
  return `<li class="project${p.featured ? ' is-featured' : ''}">
<article aria-labelledby="p-${attr(p.id)}">
<header class="project-head">
<span class="project-n" aria-hidden="true">${n}</span>
<h3 id="p-${attr(p.id)}">${esc(p.title)}</h3>
<p class="project-context"><span>${esc(p.context)}</span>${period(p.period, p.periodIso)}</p>
</header>
<p class="project-lead">${esc(p.lead)}</p>
<div class="pa">
<div class="pa-cell"><h4>${esc(ui.problemLabel)}</h4><p>${esc(p.problem)}</p></div>
<div class="pa-cell"><h4>${esc(ui.approachLabel)}</h4><p>${esc(p.approach)}</p></div>
</div>
${projectCode(m, p)}
${list(p.highlights, 'highlights')}
<p class="stack"><span class="stack-k" aria-hidden="true">${esc(ui.stackLabel)}</span><span class="sr">${esc(ui.stackLabel)}: </span>${p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</p>
${p.url ? `<p class="project-link">${ext(p.url, ui.liveSite, ui)}</p>` : ''}
${p.repo ? `<p class="project-link">${ext(p.repo, ui.sourceCode, ui)}</p>` : ''}
</article>
</li>`;
}

function work(m) {
  const s = m.sections.trabajo;
  return `<section id="${attr(s.id)}" aria-labelledby="${attr(s.id)}-title">
<h2 class="cmd" id="${attr(s.id)}-title">${cmd(s.title, '--all')}</h2>
<p class="section-intro">${esc(s.intro)}</p>
<ol class="projects">${m.projects.map((p, i) => project(m, p, i)).join('')}</ol>
</section>`;
}

function experience(m) {
  const s = m.sections.experiencia;
  const e = m.experience;
  return `<section id="${attr(s.id)}" aria-labelledby="${attr(s.id)}-title">
<h2 class="cmd" id="${attr(s.id)}-title">${cmd(s.title)}</h2>
<article class="job">
<header class="job-head">
<h3>${esc(e.employer)}</h3>
<p class="job-role">${esc(e.role)}</p>
${period(e.period, e.periodIso)}
</header>
<ol class="clients">
${e.clients
  .map(
    (c) =>
      `<li class="client"><h4>${esc(c.name)}</h4>${period(c.period, c.periodIso)}<p>${esc(c.text)}</p></li>`,
  )
  .join('')}
</ol>
<div class="teamwork">
<h4>${esc(e.teamworkTitle)}</h4>
${list(e.teamwork)}
</div>
</article>
</section>`;
}

function skills(m) {
  const s = m.sections.habilidades;
  return `<section id="${attr(s.id)}" aria-labelledby="${attr(s.id)}-title">
<h2 class="cmd" id="${attr(s.id)}-title">${cmd(s.title, '--groups')}</h2>
<div class="skills">
${m.skills
  .map(
    (g) =>
      `<section class="skill-group" aria-labelledby="sk-${attr(g.id)}">` +
      `<h3 id="sk-${attr(g.id)}">${esc(g.label)}<span class="slash" aria-hidden="true">/</span></h3>` +
      `<ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></section>`,
  )
  .join('')}
</div>
</section>`;
}

function education(m) {
  const s = m.sections.formacion;
  const e = m.education;
  const c = e.cert;

  const credential = c.url
    ? ext(c.url, c.verifyLabel, m.ui, 'cert-link')
    : `<p class="pending">${esc(c.pendingLabel)}</p>`;

  return `<section id="${attr(s.id)}" aria-labelledby="${attr(s.id)}-title">
<h2 class="cmd" id="${attr(s.id)}-title">${cmd(s.title)}</h2>
<div class="edu">
<article class="edu-item">
<h3>${esc(e.degree)}</h3>
<p class="edu-inst">${esc(e.institution)}</p>
<p class="edu-note">${esc(e.note)}</p>
</article>
<article class="edu-item is-cert">
<h3>${esc(c.title)}</h3>
<p class="edu-inst"><span>${esc(c.issuer)}</span>${period(c.date, c.dateIso)}</p>
${credential}
</article>
<article class="edu-item">
<h3>${esc(e.languagesTitle)}</h3>
<ul class="langs">${e.languages.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
</article>
</div>
</section>`;
}

function contact(m) {
  const s = m.sections.contacto;
  const c = m.contact;
  const h = m.hero;
  const row = (k, v) => `<div class="chan"><dt>${esc(k)}</dt><dd>${v}</dd></div>`;

  return `<section id="${attr(s.id)}" aria-labelledby="${attr(s.id)}-title">
<h2 class="cmd" id="${attr(s.id)}-title">${cmd(c.title)}</h2>
<p class="section-intro">${esc(`${c.seeking}. ${c.lead}`)}</p>
<dl class="channels">
${row(c.emailLabel, `<a href="mailto:${attr(h.email)}">${esc(h.email)}</a>`)}
${row(c.linkedinLabel, ext(h.linkedin, 'nicolas-dalessandro', m.ui))}
${row(c.githubLabel, ext(h.github, 'nks21may', m.ui))}
${row(
  c.cvLabel,
  `<a href="${attr(h.cv)}" download>${esc(h.ctaSecondary)}</a>` +
    (h.cvIsPending ? `<span class="pending"> — ${esc(h.cvPending)}</span>` : ''),
)}
</dl>
</section>`;
}

function footer(m) {
  const year = new Date().getFullYear();
  return `<footer class="footer">
${m.footer.colophon ? `<p class="colophon">${esc(m.footer.colophon)}</p>` : ''}
<p class="rights">© ${year} ${esc(m.site.name)}. ${esc(m.footer.rights)}</p>
<p class="totop"><a href="#top"><span class="sigil" aria-hidden="true">^ </span>${esc(m.ui.backToTop)}</a></p>
</footer>`;
}

/* ── documento ───────────────────────────────────────────────────────────── */

export function renderBody(m) {
  return `<a class="skip" href="#main">${esc(m.ui.skipToContent)}</a>
<div class="shell" id="top">
${topbar(m)}
<div class="frame">
${rail(m)}
<main class="main" id="main">
${hero(m)}
${layers(m)}
${work(m)}
${experience(m)}
${skills(m)}
${education(m)}
${contact(m)}
${footer(m)}
</main>
</div>
</div>`;
}
