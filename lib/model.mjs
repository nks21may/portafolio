/**
 * Arma el modelo de vista de una página: cruza content/shared.js (datos que no
 * se traducen) con content/es.js o en.js (el copy) y devuelve un objeto plano.
 *
 * La página consume ESTE modelo y nada más. Es lo que garantiza que español e
 * inglés digan lo mismo: si uno muestra un dato distinto al otro, es un bug,
 * no una decisión.
 */

import { iso } from './html.mjs';

/** Los anclas cambian por idioma para que la URL en inglés no diga #trabajo. */
const SECTION_IDS = {
  es: {
    trabajo: 'trabajo',
    experiencia: 'experiencia',
    habilidades: 'habilidades',
    formacion: 'formacion',
    contacto: 'contacto',
  },
  en: {
    trabajo: 'work',
    experiencia: 'experience',
    habilidades: 'skills',
    formacion: 'education',
    contacto: 'contact',
  },
};

/**
 * Una medición antes/después. Las cifras salen de shared.js y el idioma pone
 * sólo las etiquetas y el separador decimal: así la página en inglés no puede
 * decir un número distinto al de la española. El espacio antes de la unidad
 * es duro para que "36,2 KB/s" no se parta en dos renglones.
 */
function measure(p, copy, locale) {
  if (!copy) throw new Error(`Falta el copy de la medición de "${p.id}" en content/${locale.lang}.js`);
  const num = new Intl.NumberFormat(locale.locale, { maximumFractionDigits: 1 });
  const fmt = (n, unit) => `${num.format(n)}\u00A0${unit}`;
  return {
    caption: copy.caption,
    rows: p.measure.map((r) => {
      const label = copy.rows[r.id];
      if (!label) throw new Error(`Falta la etiqueta de la medición "${r.id}" de "${p.id}" en content/${locale.lang}.js`);
      return { label, before: fmt(r.before, r.unit), after: fmt(r.after, r.unit) };
    }),
  };
}

export function buildModel({ locale, shared }) {
  const { site, pending, certification, projects, experience, skills, education } = shared;
  const lang = locale.lang;
  const ids = SECTION_IDS[lang];
  const isEs = lang === 'es';

  const alt = {
    lang: isEs ? 'en' : 'es',
    dir: isEs ? '/en/' : '/',
    short: locale.ui.langToggleShort,
    label: locale.ui.langToggleLabel,
  };

  return {
    lang,
    htmlLang: locale.locale,
    dir: locale.dir,
    alt,
    site,
    pending,

    meta: {
      ...locale.meta,
      canonical: site.url + locale.dir,
      ogImage: site.url + site.og[lang],
      ogLocale: isEs ? 'es_AR' : 'en_US',
    },

    ui: locale.ui,
    nav: locale.nav,
    ids,

    hero: {
      ...locale.hero,
      email: site.email,
      github: site.github,
      linkedin: site.linkedin,
      cv: site.cv[lang],
      /* Ojo: locale.hero.cvPending es el texto del aviso; esto es la bandera. */
      cvIsPending: pending.cv,
    },

    layers: locale.layers,

    sections: {
      trabajo: { id: ids.trabajo, ...locale.sections.trabajo },
      experiencia: { id: ids.experiencia, ...locale.sections.experiencia },
      habilidades: { id: ids.habilidades, ...locale.sections.habilidades },
      formacion: { id: ids.formacion, ...locale.sections.formacion },
      contacto: { id: ids.contacto, ...locale.sections.contacto },
    },

    /* Un proyecto = sus datos duros de shared.js + su copy del idioma. */
    projects: projects.map((p) => {
      const copy = locale.projects[p.id];
      if (!copy) throw new Error(`Falta el copy del proyecto "${p.id}" en content/${lang}.js`);
      /* El copy de la medición se separa antes del spread: si no, pisaría a
         la medición ya armada con las cifras de shared.js. */
      const { measure: measureCopy, ...text } = copy;
      return {
        id: p.id,
        featured: Boolean(p.featured),
        url: p.url ?? null,
        repo: p.repo ?? null,
        stack: p.stack,
        code: p.code ?? null,
        measure: p.measure ? measure(p, measureCopy, locale) : null,
        periodIso: iso(p.period),
        ...text,
      };
    }),

    experience: {
      employer: experience.employer,
      periodIso: iso(experience.period),
      role: locale.experience.role,
      period: locale.experience.period,
      teamworkTitle: locale.experience.teamworkTitle,
      teamwork: locale.experience.teamwork,
      clients: experience.clients.map((c) => {
        const copy = locale.experience.clients[c.id];
        if (!copy) throw new Error(`Falta el copy del cliente "${c.id}" en content/${lang}.js`);
        return { id: c.id, periodIso: iso(c.period), ...copy };
      }),
    },

    skills: skills.map((g) => {
      const label = locale.skills[g.id];
      if (!label) throw new Error(`Falta la etiqueta de skills "${g.id}" en content/${lang}.js`);
      return { id: g.id, label, items: g.items };
    }),

    education: {
      institution: education.institution,
      degree: locale.education.degree,
      note: locale.education.note,
      languagesTitle: locale.education.languagesTitle,
      languages: locale.education.languages,
      cert: {
        title: locale.education.certTitle,
        date: locale.education.certDate,
        dateIso: certification.date,
        issuer: certification.issuer,
        /* Sin URL no se inventa un link: se muestra como texto y se dice por qué. */
        url: certification.url,
        pendingLabel: locale.education.certPending,
        verifyLabel: locale.education.certVerify,
      },
    },

    contact: locale.contact,
    footer: locale.footer,
  };
}
