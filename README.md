# Portfolio — Nicolás D'Alessandro

Tres implementaciones completas del mismo portfolio, para comparar terminadas y
elegir una. **El contenido se escribe una sola vez y las tres lo comparten**: si
una muestra un dato distinto a las otras, es un bug, no una decisión de diseño.

| Variante | Carácter | Tipografías | Modo nativo |
|---|---|---|---|
| `b-terminal` | Terminal densa. Rail fijo, prompts, tablas. | JetBrains Mono + Public Sans | oscuro |
| `a-editorial` | Editorial técnica. Rejilla asimétrica, serif de display. | Instrument Serif + Instrument Sans + IBM Plex Mono | claro |
| `d-ficha` | Ficha técnica. Abre como especificación, todo filas etiqueta/valor. | Schibsted Grotesk + IBM Plex Mono | claro |

Las tres tienen las mismas secciones, español e inglés, tema claro y oscuro,
y Lighthouse en 100 de accesibilidad, SEO y buenas prácticas.

## Uso

```bash
node build.mjs              # construye las tres en dist/
node build.mjs b-terminal   # una sola
node serve.mjs              # las sirve para compararlas
```

- `b-terminal` → http://localhost:4001/
- `a-editorial` → http://localhost:4002/
- `d-ficha` → http://localhost:4003/

Cada una con su inglés en `/en/`.

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
  model.mjs         cruza shared + idioma y arma el modelo que consumen las tres
  head.mjs          SEO, hreflang, Open Graph, JSON-LD y la CSP
  contrast.mjs      chequeo WCAG en tiempo de build
  fonts.mjs         baja los woff2 de Google una vez y los deja self-hosted
  theme.mjs         el único JavaScript del sitio: el conmutador de tema
  nginx.mjs         genera el nginx.conf con los hashes de cada variante
  og.mjs            la tarjeta 1200×630 de Open Graph
  pycode.mjs        resaltado del fragmento de Python
  icons.mjs         los cuatro iconos, dibujados
sites/<variante>/
  tokens.mjs        paleta clara y oscura + pares de contraste + tipografías
  styles.css        la hoja, escrita contra var(--token)
  page.mjs          renderBody(model) -> el interior de <body>
scripts/            generadores puntuales (CV provisorio, páginas de OG)
design/canvas/      los bocetos de dirección visual, archivados
dist/<variante>/    el sitio publicable
deploy/             un nginx.conf por variante, generado
```

### Decisiones que conviene no deshacer sin querer

- **El build falla si el contraste baja de 4.5:1** (3:1 para el anillo de foco),
  en los dos temas. Está en `lib/contrast.mjs` y los pares los declara cada
  variante en su `tokens.mjs`. Es lo que evita que "accesible" se degrade en
  silencio la próxima vez que alguien retoque un color.
- **Ningún `style=""` en el markup generado.** La CSP va con hash del `<style>`
  inline; un estilo inline obligaría a `'unsafe-hashes'` y tiraría abajo la
  política entera.
- **Ningún hex suelto en los `.css`.** Los colores salen de `tokens.mjs`, que es
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

## Desplegar

Cada `dist/<variante>/` es autocontenida: se sube esa carpeta y nada más.

```bash
rsync -av --delete dist/b-terminal/ servidor:/var/www/nicolasdalessandro.dev/
sudo cp deploy/b-terminal-nginx.conf /etc/nginx/sites-available/nicolasdalessandro.dev
sudo ln -s /etc/nginx/sites-available/nicolasdalessandro.dev /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

El `nginx.conf` se **genera** en cada build porque la CSP lleva los hashes del
CSS y del JS de esa variante. Editarlo a mano lo desincroniza en el primer
cambio de estilo y rompe la página en producción, no en desarrollo.

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
  1200×630, guardarlas en `assets/og/<variante>-<idioma>.png`, y `node build.mjs`
  otra vez.
