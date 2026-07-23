# JYDev — Freelance Consulting Site

Freelancer landing site for Jackie Ye, built on Payload CMS (which runs natively inside Next.js App Router), Tailwind CSS, and PostgreSQL. Visitors can browse services — software development, AI integration, infrastructure & cloud, and web — and submit a project inquiry for a free consultation and estimate.

## Getting Started

```bash
npm install
cp .env.example .env
docker-compose -f docker-compose.dev.yml up --build -d --wait
```

Or run Postgres yourself and:

```bash
npm run dev
```

Open http://localhost:3000. On first launch, create the admin user at http://localhost:3000/admin.

## Architecture

Payload 3 is embedded in the Next.js app — there is no separate CMS server:

```text
Frontend:           http://localhost:3000        (Tailwind CSS landing page)
Payload admin:      http://localhost:3000/admin
Payload REST API:   http://localhost:3000/api
Legacy redirect:    http://localhost:3000/cms -> /admin
```

## Inquiries

The inquiry form on the homepage posts to `POST /api/inquiries`, which validates the payload, applies a honeypot check and per-IP rate limit, then writes to Payload's `inquiries` collection through the server-only Local API.

```text
Inquiry
- name            (required)
- email           (required)
- company
- serviceType     software | ai | infra | web | other
- budget          under-2k | 2k-10k | 10k-50k | 50k-plus | undecided
- message         (required)
- status          new | in-review | replied | closed   (admin only)
```

New inquiries appear in the admin panel under **Inbox → Inquiries** (public create, authenticated read). Form option labels live in `features/inquiries/inquirySchema.ts` and must stay in sync with the collection config in `payload.config.js`.

## Content model

```text
Collections: users, media, inquiries, showcases
Globals:     global-settings (site name, SEO, social links), navigation
```

Landing page copy (hero, services, process, about) is maintained in `features/landing/LandingPage.tsx`; SEO metadata and social links are editable in `/admin` under Settings.

## Gallery

`/gallery` renders the `showcases` collection on a spatial draggable infinite canvas — an oversized grid you pan with pointer drag (momentum + rubberband edges), zoom with the mouse wheel, or jump around via the numbered rail. Cells are placed center-first in a spiral by `orderIndex`, so the first showcase is the opening cell.

**One cell = one project.** Every card uses the same structure — index, category, artwork inlaid into the panel, title, description, stack chips — but each project carries its own accent pair, so no two cells look alike:

```text
Showcase
- title, kicker (category), meta (year / context)
- body                     one or two sentences
- accentFrom / accentTo    per-project hex accents; drive border, glow,
                           index number, chips and link colour via color-mix()
- tags[]                   stack chips
- image (upload) / imageUrl   artwork inlaid into the card
- link                     label + href
- orderIndex               unique; spiral placement order, centre first
```

Cards are managed in `/admin` under Content → Showcases; changes revalidate `/gallery` automatically. The canvas implementation lives in `features/gallery/components/GalleryCanvas.tsx` (+ CSS module); spiral placement in `features/gallery/gridSpiral.ts`. Off-screen cells lazy-unload via IntersectionObserver.

To (re)seed the work set — six curated projects, each with its own hand-drawn SVG artwork in `public/images/work/`:

```bash
npx payload run scripts/seed-showcases.ts
```

It clears the collection first, so it is safe to re-run.

## Project Structure

```text
app/
  (frontend)/
    layout.tsx
    page.tsx          # landing page entry
    gallery/          # showcase gallery page
  (payload)/          # Payload admin & API routes
  api/
    inquiries/        # inquiry submission endpoint
    revalidate/
  globals.css

features/
  gallery/
    components/       # canvas and project preview UI
    galleryContent.ts # gallery view model + fallback projects
    gridSpiral.ts     # center-first placement algorithm
    showcases.server.ts # Payload showcase queries
  inquiries/
    InquiryForm.tsx   # client-side form
    inquirySchema.ts  # shared options + validation
    telegram.server.ts # Telegram delivery adapter
  landing/
    LandingPage.tsx   # hero, services, process, about
    SiteChrome.tsx    # shared header/footer

lib/
  seo.ts              # metadata + structured data
  payload/client.ts   # Local API accessor
  revalidate.ts       # cache invalidation helpers

migrations/           # checked-in Payload/Postgres migrations
styles/tokens.css     # design tokens used by tailwind.config.ts
```

## Useful Commands

```bash
npm run dev
npm run dev:docker      # Turbopack dev server used by Docker
npm run build
npm run lint
npm run typecheck
npm run payload:generate        # regenerate payload-types.ts + admin import map
npm run payload:migrate:create  # generate a migration after schema changes
```

On Windows PowerShell, use `npm.cmd run build` if script execution policy blocks `npm`.

## Database & Migrations

Production uses checked-in Payload migrations to create and update PostgreSQL tables automatically on app startup. `PAYLOAD_DB_PUSH=true` is only for local development; leave it `false` in production.

After changing collections in `payload.config.js`:

```bash
npm run payload:migrate:create   # answer the prompts, review the generated SQL
npm run payload:generate
```

## Docker

Local production-style build:

```bash
docker compose up --build
```

On EC2, use the prebuilt GHCR image and never build on the instance. See
[`docs/ghcr-deployment.md`](docs/ghcr-deployment.md). For a fresh production database, the
web container runs bundled migrations on startup; after deployment, visit `/admin` to create the first admin user.

Development container:

```bash
docker-compose -f docker-compose.dev.yml up --build -d --wait
```

The web health check precompiles `/` and `/gallery` before Compose reports the service healthy. Docker uses
Turbopack to keep route compilation within modest Docker Desktop memory limits; `npm run dev` remains available
for the Webpack dev server when debugging a compiler-specific issue.

This starts:

```text
Next.js + Payload: http://localhost:3000
Postgres:          localhost:5432
```

## Personalization

- Landing copy & services: `features/landing/LandingPage.tsx`
- Inquiry options: `features/inquiries/inquirySchema.ts` + `payload.config.js` (keep in sync)
- Site metadata / SEO / social links: `/admin` → Settings → Global Settings
- Fallback metadata: `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_SITE_DESCRIPTION`
- Design tokens: `styles/tokens.css` (consumed by `tailwind.config.ts`)
