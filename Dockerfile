# syntax=docker/dockerfile:1.7
# Production image for the Next.js + Payload app.

FROM node:24-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NPM_CONFIG_AUDIT=false
ENV NPM_CONFIG_FUND=false

FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
  npm ci --prefer-offline

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG DATABASE_URL=postgres://portfolio:portfolio@127.0.0.1:5432/portfolio
ARG PAYLOAD_SECRET=docker-build-secret
ARG NODE_OPTIONS=--max-old-space-size=1536
ARG NEXT_BUILD_MODE=compile
ARG NEXT_SKIP_BUILD_CHECKS=1
ARG NEXT_SKIP_BUILD_CMS=1

ENV NODE_ENV=production
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV NODE_OPTIONS=$NODE_OPTIONS
ENV NEXT_SKIP_BUILD_CHECKS=$NEXT_SKIP_BUILD_CHECKS
ENV NEXT_SKIP_BUILD_CMS=$NEXT_SKIP_BUILD_CMS

RUN mkdir -p public
RUN --mount=type=cache,target=/app/.next/cache \
    --mount=type=cache,target=/root/.npm \
    if [ "$NEXT_BUILD_MODE" = "compile" ]; then \
      npm run build -- --experimental-build-mode compile && \
      npm run build -- --experimental-build-mode generate-env; \
    else \
      npm run build; \
    fi

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
