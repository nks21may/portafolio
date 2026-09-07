/**
 * D — ficha técnica. Renderiza el interior de <body>.
 *
 * La página abre como una especificación: keyline roja, cabecera con revisión,
 * y un bloque de filas rol/base/contacto antes de la declaración. Casi todo el
 * contenido es una fila de definición etiqueta/valor — es lo que la vuelve
 * escaneable en 90 segundos y lo que la separa de las otras dos.
 *
 * Igual que en A y B: ningún atributo style="" (la CSP va con hash del <style>).
 */

import { esc, attr, richText } from '../lib/html.mjs';
import { icons } from '../lib/icons.mjs';
import { highlightPython } from '../lib/pycode.mjs';

/* ── piezas chicas ───────────────────────────────────────────────────────── */

const ext = (href, label, ui, cls = 'ext') =>
  `<a class="${attr(cls)}" href="${attr(href)}" target="_blank" rel="noopener noreferrer">` +
  `${esc(label)}${icons.external(13)}<span class="sr"> (${esc(ui.newTab)})</span></a>`;

const period = (label, isoValue) =>
  isoValue && !isoValue.includes('/')
    ? `<time class="period" datetime="${attr(isoValue)}">${esc(label)}</time>`
    : `<span class="period">${esc(label)}</span>`;

/**
 * Ata la cola que sigue al guion largo con la palabra que la precede, para que
 * no quede colgando sola en un renglón. El guion es punto de corte por los dos
 * lados (UAX#14), así que no alcanza con un espacio duro: el grupo entero va
 * en un span sin cortes. Sirve igual en los dos idiomas — busca el último
 * guion largo, no una posición fija.
 */
const bindTail = (s) => {
  const m = /^(.*\S)(\s+—\s+\S.*)$/.exec(String(s));
  if (!m) return esc(s);
  const [, head, tail] = m;
  const cut = head.lastIndexOf(' ');
  const tie = (t) => `<span class="seeking-tail">${esc(t)}</span>`;
  return cut === -1
    ? tie(head + tail)
    : `${esc(head.slice(0, cut + 1))}${tie(head.slice(cut + 1) + tail)}`;
};

/** La unidad del sitio: una fila etiqueta / valor. */
const row = (label, value, cls = '') =>
  `<div class="row${cls ? ' ' + cls : ''}"><dt>${esc(label)}</dt><dd>${value}</dd></div>`;

/**
 * Cabecera de registro: etiqueta a la izquierda, metadato a la derecha, regla
 * gruesa debajo. Es el separador que estructura toda la página.
 */
const recHead = (id, title, meta) =>
  `<div class="rec-head">` +
  `<h2${id ? ` id="${attr(id)}-title"` : ''}>${esc(title)}</h2>` +
  (meta ? `<p class="rec-meta">${meta}</p>` : '') +
  `</div>`;

const record = ({ id, title, meta, body }) =>
  `<section class="rec"${id ? ` id="${attr(id)}" aria-labelledby="${attr(id)}-title"` : ''}>` +
  recHead(id, title, meta) +
  `<div class="rec-body">${body}</div></section>`;

/* ── cabecera ────────────────────────────────────────────────────────────── */

function masthead(m) {
  const { ui, site, alt, nav, hero } = m;
  return `<div class="keyline" aria-hidden="true"></div>
<header class="masthead">
<div class="mast-id">
<a class="brand" href="${attr(m.dir)}">${esc(site.name)}</a>
<p class="mast-sub">${esc(hero.role)}</p>
</div>
<nav class="mast-nav" aria-label="${attr(ui.navLabel)}">
<ul>${nav.map((n) => `<li><a href="${attr(n.href)}">${esc(n.label)}</a></li>`).join('')}</ul>
</nav>
<div class="mast-actions">
<a class="lang" href="${attr(alt.dir)}" hreflang="${attr(alt.lang)}" lang="${attr(alt.lang)}" aria-label="${attr(alt.label)}">${esc(alt.short)}</a>
<button id="theme-toggle" class="theme" type="button" aria-pressed="false" aria-label="${attr(ui.themeToggle)}" data-label-dark="${attr(ui.themeDark)}" data-label-light="${attr(ui.themeLight)}">
<span class="theme-sun" aria-hidden="true">${icons.sun(16)}</span>
<span class="theme-moon" aria-hidden="true">${icons.moon(16)}</span>
</button>
</div>
</header>`;
}

