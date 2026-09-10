---
name: "Nicolás D'Alessandro — Portfolio"
description: "Ficha técnica: blanco de papel, tinta casi negra y un rojo de registro."
colors:
  paper: "#FFFFFF"
  paper-2: "#FAFAFA"
  paper-3: "#F1F2F3"
  ink: "#101112"
  ink-2: "#4A4D52"
  ink-3: "#666A70"
  rule: "#C0C4C9"
  rule-strong: "#9EA3A9"
  accent: "#C62D19"
  accent-ink: "#FFFFFF"
  live: "#12703F"
  focus: "#C62D19"
  selection: "rgb(198 45 25 / 0.15)"
  paper-dark: "#0E0F11"
  paper-2-dark: "#15171A"
  paper-3-dark: "#1A1D21"
  ink-dark: "#EDEEF0"
  ink-2-dark: "#B0B5BB"
  ink-3-dark: "#868C93"
  rule-dark: "#383D44"
  rule-strong-dark: "#4E545C"
  accent-dark: "#FF6A50"
  accent-ink-dark: "#0E0F11"
  live-dark: "#4ADE80"
  focus-dark: "#FF6A50"
  selection-dark: "rgb(255 106 80 / 0.24)"
typography:
  display:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.3rem + 3.4vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.15rem + 1.1vw, 1.875rem)"
    fontWeight: 700
    lineHeight: 1.26
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.02rem + 0.5vw, 1.4375rem)"
    fontWeight: 700
    lineHeight: 1.26
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, Menlo, Consolas, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.12em"
  section-label:
    fontFamily: "IBM Plex Mono, ui-monospace, Menlo, Consolas, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.22
    letterSpacing: "0.14em"
  meta:
    fontFamily: "IBM Plex Mono, ui-monospace, Menlo, Consolas, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "IBM Plex Mono, ui-monospace, Menlo, Consolas, monospace"
    fontSize: "0.625rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  none: "0"
spacing:
  gutter-sm: "1.125rem"
  gutter-md: "2rem"
  gutter-lg: "3rem"
  stack: "0.875rem"
  row-y: "0.75rem"
  row-y-md: "0.875rem"
  project-y: "1.5rem"
  section-top: "2.25rem"
  section-top-md: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.none}"
    padding: "0 1.375rem"
    height: "2.875rem"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.accent-ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 1.375rem"
    height: "2.875rem"
  button-ghost-hover:
    backgroundColor: "{colors.paper-3}"
    textColor: "{colors.ink}"
  row-label:
    textColor: "{colors.ink-3}"
    typography: "{typography.label}"
  row-value:
    textColor: "{colors.ink-2}"
    typography: "{typography.body}"
  chip:
    backgroundColor: "{colors.paper-3}"
    textColor: "{colors.ink-2}"
    typography: "{typography.meta}"
    rounded: "{rounded.none}"
    padding: "0.1875rem 0.5rem"
  register-number:
    textColor: "{colors.accent}"
  register-number-active:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
  project-featured:
    backgroundColor: "{colors.paper-2}"
    padding: "1.5rem 1rem"
  code-block:
    backgroundColor: "{colors.paper-3}"
    padding: "0.9375rem 1rem"
  nav-link:
    textColor: "{colors.ink-2}"
    height: "2.5rem"
  nav-link-hover:
    textColor: "{colors.accent}"
  link:
    textColor: "{colors.accent}"
---

# Design System: Nicolás D'Alessandro — Portfolio

## Overview

**Creative North Star: "La Ficha Técnica"**

La página es una hoja de especificación impresa. Abre con una keyline roja en el filo superior, una cabecera con el nombre, y un bloque de filas (qué busca, email, ubicación) antes de la declaración. Después, casi todo el contenido es una fila de definición: una etiqueta a la izquierda y un valor a la derecha, separadas por una regla fina. Esa gramática es la que la vuelve escaneable en 90 segundos para quien filtra y legible con tiempo para quien evalúa.

