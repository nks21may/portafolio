#!/bin/sh
#
# Publica el sitio. Corre EN el servidor, desde el clon del repo.
#
#   sh deploy.sh
#
# Construye, verifica la salida, publica dist/ en /var/www/<dominio> e instala
# el nginx.conf generado. Si el build o el verificador fallan, no toca nada.
#
# Pide sudo sólo para lo que lo necesita — escribir en /var/www y /etc/nginx y
# recargar nginx. El build corre con tu usuario a propósito: con sudo dejaría
# dist/ y assets/fonts/ como root adentro del repo, y el próximo git pull o el
# próximo build sin sudo se romperían con "permiso denegado".
#
# Antes de correrlo, traé los cambios:
#
#   git pull && sh deploy.sh
#
# Configurable por entorno (los valores por defecto son los de producción):
#   DOMINIO=otro.dev  sh deploy.sh
#
# Detrás de Cloudflare Tunnel no hay nada que abrir en el firewall: nginx
# escucha en 127.0.0.1:80 y cloudflared entra por ahí.

set -eu

DOMINIO="${DOMINIO:-nicolasdalessandro.dev}"

# Con valores por defecto y no fijos para poder ensayar el guión completo
# contra un árbol de mentira antes de apuntarlo a /var y /etc.
RAIZ="${RAIZ:-/var/www/$DOMINIO}"
VHOST="${VHOST:-/etc/nginx/sites-available/$DOMINIO}"
ENLACE="${ENLACE:-/etc/nginx/sites-enabled/$DOMINIO}"
BASE="${BASE:-http://127.0.0.1}"
DUENO="${DUENO:-www-data:www-data}"
SELLO=$(date +%Y%m%d-%H%M%S)

cd "$(dirname "$0")"

rojo()  { printf '\033[31m%s\033[0m\n' "$*"; }
verde() { printf '\033[32m%s\033[0m\n' "$*"; }
paso()  { printf '\n\033[1m── %s\033[0m\n' "$*"; }

# ── 0. Comprobaciones ───────────────────────────────────────────────────────

[ -f build.mjs ] || { rojo "No encuentro build.mjs. Corré esto desde la raíz del repo."; exit 1; }

command -v node >/dev/null || {
  rojo "Hace falta node para construir el sitio, y no está instalado."
  echo "  El HTML se genera acá mismo: dist/ no se versiona."
  echo "  En Ubuntu:  sudo apt install nodejs   (o nvm, si preferís)"
  exit 1
}

# Todo lo que escribe fuera del repo pasa por acá. Si ya sos root, queda vacío
# y los comandos corren tal cual.
if [ "$(id -u)" -eq 0 ]; then
  SUDO=""
else
  command -v sudo >/dev/null || { rojo "Hace falta sudo (o correr como root)."; exit 1; }
  SUDO="sudo"
fi

# ── 1. Construir y verificar ────────────────────────────────────────────────
# El verificador corre sobre dist/ y sale con 1 si una página perdió una
# sección, si se coló un style="" que rompería la CSP o si falta un asset
# referenciado. Si falla, no hay nada que publicar.

paso "Construyendo"
node build.mjs
node scripts/check.mjs

# ── 2. Contenido ────────────────────────────────────────────────────────────
# Se copia al lado y recién después se cambia de lugar. El mv de un directorio
# dentro del mismo filesystem es atómico: nadie ve el sitio a medio copiar, y
# el anterior queda entero para volver atrás.

paso "Publicando en $RAIZ"

$SUDO rm -rf "$RAIZ.nuevo"
$SUDO mkdir -p "$RAIZ.nuevo"
$SUDO cp -a dist/. "$RAIZ.nuevo/"
$SUDO chown -R "$DUENO" "$RAIZ.nuevo"
$SUDO find "$RAIZ.nuevo" -type d -exec chmod 755 {} +
$SUDO find "$RAIZ.nuevo" -type f -exec chmod 644 {} +

# En el primer despliegue no hay nada que conservar, y entonces tampoco hay a
# dónde volver: los mensajes de más abajo tienen que decir eso y no ofrecer un
# comando que falla.
HABIA_CONTENIDO=no
if [ -d "$RAIZ" ]; then
  $SUDO rm -rf "$RAIZ.anterior"
  $SUDO mv "$RAIZ" "$RAIZ.anterior"
  HABIA_CONTENIDO=si
  echo "  el contenido anterior quedó en $RAIZ.anterior"
fi
$SUDO mv "$RAIZ.nuevo" "$RAIZ"
verde "  $(find dist -type f | wc -l | tr -d ' ') archivos publicados"

