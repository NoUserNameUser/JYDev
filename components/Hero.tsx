"use client";

import { useEffect, useRef } from "react";

// Direct DOM updates (no React re-renders on every scroll frame)
export default function Hero() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const introRef  = useRef<HTMLDivElement>(null);
  const ctaRef    = useRef<HTMLDivElement>(null);
  const metaRef   = useRef<HTMLDivElement>(null);

  // ── Canvas flowing paths ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0, rafId: number;

    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const paths = Array.from({ length: 5 }, () => ({
      pts: Array.from({ length: 6 }, (_, j) => ({
        x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
        y: (j / 5) * (typeof window !== "undefined" ? window.innerHeight : 800),
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.08,
      })),
      alpha: Math.random() * 0.035 + 0.008,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      paths.forEach((path) => {
        path.pts.forEach((p) => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < -W * 0.2) p.vx = Math.abs(p.vx);
          if (p.x > W * 1.2)  p.vx = -Math.abs(p.vx);
          if (p.y < 0)         p.vy = Math.abs(p.vy);
          if (p.y > H)         p.vy = -Math.abs(p.vy);
        });
        ctx.beginPath();
        ctx.moveTo(path.pts[0].x, path.pts[0].y);
        for (let i = 1; i < path.pts.length - 2; i++) {
          const mx = (path.pts[i].x + path.pts[i + 1].x) / 2;
          const my = (path.pts[i].y + path.pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(path.pts[i].x, path.pts[i].y, mx, my);
        }
        ctx.strokeStyle = `rgba(140,100,20,${path.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(rafId); };
  }, []);

  // ── Scroll-driven reveal ──
  useEffect(() => {
    const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    // lerp progress 0→1 within [start, end] band, eased
    const band = (p: number, start: number, end: number) =>
      ease(Math.max(0, Math.min(1, (p - start) / (end - start))));

    const onScroll = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const scrollable = wrap.offsetHeight - window.innerHeight;
      // progress: 0 at section top, 1 when sticky panel is about to unpin
      const p = scrollable > 0 ? Math.max(0, Math.min(1, -rect.top / scrollable)) : 0;

      // kicker: enters at p 0.15→0.45
      if (kickerRef.current) {
        const t = band(p, 0.15, 0.45);
        kickerRef.current.style.opacity = String(t);
        kickerRef.current.style.transform = `translateY(${(1 - t) * 22}px)`;
      }

      // intro paragraph: enters at p 0.45→0.72
      if (introRef.current) {
        const t = band(p, 0.45, 0.72);
        introRef.current.style.opacity = String(t);
        introRef.current.style.transform = `translateY(${(1 - t) * 28}px)`;
      }

      // CTA row: enters at p 0.70→0.92
      if (ctaRef.current) {
        const t = band(p, 0.70, 0.92);
        ctaRef.current.style.opacity = String(t);
        ctaRef.current.style.transform = `translateY(${(1 - t) * 22}px)`;
      }

      // bottom-right metrics: same as CTA
      if (metaRef.current) {
        const t = band(p, 0.75, 0.97);
        metaRef.current.style.opacity = String(t);
        metaRef.current.style.transform = `translateY(${(1 - t) * 16}px)`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // Outer wrapper gives scroll length. 200vh = 100vh visible + 100vh of pinned scroll
    <div ref={wrapRef} id="hero" style={{ height: "200vh", position: "relative" }}>
      {/* Sticky panel — stays in view while user scrolls through the 200vh wrapper */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          padding: "0 64px 0 84px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        className="hero-sticky"
      >
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", width: "100%" }}>

          {/* Kicker — scroll-revealed */}
          <div
            ref={kickerRef}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#a07c28",
              marginBottom: "28px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              opacity: 0,
              willChange: "opacity, transform",
            }}
          >
            <span style={{ width: "28px", height: "1px", background: "#a07c28", display: "inline-block", flexShrink: 0 }} />
            Full Stack Developer · Asia-Pacific
          </div>

          {/* Name — loads immediately via CSS animation */}
          <h1
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: "clamp(72px, 12vw, 160px)",
              lineHeight: 0.88,
              letterSpacing: "-0.04em",
              marginBottom: "48px",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                display: "block",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  display: "block",
                  animation: "heroSlideUp 1s 0.1s cubic-bezier(0.16,1,0.3,1) forwards",
                  opacity: 0,
                }}
              >
                JACKIE
              </span>
            </span>
            <span
              style={{
                display: "block",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  display: "block",
                  animation: "heroSlideUp 1s 0.25s cubic-bezier(0.16,1,0.3,1) forwards",
                  opacity: 0,
                  color: "transparent",
                  WebkitTextStroke: "1.5px #1a1712",
                }}
              >
                YE<span style={{ color: "#a07c28", WebkitTextStroke: "0" }}>.</span>
              </span>
            </span>
          </h1>

          {/* Intro paragraph — scroll-revealed */}
          <div
            ref={introRef}
            style={{
              maxWidth: "480px",
              marginBottom: "44px",
              opacity: 0,
              willChange: "opacity, transform",
            }}
          >
            <p style={{ fontSize: "16px", lineHeight: 1.8, color: "rgba(26,23,18,0.6)", fontWeight: 300 }}>
              I&apos;m Jackie — I don&apos;t just write code.{" "}
              <strong style={{ color: "#1a1712", fontWeight: 500 }}>I listen, understand,</strong>{" "}
              then build the most direct path to what you truly envision.
            </p>
          </div>

          {/* CTA buttons — scroll-revealed */}
          <div
            ref={ctaRef}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              opacity: 0,
              willChange: "opacity, transform",
            }}
          >
            <a
              href="#contact"
              data-magnet
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "16px 36px",
                borderRadius: "100px",
                background: "#a07c28",
                color: "#F6F3EC",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "0.04em",
                textDecoration: "none",
                transition: "box-shadow 0.2s",
                fontFamily: "var(--font-sans)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(197,162,74,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ""; }}
            >
              Start a Conversation →
            </a>
            <a
              href="#build"
              className="ghost-btn"
              style={{
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(26,23,18,0.45)",
                textDecoration: "none",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "color 0.2s",
                fontFamily: "var(--font-sans)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1712")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(26,23,18,0.45)")}
            >
              See what I build{" "}
              <span className="ghost-arrow" style={{ fontSize: "18px", display: "inline-block", transition: "transform 0.2s" }}>→</span>
            </a>
          </div>
        </div>

        {/* Bottom-right metrics — scroll-revealed */}
        <div
          ref={metaRef}
          style={{
            position: "absolute",
            bottom: "52px",
            right: "64px",
            display: "flex",
            gap: "44px",
            opacity: 0,
            willChange: "opacity, transform",
          }}
          className="hero-metrics"
        >
          {[
            { val: "3", sup: "+", key: "Years shipping" },
            { val: "20", sup: "+", key: "Products built" },
            { val: "∞", sup: "",  key: "Ideas welcomed" },
          ].map(({ val, sup, key }) => (
            <div key={key}>
              <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "36px", letterSpacing: "-0.03em", color: "#1a1712", lineHeight: 1 }}>
                {val}
                {sup && <sup style={{ fontSize: "0.5em", color: "#a07c28", verticalAlign: "super" }}>{sup}</sup>}
              </div>
              <div style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(26,23,18,0.45)", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
                {key}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint — fades out once user scrolls */}
        <div
          id="scroll-hint"
          style={{
            position: "absolute",
            bottom: "52px",
            left: "84px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(26,23,18,0.3)",
            animation: "heroFadeIn 1s 1.4s ease forwards",
            opacity: 0,
          }}
        >
          <span style={{ display: "inline-block", animation: "scrollBounce 1.6s ease-in-out infinite" }}>↓</span>
          Scroll
        </div>
      </div>

      <style>{`
        @keyframes heroSlideUp {
          from { opacity: 0; transform: translateY(110%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeIn {
          to { opacity: 1; }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(5px); }
        }
        .ghost-btn:hover .ghost-arrow {
          transform: translateX(4px);
        }
        @media (max-width: 800px) {
          .hero-sticky { padding-left: 24px !important; padding-right: 24px !important; }
          .hero-metrics { display: none !important; }
        }
      `}</style>
    </div>
  );
}
