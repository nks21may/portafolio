/**
 * English content. Natural technical English, not a literal translation of es.js.
 * Project, skill and client ids must match data/shared.js.
 */

export default {
  lang: 'en',
  locale: 'en',
  dir: '/en/',

  meta: {
    title: "Nicolás D'Alessandro — Backend, infrastructure and AI tooling",
    description:
      'Fullstack developer with 5+ years of experience. I build APIs in Django REST Framework, run the infrastructure they live on, and write MCP servers that expose them to AI agents. Córdoba, Argentina — open to remote.',
    ogAlt:
      "Nicolás D'Alessandro, backend developer. I build Django APIs and the AI infrastructure that consumes them.",
  },

  ui: {
    homeLabel: "Nicolás D'Alessandro, back to home",
    skipToContent: 'Skip to content',
    themeToggle: 'Switch theme',
    themeLight: 'Light theme',
    themeDark: 'Dark theme',
    langToggleShort: 'ES',
    langToggleLabel: 'Cambiar a español',
    backToTop: 'Back to top',
    navLabel: 'Sections',
    locationLabel: 'Location',
    newTab: 'opens in a new tab',
    liveSite: 'Live site',
    sourceCode: 'GitHub',
    stackLabel: 'Stack',
    copyEmail: 'Copy address',
    copied: 'Copied',
    codeCaption: 'How the tools get derived, simplified',
    problemLabel: 'The problem',
    approachLabel: 'What I did',
  },

  nav: [
    { href: '#work', label: 'Work' },
    { href: '#experience', label: 'Experience' },
    { href: '#skills', label: 'Skills' },
    { href: '#contact', label: 'Contact' },
  ],

  hero: {
    role: 'Fullstack software developer',
    headline: ['I build Django APIs', 'and the AI infrastructure', 'that consumes them.'],
    lead: 'Five-plus years on the backend. I design the API contract and its documentation, run the servers it lives on, and build the tooling that lets an agent use it without anyone hand-maintaining tool definitions.',
    location: 'Córdoba, Argentina',
    availability: 'Open to remote',
    ctaPrimary: 'Get in touch',
    ctaSecondary: 'Download CV',
    cvPending: 'The PDF is still a placeholder file',
  },

  layers: {
    title: 'Three layers',
    items: [
      {
        name: 'Backend',
        text: 'REST APIs in Django, services in Go, versioned contracts, and queries that never pull into memory what they do not need.',
      },
      {
        name: 'Infrastructure',
        text: 'Linux, Docker and nginx on servers I administer myself, with my own DNS, TLS and deploys.',
      },
      {
        name: 'Applied AI',
        text: 'MCP servers that expose those APIs to agents, generating their tools straight from the live schema.',
      },
    ],
  },

  sections: {
    trabajo: {
      title: 'Work',
      intro: 'Five systems. What each one solved, what I decided, and what it runs on.',
    },
    experiencia: { title: 'Experience' },
    habilidades: { title: 'Skills' },
    formacion: { title: 'Education and certifications' },
    contacto: { title: 'Contact' },
  },

  projects: {
    'cve-proxy': {
      title: 'Local mirror of the NVD CVE API',
      context: 'Personal project',
      period: 'July 2026',
      lead: 'A Go service that serves NVD’s CVE API 2.0 out of a local SQLite copy, so that ~100 internal clients stop spending the upstream quota.',
      problem:
        'Without an API key, NVD allows 5 requests every 30 seconds. With ~100 clients querying, that quota is gone at once and the API answers 403 — the synchroniser included, which is what would fetch the missing record.',
      approach:
        'A mirror with passthrough that works as a query router: the local engine resolves 29 parameters and delegates the five it does not. A client changes the base URL and nothing else, so the replacement is transparent from day one.',
      highlights: [
        'One global rate limiter shared by the synchroniser and the passthrough, with priority for live traffic: keeping the mirror fresh never eats the clients’ quota.',
        'Delegated queries get coalesced: 100 clients asking for the same thing produce one request to NVD, and all 100 get the same body.',
        'The bootstrap was ingest-bound, not rate-limited: deferring the indexes to the end took it from 87.7 to 6.4 s per page and from nearly 3 hours to ~20 minutes.',
        'The <code>cve</code> object comes out byte-for-byte identical to the upstream one, and a parity suite checks the identity and order of results against the live API.',
        'Three parameters that return 0 at NVD today are still delegated: a silent false negative in security data costs more than the request it would save.',
      ],
    },

    'mcp-platform': {
      title: 'B2B SaaS platform: Django REST API and MCP layer',
      context: 'Work for a B2B SaaS product, through Pabex',
      period: 'March 2023 – present',
      lead: 'The backend of a B2B platform in Django REST Framework, plus the layer that makes it usable by AI agents.',
      problem:
        'A B2B platform in production, with an external API that is the contract its clients build against. And on top of that, the tools an agent exposes against that API are written by hand and go stale the moment the API moves.',
      approach:
        'Two and a half years on that backend: the migration of the API to v2, access control, and product features. Plus a self-adapting MCP server that generates its tools from the live OpenAPI schema: when the API changes, the tools change with it. There are no definitions left to maintain.',
      highlights: [
        'A custom authentication middleware using identity and key headers, validated end to end with MCP Inspector.',
        'Custom OpenAPI extensions (<code>x-plan-required</code>), tags and preprocessing hooks, so one codebase emits different documentation per audience and per subscribed plan.',
        'I migrated the external API to v2.',
        'Fixed IDORs in the configuration.',
        'Clients rotated resources to dodge their plan limit; a freed slot is now locked for a week.',
        'Integrated an external content-certification service: evidence of a phishing site gets timestamped and signed so it holds up in a legal claim.',
        'I documented the business rules as a structured knowledge base — entities, flows, ADRs and API references — built to be consumed by an agent.',
      ],
    },

    'health-scheduling': {
      title: 'Medical scheduling platform with video consultations',
      context: 'Work for a digital health platform, through Pabex',
      period: 'February 2021 – March 2023',
      lead: 'An appointment system with video consultations, for remote visits between clinicians and patients.',
      problem:
        'A platform already in production, with people being seen that same day. Anything I shipped had to land without breaking the appointment flow that already worked.',
      approach:
        'For two years I maintained the platform and kept adding functionality around the appointment flow and around the live consultation experience.',
      highlights: [
        'I extended the consultation flow, which was built on WebRTC video calls, integrating new functionality around the live session.',
        'Async processing with Celery for reminders and for everything that did not belong inside the request.',
        'A domain with sensitive health data: access control and traceability were entry requirements, not an afterthought.',
        'Feature work on a live system with real users, without breaking what already worked.',
      ],
    },

    'discord-audio': {
      title: 'Browser-to-Discord audio streaming bot',
      context: 'Personal project',
      period: 'in production',
      lead: 'A Chrome extension plus a Node.js pipeline that captures a browser tab’s audio and streams it into a Discord voice channel over WebSocket.',
      problem:
        'Discord gives you no way to push a tab’s audio into a voice channel without tying up someone’s session. I wanted the audio to join on its own, as another member of the channel.',
      approach:
        'Two services under Docker Compose: a WebSocket service that receives WebM/Opus chunks from the browser, and an HTTP service handling Discord OAuth and a metrics endpoint.',
      highlights: [
        'Deployed on ARM64 on my own VPS, exposed through subdomains behind nginx.',
        'Its own terms of use and privacy policy, because it processes third-party audio.',
      ],
    },

    'oracle-infra': {
      title: 'Personal infrastructure on Oracle Cloud',
      context: 'Personal project',
      period: 'ongoing',
      lead: 'An ARM server with 4 OCPUs and 24 GB of RAM that I run end to end. Everything I publish runs here.',
      problem:
        'Leaning on a PaaS for every experiment means never learning what happens underneath, and having no room to move when something breaks outside the application.',
      approach:
        'I stood up and maintain the whole box: nginx serving several sites, services in Docker, a modded game server, my own DNS on Cloudflare, and hardened access.',
      highlights: [
        'nginx as a reverse proxy for several sites and subdomains, with TLS.',
        'Containerised services under Docker Compose.',
        'DNS managed on Cloudflare.',
        'Hardened access and a minimal exposed surface.',
      ],
    },
  },

  experience: {
    role: 'Fullstack Developer',
    period: 'February 2021 – present',
    clients: {
      'saas-b2b': {
        name: 'B2B SaaS',
        period: 'March 2023 – present',
        text: 'Django REST Framework backend, API design and AI tooling.',
      },
      health: {
        name: 'Digital health platform',
        period: 'February 2021 – March 2023',
        text: 'Maintenance and feature work on a medical scheduling system with video consultations.',
      },
    },
    teamworkTitle: 'Working on a team',
    teamwork: [
      'I review PRs for edge cases: fixes that do not fix, that break something else, or that leak sensitive data through debug logs — QA misses that last one, because the feature works.',
      'Fixed an integrity bug between the view and the export: values were truncated in the UI but had to come out complete in CSV and PDF.',
      'Tasks arrive defined by product; when something does not add up I raise it, with a proposal, in the channel devs and product share — before implementing.',
      'When the team moved from Scrum to Kanban, I went through the flow the tech lead proposed and fed back changes to it.',
    ],
  },

  skills: {
    backend: 'Backend',
    ai: 'Applied AI',
    infra: 'Infrastructure',
    frontend: 'Frontend',
    payments: 'Payments',
    practices: 'Practices',
  },

  education: {
    degree: 'BSc in Computer Science',
    note: 'Coursework completed through fourth year',
    certTitle: 'Mercado Pago integration certification — Checkout Pro',
    certDate: 'August 2022',
    certPending: 'Verifiable credential not linked yet',
    certVerify: 'View credential',
    languagesTitle: 'Languages',
    languages: ['Spanish, native', 'English, technical reading and writing; basic spoken'],
  },

  contact: {
    title: 'Let’s talk',
    /* Two pieces, not one sentence: `seeking` is the fit filter and travels to
       the top in variants that treat it as another field of the spec; `lead` is
       the close and stays at the bottom. Variants that do not split show both
       together and read as before. */
    seekingLabel: 'Looking for',
    seeking: 'Senior backend, fullstack or AI engineering roles — remote',
    lead: 'If you are evaluating someone for a role like that, write to me and I will reply.',
    emailLabel: 'Email',
    linkedinLabel: 'LinkedIn',
    githubLabel: 'GitHub',
    cvLabel: 'CV as PDF',
  },

  footer: {
    /* With no `colophon` the footer goes straight to the copyright line: the
       three templates skip the paragraph when there is no text. */
    rights: 'All rights reserved.',
  },
};
