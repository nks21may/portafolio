/**
 * Los únicos iconos del sitio. Dibujados, no emoji: escalan y se recolorean.
 *
 * Todos sobre grilla de 24, trazo 1.6, extremos redondeados. Van inline
 * (son cuatro) y siempre con aria-hidden: el significado lo lleva el texto de
 * al lado o el aria-label del control.
 */

const svg = (body, size = 16) =>
  `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" ` +
  `stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ` +
  `aria-hidden="true" focusable="false">${body}</svg>`;

export const icons = {
  sun: (s) =>
    svg(
      `<circle cx="12" cy="12" r="4.2"/>` +
        `<path d="M12 2.6v2.2M12 19.2v2.2M4.4 4.4l1.6 1.6M18 18l1.6 1.6M2.6 12h2.2M19.2 12h2.2M4.4 19.6l1.6-1.6M18 6l1.6-1.6"/>`,
      s,
    ),

  moon: (s) => svg(`<path d="M20 13.6A8.4 8.4 0 1 1 10.4 4a6.6 6.6 0 0 0 9.6 9.6Z"/>`, s),

  /** Flecha diagonal para links que salen del sitio. */
  external: (s) => svg(`<path d="M8 16 16 8M9.5 8H16v6.5"/>`, s),

  /** Verificación, para la credencial de la certificación. */
  check: (s) => svg(`<path d="m5 12.5 4.5 4.5L19 7.5"/>`, s),
};
