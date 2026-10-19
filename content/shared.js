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
  cv: false,
};

/**
 * Funciones de Cloudflare que reescriben el HTML en el borde, después de que
 * salió de nginx. Cada una agrega un script que la CSP tiene que dejar pasar,
 * o el navegador lo bloquea y la función queda a medias.
 *
 * Esto tiene que reflejar lo que está activo en el panel de Cloudflare. Si
 * apagás una allá y no acá, la CSP queda más abierta de lo necesario; al
 * revés, la función se rompe en silencio y sólo lo ves en la consola.
 *
 * - `emailObfuscation` (Scrape Shield → Email Address Obfuscation) reescribe
 *   los mailto: a /cdn-cgi/l/email-protection y los decodifica con un script
 *   servido desde el propio dominio. Con la CSP bloqueándolo, el visitante ve
 *   "[email protected]" y el enlace no funciona.
 * - `browserInsights` (Speed → Browser Insights) inyecta el beacon de RUM,
 *   que además manda las mediciones a cloudflareinsights.com.
 * - `jsDetections` (Security → Bots → JavaScript Detections) inyecta un
 *   script inline que lleva el ray id de cada request adentro, así que no hay
 *   hash que lo cubra. Con Bot Fight Mode, que es lo que trae el plan gratis,
 *   no se puede apagar. Lo que Cloudflare sí hace es copiarle el nonce de la
 *   CSP del header, y por eso esta bandera suma un nonce por request.
 */
