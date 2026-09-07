#!/bin/sh
#
# Despliega el sitio en el VPS, detrás de Cloudflare Tunnel.
#
#   sh deploy.sh
#
# Corre desde la raíz del repo, en la máquina de desarrollo. Construye, verifica
# la salida, sube dist/ y recarga nginx. Si algo falla, corta antes de tocar
# producción.
#
# Configurable por entorno:
#   SERVIDOR=ubuntu@vps  sh deploy.sh      destino ssh (o el Host de ~/.ssh/config)
#   DOMINIO=otro.dev     sh deploy.sh      dominio a publicar
#
# Si entrás al VPS por el túnel SSH de Cloudflare, esto necesita el ProxyCommand
# en ~/.ssh/config:
#
#   Host vps
#     HostName ssh.nicolasdalessandro.dev
#     User ubuntu
#     ProxyCommand cloudflared access ssh --hostname %h
#
# No usa rsync a propósito: Git Bash en Windows no lo trae, y tar sobre ssh hace
# el mismo trabajo con lo que ya está instalado en los dos lados.

set -eu

SERVIDOR="${SERVIDOR:-ubuntu@vps}"
DOMINIO="${DOMINIO:-nicolasdalessandro.dev}"

# Git Bash reescribe los argumentos que parecen rutas Unix, y rompería el
# "servidor:/tmp/..." de scp. En Linux y macOS la variable no molesta.
export MSYS_NO_PATHCONV=1

RAIZ_LOCAL=$(dirname "$0")
cd "$RAIZ_LOCAL"

rojo()  { printf '\033[31m%s\033[0m\n' "$*"; }
verde() { printf '\033[32m%s\033[0m\n' "$*"; }
paso()  { printf '\n\033[1m── %s\033[0m\n' "$*"; }

if [ ! -f build.mjs ]; then
  rojo "No encuentro build.mjs. Corré esto desde la raíz del repo."
  exit 1
fi

TMP=$(mktemp -d)
limpiar() { rm -rf "$TMP"; }
trap limpiar EXIT INT TERM

# ── 1. Construir y verificar ────────────────────────────────────────────────
# El check corre sobre dist/ y sale con 1 si una página perdió una sección, si
# se coló un style="" que rompería la CSP o si falta un asset referenciado. Si
# falla, no hay nada que subir.

paso "Construyendo"
node build.mjs
node scripts/check.mjs

# ── 2. Empaquetar ───────────────────────────────────────────────────────────
# El tar viaja con permisos normalizados: en el VPS lo desempaqueta root y el
# chown posterior le da el dueño que corresponde.

paso "Empaquetando dist/"
tar czf "$TMP/nd-sitio.tar.gz" -C dist .
printf '  %s\n' "$(du -h "$TMP/nd-sitio.tar.gz" | cut -f1) en $(find dist -type f | wc -l | tr -d ' ') archivos"

# ── 3. Subir ────────────────────────────────────────────────────────────────
# El paso remoto va como archivo y no por stdin para poder ejecutarlo con
# "ssh -t": si sudo pide contraseña, hace falta un TTY.

cat > "$TMP/nd-remoto.sh" <<'REMOTO'
#!/bin/sh
set -eu

DOMINIO="$1"

# Con valores por defecto y no fijos para poder ensayar el guión completo
# contra un árbol de mentira antes de apuntarlo a /var y /etc.
RAIZ="${RAIZ:-/var/www/$DOMINIO}"
VHOST="${VHOST:-/etc/nginx/sites-available/$DOMINIO}"
ENLACE="${ENLACE:-/etc/nginx/sites-enabled/$DOMINIO}"
PAQUETE="${PAQUETE:-/tmp/nd-sitio.tar.gz}"
CONF_NUEVO="${CONF_NUEVO:-/tmp/nd-nginx.conf}"
BASE="${BASE:-http://127.0.0.1}"
DUENO="${DUENO:-www-data:www-data}"
SELLO=$(date +%Y%m%d-%H%M%S)

rojo()  { printf '\033[31m%s\033[0m\n' "$*"; }
verde() { printf '\033[32m%s\033[0m\n' "$*"; }

[ -f "$PAQUETE" ]    || { rojo "No llegó el paquete del sitio."; exit 1; }
[ -f "$CONF_NUEVO" ] || { rojo "No llegó el nginx.conf."; exit 1; }

# ── Contenido ─────────────────────────────────────────────────────────────
# Se desempaqueta al lado y recién después se cambia de lugar. El mv de un
# directorio dentro del mismo filesystem es atómico: nadie ve el sitio a medio
# copiar, y el anterior queda entero para volver atrás.

