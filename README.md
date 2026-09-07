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
  banderas de archivos provisorios.
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
scripts/            generadores puntuales (CV provisorio, páginas de OG)
dist/               el sitio publicable (no se versiona: lo hace el build)
deploy/nginx.conf   la config del servidor, generada
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

**En el servidor**, desde el clon del repo:

```bash
git pull && sh deploy.sh
```

Construye, corre el verificador, publica `dist/` en `/var/www/<dominio>` e
instala el `nginx.conf` generado. Si el build o el check fallan, no toca nada.

Pide `sudo` sólo para escribir en `/var/www` y `/etc/nginx` y para recargar.
El build corre con tu usuario a propósito: con `sudo` dejaría `dist/` y
`assets/fonts/` como root adentro del repo, y el próximo `git pull` o el
próximo build sin `sudo` fallarían por permisos.

El contenido se copia al lado y recién ahí se cambia de lugar: el `mv` de un
directorio dentro del mismo filesystem es atómico, así que nadie ve el sitio a
medio copiar y el anterior queda entero en `/var/www/<dominio>.anterior`. El
vhost se guarda con fecha antes de pisarlo, y si `nginx -t` rechaza la
configuración nueva se restaura la anterior **sin recargar** — un conf malo no
llega a estar activo. Al final comprueba cinco rutas contra `127.0.0.1`, que es
por donde entra el túnel, y si alguna falla imprime los comandos para volver
atrás.

Hace falta `node` en el servidor: `dist/` no se versiona, el HTML se genera ahí.

Configurable por entorno: `DOMINIO=otro.dev sh deploy.sh`.

A mano, si hiciera falta:

```bash
node build.mjs && node scripts/check.mjs
sudo cp -a dist/. /var/www/nicolasdalessandro.dev/
sudo cp deploy/nginx.conf /etc/nginx/sites-available/nicolasdalessandro.dev
sudo ln -s /etc/nginx/sites-available/nicolasdalessandro.dev /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

El `nginx.conf` se **genera** en cada build porque la CSP lleva los hashes del
CSS y del JS. Editarlo a mano lo desincroniza en el primer cambio de estilo y
rompe la página en producción, no en desarrollo.

### Va detrás de Cloudflare Tunnel

El VPS no expone puertos: `cloudflared` entra por `http://127.0.0.1:80` y el
TLS lo termina Cloudflare en su borde. De ahí tres cosas que el conf generado
resuelve y que conviene no "arreglar" de vuelta:

- **Nada de 443 ni de certbot.** El origen no ve una conexión TLS nunca, y
  certbot no podría validar por HTTP-01 con los puertos cerrados.
- **Ningún redirect de 80 a https de este mismo host.** Ese 301 vuelve al
  borde, que vuelve a entrar por el túnel al puerto 80: bucle, y el navegador
  lo corta con `ERR_TOO_MANY_REDIRECTS`. El redirect de `www` al apex sí es
  seguro, porque cambia de host.
- **`absolute_redirect off`.** Si no, nginx completa cada `Location` con
  `$scheme`, que acá vale `http`, y manda de vuelta al borde por un salto de
  más — sin "Always Use HTTPS", directamente deja al visitante en http.
- **`listen 127.0.0.1:80`**, no `listen 80`. El único que tiene que llegar es
  cloudflared. Ojo si algún día agregás otro vhost: mezclar `listen 80` con
  `listen 127.0.0.1:80` hace que nginx intente bindear `0.0.0.0:80` y
  `127.0.0.1:80` a la vez y no arranque. Todos en loopback, o ninguno.

### Cloudflare reescribe el HTML, y la CSP tiene que saberlo

Dos funciones del panel modifican la página **después** de que salió de nginx,
y cada una agrega un script que la CSP bloquearía. Están declaradas en
`content/shared.js`, en `cloudflare`, y de ahí salen los orígenes que se suman
a la política:

| función | qué agrega | qué se abre |
|---|---|---|
| Email Address Obfuscation | `/cdn-cgi/scripts/…/email-decode.min.js` | `script-src https://<dominio>/cdn-cgi/scripts/` |
| Browser Insights | `static.cloudflareinsights.com/beacon.min.js` | `script-src` ese host + `connect-src https://cloudflareinsights.com` |

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

- **CV en PDF.** `assets/brand/cv-nicolas-dalessandro.pdf` es un archivo
  provisorio que dice, en su primera línea, que no es el CV. Reemplazalo, poné
  `pending.cv` en `false` (`content/shared.js`) y desaparecen los avisos del
  sitio. Para regenerar el provisorio: `node scripts/make-cv-placeholder.mjs`.
- **Credencial de la certificación de Mercado Pago.** Mientras
  `certification.url` sea `null`, se muestra como texto plano y el sitio aclara
  que la credencial verificable está pendiente. Pegá la URL y aparece el link
  solo.
- **Imágenes de Open Graph.** Están generadas (`assets/og/`). Si cambiás el
  titular o la paleta, hay que rehacerlas: `node build.mjs`,
  `node scripts/make-og.mjs`, capturar `/_og-es.html` y `/_og-en.html` a
  1200×630, guardarlas en `assets/og/og-<idioma>.png`, y `node build.mjs` otra
  vez.