El tono es sobrio, preciso y verificable. La precisión hace de ornamento: las cifras van en mono tabular, las fechas son `<time>` de verdad, cada dato provisorio se declara en vez de disimularse, y la única decoración es una marca de registro roja que señala dónde está lo importante. Los componentes son piezas de documento, no widgets. La profundidad es plana: la jerarquía la dan el peso de las reglas y tres tonos de papel, nunca una sombra.

El tema oscuro es la misma hoja en pizarra fría, no un dark cálido: el sitio tiene que leerse como documento impreso en los dos temas.

**Key Characteristics:**

- Blanco de papel, tinta casi negra y un único rojo de registro; en oscuro, pizarra fría.
- La fila etiqueta/valor como unidad de toda la página.
- Schibsted Grotesk para leer, IBM Plex Mono para etiquetar y medir.
- Plana: reglas de 1, 2 y 4 px y tres tonos de papel. Ni una sombra.
- Esquinas rectas; la única curva del sistema es el punto de "disponible".
- El contraste se mide en el build, en los dos temas, antes de publicar.

## Colors

Una hoja neutra y fría con un solo acento cálido que funciona como marca de registro, no como relleno.

Los tokens viven en `site/tokens.mjs` y el build los emite como variables CSS (`--paper`, `--ink`, `--accent`…) sobre `:root`, con el oscuro por `prefers-color-scheme` y por `data-theme` para que el conmutador gane en los dos sentidos. En el frontmatter, cada token claro tiene su par oscuro con el sufijo `-dark`.

### Primary

- **Rojo de registro** (`accent`; más claro en oscuro, `accent-dark`, para sostener el contraste sobre pizarra): la marca de la hoja. Es el filo de 4 px arriba y abajo de la página, los números de registro de cada proyecto y de cada capa, los links, las viñetas de las listas, la marca del rastro del puntero y el anillo de foco (`focus`, el mismo valor). Las únicas superficies rojas son el botón primario, el salto al contenido y el sello que aparece sobre el número de un proyecto al pasar el puntero. La selección de texto es el mismo rojo al 15 % (24 % en oscuro).
- **Tinta sobre rojo** (`accent-ink`): el texto del botón primario y del sello. Blanco en claro, pizarra en oscuro.

### Neutral

- **Blanco de papel** (`paper`) / **Pizarra fría** (`paper-dark`): el fondo de la hoja.
- **Papel alterno** (`paper-2`): el fondo del proyecto destacado, que es la única entrada con fondo propio.
- **Papel hundido** (`paper-3`): lo que va "adentro" de la hoja: chips de stack, el bloque de código, el código inline y el hover del botón fantasma.
- **Tinta casi negra** (`ink`): títulos, valores clave de fila, la regla bajo la cabecera y bajo la declaración, la regla gruesa de cada sección y el borde del botón fantasma.
- **Tinta de prosa** (`ink-2`): todo lo que se lee de corrido: valores de fila, leads, puntos destacados, la navegación en reposo.
- **Tinta de metadato** (`ink-3`): etiquetas de fila, fechas, contexto de proyecto, epígrafes y el "antes" de una medición.
- **Regla de fila** (`rule`): la línea de 1 px que ata etiqueta con valor.
- **Regla de corte** (`rule-strong`): la línea de 1 px entre un proyecto y el siguiente, un paso más fuerte que la de fila.

### Tertiary

- **Verde de disponible** (`live`): el estado "Disponible para remoto" con su punto, y las cadenas del resaltado de código. Es un color de estado, no un segundo acento de marca.

### Named Rules

**La regla del rojo de registro.** El rojo marca, no pinta. Aparece como filo, como signo (número, viñeta, marca, foco) y como link. Superficie roja sólo en el botón primario, el salto al contenido y el sello del número.

**La regla del contraste medido.** Ningún color entra al CSS sin pasar por `site/tokens.mjs`, y todo par de texto se declara en `checks`. El build falla por debajo de 4.5:1 en texto y 3:1 en el anillo de foco, en los dos temas; las reglas tienen piso propio (1.7:1 la de fila, 2.4:1 la de corte). Ningún hex suelto en `styles.css`.

