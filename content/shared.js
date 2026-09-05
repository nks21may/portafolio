/**
 * Datos que NO se traducen: identidad, links, fechas, stacks y assets.
 * Editá acá una sola vez y sirve para los dos idiomas.
 */

/**
 * Poné en false cada bandera cuando reemplaces el archivo provisorio por el
 * real. Mientras esté en true, el sitio lo dice en la cara en vez de fingir
 * que el archivo es auténtico.
 */
export const pending = {
  cv: true,
};

export const site = {
  domain: 'nicolasdalessandro.dev',
  url: 'https://nicolasdalessandro.dev',
  name: "Nicolás D'Alessandro",
  // Iniciales para el monograma del header y del favicon.
  initials: 'ND',
  email: 'contacto@nicolasdalessandro.dev',
  linkedin: 'https://www.linkedin.com/in/nicolas-dalessandro/',
  github: 'https://github.com/nks21may/',
  // Si algún día tenés un CV traducido, cambiá `en` y listo. Por ahora
  // los dos idiomas apuntan al mismo PDF para no dejar un link roto.
  cv: {
    es: '/assets/cv-nicolas-dalessandro.pdf',
    en: '/assets/cv-nicolas-dalessandro.pdf',
  },
  // Una tarjeta de Open Graph por idioma: el link se pega en LinkedIn y en mails.
  og: {
    es: '/assets/og.png',
    en: '/assets/og-en.png',
  },
};

/**
 * Certificación de Mercado Pago.
 * `url` en null renderiza la certificación como texto plano, sin link ni badge.
 * Pegá acá la URL verificable cuando la tengas y aparece el link sola.
 */
export const certification = {
  issuer: 'Mercado Libre',
  date: '2022-08',
  url: null,
};

/** Orden de aparición de los proyectos. El primero es el destacado. */
export const projects = [
  {
    id: 'cve-proxy',
    featured: true,
    period: { start: '2026-07', end: '2026-07' },
    // No lleva `url`: es un servicio para consumo interno, no un sitio que se
    // pueda visitar. El código sí es público, y `repo` lo enlaza con su propia
    // etiqueta en vez de reusar la de "Sitio en vivo", que diría algo falso.
    repo: 'https://github.com/nks21may/cve-proxy',
    stack: ['Go', 'net/http', 'SQLite', 'modernc.org/sqlite', 'Docker'],
  },
  {
    id: 'mcp-platform',
    featured: false,
    period: { start: '2023-03', end: null },
    stack: ['Python', 'Django REST Framework', 'drf-spectacular', 'MCP', 'PostgreSQL', 'Angular'],
    // Esquema simplificado de la decisión técnica del proyecto. Es ilustrativo,
    // no el código de producción: la etiqueta del bloque lo dice explícitamente.
    code: {
      lang: 'python',
      source: [
        'def build_tools(plan):',
        '    schema = live_openapi_schema()   # drf-spectacular, en caliente',
        '',
        '    for operation in walk(schema):',
        '        if operation.get("x-plan-required") > plan:',
        '            continue                 # el plan recorta la superficie',
        '        yield tool_from(operation)   # nombre, args y docs del schema',
      ].join('\n'),
    },
  },
  {
    id: 'health-scheduling',
    featured: false,
    period: { start: '2021-02', end: '2023-03' },
    stack: ['Python', 'Django', 'jQuery', 'MySQL', 'Celery', 'WebRTC'],
  },
  {
    id: 'discord-audio',
    featured: false,
    period: { start: '2024-01', end: null },
    // Sirve de prueba de la infraestructura propia: subdominio en su servidor.
    url: 'https://audio.nicolasdalessandro.dev/',
    stack: [
      'JavaScript',
      'Node.js',
      'discord.js',
      '@discordjs/voice',
      'Chrome Extensions API',
      'WebSocket',
      'Docker',
      'nginx',
    ],
  },
  {
    id: 'oracle-infra',
    featured: false,
    period: { start: '2023-01', end: null },
    stack: ['Ubuntu', 'ARM64', 'Docker Compose', 'nginx', 'Cloudflare DNS'],
  },
];

/** Un solo empleador. Los clientes van anidados adentro. */
export const experience = {
  employer: 'Pabex',
  period: { start: '2021-02', end: null },
  clients: [
    { id: 'saas-b2b', period: { start: '2023-03', end: null } },
    { id: 'health', period: { start: '2021-02', end: '2023-03' } },
  ],
};

/** Grupos de habilidades. Sin porcentajes, sin barras, sin nube de logos. */
export const skills = [
  {
    id: 'backend',
    items: [
      'Python',
      'Django',
      'Django REST Framework',
      'Go',
      'Diseño de APIs',
      'OpenAPI / drf-spectacular',
      'Optimización de ORM y consultas',
      'Celery y tareas asincrónicas',
      'PostgreSQL',
      'MySQL',
      'SQLite',
    ],
  },
  {
    id: 'ai',
    items: [
      'Model Context Protocol (MCP)',
      'Diseño y despliegue de servidores MCP',
      'Integración de agentes con APIs existentes',
      'Claude Code en el flujo diario'
    ],
  },
  {
    id: 'infra',
    items: [
      'Linux (Ubuntu)',
      'Docker y Docker Compose',
      'nginx como reverse proxy',
      'Oracle Cloud',
      'ARM64',
      'DNS y Cloudflare',
      'WebSockets',
      'OAuth',
    ],
  },
  {
    id: 'frontend',
    items: ['Angular', 'TypeScript', 'Arquitectura de componentes'],
  },
  {
    id: 'payments',
    items: [
      'Mercado Pago (Checkout Pro)',
      'Webhooks',
      'Idempotencia en flujos de cobro',
    ],
  },
  {
    id: 'practices',
    items: [
      'Git',
      'Bitbucket',
      'Code review y ownership por módulo',
      'Kanban',
      'Documentación técnica y ADRs',
    ],
  },
];

export const education = {
  institution: 'Universidad Nacional de Río Cuarto',
};
