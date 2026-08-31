/**
 * D — ficha técnica.
 *
 * La más neutra de las tres a propósito: blanco de papel, tinta casi negra y
 * un rojo de keyline que funciona como marca de registro, no como decoración.
 * Aparece en el filo superior, en los números de registro y en nada más.
 *
 * El oscuro es pizarra fría, no marrón: esta variante quiere leerse como
 * documento impreso, y un dark cálido la volvería otra cosa.
 */

export const light = {
  paper: '#FFFFFF',
  'paper-2': '#FAFAFA',
  'paper-3': '#F1F2F3',

  ink: '#101112',
  'ink-2': '#4A4D52',
  'ink-3': '#666A70',

  rule: '#E2E4E7',
  'rule-2': '#EEEFF1',
  'rule-strong': '#B9BDC2',

  accent: '#C62D19',
  'accent-ink': '#FFFFFF',
  'accent-soft': '#FDEEEB',

  live: '#12703F',
  focus: '#C62D19',
  selection: 'rgb(198 45 25 / 0.15)',
  'browser-chrome': '#FFFFFF',
};

export const dark = {
  paper: '#0E0F11',
  'paper-2': '#15171A',
  'paper-3': '#1A1D21',

  ink: '#EDEEF0',
  'ink-2': '#B0B5BB',
  'ink-3': '#868C93',

  rule: '#23262B',
  'rule-2': '#1C1F23',
  'rule-strong': '#3B4046',

  accent: '#FF6A50',
  'accent-ink': '#0E0F11',
  'accent-soft': '#2A1512',

  live: '#4ADE80',
  focus: '#FF6A50',
  selection: 'rgb(255 106 80 / 0.24)',
  'browser-chrome': '#0E0F11',
};

export const checks = [
  { fg: 'ink', bg: 'paper', min: 4.5, label: 'cuerpo sobre papel' },
  { fg: 'ink', bg: 'paper-2', min: 4.5, label: 'cuerpo sobre alterno' },
  { fg: 'ink', bg: 'paper-3', min: 4.5, label: 'cuerpo sobre hundido' },
  { fg: 'ink-2', bg: 'paper', min: 4.5, label: 'prosa sobre papel' },
  { fg: 'ink-2', bg: 'paper-2', min: 4.5, label: 'prosa sobre alterno' },
  { fg: 'ink-2', bg: 'paper-3', min: 4.5, label: 'prosa sobre hundido' },
  { fg: 'ink-3', bg: 'paper', min: 4.5, label: 'metadatos sobre papel' },
  { fg: 'ink-3', bg: 'paper-2', min: 4.5, label: 'metadatos sobre alterno' },
  { fg: 'ink-3', bg: 'paper-3', min: 4.5, label: 'metadatos sobre hundido' },
  { fg: 'accent', bg: 'paper', min: 4.5, label: 'rojo sobre papel' },
  { fg: 'accent', bg: 'paper-2', min: 4.5, label: 'rojo sobre alterno' },
  { fg: 'accent', bg: 'paper-3', min: 4.5, label: 'rojo sobre hundido' },
  { fg: 'accent', bg: 'accent-soft', min: 4.5, label: 'rojo sobre su tinte' },
  { fg: 'accent-ink', bg: 'accent', min: 4.5, label: 'botón primario' },
  { fg: 'live', bg: 'paper', min: 4.5, label: 'estado disponible' },
  { fg: 'focus', bg: 'paper', min: 3, label: 'anillo de foco' },
  { fg: 'focus', bg: 'paper-3', min: 3, label: 'anillo de foco sobre hundido' },
];

export const themeColor = { light: light.paper, dark: dark.paper };

/**
 * Schibsted Grotesk es variable, así que una sola cara cubre de 400 a 700 —
 * y esta variante usa los tres pesos. IBM Plex Mono lleva las columnas de
 * etiqueta, que es donde vive el aire de ficha.
 */
export const fonts = [
  { spec: 'Schibsted+Grotesk:wght@400..700', preload: true },
  { spec: 'IBM+Plex+Mono:wght@400;500' },
];

export const og = {
  theme: 'light',
  display: "'Schibsted Grotesk', ui-sans-serif, system-ui, sans-serif",
  meta: "'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace",
  size: '58px',
  weight: '700',
  leading: '1.14',
  tracking: '-0.035em',
};
