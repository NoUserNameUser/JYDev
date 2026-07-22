import Link from "next/link";

import type { GlobalSetting } from "@/payload-types";

const NAV_ITEMS = [
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#process" },
  { label: "About", href: "#about" },
];

function GridGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="1" y="1" width="6" height="6" rx="1.4" fill="currentColor" />
      <rect x="9" y="1" width="6" height="6" rx="1.4" fill="currentColor" opacity="0.55" />
      <rect x="1" y="9" width="6" height="6" rx="1.4" fill="currentColor" opacity="0.55" />
      <rect x="9" y="9" width="6" height="6" rx="1.4" fill="currentColor" />
    </svg>
  );
}

export function SiteHeader({ siteName, isHomePage = false }: { siteName: string; isHomePage?: boolean }) {
  return (
    <header className="sticky top-0 z-header border-b border-border bg-background/85 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          {siteName}
          <span className="text-primary">.</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 sm:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={isHomePage ? item.href : `/${item.href}`}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 rounded-pill border border-primary bg-primary-soft px-4 py-2 text-sm font-semibold text-primary shadow-glow transition-all hover:bg-primary-soft-hover hover:shadow-glow-strong"
          >
            <span className="transition-transform duration-300 group-hover:rotate-90">
              <GridGlyph />
            </span>
            Work Gallery
          </Link>
          <a
            href={isHomePage ? "#inquiry" : "/#inquiry"}
            className="hidden rounded-pill bg-primary px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-primary-hover sm:inline-block"
          >
            Free estimate
          </a>
        </div>
      </div>
    </header>
  );
}

function SocialLinks({ settings }: { settings: GlobalSetting | null }) {
  const links = settings?.socialLinks?.filter((link) => link.label && link.href) ?? [];
  if (links.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {links.map((link) => (
        <li key={link.id ?? link.href}>
          <a
            href={link.href}
            target={link.openInNewTab ? "_blank" : undefined}
            rel={link.openInNewTab ? "noreferrer noopener" : undefined}
            className="text-sm text-muted transition-colors hover:text-primary"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter({ settings }: { settings: GlobalSetting | null }) {
  const siteName = settings?.siteName || "Jackie Ye";

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display font-semibold">
            {siteName}
            <span className="text-primary">.</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            Freelance software · AI · infrastructure · web — © {new Date().getFullYear()}
          </p>
        </div>
        <SocialLinks settings={settings} />
      </div>
    </footer>
  );
}
