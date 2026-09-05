/**
 * A — editorial técnica. Renderiza el interior de <body>.
 *
 * La estructura de esta variante es una rejilla asimétrica: cada sección tiene
 * una columna angosta a la izquierda con la etiqueta en monoespaciada, y el
 * contenido a la derecha. Es lo que le da el aire de revista y lo que la
 * distingue de las otras dos, que apilan.
 *
 * Igual que en B: ningún atributo style="" — la CSP va con hash del <style>.
 */

import { esc, attr, richText } from '../../lib/html.mjs';
import { icons } from '../../lib/icons.mjs';
import { highlightPython } from '../../lib/pycode.mjs';

/* ── piezas chicas ───────────────────────────────────────────────────────── */

const ext = (href, label, ui, cls = 'ext') =>
  `<a class="${attr(cls)}" href="${attr(href)}" target="_blank" rel="noopener noreferrer">` +
  `${esc(label)}${icons.external(13)}<span class="sr"> (${esc(ui.newTab)})</span></a>`;

const period = (label, isoValue) =>
  isoValue && !isoValue.includes('/')
    ? `<time class="period" datetime="${attr(isoValue)}">${esc(label)}</time>`
    : `<span class="period">${esc(label)}</span>`;

/**
 * Envoltura de sección: etiqueta a la izquierda, contenido a la derecha.
 * `note` es la línea chica bajo la etiqueta (un período, un contador).
 */
const band = ({ id, title, note, body, cls = '' }) => `<section class="band${cls ? ' ' + cls : ''}"${
  id ? ` id="${attr(id)}" aria-labelledby="${attr(id)}-title"` : ''
}>
<div class="band-label">
<h2${id ? ` id="${attr(id)}-title"` : ''}>${esc(title)}</h2>
${note ? `<p class="band-note">${esc(note)}</p>` : ''}
</div>
<div class="band-body">${body}</div>
</section>`;

/* ── cabecera ────────────────────────────────────────────────────────────── */

function topbar(m) {
  const { ui, site, alt, nav } = m;
  return `<header class="topbar">
<a class="brand" href="${attr(m.dir)}">${esc(site.name)}</a>
<nav class="topnav" aria-label="${attr(ui.navLabel)}">
<ul>${nav.map((n) => `<li><a href="${attr(n.href)}">${esc(n.label)}</a></li>`).join('')}</ul>
</nav>
<div class="topbar-actions">
<a class="lang" href="${attr(alt.dir)}" hreflang="${attr(alt.lang)}" lang="${attr(alt.lang)}" aria-label="${attr(alt.label)}">${esc(alt.short)}</a>
<button id="theme-toggle" class="theme" type="button" aria-pressed="false" aria-label="${attr(ui.themeToggle)}" data-label-dark="${attr(ui.themeDark)}" data-label-light="${attr(ui.themeLight)}">
<span class="theme-sun" aria-hidden="true">${icons.sun(17)}</span>
<span class="theme-moon" aria-hidden="true">${icons.moon(17)}</span>
</button>
</div>
</header>`;
}

/* ── secciones ───────────────────────────────────────────────────────────── */

function hero(m) {
  const h = m.hero;
  /* La última línea del titular va en itálica bermellón: es el único momento
     de énfasis tipográfico de la página, y cae justo sobre el diferencial. */
  const lines = h.headline
    .map((l, i) =>
      i === h.headline.length - 1
        ? `<em class="hl hl-turn">${esc(l)}</em>`
        : `<span class="hl">${esc(l)}</span>`,
    )
    .join(' ');

  return `<header class="hero">
<p class="eyebrow"><span>${esc(h.role)}</span><span>${esc(h.location)}</span></p>
<h1 class="headline">${lines}</h1>
<p class="lead">${esc(h.lead)}</p>
<div class="cta">
<a class="btn btn-primary" href="mailto:${attr(h.email)}">${esc(h.ctaPrimary)}</a>
<a class="btn btn-ghost" href="${attr(h.cv)}" download>${esc(h.ctaSecondary)}</a>
<span class="avail"><span class="dot" aria-hidden="true"></span>${esc(h.availability)}</span>
</div>
${h.cvIsPending ? `<p class="pending">${esc(h.cvPending)}</p>` : ''}
</header>`;
}

const layers = (m) =>
  band({
    title: m.layers.title,
    body: `<dl class="layer-list">${m.layers.items
      .map(
        (l) =>
          `<div class="layer"><dt>${esc(l.name)}</dt><dd>${esc(l.text)}</dd></div>`,
      )
      .join('')}</dl>`,
    cls: 'band-layers',
  });

