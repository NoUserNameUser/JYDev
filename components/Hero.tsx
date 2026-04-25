"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0;
    let rafId: number;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const paths = Array.from({ length: 6 }, () => ({
      pts: Array.from({ length: 6 }, (_, j) => ({
        x: Math.random() * W,
        y: (j / 5) * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.1,
      })),
      alpha: Math.random() * 0.04 + 0.01,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      paths.forEach((path) => {
        path.pts.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -W * 0.2) p.vx = Math.abs(p.vx);
          if (p.x > W * 1.2) p.vx = -Math.abs(p.vx);
          if (p.y < 0) p.vy = Math.abs(p.vy);
          if (p.y > H) p.vy = -Math.abs(p.vy);
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

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 64px 0 84px",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1000px" }}>
        {/* Kicker */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#a07c28",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            animation: "heroFadeUp 0.7s 0.2s ease forwards",
            opacity: 0,
          }}
        >
          <span style={{ width: "28px", height: "1px", background: "#a07c28", display: "inline-block" }} />
          Full Stack Developer · Building Digital Dreams
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 800,
            fontSize: "clamp(64px, 10vw, 148px)",
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            marginBottom: "40px",
          }}
        >
          <span
            style={{
              display: "block",
              animation: "heroFadeUp 0.9s 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
              opacity: 0,
            }}
          >
            YOUR VISION,
          </span>
          <span
            style={{
              display: "block",
              animation: "heroFadeUp 0.9s 0.55s cubic-bezier(0.16,1,0.3,1) forwards",
              opacity: 0,
              color: "transparent",
              WebkitTextStroke: "1.5px #1a1712",
            }}
          >
            BUILT<span style={{ color: "#a07c28", WebkitTextStroke: "0" }}>.</span>
          </span>
        </h1>

        {/* Philosophy */}
        <div
          style={{
            maxWidth: "460px",
            marginBottom: "52px",
            animation: "heroFadeUp 0.8s 0.85s ease forwards",
            opacity: 0,
          }}
        >
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.85,
              color: "rgba(26,23,18,0.45)",
              fontWeight: 300,
              fontStyle: "italic",
            }}
          >
            Every path is unique. The fact that{" "}
            <strong style={{ color: "#1a1712", fontStyle: "normal", fontWeight: 400 }}>
              our paths have crossed
            </strong>{" "}
            is not coincidence — it&apos;s possibility. I&apos;m here to understand what you truly want to
            build, and make it real.
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            animation: "heroFadeUp 0.8s 1.05s ease forwards",
            opacity: 0,
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
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(197,162,74,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "";
            }}
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

      {/* Metrics */}
      <div
        style={{
          position: "absolute",
          bottom: "56px",
          right: "64px",
          display: "flex",
          gap: "48px",
          animation: "heroFadeUp 0.8s 1.2s ease forwards",
          opacity: 0,
        }}
      >
        {[
          { val: "3", sup: "+", key: "Years shipping" },
          { val: "20", sup: "+", key: "Products built" },
          { val: "∞", sup: "", key: "Ideas welcomed" },
        ].map(({ val, sup, key }) => (
          <div key={key}>
            <div
              style={{
                fontFamily: "var(--font-syne)",
                fontWeight: 800,
                fontSize: "38px",
                letterSpacing: "-0.03em",
                color: "#1a1712",
                lineHeight: 1,
              }}
            >
              {val}
              {sup && (
                <sup style={{ fontSize: "0.5em", color: "#a07c28", verticalAlign: "super" }}>
                  {sup}
                </sup>
              )}
            </div>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(26,23,18,0.45)",
                fontFamily: "var(--font-mono)",
                marginTop: "4px",
              }}
            >
              {key}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes heroFadeUp {
          to { opacity: 1; transform: none; }
        }
        .ghost-btn:hover .ghost-arrow {
          transform: translateX(4px);
        }
      `}</style>
    </section>
  );
}
