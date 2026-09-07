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
# Certificado con certbot:
#   sudo certbot --nginx -d ${host} -d www.${host}

server {
    listen 80;
    listen [::]:80;
    server_name ${host} www.${host};
    return 301 https://${host}$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name www.${host};

    ssl_certificate     /etc/letsencrypt/live/${host}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${host}/privkey.pem;

    return 301 https://${host}$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name ${host};

    root /var/www/${host};
    index index.html;
    charset utf-8;

    ssl_certificate     /etc/letsencrypt/live/${host}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${host}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # ── Cabeceras ───────────────────────────────────────────────────────
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header Content-Security-Policy "${headerCsp}" always;

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

    # ── Caché ───────────────────────────────────────────────────────────
    # El HTML nunca se cachea: es lo que trae los cambios de contenido, y
    # además lleva el CSS y el JS adentro.
    location = /             { add_header Cache-Control "no-cache" always; }
    location = /index.html   { add_header Cache-Control "no-cache" always; }
    location = /en/          { add_header Cache-Control "no-cache" always; }
    location = /en/index.html { add_header Cache-Control "no-cache" always; }

    # Las fuentes tienen el peso y el subconjunto en el nombre: si cambia el
    # contenido, cambia el nombre. Se pueden cachear para siempre.
    location ^~ /assets/fonts/ {
        add_header Cache-Control "public, max-age=31536000, immutable" always;
        try_files $uri =404;
    }

    location ~* \\.(png|jpe?g|webp|svg|ico|pdf)$ {
        add_header Cache-Control "public, max-age=604800" always;
        try_files $uri =404;
    }

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
