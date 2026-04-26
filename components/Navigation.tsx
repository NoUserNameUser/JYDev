"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#about",      label: "About" },
  { href: "#build",      label: "Services" },
  { href: "#experience", label: "Work" },
  { href: "#contact",    label: "Contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        padding: "28px 64px 28px 84px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.4s",
      }}
    >
      {/* Background fade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: scrolled
            ? "rgba(246,243,236,0.92)"
            : "linear-gradient(to bottom, #F6F3EC 50%, transparent)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(26,23,18,0.09)" : "none",
          pointerEvents: "none",
          transition: "all 0.4s",
        }}
      />

      <a
        href="#"
        style={{
          fontFamily: "var(--font-syne)",
          fontWeight: 800,
          fontSize: "16px",
          letterSpacing: "-0.02em",
          color: "#1a1712",
          textDecoration: "none",
          position: "relative",
          zIndex: 1,
        }}
      >
        J<span style={{ color: "#a07c28" }}>·</span>Y
      </a>

      <ul
        style={{
          display: "flex",
          gap: "36px",
          listStyle: "none",
          position: "relative",
          zIndex: 1,
        }}
        className="hidden md:flex"
      >
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              style={{
                fontSize: "11px",
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                color: "rgba(26,23,18,0.45)",
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 0.2s",
                fontFamily: "var(--font-sans)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#a07c28")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(26,23,18,0.45)")}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        data-magnet
        style={{
          position: "relative",
          zIndex: 1,
          padding: "10px 24px",
          borderRadius: "100px",
          border: "1px solid rgba(197,162,74,0.35)",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          color: "#a07c28",
          textDecoration: "none",
          fontWeight: 500,
          transition: "all 0.2s",
          background: "rgba(197,162,74,0.05)",
          fontFamily: "var(--font-sans)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(197,162,74,0.12)";
          e.currentTarget.style.borderColor = "#a07c28";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(197,162,74,0.05)";
          e.currentTarget.style.borderColor = "rgba(197,162,74,0.35)";
        }}
      >
        Let&apos;s Connect
      </a>
    </nav>
  );
}
