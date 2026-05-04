FROM node:24-alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /opt/app

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

FROM node:24-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /opt/app
COPY --from=deps /opt/app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:24-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /opt/app

ENV NODE_ENV=production

COPY --from=builder /opt/app ./

EXPOSE 1337
CMD ["npm", "run", "start"]
