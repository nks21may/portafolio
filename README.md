# Portfolio — Nicolás D'Alessandro

Sitio estático, español e inglés, tema claro y oscuro. Ficha técnica: abre como
una especificación y todo es fila etiqueta/valor. Schibsted Grotesk + IBM Plex
Mono. Lighthouse en 100 de accesibilidad, SEO y buenas prácticas.

**El contenido se escribe una sola vez y los dos idiomas lo comparten**: si una
página muestra un dato distinto a la otra, es un bug, no una decisión de diseño.

## Uso

```bash
node build.mjs              # construye el sitio en dist/
node serve.mjs              # lo sirve en http://localhost:4003/
node scripts/check.mjs      # verifica la salida (sale con 1 si algo falla)
```

El inglés queda en `/en/`.

Hace falta un servidor (no alcanza con abrir el `index.html`): las páginas
referencian `/assets/…` y `/en/` con rutas absolutas, igual que en producción.

Cero dependencias: sólo Node. No hay `npm install`.

## Editar el contenido

Todo el texto vive en `content/`. **Nunca hace falta tocar una plantilla para
cambiar un proyecto.**

- `content/shared.js` — lo que no se traduce: identidad, links, fechas, stacks,
  ids de proyecto, el fragmento de código que ilustra un proyecto, y las
  banderas de archivos provisorios. Las dos excepciones son las habilidades que
  no son un nombre propio y los comentarios del fragmento: van como
  `{ es, en }`, y el build falla si falta un idioma.
- `content/es.js` y `content/en.js` — el copy de cada idioma. Los ids de
  proyecto, habilidad y cliente tienen que coincidir con `shared.js`; si falta
  uno, el build lo dice con nombre y apellido en vez de renderizar un hueco.

Después de editar: `node build.mjs`.

## Qué hace cada pieza

```
content/            fuente única de contenido
lib/
  model.mjs         cruza shared + idioma y arma el modelo que consume la página
  head.mjs          SEO, hreflang, Open Graph, JSON-LD y la CSP
  contrast.mjs      chequeo WCAG en tiempo de build
  fonts.mjs         baja los woff2 de Google una vez y los deja self-hosted
  theme.mjs         el único JavaScript del sitio: el conmutador de tema
  nginx.mjs         genera el nginx.conf con los hashes del CSS y del JS
  og.mjs            la tarjeta 1200×630 de Open Graph
  pycode.mjs        resaltado del fragmento de Python
  icons.mjs         los cuatro iconos, dibujados
site/
  tokens.mjs        paleta clara y oscura + pares de contraste + tipografías
  styles.css        la hoja, escrita contra var(--token)
  page.mjs          renderBody(model) -> el interior de <body>
assets/brand/       favicon, apple-touch-icon y un CV en PDF por idioma
assets/og/          las dos tarjetas de Open Graph, ya renderizadas
assets/fonts/       los woff2 self-hosted (los baja el build la primera vez)
scripts/            generadores puntuales (páginas de OG) y el chequeo del build
dist/               el sitio publicable (no se versiona: lo hace el build)
deploy/nginx.conf   la config del nginx de la imagen, generada
```

### Decisiones que conviene no deshacer sin querer

- **El build falla si el contraste baja de 4.5:1** (3:1 para el anillo de foco),
  en los dos temas. Está en `lib/contrast.mjs` y los pares los declara
  `site/tokens.mjs`. Es lo que evita que "accesible" se degrade en silencio la
  próxima vez que alguien retoque un color.
- **Ningún `style=""` en el markup generado.** La CSP va con hash del `<style>`
  inline; un estilo inline obligaría a `'unsafe-hashes'` y tiraría abajo la
  política entera.
- **Ningún hex suelto en el `.css`.** Los colores salen de `tokens.mjs`, que es
  lo que el chequeo de contraste puede medir.
- **El sitio no pide nada a terceros.** Las tipografías se sirven desde el
  propio dominio; no hay CDN, ni Google Fonts en runtime, ni analítica propia.
  Lo único externo lo agrega Cloudflare en el borde, y está declarado en
  `content/shared.js` bajo `cloudflare` — ver más abajo.
- **El CSS y el JS van inline.** Son páginas únicas: un archivo aparte sería un
  round-trip extra sin beneficio de caché real.
- **Español en `/`, inglés en `/en/`, prerenderizados.** El conmutador es un
  `<a>` común: funciona sin JavaScript y es indexable.
- **El inglés no es traducción literal.** Si tocás `es.js`, revisá `en.js` a
  mano; no lo pases por un traductor.
- **Finales de línea LF, fijados en `.gitattributes`.** El hash de la CSP se
  calcula sobre el CSS tal como está en el disco: si el working tree cambia de
  CRLF a LF según el sistema, el hash cambia con él. Además el CV en PDF es
  ASCII plano y git lo tomaría por texto, corriendo los offsets de su `xref`.

## Desplegar

Con un push a `main`. La CI (`.github/workflows/publish.yml`) construye la
imagen y la publica en GHCR como `ghcr.io/nks21may/portafolio`. La VPS la baja
sola con su timer de deploy, y si la nueva no queda healthy vuelve a la
anterior. Qué corre ahí, y cómo, se decide en el repo infra.

La imagen se arma en dos etapas (`Dockerfile`). Primero `node build.mjs` y
`node scripts/check.mjs`: si el build o el verificador fallan, el build de la
imagen falla y no se publica nada. Después, un nginx sin root
(`nginx-unprivileged`, en el 8080) con `dist/` y el `nginx.conf` generado.

Para probar la imagen en local:

```bash
docker build -t portafolio . && docker run --rm -p 127.0.0.1:8080:8080 portafolio
curl -sI -H 'Host: nicolasdalessandro.dev' http://127.0.0.1:8080/
```

