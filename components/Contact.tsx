"use client";

import { useEffect, useRef } from "react";

const socials = [
  { label: "GitHub",   href: "https://github.com/" },
  { label: "LinkedIn", href: "https://linkedin.com/" },
  { label: "Resume",   href: "#" },
];

const GitHubIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    sectionRef.current?.querySelectorAll(".rv").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <hr style={{ border: "none", borderTop: "1px solid rgba(26,23,18,0.09)", margin: "0 64px 0 84px" }} />
      <section
        id="contact"
        ref={sectionRef}
        style={{
          padding: "120px 64px 120px 84px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          {/* Fate tag */}
          <div
            className="rv"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              color: "#a07c28",
              textTransform: "uppercase",
              marginBottom: "36px",
            }}
          >
            <span style={{ fontSize: "6px" }}>◆</span>
            Our paths have crossed
            <span style={{ fontSize: "6px" }}>◆</span>
          </div>

          {/* Big headline */}
          <div
            className="rv"
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: "clamp(48px, 8vw, 110px)",
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              marginBottom: "32px",
              transitionDelay: "0.05s",
            }}
          >
            LET&apos;S
            <br />
            <span
              style={{
                WebkitTextStroke: "1.5px #1a1712",
                color: "transparent",
              }}
            >
              BUILD.
            </span>
          </div>

          {/* Sub */}
          <p
            className="rv"
            style={{
              fontSize: "16px",
              color: "rgba(26,23,18,0.45)",
              fontWeight: 300,
              lineHeight: 1.8,
              maxWidth: "480px",
              margin: "0 auto 48px",
              fontStyle: "italic",
              transitionDelay: "0.1s",
            }}
          >
            Tell me your vision. Whether it&apos;s a bold idea or a half-formed thought —{" "}
            <strong style={{ color: "#1a1712", fontStyle: "normal", fontWeight: 400 }}>
              I want to hear it.
            </strong>{" "}
            Every great product started as a conversation.
          </p>

          {/* Email */}
          <a
            href="mailto:hi@jackieye.dev"
            className="rv contact-email"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: "clamp(18px, 2.5vw, 28px)",
              letterSpacing: "-0.01em",
              color: "#a07c28",
              textDecoration: "none",
              borderBottom: "1px solid rgba(160,124,40,0.4)",
              paddingBottom: "4px",
              marginBottom: "48px",
              transition: "border-color 0.2s",
              transitionDelay: "0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#a07c28")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(160,124,40,0.4)")}
          >
            hi@jackieye.dev
          </a>

          {/* Socials */}
          <div
            className="rv"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "14px",
              flexWrap: "wrap",
              transitionDelay: "0.2s",
            }}
          >
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                data-magnet
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 22px",
                  borderRadius: "100px",
                  border: "1px solid rgba(26,23,18,0.09)",
                  color: "rgba(26,23,18,0.45)",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "all 0.2s",
                  fontFamily: "var(--font-sans)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#a07c28";
                  e.currentTarget.style.color = "#a07c28";
                  e.currentTarget.style.background = "rgba(160,124,40,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(26,23,18,0.09)";
                  e.currentTarget.style.color = "rgba(26,23,18,0.45)";
                  e.currentTarget.style.background = "";
                }}
              >
                {s.label === "GitHub" && <GitHubIcon />}
                {s.label === "LinkedIn" && <LinkedInIcon />}
                {s.label}
                {s.label === "Resume" && " ↓"}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