**La regla de las tres tintas.** La jerarquía del texto se hace con `ink` (lo que hay que ver), `ink-2` (lo que se lee) e `ink-3` (lo que describe), no con tamaños nuevos.

## Typography

**Display Font:** Schibsted Grotesk (con `ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif`)
**Body Font:** Schibsted Grotesk, la misma cara variable de 400 a 700
**Label/Mono Font:** IBM Plex Mono 400 y 500 (con `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`)

**Character:** Una grotesca de periódico, compacta y seria, para todo lo que se lee; una mono de ingeniería para las columnas de etiqueta, los metadatos y las cifras. Es la mono la que le da a la página el aire de ficha. Las dos se sirven desde el propio dominio.

### Hierarchy

- **Display** (700, `clamp(2rem, 1.3rem + 3.4vw, 3.25rem)`, interlineado 1.08, tracking −0.04em): sólo el titular de la declaración. Desde 48rem cada renglón escrito en el contenido va en su propia línea.
- **Headline** (700, `clamp(1.375rem, 1.15rem + 1.1vw, 1.875rem)`, 1.26): el título del proyecto destacado. El empleador en Experiencia usa la misma voz a 1.375rem fijo con −0.03em.
- **Title** (700, `clamp(1.125rem, 1.02rem + 0.5vw, 1.4375rem)`, 1.26): el título de cada proyecto.
- **Lead** (400, `clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)`, 1.6, medida de 66ch): el párrafo bajo el titular y el cierre de Contacto.
- **Body** (400, 0.9375rem, 1.6; las listas a 1.55; medida de 68ch): valores de fila, leads de proyecto, puntos destacados. La base del documento es 1rem.
- **Label** (IBM Plex Mono 400, 0.6875rem, tracking 0.12em, mayúsculas): las etiquetas de fila y la cabecera de una tabla de medición.
- **Section label** (IBM Plex Mono 500, 0.6875rem, tracking 0.14em, mayúsculas, en `ink`): el título de cada sección, sobre su regla de 2 px. Es chico a propósito: es lo que vuelve la página una ficha.
- **Meta** (IBM Plex Mono 400, 0.6875rem): fechas, chips de stack, el metadato de una cabecera de sección. Los números de registro van a 0.75rem.
- **Caption** (IBM Plex Mono 400, 0.625rem): epígrafes de código y de medición, el copyright.

### Named Rules

**La regla de la mono como etiqueta.** IBM Plex Mono sólo para etiquetas, metadatos, cifras y código. Todo lo que se lee como prosa va en Schibsted. Cuando la etiqueta de una fila es un nombre propio (una institución, un cliente) deja de ser un campo: sale de la mono y pasa a Schibsted 700 a 0.9375rem en `ink`.

**La regla del piso.** Nada baja de 0.625rem, y ese tamaño es sólo mono: epígrafes, copyright y el subtítulo de Trabajo de equipo. Las etiquetas de fila no bajan de 0.6875rem.

## Layout

Mobile primero, con cortes en rem para que el zoom al 200 % desarme la tabla en pila en vez de romperla.

- **Hoja:** columna centrada de 74rem como máximo, con márgenes de 1.125rem en el teléfono, 2rem desde 48rem y 3rem desde 60rem. Cabecera, contenido y pie comparten la misma columna.
- **La fila:** hasta 48rem apila (etiqueta arriba, valor abajo, 0.75rem de aire vertical). Desde 48rem es una tabla de dos columnas de verdad: 11rem para la etiqueta y 1.5rem de separación; desde 60rem, 13rem y 2rem. Las filas numeradas suman una columna de 2.25rem–2.5rem para el número.
- **Ritmo:** cada sección abre con 2.25rem de aire (3rem desde 48rem) y su cabecera; cada proyecto tiene 1.5rem arriba y abajo, y adentro sus piezas se separan 0.875rem.
- **Medidas de lectura:** 66ch el lead, 68ch los leads de proyecto y las listas, 52ch el cierre. Una tabla de medición se topa en 32rem para que la cifra no quede a media pantalla de su etiqueta.
- **Cabecera:** en el teléfono, el nombre y las acciones (idioma, tema) en una fila y la navegación en otra, a lo ancho y con scroll horizontal. Desde 60rem la navegación entra en la fila del nombre.