/* ── secciones ───────────────────────────────────────────────────────────── */

/**
 * El bloque de apertura. La fila "Busco" está primera a propósito: contesta el
 * fit antes que el canal, que es la pregunta que trae quien abre la página.
 * Dejarla al final, con el resto del contacto, era pedir la acción antes de
 * haber dado la razón.
 */
function spec(m) {
  const h = m.hero;
  const c = m.contact;
  return `<section class="spec" aria-label="${attr(m.sections.contacto.title)}">
<dl>
${row(c.seekingLabel, `<span class="seeking">${bindTail(c.seeking)}</span>`, 'is-seeking')}
${row(c.emailLabel, `<a class="spec-link" href="mailto:${attr(h.email)}">${esc(h.email)}</a>`)}
${row(
  m.ui.locationLabel,
  `<span class="place">${esc(h.location)}</span>` +
    `<span class="avail"><span class="dot" aria-hidden="true"></span>${esc(h.availability)}</span>`,
)}
</dl>
</section>`;
}

function statement(m) {
  const h = m.hero;
  return `<section class="statement">
<h1>${h.headline.map((l) => `<span class="hl">${esc(l)}</span>`).join(' ')}</h1>
<p class="lead">${esc(h.lead)}</p>
<div class="cta">
<a class="btn btn-primary" href="mailto:${attr(h.email)}">${esc(h.ctaPrimary)}</a>
<div class="cta-cv">
<a class="btn btn-ghost" href="${attr(h.cv)}" download${h.cvIsPending ? ' aria-describedby="cv-pending"' : ''}>${esc(h.ctaSecondary)}</a>
${h.cvIsPending ? `<p class="pending" id="cv-pending">${esc(h.cvPending)}</p>` : ''}
</div>
</div>
</section>`;
}

const layers = (m) =>
  record({
    title: m.layers.title,
    body: `<dl class="numbered">${m.layers.items
      .map(
        (l, i) =>
          `<div class="row is-numbered">` +
          `<span class="n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>` +
          `<dt>${esc(l.name)}</dt><dd>${esc(l.text)}</dd></div>`,
      )
      .join('')}</dl>`,
    cls: 'rec-layers',
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
<div class="project-head">
<span class="project-n" aria-hidden="true">${n}</span>
<div class="project-title">
<h3 id="p-${attr(p.id)}">${esc(p.title)}</h3>
<p class="project-context"><span>${esc(p.context)}</span>${period(p.period, p.periodIso)}</p>
</div>
</div>
<p class="project-lead">${esc(p.lead)}</p>
<dl class="fields">
${row(ui.problemLabel, esc(p.problem))}
${row(ui.approachLabel, esc(p.approach), 'is-key')}
${row(ui.stackLabel, `<span class="stack">${p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</span>`)}
</dl>
${code}
<ul class="highlights">${p.highlights.map((i) => `<li>${richText(i)}</li>`).join('')}</ul>
${p.url ? `<p class="project-link">${ext(p.url, ui.liveSite, ui)}</p>` : ''}
${p.repo ? `<p class="project-link">${ext(p.repo, ui.sourceCode, ui)}</p>` : ''}
</article>
</li>`;
}

const work = (m) =>
  record({
    id: m.sections.trabajo.id,
    title: m.sections.trabajo.title,
    meta: esc(m.sections.trabajo.intro),
    body: `<ol class="projects">${m.projects.map((p, i) => project(m, p, i)).join('')}</ol>`,
  });