function project(m, p, index) {
  const { ui } = m;
  const n = String(index + 1).padStart(2, '0');

  const code = p.code
    ? `<figure class="code">
<pre><code>${highlightPython(p.code.source)}</code></pre>
<figcaption>${esc(m.ui.codeCaption)}</figcaption>
</figure>`
    : '';

  return `<li class="project${p.featured ? ' is-featured' : ''}">
<article aria-labelledby="p-${attr(p.id)}">
<p class="project-n" aria-hidden="true">${n}</p>
<h3 id="p-${attr(p.id)}">${esc(p.title)}</h3>
<p class="project-context"><span>${esc(p.context)}</span>${period(p.period, p.periodIso)}</p>
<p class="project-lead">${esc(p.lead)}</p>
<div class="pa">
<div class="pa-cell"><h4>${esc(ui.problemLabel)}</h4><p>${esc(p.problem)}</p></div>
<div class="pa-cell"><h4>${esc(ui.approachLabel)}</h4><p>${esc(p.approach)}</p></div>
</div>
${code}
<ul class="highlights">${p.highlights.map((i) => `<li>${richText(i)}</li>`).join('')}</ul>
<p class="stack"><span class="sr">${esc(ui.stackLabel)}: </span>${p.stack
    .map((s) => `<span class="chip">${esc(s)}</span>`)
    .join('')}</p>
${p.url ? `<p class="project-link">${ext(p.url, ui.liveSite, ui)}</p>` : ''}
</article>
</li>`;
}

const work = (m) =>
  band({
    id: m.sections.trabajo.id,
    title: m.sections.trabajo.title,
    note: m.sections.trabajo.intro,
    body: `<ol class="projects">${m.projects.map((p, i) => project(m, p, i)).join('')}</ol>`,
    cls: 'band-work',
  });

function experience(m) {
  const e = m.experience;
  return band({
    id: m.sections.experiencia.id,
    title: m.sections.experiencia.title,
    body: `<article class="job">
<header class="job-head">
<h3>${esc(e.employer)}</h3>
<p class="job-role">${esc(e.role)}</p>
${period(e.period, e.periodIso)}
</header>
<ol class="clients">${e.clients
      .map(
        (c) =>
          `<li class="client"><h4>${esc(c.name)}</h4>${period(c.period, c.periodIso)}<p>${esc(c.text)}</p></li>`,
      )
      .join('')}</ol>
<div class="teamwork">
<h4>${esc(e.teamworkTitle)}</h4>
<ul>${e.teamwork.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
</div>
</article>`,
  });
}

const skills = (m) =>
  band({
    id: m.sections.habilidades.id,
    title: m.sections.habilidades.title,
    body: `<div class="skills">${m.skills
      .map(
        (g) =>
          `<section class="skill-group" aria-labelledby="sk-${attr(g.id)}">` +
          `<h3 id="sk-${attr(g.id)}">${esc(g.label)}</h3>` +
          `<ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></section>`,
      )
      .join('')}</div>`,
  });

function education(m) {
  const e = m.education;
  const c = e.cert;
  const credential = c.url
    ? ext(c.url, c.verifyLabel, m.ui, 'cert-link')
    : `<p class="pending">${esc(c.pendingLabel)}</p>`;

  return band({
    id: m.sections.formacion.id,
    title: m.sections.formacion.title,
    body: `<div class="edu">
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
</div>`,
  });
}

function contact(m) {
  const c = m.contact;
  const h = m.hero;
  const row = (k, v) => `<div class="chan"><dt>${esc(k)}</dt><dd>${v}</dd></div>`;

  return band({
    id: m.sections.contacto.id,
    title: c.title,
    /* Esta variante no separa el filtro de fit del cierre: los muestra juntos. */
    note: `${c.seeking}. ${c.lead}`,
    body: `<dl class="channels">
${row(c.emailLabel, `<a href="mailto:${attr(h.email)}">${esc(h.email)}</a>`)}
${row(c.linkedinLabel, ext(h.linkedin, 'nicolas-dalessandro', m.ui))}
${row(c.githubLabel, ext(h.github, 'nks21may', m.ui))}
${row(
  c.cvLabel,
  `<a href="${attr(h.cv)}" download>${esc(h.ctaSecondary)}</a>` +
    (h.cvIsPending ? `<span class="pending"> — ${esc(h.cvPending)}</span>` : ''),
)}
</dl>`,
    cls: 'band-contact',
  });
}

const footer = (m) => `<footer class="footer">
<p class="colophon">${esc(m.footer.colophon)}</p>
<div class="footer-end">
<p class="rights">© ${new Date().getFullYear()} ${esc(m.site.name)}. ${esc(m.footer.rights)}</p>
<p class="totop"><a href="#top">${esc(m.ui.backToTop)}</a></p>
</div>
</footer>`;

/* ── documento ───────────────────────────────────────────────────────────── */

export function renderBody(m) {
  return `<a class="skip" href="#main">${esc(m.ui.skipToContent)}</a>
<div class="shell" id="top">
${topbar(m)}
<main class="main" id="main">
${hero(m)}
${layers(m)}
${work(m)}
${experience(m)}
${skills(m)}
${education(m)}
${contact(m)}
</main>
${footer(m)}
</div>`;
}