### Named Rules

**La regla de la fila.** Todo dato nuevo entra como fila etiqueta/valor. Si no se puede escribir como etiqueta y valor, todavía no está entendido.

## Elevation & Depth

Plana. No hay una sola sombra en el sistema, y no la va a haber. La profundidad sale de dos cosas: el peso de las reglas y el tono del papel.

Las reglas, de menos a más: 1 px en `rule` entre filas; 1 px en `rule-strong` entre proyectos; 1 px en `ink` bajo la cabecera y bajo la declaración; 2 px en `ink` bajo el título de cada sección; 4 px en rojo de registro en el filo superior y en el pie. Los papeles: `paper` es la hoja, `paper-2` levanta al proyecto destacado y `paper-3` hunde lo que va adentro (chips, código).

### Named Rules

**La regla de las reglas.** Si algo necesita separarse, se le da una regla del peso que corresponde; si necesita agruparse, un papel. Nunca una sombra.

## Shapes

Esquinas rectas en todo (radio 0): botones, chips, bloques de código, el proyecto destacado. La única curva del sistema es el punto de estado de "disponible", un círculo de 0.4375rem.

Los bordes son líneas de hoja impresa, no contornos de caja: la mayoría separa por abajo. Las únicas líneas gruesas son la regla de 2 px de cada sección, el filo rojo de 3 px a la izquierda del bloque de código y la keyline de 4 px. Los íconos son cuatro, dibujados en SVG inline (`lib/icons.mjs`) sobre una grilla de 24 con un trazo de 1.6 y extremos redondeados, en `currentColor` y siempre `aria-hidden`: la flecha de link externo a 13 px, el sol y la luna del conmutador a 16 px, y la verificación de la credencial.

El favicon actual, un cuadrado azul con esquinas redondeadas, viene de una versión anterior del sitio y no sigue este sistema: no tomarlo como referencia.

## Components

### Buttons

Piezas firmes y rectas; hay dos y sólo aparecen en la declaración y en el cierre.

- **Shape:** esquinas rectas (0), alto mínimo de 2.875rem, 1.375rem de padding lateral, Schibsted a 0.9375rem.
- **Primary:** fondo rojo de registro con tinta sobre rojo, en 700. Es la acción de escribir por email.
- **Ghost:** sin fondo, borde de 1 px en `ink`, texto en `ink`, en 500. Es la descarga del CV.
- **Hover / Focus:** el primario pasa a fondo `ink`; el fantasma se hunde a `paper-3`. Las dos transiciones duran 0.15s con `cubic-bezier(0.16, 1, 0.3, 1)`. El foco es un anillo de 2 px en `focus` con 2 px de separación, igual en toda la página.

### Chips

- **Style:** los chips de stack son mono a 0.6875rem en `ink-2` sobre `paper-3`, sin borde, sin radio, con 0.1875rem × 0.5rem de padding y `white-space: nowrap`. Son un dato, no un botón: no tienen hover.

### Cards / Containers

No hay tarjetas. Las dos superficies con fondo propio son:

- **Proyecto destacado:** el primer proyecto de Trabajo va sobre `paper-2`, con 1.5rem × 1rem de padding (1.75rem × 1.5rem desde 48rem) y su título en headline. Sin borde ni sombra.
- **Bloque de código:** sobre `paper-3`, mono a 0.75rem con interlineado 1.7, filo rojo de 3 px a la izquierda y scroll horizontal propio. Lleva siempre un epígrafe en caption que dice qué es, incluido que es un esquema simplificado cuando lo es. El resaltado usa el sistema: palabras clave en rojo, cadenas en verde, comentarios en `ink-3`.

