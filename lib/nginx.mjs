/**
 * Genera el nginx.conf del sitio.
 *
 * Se emite desde el build por una razón concreta: la CSP lleva los hashes
 * SHA-256 del CSS y del JS que la página inlinea, y esos hashes cambian
 * cada vez que se toca un estilo. Escrito a mano se desincroniza en el primer
 * cambio y la página queda rota en producción, no en desarrollo.
 *
 * La página ya trae su CSP en un <meta>. Repetirla en el header no es
 * redundante de más: el header se aplica antes de parsear y admite
 * frame-ancestors, que en <meta> se ignora.
 *
 * Sale fuera de dist/ a propósito — dist/ es la raíz web y no tiene por qué
 * contener su propia configuración de servidor.
 *
 * ── Va detrás de Cloudflare Tunnel ────────────────────────────────────────
 * cloudflared entra por http://127.0.0.1:80 y el TLS lo termina Cloudflare en
 * su borde. Por eso acá no hay listen 443, ni certificados, ni certbot: el
 * origen no ve una conexión TLS nunca. Y sobre todo no hay redirect de 80 a
 * https del MISMO host, que es el error que rompe este montaje — el 301
 * volvería al borde, el borde volvería a entrar por el túnel al puerto 80, y
 * de ahí otro 301: un bucle que el navegador corta con ERR_TOO_MANY_REDIRECTS.
 *
 * ── Por qué el Cache-Control sale de un map ───────────────────────────────
 * Porque nginx NO hereda add_header hacia un nivel que declara el suyo: un
 * solo `add_header Cache-Control` dentro de un location borra, en esas
 * respuestas, la CSP y el HSTS declarados en el server. Con las rutas de caché
 * resueltas en un map, las cabeceras se declaran UNA vez y ningún location
 * necesita tocarlas — que es también lo que evita que el problema vuelva la
 * próxima vez que alguien agregue una regla.
 */

export function renderNginx({ site, csp }) {
  const host = site.domain;
  /* frame-ancestors sólo funciona por header, así que se suma acá. */
  const headerCsp = `${csp}; frame-ancestors 'none'`;

  return `# nginx — ${site.name}
#
# GENERADO POR build.mjs. No lo edites a mano: la CSP lleva los hashes del CSS
# y del JS del sitio y se regeneran en cada build.
#
#   sudo cp deploy/nginx.conf /etc/nginx/sites-available/${host}
#   sudo ln -s /etc/nginx/sites-available/${host} /etc/nginx/sites-enabled/
#   sudo nginx -t && sudo systemctl reload nginx
#
# La raíz es el contenido de dist/:
#   rsync -av --delete dist/ servidor:/var/www/${host}/
#
# ── Detrás de Cloudflare Tunnel ─────────────────────────────────────────────
# El TLS lo termina Cloudflare: acá se sirve HTTP plano y cloudflared lo toma
# por loopback. No hay 443 ni certbot, y no hay redirect de 80 a https de este
# mismo host: ese 301 volvería al borde, que volvería a entrar por el túnel al
# 80, en bucle.
#
# En /etc/cloudflared/config.yml, ambos hostnames ya apuntan acá:
#   - hostname: ${host}
#     service: http://127.0.0.1:80
#   - hostname: www.${host}
#     service: http://127.0.0.1:80

# Cache-Control por ruta. Va en un map y no en cada location a propósito:
# nginx no hereda add_header hacia un nivel que declara el suyo, así que un
# "add_header Cache-Control" dentro de un location dejaría esas respuestas sin
# CSP y sin HSTS. Acá el valor viaja como variable y las cabeceras se declaran
# una sola vez, en el server.
#
# El HTML nunca se cachea: es lo que trae los cambios de contenido, y además
# lleva el CSS y el JS adentro. Las fuentes llevan el peso y el subconjunto en
# el nombre — si cambia el contenido, cambia el nombre — así que se pueden
# cachear para siempre. El valor vacío del default no emite la cabecera.
map $uri $nd_cache_control {
    default                            "";
    "/"                                "no-cache";
    "/index.html"                      "no-cache";
    "/en/"                             "no-cache";
    "/en/index.html"                   "no-cache";
    ~^/assets/fonts/                   "public, max-age=31536000, immutable";
    ~*\\.(png|jpe?g|webp|svg|ico|pdf)$  "public, max-age=604800";
}

# www -> apex. Este redirect sí es seguro: cambia de host, así que el borde
# resuelve ${host} en vez de volver a entrar por este mismo vhost.
server {
    listen 80;
    listen [::]:80;
    server_name www.${host};

    # Un 301 no tiene cuerpo que proteger, pero sí conviene que quien entra por
    # www se lleve la política: si no, la primera visita de alguien que escribe
    # "www." no fija HSTS hasta después del salto.
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    return 301 https://${host}$request_uri;
}

server {
    listen 80;
    listen [::]:80;
    server_name ${host};

    root /var/www/${host};
    index index.html;
    charset utf-8;

    # El único cliente es cloudflared, que llega por loopback: sin esto todos
    # los accesos se loguean como 127.0.0.1 y el log no sirve para nada.
    set_real_ip_from 127.0.0.1;
    set_real_ip_from ::1;
    real_ip_header CF-Connecting-IP;

    # Sin esto, nginx completa cada Location con esquema y host: como la
    # conexión desde cloudflared es HTTP plano, $scheme vale "http" y el
    # visitante que venía por https se comería un salto de vuelta al borde —
    # y sin "Always Use HTTPS", se quedaría en http. En off el Location sale
    # relativo y el esquema lo pone el navegador, que ya está en https.
    # Cubre tanto los redirects que arma nginx solo (directorio sin barra
    # final) como los "return 301 /ruta/" de más abajo.
    absolute_redirect off;

    # ── Cabeceras ───────────────────────────────────────────────────────
    # Declaradas una sola vez. Si algún día agregás un location con su propio
    # add_header, ese location pierde TODAS estas: pasá el valor por el map de
    # arriba en vez de declararlo ahí.
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header Content-Security-Policy "${headerCsp}" always;
    add_header Cache-Control $nd_cache_control always;

    # ── Compresión ──────────────────────────────────────────────────────
    # woff2, png y jpg ya vienen comprimidos: no los pases por gzip.
    gzip on;
    gzip_vary on;
    gzip_comp_level 6;
    gzip_min_length 512;
    gzip_types text/plain text/css application/javascript application/json
               application/manifest+json image/svg+xml application/xml;

    # Si tu build de nginx trae brotli, descomentá — el HTML es casi todo
    # texto inline y comprime muy bien:
    # brotli on;
    # brotli_comp_level 6;
    # brotli_types text/plain text/css application/manifest+json
    #              image/svg+xml application/xml;

    # ── Rutas ───────────────────────────────────────────────────────────
    location = /en { return 301 /en/; }

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ /\\. { return 404; }

    error_page 404 /index.html;
}
`;
}
