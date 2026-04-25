"use client";

import { useEffect, useRef } from "react";

const S = {
  sec: {
    padding: "120px 64px 120px 84px",
  } as React.CSSProperties,
  sh: {
    display: "flex",
    alignItems: "baseline",
    gap: "18px",
    marginBottom: "72px",
  } as React.CSSProperties,
  sn: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    color: "#a07c28",
    letterSpacing: "0.14em",
  } as React.CSSProperties,
  st: {
    fontFamily: "var(--font-syne)",
    fontWeight: 800,
    fontSize: "clamp(36px, 5vw, 64px)",
    letterSpacing: "-0.03em",
  } as React.CSSProperties,
};

const values = [
  { icon: "◆", title: "Understand First",      desc: "Listen, then build" },
  { icon: "◆", title: "Ship Fast, Ship Right",  desc: "Speed with craft" },
  { icon: "◆", title: "End-to-End Ownership",   desc: "Design → Deploy" },
  { icon: "◆", title: "Long-term Thinking",     desc: "Built to scale" },
];

export default function About() {
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
    <section id="about" ref={sectionRef} style={S.sec}>
      <div className="rv" style={S.sh}>
        <span style={S.sn}>01</span>
        <h2 style={S.st}>About Me</h2>
        <div style={{ flex: 1, height: "1px", background: "rgba(26,23,18,0.09)", marginBottom: "5px" }} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "420px 1fr",
          gap: "80px",
          alignItems: "start",
        }}
        className="about-grid"
      >
        {/* Photo */}
        <div className="rv" style={{ position: "relative" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "4/5",
              background: "#EDEAE0",
              borderRadius: "4px",
              overflow: "hidden",
              position: "relative",
              border: "1px solid rgba(26,23,18,0.09)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(-55deg, transparent 0, transparent 10px, rgba(197,162,74,0.04) 10px, rgba(197,162,74,0.04) 11px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  border: "1.5px dashed rgba(197,162,74,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c5a24a" strokeWidth="1.2" style={{ opacity: 0.35 }}>
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(197,162,74,0.4)",
                }}
              >
                Your photo here
              </div>
            </div>
            {/* Swap in your own photo: <img src="/photo.jpg" alt="Jackie Ye" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} /> */}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "-14px",
              left: "28px",
              background: "#a07c28",
              color: "#F6F3EC",
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "8px 16px",
              borderRadius: "2px",
            }}
          >
            Jackie Ye · Full Stack Dev
          </div>
        </div>

        {/* Text */}
        <div className="rv" style={{ paddingTop: "8px", transitionDelay: "0.1s" }}>
          <h3
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: "clamp(22px, 2.5vw, 32px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.25,
              marginBottom: "32px",
            }}
          >
            I believe every encounter is{" "}
            <em style={{ color: "#a07c28", fontStyle: "normal" }}>meaningful</em> — including this one.
          </h3>

          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.9,
              color: "rgba(26,23,18,0.45)",
              fontWeight: 300,
              marginBottom: "16px",
            }}
          >
            I&apos;m Jackie, a full stack developer based in Asia-Pacific. I don&apos;t just write code — I
            listen to understand what you&apos;re truly trying to achieve, then build the most direct,
            elegant path to get you there.
          </p>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.9,
              color: "rgba(26,23,18,0.45)",
              fontWeight: 300,
              marginBottom: "16px",
            }}
          >
            My approach is simple: understand deeply, plan precisely, execute efficiently. Whether
            it&apos;s a startup idea, a business tool, or a creative platform — if you can imagine it, I
            can build it.
          </p>

          <div style={{ marginTop: "40px" }}>
            {values.map((v, i) => (
              <div
                key={v.title}
                style={{
                  padding: "18px 0",
                  borderBottom: "1px solid rgba(26,23,18,0.09)",
                  borderTop: i === 0 ? "1px solid rgba(26,23,18,0.09)" : undefined,
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div style={{ color: "#a07c28", fontSize: "14px", width: "20px", flexShrink: 0 }}>
                  {v.icon}
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, flex: 1 }}>{v.title}</div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "rgba(26,23,18,0.45)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {v.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