### Navigation

- **Style:** links de texto en Schibsted, 0.8125rem en el teléfono y 0.875rem desde 60rem, en `ink-2`, sin subrayado, con un área táctil de 2.5–2.75rem de alto.
- **States:** hover en rojo de registro (0.15s). En el teléfono ocupa su propia fila y se desplaza de costado sin barra visible; desde 60rem se sienta en la cabecera. Los links de contenido, en cambio, van siempre en rojo y subrayados (1 px, separación de 3 px; 2 px en hover).

### La fila (componente firma)

La unidad del sitio: una etiqueta en label mono y `ink-3`, un valor en body e `ink-2`, y una regla de fila debajo. La variante clave (`is-key`) lleva el valor en `ink`; la variante de entidad convierte la etiqueta en un nombre propio en Schibsted 700.

**El rastro del puntero.** Con un puntero fino, al pasar por una fila su etiqueta sube a `ink` y aparece al margen izquierdo una marca roja de 2 px. Entra en 0.1s y se apaga en 0.42s a altura completa, sin encogerse, así que barrer una lista deja una estela de filas que se van consumiendo. `:focus-within` repite el efecto para el teclado. Todo va detrás de `(hover: hover) and (pointer: fine)`: en el teléfono la ficha no se mueve.

### Cabecera de registro

El título de cada sección en section label, con un metadato opcional a la derecha en meta y `ink-3`, sobre una regla de 2 px en `ink`. Es el separador que estructura la página entera.

### Entrada de proyecto

Número de registro de dos cifras en mono rojo a 0.75rem, título en title, contexto y fecha en meta; después el lead, las filas de problema / qué hice / stack, un artefacto de prueba opcional, los puntos destacados con viñeta roja y el link. Con puntero fino, al pasar por el proyecto el número se sella: fondo rojo de registro y tinta sobre rojo, en 0.1s de entrada y 0.16s de salida.

### Tabla de medición

La prueba de un proyecto cuando es un número y no un fragmento de código: un antes/después medido. Cabecera en label, filas separadas con la regla de fila bajo una regla de 1 px en `ink`, la métrica en Schibsted e `ink-2`, las cifras en mono tabular alineadas a la derecha con el "antes" en `ink-3` y el "ahora" en `ink` y 500, y un epígrafe en caption que dice cómo se midió. Sin fondo, sin filo de color, 32rem como máximo.

## Do's and Don'ts

### Do:

- **Usá** la fila etiqueta/valor para todo dato nuevo, con la etiqueta en label mono y el valor en body.
- **Sacá** cada color de `site/tokens.mjs` y declará su par de contraste en `checks`, en los dos temas.
- **Reservá** la mono para etiquetas, metadatos, cifras y código; cuando la etiqueta es un nombre propio, pasala a Schibsted 700.
- **Dale** a cada proyecto como mucho un artefacto de prueba (un bloque de código o una tabla de medición), siempre con su epígrafe.
- **Mantené** las esquinas rectas (radio 0): la única curva del sistema es el punto de "disponible".
- **Separá** con reglas del peso que corresponde (1, 2 o 4 px) y agrupá con papel (`paper-2`, `paper-3`).
- **Animá** sólo cambios de estado, en 0.15s con `cubic-bezier(0.16, 1, 0.3, 1)`; los efectos de puntero, detrás de `(hover: hover) and (pointer: fine)` y repetidos en `:focus-within`; y todo se apaga con `prefers-reduced-motion`.

### Don't:

- **No agregues sombras.** La profundidad es plana: reglas y papeles.
- **No muestres habilidades con barras, porcentajes ni nubes de logos.**
- **No uses imágenes ni ilustraciones decorativas.** La prueba es el dato, el código o el link en vivo.
- **No escribas hex sueltos en el CSS ni atributos `style=""` en el markup:** el primero se saltea el chequeo de contraste y el segundo rompe la CSP con hash.
- **No calientes el oscuro.** Es pizarra fría; un oscuro marrón volvería la hoja otra cosa.
