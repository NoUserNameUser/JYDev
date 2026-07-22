# CLAUDE.md

Guidance for AI agents working in this repository. Keep it current when architecture or workflow changes.

## What this is

Jackie Ye's freelance consulting site: a landing page that markets software / AI / infrastructure / web services and collects project inquiries, plus a draggable "infinite canvas" gallery of showcase work. Built on **Payload CMS 3 embedded inside Next.js 15 (App Router)**, **Tailwind CSS**, and **PostgreSQL**. Site copy is English; the maintainer communicates in Chinese.

There is **no separate CMS server** — Payload runs as Next routes. `/admin` is the Payload admin UI, `/api` is Payload's REST API, both served by the same Next app.

## Commands

```bash
npm run dev             # next dev on :3000
npm run build           # next build (production)
npm run lint            # eslint
npm run typecheck       # tsc --noEmit
npm run verify          # lint + typecheck + build
npm run payload:generate        # regenerate payload-types.ts + admin importMap
npm run payload:migrate         # apply migrations
npm run payload:migrate:create  # generate a migration after schema changes
```

Required env for any payload/next command that touches the DB: `PAYLOAD_SECRET`, `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`. For an offline production build (no DB), set `NEXT_SKIP_BUILD_CMS=1`.

## Architecture

```
app/(frontend)/page.tsx        Landing page (server component)
app/(frontend)/gallery/page.tsx  Gallery canvas page (server component)
app/(payload)/                 Payload admin + REST API routes (generated wiring)
app/api/inquiries/route.ts     Inquiry submission endpoint (honeypot + rate limit)
app/api/revalidate/route.ts    On-demand ISR revalidation
app/cms/route.ts               Legacy /cms → /admin redirect

features/landing/              Landing page and shared site chrome
features/gallery/components/   Gallery client UI and colocated CSS modules
features/gallery/              Gallery content, CMS queries, and placement algorithm
features/inquiries/            Form UI, shared validation, and Telegram adapter

lib/seo.ts                     Metadata + JSON-LD (ProfessionalService)
lib/payload/client.ts          Local API accessor (server-only)
lib/revalidate.ts              revalidateHome() / revalidateGallery()
payload.config.js              Single source of truth for collections/globals
payload-types.ts               GENERATED — never edit by hand
migrations/                    Checked-in Payload/Postgres migrations (run on startup in prod)
styles/tokens.css              Design tokens consumed by tailwind.config.ts
```

**Content model.** Collections: `users`, `media`, `inquiries` (public create, auth read — the inbox), `showcases` (public read, auth write — gallery cards). Globals: `global-settings` (site name, SEO, social links), `navigation`. One showcase = one project: each carries its own `accentFrom`/`accentTo` pair that drives the cell's border, glow, chips and link colour through `color-mix()`, plus `tags[]` and an artwork inlaid into the panel. `orderIndex` (unique) sets spiral order, first item = center cell.

## Conventions

- After changing collections in `payload.config.js`: run `payload:migrate:create`, review the generated SQL, then `payload:generate`. Keep `features/inquiries/inquirySchema.ts` option lists in sync with the collection's select options.
- Design uses the dark theme tokens in `styles/tokens.css` (mint `--color-primary`, dark surfaces). Reuse them via Tailwind classes rather than hardcoding colors.
- Landing/gallery copy is hardcoded in the feature components; SEO and social links come from `/admin` Settings.
- Follow `docs/engineering.md` PR checklist. Public API routes must return safe error messages. Images use `next/image` (canvas cells pass `unoptimized` because sources may be external/dynamic).

## Gotchas learned the hard way

- **Never run `npm run build` while `next dev` is running in the same checkout.** They share `.next`; the build overwrites chunks the dev server holds open and the dev server then throws `Cannot find module './###.js'` 500s. Sequence: stop dev → build → `rm -rf .next` → restart dev.
- **`payload migrate:create` is interactive** (drizzle-kit asks create-vs-rename per enum/table). Piped `\n` is ignored; only `\r` counts as Enter and stdin must stay open. Drive it with: `(for i in $(seq 1 120); do printf '\r'; sleep 0.5; done) | PAYLOAD_SECRET=x DATABASE_URL=... npx payload migrate:create <name>`. Each Enter accepts the default (create/delete, never rename).
- **Generated migrations can fail on redundant DROPs.** When a migration drops a table with `CASCADE` and later explicitly drops FK constraints/indexes that referenced it, those are already gone — rewrite them as `DROP CONSTRAINT IF EXISTS` / `DROP INDEX IF EXISTS`. Always test a migration against a fresh DB before committing.
- **framer-motion motion values update via rAF**, which browsers freeze in background/unfocused tabs. Anything that must be correct on first paint (e.g. the canvas initial centering) has to write `element.style.transform` synchronously; don't rely on rAF/spring for it. This also makes the automated browser-preview pane unreliable for observing framer-driven changes — verify canvas math by replaying it against real DOM measurements instead.
- **Gallery canvas zoom:** wheel = zoom (scale 1 = single-grid focus = max; min scale = fit-all cards centered). Fit is computed from the card bounding box, not the padded grid template, and `minScale` is recomputed on each wheel/pointer start (`refreshDims()`) to avoid a stale-dimension bug that stopped zoom-out before content fit vertically.

## Local environment (Windows)

- Shell is PowerShell; a Bash tool is also available (POSIX). Docker Desktop lives at `D:\Docker\Docker Desktop.exe` and is usually not running — start it and wait ~30s for the engine.
- No local Postgres on 5432 outside Docker. For throwaway verification: `docker run -d --name jydev-verify-pg -e POSTGRES_DB=portfolio -e POSTGRES_USER=portfolio -e POSTGRES_PASSWORD=portfolio -p 5433:5432 postgres:16-alpine`, then point `DATABASE_URL` at `:5433`.
- Claude worktrees are nested inside the repo, so Next sees multiple lockfiles and ESLint would merge the parent config — `.eslintrc.json` sets `"root": true` to prevent that.
