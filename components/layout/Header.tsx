"use client";

import { useEffect, useState } from "react";

import { mainNavigation, navigationCta } from "@/content/navigation";
import { siteConfig } from "@/content/site";
import styles from "./Header.module.css";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={styles.header}>
      <div
        className={`${styles.backdrop} ${scrolled ? styles.backdropScrolled : ""}`}
      />

      <a
        href="#hero"
        className={styles.brand}
        aria-label={siteConfig.name}
      >
        <span className={styles.brandMark}>JY</span>
        <span className={styles.brandText}>Playground</span>
      </a>

      <ul className={`${styles.navList} hidden md:flex`}>
        {mainNavigation.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={styles.navLink}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <a
        href={navigationCta.href}
        data-magnet
        className={styles.cta}
      >
        {navigationCta.label}
      </a>
    </nav>
  );
}
