# Jackie Ye Personal Portfolio

Interactive personal homepage built with Next.js App Router, Tailwind CSS, CSS Modules, Payload CMS, PostgreSQL, and a POEZA-style spatial canvas.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Current Direction

The redesign moves into a high-end editorial spatial navigation system:

- Fixed viewport with an oversized draggable canvas
- Strong coffee-brown grid gaps with white editorial panels
- Momentum, rubberband edge feedback, and wheel-based grid cycling
- Center-first spiral placement for adding and removing grids
- Payload CMS embedded in Next.js and backed by PostgreSQL

## POEZA CMS with Payload

The homepage loads grids through the local read proxy at `GET /api/grids`, which reads Payload's `grids` collection through the server-only Local API. If the database is not reachable, it falls back to `content/grids.ts`.

CMS entry points:

```text
Payload admin:      http://localhost:3000/admin
Legacy redirect:    http://localhost:3000/cms -> /admin
Payload REST API:   http://localhost:3000/api
Payload GraphQL:    http://localhost:3000/graphql
GraphQL Playground: http://localhost:3000/graphql-playground
```

The old in-app grid manager has been replaced by Payload. Use `/admin` for content editing; `/cms` only exists as a compatibility redirect to `/admin`.

Frontend read endpoint:

```text
GET    /api/grids
```

Payload collection:

```text
Grid
- label
- kicker
- title
- body
- meta
- kind: hero | image | text | index | quote
- image
- orderIndex
```

Spiral placement order:

```text
center -> top -> top-right -> right -> bottom-right -> bottom -> bottom-left -> left -> top-left -> next outer ring
```

PostgreSQL:

```bash
cp .env.example .env
docker compose -f docker-compose.dev.yml up --build
npm run payload:seed
```

On first Payload launch, create the admin user at `http://localhost:3000/admin`. After the account exists, run `npm run payload:seed` to seed the default grid content into PostgreSQL.

Production uses checked-in Payload migrations to create and update PostgreSQL tables automatically on app startup. `PAYLOAD_DB_PUSH` is only useful for local development; leave it `false` in production.

## Project Structure

```text
app/
  (frontend)/
    layout.tsx
    page.tsx
  (payload)/
    layout.tsx
    admin/
    api/
    graphql/
  globals.css
  api/
  cms/

components/
  PoezaCanvas.tsx
  PoezaCanvas.module.css
  layout/
    Header.tsx
    Footer.tsx
  sections/
    HeroSection.tsx
    AboutSection.tsx
    ServicesSection.tsx
    ExperienceSection.tsx
    ContactSection.tsx
    PortfolioSections.module.css
  ui/
    SectionTitle.tsx
    Ui.module.css

content/
  grids.ts
  pages/home.ts
  navigation.ts
  site.ts
  research/personal-homepage-redesign.md

lib/
  gridCms.ts
  gridSpiral.ts

types/
  grid.ts

styles/
  tokens.css
```

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
```

On Windows PowerShell, use `npm.cmd run build` if script execution policy blocks `npm`.

## Personalization

- Name, tagline, email, and social links: `content/site.ts`
- Default POEZA grid content: `content/grids.ts`
- Payload grid fetcher: `lib/gridCms.ts`
- Spiral placement logic: `lib/gridSpiral.ts`
- Navigation labels: `content/navigation.ts`
- Visual theme tokens: `styles/tokens.css`
- Main layout and interaction styling: `components/sections/PortfolioSections.module.css`

## Docker

```bash
docker compose up --build
```

For a fresh production database, the web container runs the bundled Payload migrations when it first connects to Postgres. After `docker compose up -d --build`, visit `/admin` and create the first admin user.

Development container:

```bash
docker compose -f docker-compose.dev.yml up --build
```

The development compose file stores Payload's Postgres data in `payload-postgres-data`.

This starts:

```text
Next.js:  http://localhost:3000
Payload:  http://localhost:3000/admin
Postgres: localhost:5432
```
