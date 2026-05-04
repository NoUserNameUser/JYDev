# Jackie Ye Personal Portfolio

Interactive personal homepage built with Next.js App Router, Tailwind CSS, CSS Modules, Strapi, PostgreSQL, and a POEZA-style spatial canvas.

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
- Strapi headless CMS backed by PostgreSQL

## POEZA CMS with Strapi

The homepage loads grids through the local read proxy at `GET /api/grids`, which fetches Strapi's `Grid` collection from `STRAPI_URL`. If Strapi is not reachable, it falls back to `content/grids.ts`.

CMS admin:

```text
http://localhost:1337/admin
```

The old in-app grid manager has been replaced by Strapi. The `/cms` page redirects to the Strapi admin panel.

Frontend read endpoint:

```text
GET    /api/grids
```

Strapi collection:

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
cp .env.example .env.local
docker compose -f docker-compose.dev.yml up --build
```

On first Strapi launch, create the admin user at `http://localhost:1337/admin`. The Strapi bootstrap seeds the default grid content into PostgreSQL if the `Grid` collection is empty.

## Project Structure

```text
app/
  layout.tsx
  page.tsx
  globals.css

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
- Strapi grid fetcher: `lib/gridCms.ts`
- Spiral placement logic: `lib/gridSpiral.ts`
- Navigation labels: `content/navigation.ts`
- Visual theme tokens: `styles/tokens.css`
- Main layout and interaction styling: `components/sections/PortfolioSections.module.css`

## Docker

```bash
docker compose up --build
```

Development container:

```bash
docker compose -f docker-compose.dev.yml up --build
```

This starts:

```text
Next.js:  http://localhost:3000
Strapi:   http://localhost:1337/admin
Postgres: localhost:5432
```