export const cloudflare = {
  emailObfuscation: true,
  browserInsights: true,
  jsDetections: true,
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
  // Un PDF por idioma. El nombre del archivo es el que le queda al visitante
  // en su carpeta de descargas, y de acá lo saca también el build para saber
  // qué copiar de assets/brand: si cambiás uno, cambia el otro solo.
  cv: {
    es: '/assets/cv-nicolas-dalessandro-es.pdf',
    en: '/assets/cv-nicolas-dalessandro-en.pdf',
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
    id: 'oracle-infra',
    featured: false,
    period: { start: '2023-01', end: null },
    // Sin `url` ni `repo`: el repo es privado a propósito, porque describe la
    // superficie expuesta del servidor entero.
    stack: [
      'Ubuntu',
      'ARM64',
      'Docker Compose',
      'Cloudflare Tunnel',
      'OpenTofu',
      'Ansible',
      'sops + age',
      'Prometheus',
      'Loki',
      'Grafana',
      'restic',
      'GitHub Actions',
    ],
  },
  {
    id: 'mcp-platform',
    featured: false,
    period: { start: '2023-03', end: null },
    stack: ['Python', 'Django REST Framework', 'drf-spectacular', 'MCP', 'PostgreSQL', 'Angular'],
    // Esquema simplificado de la decisión técnica del proyecto. Es ilustrativo,
    // no el código de producción: la etiqueta del bloque lo dice explícitamente.
    // El código es el mismo en los dos idiomas; sólo cambian los comentarios.
    code: {
      lang: 'python',
      source: {
        es: [
          'def build_tools(plan):',
          '    schema = live_openapi_schema()   # drf-spectacular, en caliente',
          '',
          '    for operation in walk(schema):',
          '        if operation.get("x-plan-required") > plan:',
          '            continue                 # el plan recorta la superficie',
          '        yield tool_from(operation)   # nombre, args y docs del schema',
        ].join('\n'),
        en: [
          'def build_tools(plan):',
          '    schema = live_openapi_schema()   # drf-spectacular, read live',
          '',
          '    for operation in walk(schema):',
          '        if operation.get("x-plan-required") > plan:',
          '            continue                 # the plan trims the surface',
          '        yield tool_from(operation)   # name, args and docs from the schema',
        ].join('\n'),
      },
    },
  },
  {
    id: 'neonduel',
    featured: false,
    period: { start: '2026-08', end: null },
    // Publicado en un subdominio propio, pero con el repo privado: por eso
    // lleva `url` y no `repo`, que llevaría a un 404.
    url: 'https://neonduel.nicolasdalessandro.dev/',
    stack: ['TypeScript', 'Node.js', 'WebSocket', 'three.js', 'Vite', 'Vitest', 'Docker'],
    // Antes y después de las instantáneas diferenciales, medido contra el
    // servidor real. Las cifras viven acá y no en el copy para que los dos
    // idiomas no puedan decir números distintos: cada uno pone sólo sus
    // etiquetas y su separador decimal.
    measure: [
      { id: 'snapshot', unit: 'bytes', before: 579, after: 188 },
      { id: 'traffic', unit: 'KB/s', before: 36.2, after: 11.7 },
    ],
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
    id: 'surf-bhop',
    featured: false,
    period: { start: '2026-09', end: null },
    // Igual que NEONDUEL: se juega en su subdominio, el repo es privado.
    url: 'https://surf.nicolasdalessandro.dev/',
    stack: [
      'TypeScript',
      'three.js',
      'Fastify',
      'WebSocket',
      'SQLite',
      'Discord OAuth2',
      'Discord Embedded App SDK',
      'Vitest',
      'Docker',
    ],
  },
  {
    id: 'museo',
    featured: false,
    period: { start: '2026-09', end: null },
    // Como los juegos: se visita en su subdominio, el repo es privado.
    url: 'https://museo.nicolasdalessandro.dev/',
    stack: ['JavaScript', 'WebGL2', 'GLSL ES 3.00', 'HTML-in-Canvas', 'Playwright', 'nginx', 'Docker'],
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

/**
 * Grupos de habilidades. Sin porcentajes, sin barras, sin nube de logos.
 *
 * Un nombre propio va como texto y sale igual en los dos idiomas. Lo que se
 * traduce va como { es, en }: si falta un idioma, el build lo dice en vez de
 * mostrar el ítem en el idioma equivocado.
 */
export const skills = [
  {
    id: 'backend',
    items: [
      'Python',
      'Django',
      'Django REST Framework',
      'Go',
      { es: 'Diseño de APIs', en: 'API design' },
      'OpenAPI / drf-spectacular',
      { es: 'Optimización de ORM y consultas', en: 'ORM and query optimisation' },
      { es: 'Celery y tareas asincrónicas', en: 'Celery and background tasks' },
      'PostgreSQL',
      'MySQL',
      'SQLite',
    ],
  },
  {
    id: 'ai',
    items: [
      'Model Context Protocol (MCP)',
      { es: 'Diseño y despliegue de servidores MCP', en: 'Designing and deploying MCP servers' },
      { es: 'Integración de agentes con APIs existentes', en: 'Wiring agents into existing APIs' },
      { es: 'Plugins de Claude Code: skills, agentes y MCPs', en: 'Claude Code plugins: skills, agents and MCPs' },
    ],
  },
  {
    id: 'infra',
    items: [
      'Linux (Ubuntu)',
      { es: 'Docker y Docker Compose', en: 'Docker and Docker Compose' },
      'nginx',
      { es: 'Cloudflare: DNS, Tunnel y Access', en: 'Cloudflare: DNS, Tunnel and Access' },
      'OpenTofu',
      'Ansible',
      { es: 'Secretos con sops y age', en: 'Secrets with sops and age' },
      { es: 'Prometheus, Loki y Grafana', en: 'Prometheus, Loki and Grafana' },
      { es: 'CI con GitHub Actions y GHCR', en: 'CI with GitHub Actions and GHCR' },
      'Oracle Cloud',
      'ARM64',
      'WebSockets',
      'OAuth',
    ],
  },
  {
    id: 'frontend',
    items: ['Angular', 'TypeScript', { es: 'Arquitectura de componentes', en: 'Component architecture' }],
  },
  {
    id: 'payments',
    items: [
      'Mercado Pago (Checkout Pro)',
      'Webhooks',
      { es: 'Idempotencia en flujos de cobro', en: 'Idempotent payment flows' },
    ],
  },
  {
    id: 'practices',
    items: [
      'Git',
      'Bitbucket',
      { es: 'Code review y ownership por módulo', en: 'Code review and module ownership' },
      'Kanban',
      { es: 'Documentación técnica y ADRs', en: 'Technical writing and ADRs' },
    ],
  },
];

export const education = {
  institution: 'Universidad Nacional de Río Cuarto',
};