echo "Desempaquetando en $RAIZ.nuevo"
rm -rf "$RAIZ.nuevo"
mkdir -p "$RAIZ.nuevo"
tar xzf "$PAQUETE" -C "$RAIZ.nuevo"
chown -R "$DUENO" "$RAIZ.nuevo"
find "$RAIZ.nuevo" -type d -exec chmod 755 {} +
find "$RAIZ.nuevo" -type f -exec chmod 644 {} +

if [ -d "$RAIZ" ]; then
  rm -rf "$RAIZ.anterior"
  mv "$RAIZ" "$RAIZ.anterior"
  echo "El contenido anterior quedó en $RAIZ.anterior"
fi
mv "$RAIZ.nuevo" "$RAIZ"
verde "Contenido publicado en $RAIZ"

# ── nginx ─────────────────────────────────────────────────────────────────
# El vhost se instala DESPUÉS del contenido: hasta el reload sigue en memoria
# la configuración vieja, así que en ningún momento hay un vhost apuntando a
# una raíz que todavía no existe.

if [ -f "$VHOST" ]; then
  cp -a "$VHOST" "$VHOST.bak-$SELLO"
  echo "Vhost anterior guardado en $VHOST.bak-$SELLO"
fi

cp "$CONF_NUEVO" "$VHOST"
ln -sfn "$VHOST" "$ENLACE"

if ! nginx -t; then
  rojo "nginx -t falló: restauro el vhost anterior y no recargo."
  if [ -f "$VHOST.bak-$SELLO" ]; then
    mv "$VHOST.bak-$SELLO" "$VHOST"
    nginx -t >/dev/null 2>&1 && echo "Vhost anterior restaurado."
  else
    rm -f "$VHOST" "$ENLACE"
    echo "No había vhost previo: quedó desinstalado."
  fi
  rojo "El contenido nuevo quedó en $RAIZ (el anterior, en $RAIZ.anterior)."
  exit 1
fi

systemctl reload nginx
verde "nginx recargado"

# ── Verificación ──────────────────────────────────────────────────────────
# Contra 127.0.0.1, que es por donde entra cloudflared. Con el Host puesto a
# mano, porque es lo único que distingue un vhost del otro.

echo
echo "Comprobando por donde entra el túnel:"
fallos=0
ver() {
  etiqueta="$1"; host="$2"; ruta="$3"; esperado="$4"
  codigo=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 -H "Host: $host" "$BASE$ruta")
  if [ "$codigo" = "$esperado" ]; then
    printf '  ok    %-28s %s\n' "$etiqueta" "$codigo"
  else
    printf '  FALLA %-28s %s (esperaba %s)\n' "$etiqueta" "$codigo" "$esperado"
    fallos=$((fallos + 1))
  fi
}
ver "home es"      "$DOMINIO"     /         200
ver "home en"      "$DOMINIO"     /en/      200
ver "/en -> /en/"  "$DOMINIO"     /en       301
ver "www -> apex"  "www.$DOMINIO" /         301
ver "404"          "$DOMINIO"     /no-existe 404

echo
echo "Cabeceras de la home:"
curl -s -D - -o /dev/null --max-time 5 -H "Host: $DOMINIO" "$BASE/" \
  | grep -i -e '^content-security-policy' -e '^strict-transport' -e '^cache-control' \
  | cut -c1-100 | sed 's/^/  /'

rm -f "$PAQUETE" "$CONF_NUEVO"

if [ "$fallos" -gt 0 ]; then
  rojo "$fallos comprobación(es) fallaron. Para volver atrás:"
  echo "  sudo rm -rf $RAIZ && sudo mv $RAIZ.anterior $RAIZ"
  echo "  sudo cp $VHOST.bak-$SELLO $VHOST && sudo systemctl reload nginx"
  exit 1
fi

verde "Listo."
REMOTO

paso "Subiendo a $SERVIDOR"
scp -q "$TMP/nd-sitio.tar.gz" "$TMP/nd-remoto.sh" "$SERVIDOR:/tmp/"
scp -q deploy/nginx.conf "$SERVIDOR:/tmp/nd-nginx.conf"

# ── 4. Instalar ─────────────────────────────────────────────────────────────

paso "Instalando en el servidor"
ssh -t "$SERVIDOR" "sudo sh /tmp/nd-remoto.sh '$DOMINIO'"

paso "Desplegado"
printf '  https://%s/\n  https://%s/en/\n' "$DOMINIO" "$DOMINIO"
