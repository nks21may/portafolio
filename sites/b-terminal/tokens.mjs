/**
 * B — terminal densa.
 *
 * El modo nativo es el oscuro: casi negro, un solo ámbar como acento y un
 * verde reservado para "esto está vivo" (el punto de estado y el prompt), que
 * no se usa nunca para enfatizar. El modo claro no es una inversión: es un
 * tema de editor claro, con el ámbar oscurecido hasta que pasa sobre papel.
 *
 * Los valores están medidos, no elegidos de ojo: build.mjs corre `checks` en
 * los dos temas y falla si alguno baja del mínimo.
 */

export const light = {
  paper: '#FAFAF9',
  'paper-2': '#FFFFFF',
  'paper-3': '#F2F2F1',

  ink: '#16181A',
  'ink-2': '#4C5257',
  'ink-3': '#656B70',

  rule: '#E2E4E6',
  'rule-2': '#EDEEEF',
  'rule-strong': '#C3C7CB',

  accent: '#9A5B00',
  'accent-ink': '#FFFFFF',
  'accent-soft': '#FBF1E0',

  live: '#0F7B43',
  focus: '#9A5B00',
  selection: 'rgb(154 91 0 / 0.16)',
  'browser-chrome': '#FAFAF9',
};

export const dark = {
  paper: '#0B0C0E',
  'paper-2': '#121416',
  'paper-3': '#16191C',

  ink: '#E4E7EA',
  'ink-2': '#9AA1A8',
  'ink-3': '#838A91',

  rule: '#22262A',
  'rule-2': '#1A1E22',
  'rule-strong': '#3A3F45',

  accent: '#F0A93B',
  'accent-ink': '#0B0C0E',
  'accent-soft': '#241B0E',

  live: '#4ADE80',
  focus: '#F0A93B',
  selection: 'rgb(240 169 59 / 0.24)',
  'browser-chrome': '#0B0C0E',
};

/** 4.5:1 para texto; 3:1 para el anillo de foco, que es un objeto gráfico. */
export const checks = [
  { fg: 'ink', bg: 'paper', min: 4.5, label: 'cuerpo sobre fondo' },
  { fg: 'ink', bg: 'paper-2', min: 4.5, label: 'cuerpo sobre panel' },
  { fg: 'ink', bg: 'paper-3', min: 4.5, label: 'cuerpo sobre hundido' },
  { fg: 'ink-2', bg: 'paper', min: 4.5, label: 'prosa sobre fondo' },
  { fg: 'ink-2', bg: 'paper-2', min: 4.5, label: 'prosa sobre panel' },
  { fg: 'ink-2', bg: 'paper-3', min: 4.5, label: 'prosa sobre hundido' },
  { fg: 'ink-3', bg: 'paper', min: 4.5, label: 'metadatos sobre fondo' },
  { fg: 'ink-3', bg: 'paper-2', min: 4.5, label: 'metadatos sobre panel' },
  { fg: 'ink-3', bg: 'paper-3', min: 4.5, label: 'metadatos sobre hundido' },
  { fg: 'accent', bg: 'paper', min: 4.5, label: 'acento sobre fondo' },
  { fg: 'accent', bg: 'paper-2', min: 4.5, label: 'acento sobre panel' },
  { fg: 'accent', bg: 'paper-3', min: 4.5, label: 'acento sobre hundido' },
  { fg: 'accent', bg: 'accent-soft', min: 4.5, label: 'acento sobre su propio tinte' },
  { fg: 'accent-ink', bg: 'accent', min: 4.5, label: 'botón primario' },
  { fg: 'live', bg: 'paper', min: 4.5, label: 'estado en vivo' },
  { fg: 'live', bg: 'paper-2', min: 4.5, label: 'estado en vivo sobre panel' },
  { fg: 'focus', bg: 'paper', min: 3, label: 'anillo de foco' },
  { fg: 'focus', bg: 'paper-2', min: 3, label: 'anillo de foco sobre panel' },
];

export const themeColor = { light: light.paper, dark: dark.paper };

/**
 * JetBrains Mono lleva casi todo, así que es la que se precarga. Public Sans
 * sólo aparece en los párrafos largos: monoespaciada en prosa cansa, y la
 * densidad de esta variante ya es bastante exigente.
 */
export const fonts = [
  { spec: 'JetBrains+Mono:wght@400..700', preload: true },
  { spec: 'Public+Sans:wght@400..600' },
];

/**
 * Estilo de la tarjeta Open Graph. B es oscura de nacimiento, así que su
 * tarjeta también: es la que se va a ver pegada en LinkedIn.
 */
export const og = {
  theme: 'dark',
  display: "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace",
  meta: "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace",
  size: '56px',
  weight: '700',
  leading: '1.3',
  tracking: '-0.02em',
};