El `nginx.conf` se **genera** en cada build porque la CSP lleva los hashes del
CSS y del JS. Editarlo a mano lo desincroniza en el primer cambio de estilo y
rompe la página en producción, no en desarrollo.

Antes había un `deploy.sh` que construía en la VPS y publicaba en el nginx del
host. Desde que el sitio es un contenedor (repo infra, I22), ese camino no
existe.

### Va detrás de Cloudflare Tunnel

El VPS no expone puertos: `cloudflared`, en el host, entra por el puerto de
loopback que le asigna el repo infra, que el contenedor publica sólo en
`127.0.0.1`. El TLS lo termina Cloudflare en su borde. De ahí tres cosas que el
conf generado resuelve y que conviene no "arreglar" de vuelta:

- **Nada de 443 ni de certbot.** El origen no ve una conexión TLS nunca, y
  certbot no podría validar por HTTP-01 con los puertos cerrados.
- **Ningún redirect de http a https de este mismo host.** Ese 301 vuelve al
  borde, que vuelve a entrar por el túnel: bucle, y el navegador lo corta con
  `ERR_TOO_MANY_REDIRECTS`. El redirect de `www` al apex sí es seguro, porque
  cambia de host.
- **`absolute_redirect off`.** Si no, nginx completa cada `Location` con
  `$scheme`, que acá vale `http`, y manda de vuelta al borde por un salto de
  más — sin "Always Use HTTPS", directamente deja al visitante en http.

### Cloudflare reescribe el HTML, y la CSP tiene que saberlo

Tres funciones de Cloudflare modifican la página **después** de que salió de
nginx, y cada una agrega un script que la CSP bloquearía. Están declaradas en
`content/shared.js`, en `cloudflare`, y de ahí salen los orígenes que se suman
a la política:

| función | qué agrega | qué se abre |
|---|---|---|
| Email Address Obfuscation | `/cdn-cgi/scripts/…/email-decode.min.js` | `script-src https://<dominio>/cdn-cgi/scripts/` |
| Browser Insights | `static.cloudflareinsights.com/beacon.min.js` | `script-src` ese host + `connect-src https://cloudflareinsights.com` |
| JavaScript Detections | un script inline, y desde ahí `/cdn-cgi/challenge-platform/…` | un nonce por request + `script-src https://<dominio>/cdn-cgi/challenge-platform/` |

JavaScript Detections no se puede apagar mientras esté Bot Fight Mode, que es
lo que trae el plan gratis. Su script inline lleva el ray id de cada request,
así que ningún hash lo cubre: lo que funciona es el nonce, que Cloudflare lee
del header y copia en el script que inyecta. nginx lo genera con
`$request_id`, y como el `<meta>` también tiene que conocerlo (el navegador
aplica las dos políticas), el HTML trae un marcador que un `sub_filter`
reemplaza por el mismo valor. `serve.mjs` hace lo mismo en local, y
`scripts/check.mjs` falla si el marcador y el `sub_filter` se separan.

**Ese objeto tiene que reflejar lo que está activo en el panel.** Si apagás una
allá y no acá, la CSP queda más abierta de lo necesario; al revés, la función
se rompe en silencio y sólo se ve en la consola del navegador.

El primer origen va con path y no con `'self'` a propósito: `'self'` habilitaría
cualquier script del dominio, y el prefijo habilita sólo lo que cuelga de
`/cdn-cgi/scripts/`. Verificado en Chrome: un script bajo ese path se ejecuta y
uno del mismo origen fuera de él queda bloqueado.

Con la ofuscación de email activa hay algo que conviene mirar de vez en cuando:
Cloudflare reescribe los `mailto:`, y el email también aparece dentro del
JSON-LD, que va hasheado en la CSP. Hoy Cloudflare no toca el contenido de los
`<script>`, así que el hash sigue valiendo. Si algún día lo hiciera, el JSON-LD
quedaría bloqueado y se vería en la consola como un `Refused to execute inline
script`. Se comprueba desde fuera del servidor, que es donde interviene el
borde:

```bash
curl -s https://nicolasdalessandro.dev/ | grep -c email-protection   # >0: está activa
```

El `Cache-Control` sale de un `map` y no de un `add_header` por location a
propósito: nginx **no hereda** `add_header` hacia un nivel que declara el suyo,
así que un `add_header Cache-Control` dentro de un `location` deja esas
respuestas sin CSP y sin HSTS. Con el map, las cabeceras se declaran una sola
vez en el `server` y ningún location las toca.

Para verificar después de recargar, desde el propio servidor:

```bash
curl -sI -H 'Host: nicolasdalessandro.dev' http://127.0.0.1/ | grep -i -e content-security -e strict-transport -e cache-control
curl -sI -H 'Host: www.nicolasdalessandro.dev' http://127.0.0.1/   # 301 al apex
curl -sI -H 'Host: nicolasdalessandro.dev' http://127.0.0.1/en     # 301 a /en/, relativo
```

## Pendientes reales

Ninguno de estos inventa datos: el sitio dice la verdad mientras estén abiertos.

- **Credencial de la certificación de Mercado Pago.** Mientras
  `certification.url` sea `null`, se muestra como texto plano y el sitio aclara
  que la credencial verificable está pendiente. Pegá la URL y aparece el link
  solo.
- **Imágenes de Open Graph.** Están generadas (`assets/og/`). Si cambiás el
  titular o la paleta, hay que rehacerlas: `node build.mjs`,
  `node scripts/make-og.mjs`, capturar `/_og-es.html` y `/_og-en.html` a
  1200×630, guardarlas en `assets/og/og-<idioma>.png`, y `node build.mjs` otra
  vez.
