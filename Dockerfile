# El sitio en dos etapas: node lo construye y lo verifica, y la imagen final es
# un nginx con dist/ y el conf generado, nada más.
#
# Si el verificador falla (una sección perdida, un style="" que rompería la
# CSP, un asset que no se copió), el build de la imagen falla y no se publica.

FROM node:22-alpine AS build
WORKDIR /src

# Cero dependencias: no hay npm install. Las fuentes ya están en assets/fonts,
# así que el build no sale a la red.
COPY . .
RUN node build.mjs && node scripts/check.mjs

# nginx-unprivileged y no el oficial, como museo: corre sin root y escucha en
# 8080, así que el contenedor no necesita root ni capabilities. El compose lo
# monta read-only encima de eso.
FROM nginxinc/nginx-unprivileged:1.29-alpine

COPY --from=build --chown=root:root /src/dist /usr/share/nginx/html
COPY --from=build --chown=root:root /src/deploy/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
