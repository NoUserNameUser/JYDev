"use client";

import { useEffect, useRef } from "react";

const pillars = [
  {
    num: "01",
    title: "Products & Apps",
    body: "Full-stack web and mobile applications — from idea to deployed product. I handle architecture, database, API, and UI with equal care.",
    tags: ["React", "Next.js", "Node.js", "PostgreSQL"],
  },
  {
    num: "02",
    title: "APIs & Systems",
    body: "Scalable backends, microservices, and integrations that power products at scale. Performance and reliability are non-negotiable.",
    tags: ["Python", "FastAPI", "GraphQL", "Docker"],
  },
  {
    num: "03",
    title: "Interfaces & Craft",
    body: "Interfaces that feel alive. I bridge design and engineering to create digital experiences that your users will love and remember.",
    tags: ["TypeScript", "Tailwind", "Framer", "Figma"],
  },
];

export default function Services() {
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
        id="build"
        ref={sectionRef}
        style={{ padding: "120px 64px 120px 84px" }}
      >
        <div
          className="rv"
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "18px",
            marginBottom: "72px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "#a07c28",
              letterSpacing: "0.14em",
            }}
          >
            02
          </span>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: "clamp(36px, 5vw, 64px)",
              letterSpacing: "-0.03em",
            }}
          >
            What I Build
          </h2>
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(26,23,18,0.09)",
              marginBottom: "5px",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2px",
          }}
          className="pillars-grid"
        >
          {pillars.map((p, i) => (
            <PillarCard key={p.num} pillar={p} delay={i * 0.08} />
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 800px) {
          .pillars-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

function PillarCard({
  pillar,
  delay,
}: {
  pillar: (typeof pillars)[0];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const enter = () => {
    if (!ref.current) return;
    ref.current.style.borderColor = "rgba(197,162,74,0.25)";
    ref.current.querySelector<HTMLDivElement>(".pillar-bar")!.style.transform = "scaleX(1)";
    ref.current.querySelectorAll<HTMLSpanElement>(".ptag").forEach((t) => {
      t.style.borderColor = "rgba(197,162,74,0.3)";
      t.style.color = "#a07c28";
    });
  };

  const leave = () => {
    if (!ref.current) return;
    ref.current.style.borderColor = "rgba(26,23,18,0.09)";
    ref.current.querySelector<HTMLDivElement>(".pillar-bar")!.style.transform = "scaleX(0)";
    ref.current.querySelectorAll<HTMLSpanElement>(".ptag").forEach((t) => {
      t.style.borderColor = "rgba(26,23,18,0.09)";
      t.style.color = "rgba(26,23,18,0.45)";
    });
  };

  return (
    <div
      ref={ref}
      className="rv"
      style={{
        background: "#EDEAE0",
        padding: "44px 36px",
        border: "1px solid rgba(26,23,18,0.09)",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.3s",
        transitionDelay: `${delay}s`,
        borderRadius:
          delay === 0 ? "8px 0 0 8px" : delay === 0.16 ? "0 8px 8px 0" : undefined,
      }}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <div
        className="pillar-bar"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent, #a07c28, transparent)",
          transform: "scaleX(0)",
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      <div
        style={{
          fontFamily: "var(--font-syne)",
          fontSize: "56px",
          fontWeight: 800,
          color: "rgba(197,162,74,0.12)",
          letterSpacing: "-0.04em",
          lineHeight: 1,
          marginBottom: "24px",
        }}
      >
        {pillar.num}
      </div>
      <div
        style={{
          fontFamily: "var(--font-syne)",
          fontSize: "22px",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          marginBottom: "14px",
        }}
      >
        {pillar.title}
      </div>
      <p
        style={{
          fontSize: "13px",
          lineHeight: 1.8,
          color: "rgba(26,23,18,0.45)",
          fontWeight: 300,
        }}
      >
        {pillar.body}
      </p>
      <div style={{ marginTop: "24px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {pillar.tags.map((tag) => (
          <span
            key={tag}
            className="ptag"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.06em",
              padding: "4px 10px",
              border: "1px solid rgba(26,23,18,0.09)",
              borderRadius: "100px",
              color: "rgba(26,23,18,0.45)",
              transition: "all 0.2s",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
