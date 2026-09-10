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
    sourceCode: 'GitHub',
    stackLabel: 'Stack',
    copyEmail: 'Copiar dirección',
    copied: 'Copiada',
    codeCaption: 'Cómo se derivan las herramientas, simplificado',
    problemLabel: 'El problema',
    approachLabel: 'Qué hice',
    measureMetric: 'Métrica',
    measureBefore: 'Antes',
    measureAfter: 'Ahora',
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
        text: 'APIs REST en Django y servicios en Go, contratos versionados y consultas que no traen a memoria lo que no hace falta.',
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
      intro: 'Siete sistemas. Qué resolvían, qué decidí y con qué está hecho.',
    },
    experiencia: { title: 'Experiencia' },
    habilidades: { title: 'Habilidades' },
    formacion: { title: 'Formación y certificaciones' },
    contacto: { title: 'Contacto' },
  },

  projects: {
    'cve-proxy': {
      title: 'Mirror local de la CVE API del NVD',
      context: 'Proyecto propio',
      period: 'julio 2026',
      lead: 'Un servicio en Go que sirve la CVE API 2.0 del NVD desde una copia local en SQLite, para que ~100 clientes internos no gasten la cuota del upstream.',
      problem:
        'Sin API key, NVD permite 5 requests cada 30 segundos. Con ~100 clientes consultando, la cuota se agota de inmediato y la API devuelve 403 — también al sincronizador, que es el que traería el dato que falta.',
      approach:
        'Un mirror con passthrough que funciona como router de consultas: el motor local resuelve 29 parámetros y los cinco que no, se delegan al upstream. El cliente cambia la URL base y nada más, así que el reemplazo es transparente desde el primer día.',
      highlights: [
        'Un rate limiter global que comparten sincronizador y passthrough, con prioridad para el tráfico en vivo: el mirror no le come la cuota a los clientes.',
        'Las consultas delegadas se agrupan: 100 clientes pidiendo lo mismo generan una sola request a NVD y reciben todos el mismo cuerpo.',
        'El bootstrap estaba limitado por el ingest, no por el rate limit: diferir los índices al final lo bajó de 87,7 a 6,4 s por página y de casi 3 horas a ~20 minutos.',
        'El objeto <code>cve</code> sale idéntico byte a byte al del upstream, y una suite de paridad compara identidad y orden de los resultados contra la API real.',
        'Tres parámetros que hoy devuelven 0 en NVD se siguen delegando: un falso negativo silencioso en datos de seguridad cuesta más que la request que ahorraría.',
      ],
    },

    'mcp-platform': {
      title: 'Plataforma SaaS B2B: API Django REST y capa MCP',
      context: 'Desarrollo para un SaaS B2B, a través de Pabex',
      period: 'marzo 2023 – presente',
      lead: 'El backend de una plataforma B2B en Django REST Framework, más la capa que la vuelve consumible por agentes de IA.',
      problem:
        'Una plataforma B2B en producción, con una API externa que es el contrato con sus clientes. Y encima, las herramientas que un agente expone contra esa API se escriben a mano y se desactualizan apenas la API cambia.',
      approach:
        'Dos años y medio sobre ese backend: la migración de la API a la v2, control de acceso y features de producto. Y sobre eso, un servidor MCP auto-adaptativo que genera sus herramientas leyendo el schema OpenAPI vivo: cuando la API cambia, las herramientas cambian con ella. No hay definiciones que mantener.',
      highlights: [
        'Middleware de autenticación propio, con headers de identidad y clave, validado end-to-end con MCP Inspector.',
        'Extensiones OpenAPI custom (<code>x-plan-required</code>), tags y preprocessing hooks: el mismo código genera documentación distinta según la audiencia y el plan contratado.',
        'Migré la API externa a la v2.',
        'Corregí IDORs en la configuración.',
        'Los clientes rotaban recursos para esquivar el límite del plan; ahora el cupo liberado queda bloqueado una semana.',
        'Integré un servicio externo de certificación de contenidos: la evidencia de un phishing queda sellada con fecha y firma para un reclamo legal.',
        'Documenté las reglas de negocio como base de conocimiento estructurada — entidades, flujos, ADRs y referencias de API — pensada para que la consuma un agente.',
      ],
    },

    neonduel: {
      title: 'NEONDUEL: shooter 1 contra 1 con servidor autoritativo',
      context: 'Proyecto propio',
      period: 'en producción',
      lead: 'Un shooter 3D que corre en el navegador, con el movimiento de Counter-Strike y un servidor que es la única fuente de verdad: el cliente decide qué teclas aprieta, y nada más.',
      problem:
        'Un duelo en red tiene que sentirse inmediato para quien juega y ser justo para los dos. Si el cliente espera al servidor para moverse, cada paso cuesta un viaje de ida y vuelta; si el servidor le cree al cliente, hacer trampa es cuestión de mandar otro número.',
      approach:
        'La simulación vive en un paquete compartido: cliente y servidor corren exactamente el mismo código sobre los mismos datos. El cliente predice su propio movimiento y lo reconcilia con el servidor, al rival lo dibuja 100 ms en el pasado, y para resolver cada disparo el servidor rebobina el mundo al instante que veía el tirador.',
      highlights: [
        'La latencia la mide el servidor, no la declara el cliente. De un segundo de medidas se queda con el mínimo, así que inflarla justo al disparar obliga a sostener la mentira durante toda la ventana — y el rebobinado nunca pasa de 200 ms.',
        'Instantáneas diferenciales: sólo viaja lo que cambió desde la anterior, y una vez por segundo va una completa para que cualquier desajuste se cure solo, a cambio del 1,6 % del tráfico.',
        'El servidor valida cada mensaje antes de tocar la física — rechaza <code>NaN</code>, <code>dt</code> inflados y secuencias repetidas — y procesa como mucho ocho comandos por tick, para que ponerse al día nunca sea correr más rápido.',
        'Caerse no es irse: el servidor le guarda el lugar al jugador diez segundos, y con un ticket opaco vuelve el mismo jugador, con su vida y su posición, a la ronda en curso.',
        '486 tests sobre una simulación que no consulta el reloj, así que una partida entera corre en milisegundos. Uno levanta el servidor real y le habla por WebSocket como lo haría el navegador; otro comprueba que el mapa es simétrico pieza por pieza, que en un 1 contra 1 es una condición de justicia.',
      ],
      urlLabel: 'Jugar a NEONDUEL',
      measure: {
        caption:
          'Instantáneas diferenciales, antes y después. Medido contra el servidor real: doce segundos de partida contra el bot.',
        rows: { snapshot: 'Por instantánea', traffic: 'Tráfico del servidor' },
      },
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

    'surf-bhop': {
      title: 'Surf & Bhop Daily: carreras diarias con anti-cheat por resimulación',
      context: 'Proyecto propio',
      period: 'en producción',
      lead: 'Un juego de surf y bunnyhop con la física de Counter-Strike, en el navegador. Todos los días a las 00:00 UTC la fecha genera una pista nueva, la misma para todos, y el ranking es por tiempo.',
      problem:
        'Un ranking que se juega en el navegador no puede creerle al cliente: desde la consola, cualquiera reporta el tiempo que quiere o aparece directo en la meta.',
      approach:
        'El servidor no recibe tiempos ni posiciones: recibe los inputs, grabados tick a tick. Genera la pista del día desde la misma semilla y vuelve a correr la carrera con el mismo motor de física que usa el cliente. Si la simulación no llega a la meta, o su tiempo no coincide con el reportado, la carrera no entra al ranking.',
      highlights: [
        'Física de paso fijo a 128 ticks por segundo, compartida entre cliente y servidor: la resimulación corre el mismo código que corrió en el navegador.',
        'Cada pista se verifica al generarse contra un invariante geométrico: ninguna rampa puede superponerse con otra. Un test lo barre sobre 100 semillas.',
        'Login con Discord por OAuth2, protegido contra CSRF con <code>state</code>, y 120 tests que incluyen los intentos de suplantación: un invitado no puede correr con el nombre de un usuario registrado ni pisarle el récord a otro.',
      ],
      urlLabel: 'Jugar a Surf & Bhop Daily',
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
      'Reviso PRs buscando casos borde: arreglos que no arreglan, que rompen otra cosa, o que filtran datos sensibles por logs de debug — eso QA no lo ve, porque la función anda.',
      'Corregí un bug de integridad entre la vista y la exportación: valores que se truncaban en la UI y tenían que salir completos en CSV y PDF.',
      'Las tareas llegan definidas desde producto; cuando algo no cierra lo planteo en el canal que comparten devs y producto, con una propuesta, antes de implementar.',
      'Cuando el equipo migró de Scrum a Kanban, analicé el flujo que propuso el tech lead y devolví feedback para ajustarlo.',
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
    note: 'Cursada completa hasta cuarto año',
    certTitle: 'Certificación de integración de Mercado Pago — Checkout Pro',
    certDate: 'agosto 2022',
    certPending: 'Credencial verificable pendiente de cargar',
    certVerify: 'Ver credencial',
    languagesTitle: 'Idiomas',
    languages: ['Español, nativo', 'Inglés, lectura y escritura técnica; oral básico'],
  },

  contact: {
    title: 'Hablemos',
    /* Dos piezas, no una frase: `seeking` es el filtro de fit y viaja arriba de
       todo, como un campo más de la ficha; `lead` es el cierre y se queda
       abajo. */
    seekingLabel: 'Busco',
    seeking: 'Roles backend senior, fullstack o de AI engineering — remoto',
    lead: 'Si estás evaluando a alguien para un puesto así, escribime y te contesto.',
    emailLabel: 'Email',
    linkedinLabel: 'LinkedIn',
    githubLabel: 'GitHub',
    cvLabel: 'CV en PDF',
  },

  footer: {
    /* Sin `colophon` el pie va directo al copyright: las tres plantillas se
       saltean el párrafo cuando no hay texto. */
    rights: 'Todos los derechos reservados.',
  },
};