function experience(m) {
  const e = m.experience;
  return record({
    id: m.sections.experiencia.id,
    title: m.sections.experiencia.title,
    meta: `${esc(e.employer)} — ${esc(e.period)}`,
    body: `<article class="job">
<header class="job-head">
<h3>${esc(e.employer)}</h3>
<p class="job-role">${esc(e.role)}</p>
${period(e.period, e.periodIso)}
</header>
<dl class="fields">
${e.clients
  .map((c) =>
    row(
      c.name,
      `<span class="client-period">${esc(c.period)}</span><span class="client-text">${esc(c.text)}</span>`,
      'is-client',
    ),
  )
  .join('')}
</dl>
<div class="teamwork">
<h4>${esc(e.teamworkTitle)}</h4>
<ul>${e.teamwork.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
</div>
</article>`,
  });
}

const skills = (m) =>
  record({
    id: m.sections.habilidades.id,
    title: m.sections.habilidades.title,
    body: `<dl class="fields">${m.skills
      .map((g) =>
        row(g.label, `<span class="skill-items">${g.items.map((i) => `<span>${esc(i)}</span>`).join('')}</span>`),
      )
      .join('')}</dl>`,
  });

function education(m) {
  const e = m.education;
  const c = e.cert;
  const credential = c.url
    ? ext(c.url, c.verifyLabel, m.ui, 'cert-link')
    : `<span class="pending">${esc(c.pendingLabel)}</span>`;

  /* La etiqueta de estas dos filas es un nombre propio, no un campo: va con el
     mismo tratamiento que los clientes en Experiencia, que son la misma clase
     de dato. En mayúsculas mono a 10px, "Universidad Nacional de Río Cuarto"
     quedaba disfrazado de metadato. */
  return record({
    id: m.sections.formacion.id,
    title: m.sections.formacion.title,
    body: `<dl class="fields">
${row(
  e.institution,
  `<span class="edu-degree">${esc(e.degree)}</span><span class="edu-note">${esc(e.note)}</span>`,
  'is-entity',
)}
${row(
  c.issuer,
  `<span class="edu-degree">${esc(c.title)}</span>` +
    `<span class="edu-note">${period(c.date, c.dateIso)}</span>` +
    `<span class="edu-cred">${credential}</span>`,
  'is-entity',
)}
${row(
  e.languagesTitle,
  `<span class="skill-items is-prose">${e.languages.map((l) => `<span>${esc(l)}</span>`).join('')}</span>`,
)}
</dl>`,
  });
}

/**
 * El cierre. El pitch estaba pasando como `meta` de la cabecera, o sea con el
 * mismo tratamiento que un rango de fechas: para cuando el lector llegaba acá,
 * la página ya le había enseñado cuatro veces que ese renglón era ruido. Ahora
 * es un párrafo, y termina en el botón, que es lo que la sección venía a pedir.
 */
function contact(m) {
  const c = m.contact;
  const h = m.hero;
  return record({
    id: m.sections.contacto.id,
    title: c.title,
    body: `<p class="contact-lead">${esc(c.lead)}</p>
<dl class="fields">
${row(c.emailLabel, `<a href="mailto:${attr(h.email)}">${esc(h.email)}</a>`)}
${row(c.linkedinLabel, ext(h.linkedin, 'nicolas-dalessandro', m.ui))}
${row(c.githubLabel, ext(h.github, 'nks21may', m.ui))}
${row(c.cvLabel, `<a href="${attr(h.cv)}" download>${esc(h.ctaSecondary)}</a>`)}
</dl>
<div class="cta cta-close">
<a class="btn btn-primary" href="mailto:${attr(h.email)}">${esc(h.ctaPrimary)}</a>
</div>`,
  });
}

const footer = (m) => `<footer class="footer">
${m.footer.colophon ? `<p class="colophon">${esc(m.footer.colophon)}</p>` : ''}
<div class="footer-end">
<p class="rights">© ${new Date().getFullYear()} ${esc(m.site.name)}. ${esc(m.footer.rights)}</p>
<p class="totop"><a href="#top">${esc(m.ui.backToTop)}</a></p>
</div>
</footer>`;

/* ── documento ───────────────────────────────────────────────────────────── */

export function renderBody(m) {
  return `<a class="skip" href="#main">${esc(m.ui.skipToContent)}</a>
<div class="sheet" id="top">
${masthead(m)}
<main class="main" id="main">
${spec(m)}
${statement(m)}
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
