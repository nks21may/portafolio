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
    measureMetric: 'Metric',
    measureBefore: 'Before',
    measureAfter: 'After',
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
        text: 'Linux, Docker and nginx on servers I run myself, with deploys, secrets, monitoring and backups all described in code.',
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
      intro: 'Eight systems. What each one solved, what I decided, and what it runs on.',
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
        'Since 2023 on that backend: the migration of the API to v2, access control, and product features. Plus a self-adapting MCP server that generates its tools from the live OpenAPI schema: when the API changes, the tools change with it. There are no definitions left to maintain.',
      highlights: [
        'A custom authentication middleware using identity and key headers, validated end to end with MCP Inspector.',
        'Custom OpenAPI extensions (<code>x-plan-required</code>), tags and preprocessing hooks, so one codebase emits different documentation per audience and per subscribed plan.',
        'I migrated the external API to v2.',
        'Fixed IDORs in the configuration.',
        'Clients rotated resources to dodge their plan limit; a freed slot is now locked for a week.',
        'Integrated an external content-certification service: evidence of a phishing site gets timestamped and signed so it holds up in a legal claim.',
        'I documented the business rules as a structured knowledge base — entities, flows, ADRs and API references — built to be consumed by an agent.',
        'I built the Claude Code plugin the team works with: ten skills that take a ClickUp task end to end (plan, front and back end in parallel, a review before every push, and the PRs), with each sub-agent’s model picked by its role and how hard its part is.',
      ],
    },

    neonduel: {
      title: 'NEONDUEL: a 1v1 shooter with an authoritative server',
      context: 'Personal project',
      period: 'in production',
      lead: 'A 3D shooter that runs in the browser, with Counter-Strike movement and a server that is the only source of truth: the client decides which keys it presses, and nothing else.',
      problem:
        'A networked duel has to feel instant to whoever is playing and be fair to both of them. If the client waits on the server to move, every step costs a round trip; if the server trusts the client, cheating is a matter of sending a different number.',
      approach:
        'The simulation lives in a shared package: client and server run exactly the same code on the same data. The client predicts its own movement and reconciles it against the server, draws the opponent 100 ms in the past, and to resolve each shot the server rewinds the world to the moment the shooter was looking at.',
      highlights: [
        'Latency is measured by the server, not declared by the client. It keeps the minimum of a one-second window, so inflating it right as you fire means sustaining the lie for the whole window — and the rewind never goes past 200 ms.',
        'Delta snapshots: only what changed since the previous one goes over the wire, and once a second a full one goes out so any drift heals on its own, for 1.6% of the traffic.',
        'The server validates every message before it touches the physics — rejecting <code>NaN</code>, inflated <code>dt</code> and replayed sequences — and processes at most eight commands per tick, so catching up never turns into running faster.',
        'Dropping is not leaving: the server holds the player’s slot for ten seconds, and an opaque ticket brings back the same player, with their health and position, into the round in progress.',
        '486 tests over a simulation that never reads the clock, so a full match runs in milliseconds. One boots the real server and talks to it over WebSocket the way a browser would; another checks the map is symmetric piece by piece, which in a 1v1 is a fairness requirement.',
      ],
      urlLabel: 'Play NEONDUEL',
      measure: {
        caption:
          'Delta snapshots, before and after. Measured against the real server: twelve seconds of a match against the bot.',
        rows: { snapshot: 'Per snapshot', traffic: 'Server traffic' },
      },
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
        'Runs on ARM64 on my VPS as one more image in the infrastructure repo, and reaches the internet through Cloudflare Tunnel, with no open ports.',
        'A mutiny: after ten minutes on air, anyone in the room can call a vote to take the mic from whoever will not let go of it. A strict majority wins, with 60 seconds to vote and a cooldown if it fails, and when it passes the bot plays a horn in the channel.',
        'A <code>/healthz</code> that says whether the bot is still connected to Discord, not just whether the process answers: the container healthcheck reads it, and a deploy does not count a version as good until it passes.',
        'Closed a reflected XSS on the OAuth success page, since <code>JSON.stringify</code> does not escape <code></script></code>, and capped the demuxer: one WebM block declaring 8 GiB held 312 MiB and stalled for 3 seconds the single event loop that serves every server.',
        'Its own terms of use and privacy policy, because it processes third-party audio.',
      ],
    },

    'oracle-infra': {
      title: 'Infrastructure as code for my Oracle Cloud VPS',
      context: 'Personal project',
      period: 'ongoing',
      lead: 'An ARM server with 4 OCPUs and 24 GB, out of Oracle’s free tier, where everything I publish runs. Whatever runs there comes from a repo: anything that is not in git is drift, and a tool catches it.',
      problem:
        'The server had grown by hand. When I surveyed it, the automatic deploys of two apps had been failing dozens of times a day for a month without anyone noticing, secrets sat in unencrypted .env files, two apps were built by hand on the VPS, and one published its port on 0.0.0.0, around the firewall.',
      approach:
        'One repo as the source of truth: each service’s compose file, secrets encrypted with sops and age, the tunnel, the host in Ansible, and the Oracle and Cloudflare accounts in OpenTofu. Apps only publish their image to GHCR; the VPS pulls main every two minutes, never backwards, and applies whatever changed.',
      highlights: [
        'Every deploy records the digest that is running, recreates the container and waits for it to turn healthy. If it does not, it rolls back to the previous one on its own and reports to Discord.',
        'Apps open no ports: every subdomain comes in through Cloudflare Tunnel, SSH goes through Cloudflare Access, and secrets are decrypted into a tmpfs right before each stack comes up.',
        'Prometheus, Loki and Grafana, with alerts to Discord. If an alert fails to arrive, or the whole VPS goes down, a dead man’s switch on healthchecks.io sends an email.',
        'Daily restic backups to Cloudflare R2, on a different provider on purpose: a problem with the Oracle account cannot take the server and the backups down together.',
        'Zero cost as a rule, with an alert on any spend at all, and new third-party versions only go in after a week out, unless they fix a critical CVE that is already being exploited.',
        '26 ADRs, a security audit and 377 tests that run in Docker. An agent built it, iterating in TDD on its own branch: I am the one who moves <code>main</code>, and the agent is denied pushing to it.',
      ],
    },

    'surf-bhop': {
      title: 'Surf & Bhop Daily: daily races with anti-cheat by re-simulation',
      context: 'Personal project',
      period: 'in production',
      lead: 'A surf and bunnyhop game with Counter-Strike physics, in the browser and as an Activity inside Discord. Every day at 00:00 UTC the date generates a new track, the same one for everybody, and the leaderboard ranks by time.',
      problem:
        'A leaderboard played in the browser cannot take the client’s word for anything: from the console, anyone can report whatever time they like or turn up right at the finish line.',
      approach:
        'Every run travels with its inputs, recorded tick by tick. The server generates the day’s track from the same seed and runs the race again on the same physics engine the client uses: if the simulation does not reach the finish, or its time does not match the reported one, the run is rejected. A run without a recording still goes in, but as unverified.',
      highlights: [
        'Fixed-step physics at 128 ticks per second, shared by client and server: the re-simulation runs the same code that ran in the browser.',
        'Every track is checked against a geometric invariant as it is generated: no ramp may overlap another. A test sweeps it across 100 seeds.',
        'It also runs inside Discord through the Embedded App SDK: the same app notices it is in the Activity’s iframe and signs in with the Discord account, with no second login.',
        'Live multiplayer over WebSocket: the rest of the room shows up as ghosts with their Discord avatars, with a room scoreboard and a heads-up when a friend finishes.',
        'An endless mode that chains procedural sections forever, with its own leaderboard and a ghost of your personal best to race alongside.',
        'A security review found the server accepted an unsigned session as if it came from Discord. Sessions and guests are signed now, and 246 tests include impersonation attempts: a guest cannot race under a registered user’s name or overwrite someone else’s record.',
      ],
      urlLabel: 'Play Surf & Bhop Daily',
    },

    museo: {
      title: 'Museo: a TV set of live shaders',
      context: 'Personal project',
      period: 'in production',
      lead: 'A collection of 25 fragment shaders that run live in the browser instead of being recorded. You browse it like a TV: every piece is a channel, with a programme guide and a teletext page holding its notes and its code.',
      problem:
        'Tweet-sized shaders are published in twigl’s dialect, which hands out uniforms and functions that GLSL does not have. Outside twigl they do not compile, and a recording loses the very thing that makes them interesting: that they run live.',
      approach:
        'Each piece is stored exactly as it was published, and the museum translates it on load: it prepends a prelude with what twigl gave for free, zero-initialises the variables GLSL makes no promises about, and draws it in WebGL2. No build and no dependencies: static files behind a rootless nginx.',
      highlights: [
        'The prelude adds extensions of its own: a piece can read a photo, the last click or tap, or the trail of a spark that follows the mouse.',
        'With HTML-in-Canvas, Chrome’s experimental API, the on-screen display and the teletext are painted inside the canvas through a CRT shader, and they are still HTML: you can select them, a screen reader reads them, and the buttons work. Without the API, the same HTML sits on top of the piece.',
        '23 of the 25 pieces are my own. Two Claude Code skills build a new piece from twigl code, an idea or a photo, and a Playwright checker opens it in Chrome on the GPU and fails if the shader does not compile or the page throws errors.',
        'A strict CSP with nothing inline, and a read-only container with no capabilities, listening only on loopback.',
      ],
      urlLabel: 'Visit the museum',
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
       the top, as another field of the spec; `lead` is the close and stays at
       the bottom. */
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
