# syntax=docker/dockerfile:1.7
# ---- Multi-stage production build for Strapi ----

# 1. Production-only dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /opt/app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# 2. Build the Strapi admin panel (needs devDeps)
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /opt/app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
RUN npm run build

# 3. Lean runtime image — production deps + built admin + source
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /opt/app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 strapi \
 && adduser  --system --uid 1001 strapi

COPY --from=deps    --chown=strapi:strapi /opt/app/node_modules ./node_modules
COPY --from=builder --chown=strapi:strapi /opt/app/build        ./build
COPY --from=builder --chown=strapi:strapi /opt/app/src          ./src
COPY --from=builder --chown=strapi:strapi /opt/app/config       ./config
COPY --from=builder --chown=strapi:strapi /opt/app/public       ./public
COPY --from=builder --chown=strapi:strapi /opt/app/package.json ./package.json
COPY --from=builder --chown=strapi:strapi /opt/app/favicon.png  ./favicon.png

USER strapi
EXPOSE 1337

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -q -O - http://127.0.0.1:1337/_health > /dev/null || exit 1

CMD ["npm", "run", "start"]
