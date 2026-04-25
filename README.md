# Jackie Ye — Personal Portfolio

A personal portfolio built with Next.js App Router, Tailwind CSS, and handwritten canvas / scroll effects. Warm parchment aesthetic with gold accents, a sticky scroll-pinned hero, custom cursor, and magnetic buttons.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
app/
  layout.tsx          # Root layout — loads Syne / DM Sans / DM Mono from Google Fonts
  page.tsx            # Wires all sections together, mounts Lenis smooth scroll
  globals.css         # Tailwind base + custom CSS: grain overlay, cursor, golden thread, scroll-reveal

components/
  Cursor.tsx          # Gold dot + trailing ring cursor, thread-dot scroll tracker,
                      #   magnetic effect on all [data-magnet] elements
  Navigation.tsx      # J·Y logo, section links, gold-bordered pill CTA
  Hero.tsx            # Sticky scroll-pinned intro — name loads immediately,
                      #   kicker / intro text / CTAs / metrics reveal as you scroll
  Marquee.tsx         # Infinite tech-stack ribbon between Hero and About
  About.tsx           # Photo placeholder + intro copy + four values rows
  Skills.tsx          # "What I Build" — three-pillar card grid
  Work.tsx            # Experience timeline — two-column meta / bullet layout
  Contact.tsx         # Centred "LET'S BUILD." CTA + email + social buttons
  Footer.tsx          # Copyright line + Chinese tagline
```

## Visual effects

| Effect | Where |
|--------|-------|
| Sticky scroll hero — name first, content reveals in sequence | `Hero.tsx` |
| Animated canvas flowing-path background | `Hero.tsx` |
| Custom gold cursor (dot + lagging ring, expands on hover) | `Cursor.tsx` + `globals.css` |
| Golden vertical thread line with scroll-progress dot | `Cursor.tsx` + `globals.css` |
| Magnetic button follow on `[data-magnet]` elements | `Cursor.tsx` |
| Ghost button arrow slides right on hover | `Hero.tsx` CSS |
| Scroll-reveal fade-up on all `.rv` elements | `globals.css` + IntersectionObserver |
| Infinite keyword marquee | `Marquee.tsx` |
| Pillar cards with gold underline sweep on hover | `Skills.tsx` |
| Film-grain texture overlay | `globals.css` body::after |
| Lenis smooth scrolling | `app/page.tsx` |

## Colour tokens (`tailwind.config.ts`)

| Token | Hex | Usage |
|-------|-----|-------|
| `cream` | `#F6F3EC` | Main background |
| `surface` | `#EDEAE0` | Card / section backgrounds |
| `bark` | `#1a1712` | Body text |
| `gold` | `#a07c28` | Primary accent |
| `sun` | `#c9a24a` | Lighter gold, cursor ring |
| `mist` | `#E4E1D7` | Borders |

Swap `gold` / `sun` to re-skin the accent colour across the entire site.

## Content to personalise

| What | File |
|------|------|
| Name, intro copy, CTAs | `components/Hero.tsx` |
| Photo | Drop `photo.jpg` into `/public`, then uncomment the `<img>` in `components/About.tsx` |
| About text, values rows | `components/About.tsx` |
| Service pillars + tech tags | `components/Skills.tsx` — `pillars` array |
| Work history | `components/Work.tsx` — `experiences` array |
| Email, social links | `components/Contact.tsx` — `socials` array |
| Site metadata (title, OG) | `app/layout.tsx` |

## Docker

### Production

```bash
docker compose up --build
```

Or manually:

```bash
docker build -t portfolio .
docker run --rm -p 3000:3000 portfolio
```

The image uses `next build` with `output: "standalone"` — only the runtime code is shipped, keeping the image small. Runs as a non-root user with a `/` healthcheck.

### Development (hot reload)

```bash
docker compose -f docker-compose.dev.yml up --build
```

Source is bind-mounted; `node_modules` and `.next` stay inside the container so Linux binaries aren't clobbered by the host OS. File watching uses polling for reliable reload on macOS / Windows.

```
Dockerfile              # multi-stage production build
Dockerfile.dev          # dev image with next dev + polling
docker-compose.yml      # production on :3000
docker-compose.dev.yml  # dev with bind mount
.dockerignore           # excludes node_modules / .next / .git
```
