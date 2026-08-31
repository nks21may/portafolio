/**
 * A — editorial técnica.
 *
 * El modo nativo es el claro: papel cálido, tinta cálida y un bermellón único.
 * El oscuro no invierte la paleta, la traduce a una "edición de noche" —
 * marrón muy oscuro en vez de gris, y el bermellón aclarado hasta que respira
 * sobre el fondo.
 *
 * El verde existe sólo para el estado "disponible". No se usa nunca para
 * enfatizar: si algo tiene que destacar, es el bermellón o nada.
 */

export const light = {
  paper: '#FBFAF7',
  'paper-2': '#FFFFFF',
  'paper-3': '#F4F1EA',

  ink: '#23201B',
  'ink-2': '#56514A',
  'ink-3': '#6B6459',

  rule: '#E4DFD6',
  'rule-2': '#EFEBE3',
  'rule-strong': '#CFC8BC',

  accent: '#A83A16',
  'accent-ink': '#FFFFFF',
  'accent-soft': '#F9EDE7',

  live: '#1E6B3E',
  focus: '#A83A16',
  selection: 'rgb(168 58 22 / 0.14)',
  'browser-chrome': '#FBFAF7',
};

export const dark = {
  paper: '#17140F',
  'paper-2': '#1F1B15',
  'paper-3': '#241F18',

  ink: '#F2ECE0',
  'ink-2': '#BFB6A6',
  'ink-3': '#968E7E',

  rule: '#2E281F',
  'rule-2': '#262019',
  'rule-strong': '#443C30',

  accent: '#E8794C',
  'accent-ink': '#17140F',
  'accent-soft': '#2A1C14',

  live: '#5FD39A',
  focus: '#E8794C',
  selection: 'rgb(232 121 76 / 0.24)',
  'browser-chrome': '#17140F',
};

export const checks = [
  { fg: 'ink', bg: 'paper', min: 4.5, label: 'cuerpo sobre papel' },
  { fg: 'ink', bg: 'paper-2', min: 4.5, label: 'cuerpo sobre blanco' },
  { fg: 'ink', bg: 'paper-3', min: 4.5, label: 'cuerpo sobre hundido' },
  { fg: 'ink-2', bg: 'paper', min: 4.5, label: 'prosa sobre papel' },
  { fg: 'ink-2', bg: 'paper-2', min: 4.5, label: 'prosa sobre blanco' },
  { fg: 'ink-2', bg: 'paper-3', min: 4.5, label: 'prosa sobre hundido' },
  { fg: 'ink-3', bg: 'paper', min: 4.5, label: 'metadatos sobre papel' },
  { fg: 'ink-3', bg: 'paper-2', min: 4.5, label: 'metadatos sobre blanco' },
  { fg: 'ink-3', bg: 'paper-3', min: 4.5, label: 'metadatos sobre hundido' },
  { fg: 'accent', bg: 'paper', min: 4.5, label: 'bermellón sobre papel' },
  { fg: 'accent', bg: 'paper-2', min: 4.5, label: 'bermellón sobre blanco' },
  { fg: 'accent', bg: 'paper-3', min: 4.5, label: 'bermellón sobre hundido' },
  { fg: 'accent', bg: 'accent-soft', min: 4.5, label: 'bermellón sobre su tinte' },
  { fg: 'accent-ink', bg: 'accent', min: 4.5, label: 'botón primario' },
  { fg: 'live', bg: 'paper', min: 4.5, label: 'estado disponible' },
  { fg: 'focus', bg: 'paper', min: 3, label: 'anillo de foco' },
  { fg: 'focus', bg: 'paper-2', min: 3, label: 'anillo de foco sobre blanco' },
];

export const themeColor = { light: light.paper, dark: dark.paper };

/**
 * Instrument Serif es la cara del titular y lo primero que se pinta: es la que
 * se precarga. Instrument Sans lleva la prosa y IBM Plex Mono las etiquetas,
 * los períodos y el stack — el contrapeso técnico que evita que una serif de
 * display lo haga leer como blog de escritura.
 */
export const fonts = [
  { spec: 'Instrument+Serif:ital@0;1', preload: true },
  { spec: 'Instrument+Sans:wght@400..600' },
  { spec: 'IBM+Plex+Mono:wght@400;500' },
];

export const og = {
  theme: 'light',
  display: "'Instrument Serif', Georgia, 'Times New Roman', serif",
  meta: "'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace",
  size: '68px',
  weight: '400',
  leading: '1.12',
  tracking: '-0.015em',
  /* La última línea va en itálica, igual que en el hero del sitio. */
  turn: 'italic',
};
