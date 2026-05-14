# syntax=docker/dockerfile:1.7
# Production image for the Next.js + Payload app.

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
  if [ -f package-lock.json ]; then npm ci; else npm install; fi

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG DATABASE_URL=postgres://portfolio:portfolio@127.0.0.1:5432/portfolio
ARG PAYLOAD_SECRET=docker-build-secret
ARG NODE_OPTIONS=--max-old-space-size=768

ENV NODE_ENV=production
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV NODE_OPTIONS=$NODE_OPTIONS

RUN mkdir -p public
RUN --mount=type=cache,target=/app/.next/cache \
    --mount=type=cache,target=/root/.npm \
    npm run build

FROM base AS seed
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

CMD ["npm", "run", "content:dre"]

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

RUN mkdir -p media && chown nextjs:nodejs media

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q -O - http://127.0.0.1:3000/ > /dev/null || exit 1

CMD ["node", "server.js"]
