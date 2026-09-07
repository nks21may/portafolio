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
- **Cero requests externos.** Las tipografías se sirven desde el propio dominio;
  no hay CDN, ni Google Fonts en runtime, ni analítica. Por eso la CSP puede ser
  `default-src 'none'` de verdad.
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

`dist/` es autocontenida: se sube esa carpeta y nada más.

```bash
node build.mjs && node scripts/check.mjs
rsync -av --delete dist/ servidor:/var/www/nicolasdalessandro.dev/
sudo cp deploy/nginx.conf /etc/nginx/sites-available/nicolasdalessandro.dev
sudo nginx -t && sudo systemctl reload nginx
```

El `nginx.conf` se **genera** en cada build porque la CSP lleva los hashes del
CSS y del JS. Editarlo a mano lo desincroniza en el primer cambio de estilo y
rompe la página en producción, no en desarrollo.

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
