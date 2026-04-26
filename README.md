# Jackie Ye - Personal Portfolio

A personal portfolio built with Next.js App Router, TypeScript, Tailwind CSS, and handcrafted canvas / scroll effects. The project is organized so routes, content, layout, sections, global effects, styles, metadata helpers, and shared types each have a clear home.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```txt
app/
  layout.tsx          # Root metadata, fonts, Header/Footer, global effects
  page.tsx            # Thin page composition
  globals.css         # Tailwind, reset, global cursor/thread/reveal styles

components/
  effects/            # Client-only global effects such as Cursor and Lenis
  layout/             # Header and Footer
  sections/           # Hero, Marquee, About, Services, Experience, Contact
  ui/                 # Small reusable UI building blocks

content/
  site.ts             # Site identity, email, social links, footer copy
  navigation.ts       # Header navigation and CTA
  pages/home.ts       # Home page SEO and static section content

lib/
  metadata.ts         # createMetadata helper
  cms.ts              # Reserved CMS integration boundary
  utils.ts            # Shared utilities

styles/
  tokens.css          # Design tokens and theme variables

types/
  content.ts          # Shared content model types
  cms.ts              # CMS-facing types
```

## Content To Personalize

| What | File |
|------|------|
| Site name, email, social links, footer text | `content/site.ts` |
| Header navigation | `content/navigation.ts` |
| Hero, about, services, experience, contact copy | `content/pages/home.ts` |
| SEO title and description | `content/pages/home.ts` |
| Global colors, fonts, spacing tokens | `styles/tokens.css` |

## Scripts

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Docker

Production:

```bash
docker compose up --build
```

Development:

```bash
docker compose -f docker-compose.dev.yml up --build
```