# ── 3. nginx ────────────────────────────────────────────────────────────────
# El vhost se instala DESPUÉS del contenido: hasta el reload sigue en memoria
# la configuración vieja, así que en ningún momento hay un vhost apuntando a
# una raíz que todavía no existe.

paso "Instalando la configuración de nginx"

if [ -f "$VHOST" ]; then
  $SUDO cp -a "$VHOST" "$VHOST.bak-$SELLO"
  echo "  el vhost anterior quedó en $VHOST.bak-$SELLO"
fi

$SUDO cp deploy/nginx.conf "$VHOST"
$SUDO ln -sfn "$VHOST" "$ENLACE"

if ! $SUDO nginx -t; then
  rojo "nginx -t rechazó la configuración: restauro la anterior y no recargo."
  if [ -f "$VHOST.bak-$SELLO" ]; then
    $SUDO mv "$VHOST.bak-$SELLO" "$VHOST"
    $SUDO nginx -t >/dev/null 2>&1 && echo "  configuración anterior restaurada y válida."
  else
    $SUDO rm -f "$VHOST" "$ENLACE"
    echo "  no había vhost previo: quedó desinstalado."
  fi
  if [ "$HABIA_CONTENIDO" = si ]; then
    rojo "El contenido nuevo quedó publicado (el anterior, en $RAIZ.anterior)."
  else
    rojo "El contenido nuevo quedó en $RAIZ. No había nada antes ahí."
  fi
  exit 1
fi

$SUDO systemctl reload nginx
verde "  nginx recargado"

# El reload es asíncrono: nginx levanta workers con la configuración nueva y
# deja que los viejos terminen lo que están sirviendo. Comprobar de inmediato
# mide la configuración ANTERIOR, y el resultado es un cuadro de fallos que no
# existen — rutas que "no redirigen" y una home sin CSP, porque quien contesta
# todavía es el vhost que acabamos de reemplazar. Así que se espera a que los
# workers viejos se retiren antes de medir nada.
sleep 1
espera=0
while [ "$espera" -lt 30 ] && ps -eo args= 2>/dev/null | grep -q 'nginx: worker process is shutting down'; do
  sleep 1
  espera=$((espera + 1))
done
if [ "$espera" -gt 0 ]; then
  echo "  esperé ${espera}s a que salieran los workers de la configuración anterior"
fi

# Un backup por despliegue se acumula. Recién acá, con el reload hecho: hasta
# este punto el más nuevo era el que hacía falta para volver atrás.
ls -1t "$VHOST".bak-* 2>/dev/null | tail -n +6 | xargs -r $SUDO rm -f

# ── 4. Verificación ─────────────────────────────────────────────────────────
# Contra 127.0.0.1, que es por donde entra cloudflared. Con el Host puesto a
# mano, porque es lo único que distingue un vhost del otro.

paso "Comprobando por donde entra el túnel"

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
ver "home es"       "$DOMINIO"     /          200
ver "home en"       "$DOMINIO"     /en/       200
ver "/en -> /en/"   "$DOMINIO"     /en        301
ver "www -> apex"   "www.$DOMINIO" /          301
ver "404"           "$DOMINIO"     /no-existe 404

echo
echo "  Cabeceras de la home:"
curl -s -D - -o /dev/null --max-time 5 -H "Host: $DOMINIO" "$BASE/" \
  | grep -i -e '^content-security-policy' -e '^strict-transport' -e '^cache-control' \
  | cut -c1-96 | sed 's/^/    /'

if [ "$fallos" -gt 0 ]; then
  echo
  rojo "$fallos comprobación(es) fallaron. Para volver atrás:"
  if [ -f "$VHOST.bak-$SELLO" ]; then
    echo "  sudo cp $VHOST.bak-$SELLO $VHOST"
    echo "  sudo nginx -t && sudo systemctl reload nginx"
  else
    echo "  no había vhost previo; para desinstalar este:"
    echo "  sudo rm -f $VHOST $ENLACE && sudo nginx -t && sudo systemctl reload nginx"
  fi
  if [ "$HABIA_CONTENIDO" = si ]; then
    echo "  sudo rm -rf $RAIZ && sudo mv $RAIZ.anterior $RAIZ"
  else
    echo "  y si querés borrar lo publicado: sudo rm -rf $RAIZ"
  fi
  echo
  echo "Antes de volver atrás, mirá si lo que respondió es este vhost:"
  echo "  curl -sI -H 'Host: $DOMINIO' $BASE/ | head -1"
  echo "  sudo nginx -T | grep -n 'server_name\\|listen\\|root /'"
  echo "Si la home no trae content-security-policy, está contestando otro server."
  exit 1
fi

paso "Publicado"
printf '  https://%s/\n  https://%s/en/\n' "$DOMINIO" "$DOMINIO"
