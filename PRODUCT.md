# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dos lectores a dos velocidades, y la página tiene que servirles a los dos (confirmado):

- **Reclutador técnico.** Llega casi siempre por LinkedIn o por un link en un mail, muchas veces desde el teléfono, y filtra en unos 90 segundos: qué rol busca Nicolás, si encaja y cómo contactarlo.
- **Tech lead o hiring manager.** Llega después, con tiempo y en desktop, y lee las decisiones técnicas: qué problema había, qué se decidió y con qué pruebas.

El mercado principal es **Argentina y LatAm** (confirmado). El español es la puerta de entrada (`/`) y el inglés (`/en/`) está para quien lo necesite.

## Product Purpose

El sitio personal de Nicolás D'Alessandro, desarrollador fullstack con más de 5 años de experiencia, publicado en `nicolasdalessandro.dev`. Existe para conseguir **roles backend senior, fullstack o de AI engineering, remotos**.

El éxito es que la persona indicada escriba. El email es la acción principal y el CV en PDF, la secundaria.

## Positioning

"Construyo APIs en Django y la infraestructura de IA que las consume." Tres capas que rara vez cubre una sola persona: el backend (Django REST Framework, Go), la infraestructura donde corre (servidores propios, Docker, nginx, DNS) y la IA aplicada (servidores MCP que generan sus herramientas desde el schema OpenAPI vivo).

Los juegos personales (NEONDUEL, Surf & Bhop Daily) **no amplían el rubro** (confirmado). Se presentan como evidencia de backend (servidor autoritativo, netcode, anti-cheat por resimulación), no como búsqueda de roles de desarrollo de juegos.

## Operating Context

- El link se pega en LinkedIn y en mails; por eso hay una tarjeta de Open Graph por idioma.
- Se lee a dos velocidades: un escaneo de fit en el teléfono y una lectura técnica en desktop.
- Dos idiomas prerenderizados: español en `/`, inglés en `/en/`. El conmutador es un link común, funciona sin JavaScript.
- El contacto es por `mailto:`, con un CV descargable por idioma.

## Capabilities and Constraints

Decisiones documentadas en `README.md`, que el trabajo futuro tiene que respetar:

- Sitio estático y sin dependencias, sólo Node: `node build.mjs` genera `dist/`, `node serve.mjs` lo sirve en `:4003` y `node scripts/check.mjs` verifica la salida.
- El contenido se escribe una sola vez en `content/`: `shared.js` para lo que no se traduce (datos, links, fechas, stacks, cifras) y `es.js` / `en.js` para el copy. Un dato distinto entre idiomas es un bug, no una decisión.
- El inglés no es traducción literal del español: se escribe a mano.
- Nada de terceros: tipografías self-hosted, sin CDN ni analítica propia. Lo único externo lo agrega Cloudflare en el borde y está declarado en `content/shared.js`.
- CSP con hash del CSS y del JS inline: ningún atributo `style=""` en el markup. El `deploy/nginx.conf` se genera en cada build y viaja junto con el cambio de CSS que lo produjo.
- El único JavaScript del sitio es el conmutador de tema.
- Deploy en un VPS propio detrás de Cloudflare Tunnel, sin 443 ni certbot en el origen.

Pendiente, sin decidir:

- La certificación de Mercado Pago no tiene todavía una URL verificable. El sitio lo dice en vez de inventar el link.

## Brand Commitments

- Nombre: Nicolás D'Alessandro. Dominio `nicolasdalessandro.dev`, email `contacto@nicolasdalessandro.dev`, monograma "ND" en el favicon.
- Voz: primera persona, español rioplatense con voseo ("Escribime", "Pegá"), concreta y sin tono de marketing. Así está escrito todo el copy actual.
- Honestidad como regla: lo provisorio se declara (las banderas `pending` de `content/shared.js`) y nada se inventa. "El sitio dice la verdad mientras estén abiertos", según el README.

## Evidence on Hand

- **Siete proyectos** en `content/`, con datos verificados contra el código y los servicios:
  - Mirror de la CVE API del NVD, con repo público en `github.com/nks21may/cve-proxy`.
  - Plataforma SaaS B2B con capa MCP.
  - Turnero médico con videollamadas.
  - Bot de audio a Discord, en vivo en `audio.nicolasdalessandro.dev`.
  - Infraestructura propia en Oracle Cloud.
  - NEONDUEL, en vivo en `neonduel.nicolasdalessandro.dev`, con 486 tests y mediciones de tráfico antes y después.
  - Surf & Bhop Daily, en vivo en `surf.nicolasdalessandro.dev`, con 120 tests.
- **CV en PDF**, uno por idioma: `assets/brand/cv-nicolas-dalessandro-es.pdf` y `-en.pdf`.
- **Tarjetas de Open Graph** por idioma: `assets/og/`.
- **Una crítica de diseño previa**: `.impeccable/critique/2026-09-04T14-02-51Z__sites-d-ficha.md`.

Ausencias que no se deben fabricar:

- Testimonios, recomendaciones o métricas de negocio: no hay.
- Nombres de clientes: los trabajos hechos a través de Pabex aparecen anonimizados ("SaaS B2B", "plataforma de salud digital"). *Inferido del contenido, sin confirmar.*
- Título universitario: la Licenciatura en Ciencias de la Computación figura con la cursada completa hasta cuarto año, no como terminada.
- La URL de la credencial de Mercado Pago.
- Links a GitHub de NEONDUEL y Surf: los repos son privados.

## Product Principles

1. **Primero el fit, después la profundidad.** Lo que el reclutador necesita (qué rol busca, dónde, cómo contactarlo) se entiende en 90 segundos desde el teléfono. La profundidad técnica queda disponible para quien sigue leyendo.
2. **Todo verificable.** Cada afirmación se apoya en algo que se puede comprobar: un número medido, un sitio en vivo, un repo. Lo provisorio se declara.
3. **Una sola fuente de verdad, dos idiomas.** Los datos se escriben una vez. El español es la puerta principal y el inglés se escribe aparte, no se traduce.
4. **El backend como hilo.** Todo proyecto se presenta por lo que prueba del lado del servidor, la infraestructura o la IA aplicada, aunque sea un juego.
5. **Nada de terceros.** El sitio no pide nada fuera de su dominio salvo lo que Cloudflare agrega en el borde, y eso está declarado.

## Accessibility & Inclusion

- El build falla si el contraste baja de 4.5:1 (3:1 para el anillo de foco) en los dos temas: lo mide `lib/contrast.mjs` con los pares de `site/tokens.mjs`.
- Lighthouse en 100 de accesibilidad, según el README.
- `prefers-reduced-motion` respetado, link para saltar al contenido, foco visible y medidas en rem para que el layout aguante zoom al 200 %.
