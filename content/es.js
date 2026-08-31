/**
 * Contenido en español. Editá acá los textos sin tocar el markup.
 * Los ids de proyecto, habilidad y cliente tienen que coincidir con data/shared.js.
 */

export default {
  lang: 'es',
  locale: 'es-AR',
  dir: '/',

  meta: {
    title: "Nicolás D'Alessandro — Backend, infraestructura y tooling de IA",
    description:
      'Desarrollador fullstack con más de 5 años de experiencia. Construyo APIs en Django REST Framework, opero la infraestructura donde corren y desarrollo servidores MCP que las exponen a agentes de IA. Córdoba, Argentina — remoto.',
    ogAlt:
      "Nicolás D'Alessandro, desarrollador backend. Construyo APIs en Django y la infraestructura de IA que las consume.",
  },

  ui: {
    homeLabel: "Nicolás D'Alessandro, ir al inicio",
    skipToContent: 'Saltar al contenido',
    themeToggle: 'Cambiar tema',
    themeLight: 'Tema claro',
    themeDark: 'Tema oscuro',
    langToggleShort: 'EN',
    langToggleLabel: 'Switch to English',
    backToTop: 'Volver arriba',
    navLabel: 'Secciones',
    locationLabel: 'Ubicación',
    newTab: 'abre en una pestaña nueva',
    liveSite: 'Sitio en vivo',
    stackLabel: 'Stack',
    copyEmail: 'Copiar dirección',
    copied: 'Copiada',
    codeCaption: 'Cómo se derivan las herramientas, simplificado',
    problemLabel: 'El problema',
    approachLabel: 'Qué hice',
  },

  nav: [
    { href: '#trabajo', label: 'Trabajo' },
    { href: '#experiencia', label: 'Experiencia' },
    { href: '#habilidades', label: 'Habilidades' },
    { href: '#contacto', label: 'Contacto' },
  ],

  hero: {
    role: 'Desarrollador de software fullstack',
    headline: [
      'Construyo APIs en Django',
      'y la infraestructura de IA',
      'que las consume.',
    ],
    lead: 'Más de 5 años haciendo backend. Diseño el contrato de la API y su documentación, opero los servidores donde corre, y construyo el tooling que deja que un agente la use sin que nadie mantenga definiciones a mano.',
    location: 'Córdoba, Argentina',
    availability: 'Disponible para remoto',
    ctaPrimary: 'Escribime',
    ctaSecondary: 'Descargar CV',
    cvPending: 'El PDF todavía es un archivo provisorio',
  },

  // Las tres capas que forman el diferencial. Una fila de especificación, no tarjetas.
  layers: {
    title: 'Las tres capas',
    items: [
      {
        name: 'Backend',
        text: 'APIs REST en Django, contratos OpenAPI versionados y consultas que no traen a memoria lo que no hace falta.',
      },
      {
        name: 'Infraestructura',
        text: 'Linux, Docker y nginx en servidores que administro yo, con DNS, TLS y despliegue propios.',
      },
      {
        name: 'IA aplicada',
        text: 'Servidores MCP que exponen esas APIs a agentes, generando sus herramientas desde el schema vivo.',
      },
    ],
  },

  sections: {
    trabajo: {
      title: 'Trabajo',
      intro: 'Cuatro sistemas. Qué resolvían, qué decidí y con qué está hecho.',
    },
    experiencia: { title: 'Experiencia' },
    habilidades: { title: 'Habilidades' },
    formacion: { title: 'Formación y certificaciones' },
    contacto: { title: 'Contacto' },
  },

  projects: {
    'mcp-platform': {
      title: 'Plataforma SaaS B2B: API Django REST y capa MCP',
      context: 'Desarrollo para un SaaS B2B, a través de Pabex',
      period: 'marzo 2023 – presente',
      lead: 'El backend de una plataforma B2B en Django REST Framework, más la capa que la vuelve consumible por agentes de IA.',
      problem:
        'Las herramientas que un agente expone contra una API se escriben a mano y se desactualizan apenas la API cambia. Cada endpoint nuevo era mantenimiento en dos lugares, y la deriva entre lo que la API hacía y lo que el agente creía que existía era cuestión de tiempo.',
      approach:
        'Construí un servidor MCP auto-adaptativo: genera sus herramientas en tiempo de ejecución leyendo el schema OpenAPI vivo de la API vía drf-spectacular. Cuando la API cambia, las herramientas del agente cambian con ella. No hay definiciones que mantener.',
      highlights: [
        'Middleware de autenticación propio, con headers de identidad y clave, validado end-to-end con MCP Inspector.',
        'Extensiones OpenAPI custom (<code>x-plan-required</code>), tags y preprocessing hooks: el mismo código genera documentación distinta según la audiencia y el plan contratado.',
        'Diseño de API y documentación Swagger segmentada por tipo de usuario.',
        'Optimización de ORM: escrituras con <code>.update()</code> sobre el queryset, sin traer los objetos a memoria.',
        'Documenté las reglas de negocio como base de conocimiento estructurada — entidades, flujos, ADRs y referencias de API — pensada para que la consuma un agente.',
      ],
    },

    'health-scheduling': {
      title: 'Turnero médico con videollamadas',
      context: 'Desarrollo para una plataforma de salud digital, a través de Pabex',
      period: 'febrero 2021 – marzo 2023',
      lead: 'Sistema de turnos médicos con atención por videollamada, para consultas remotas entre profesionales y pacientes.',
      problem:
        'Una plataforma en producción, con gente atendiéndose ese mismo día. Todo lo que entraba tenía que sumarse sin romper el flujo de turnos que ya funcionaba.',
      approach:
        'Durante dos años mantuve la plataforma y le fui agregando funcionalidad sobre el flujo de turnos y sobre la experiencia de la consulta en vivo.',
      highlights: [
        'Extendí el flujo de consulta, construido sobre videollamadas WebRTC, integrando funcionalidad nueva alrededor de la sesión en vivo.',
        'Procesamiento asincrónico con Celery para recordatorios y para todo lo que no tenía que vivir dentro del request.',
        'Dominio con datos sensibles de salud: el control de acceso y la trazabilidad eran requisito de entrada, no un agregado posterior.',
        'Evolución de funcionalidad sobre un sistema con usuarios reales, sin romper lo que ya andaba.',
      ],
    },

    'discord-audio': {
      title: 'Bot de streaming de audio de navegador a Discord',
      context: 'Proyecto propio',
      period: 'en producción',
      lead: 'Extensión de Chrome más un pipeline en Node.js que captura el audio de una pestaña del navegador y lo transmite a un canal de voz de Discord por WebSocket.',
      problem:
        'Discord no permite mandar el audio de una pestaña a un canal de voz sin ocupar la sesión de alguien. Quería que el audio entrara solo, como un miembro más del canal.',
      approach:
        'Dos servicios en Docker Compose: uno WebSocket que recibe los chunks WebM/Opus del navegador, y uno HTTP con OAuth de Discord y un endpoint de métricas.',
      highlights: [
        'Desplegado sobre ARM64 en una VPS propia, expuesto por subdominios con nginx.',
        'Términos de uso y política de privacidad propios, porque procesa audio de terceros.',
      ],
    },

    'oracle-infra': {
      title: 'Infraestructura personal en Oracle Cloud',
      context: 'Proyecto propio',
      period: 'en curso',
      lead: 'Un servidor ARM de 4 OCPU y 24 GB de RAM que administro de punta a punta. Todo lo que publico corre acá.',
      problem:
        'Depender de un PaaS para cada experimento significa no aprender nunca qué pasa abajo, y quedarse sin margen cuando algo se rompe fuera de la aplicación.',
      approach:
        'Levanté y mantengo el servidor completo: nginx sirviendo varios sitios, servicios en Docker, un servidor de juego modded, DNS propio en Cloudflare y el acceso endurecido.',
      highlights: [
        'nginx como reverse proxy para varios sitios y subdominios, con TLS.',
        'Servicios containerizados con Docker Compose.',
        'DNS propio administrado en Cloudflare.',
        'Endurecimiento de acceso y superficie expuesta mínima.',
      ],
    },
  },

  experience: {
    role: 'Desarrollador Fullstack',
    period: 'febrero 2021 – presente',
    clients: {
      'saas-b2b': {
        name: 'SaaS B2B',
        period: 'marzo 2023 – presente',
        text: 'Backend en Django REST Framework, diseño de APIs y tooling de IA.',
      },
      health: {
        name: 'Plataforma de salud digital',
        period: 'febrero 2021 – marzo 2023',
        text: 'Mantenimiento y desarrollo de funcionalidades sobre un turnero médico con consultas por videollamada.',
      },
    },
    teamworkTitle: 'Trabajo de equipo',
    teamwork: [
      'Corregí un bug de integridad entre la vista y la exportación: valores que se truncaban en la UI y tenían que salir completos en CSV y PDF.',
      'Composición de componentes Angular y propagación de eventos entre componentes anidados.',
      'Empujé mejoras al proceso de code review del equipo: límites de tamaño de PR y reglas por CODEOWNERS.',
    ],
  },

  skills: {
    backend: 'Backend',
    ai: 'IA aplicada',
    infra: 'Infraestructura',
    frontend: 'Frontend',
    payments: 'Pagos',
    practices: 'Prácticas',
  },

  education: {
    degree: 'Licenciatura en Ciencias de la Computación',
    note: '4 de 5 años cursados',
    certTitle: 'Certificación de integración de Mercado Pago — Checkout Pro',
    certDate: 'agosto 2022',
    certPending: 'Credencial verificable pendiente de cargar',
    certVerify: 'Ver credencial',
    languagesTitle: 'Idiomas',
    languages: ['Español, nativo', 'Inglés, básico'],
  },

  contact: {
    title: 'Hablemos',
    lead: 'Busco roles backend senior, fullstack o de AI engineering, en remoto. Si estás evaluando a alguien para algo así, escribime y te contesto.',
    emailLabel: 'Email',
    linkedinLabel: 'LinkedIn',
    githubLabel: 'GitHub',
    cvLabel: 'CV en PDF',
  },

  footer: {
    colophon:
      'Hecho a mano en HTML, CSS y JavaScript, sin frameworks ni dependencias. Servido con nginx desde el servidor ARM del cuarto proyecto.',
    rights: 'Todos los derechos reservados.',
  },
};
