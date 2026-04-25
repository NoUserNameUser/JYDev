"use client";

import { useEffect, useRef } from "react";

const experiences = [
  {
    year: "2023 — Present",
    company: "TechCorp",
    type: "Full-time · Remote",
    role: "Senior Full Stack Developer",
    current: true,
    bullets: [
      "Led architecture of core SaaS platform — 40% faster, 50k+ monthly users",
      "Built real-time collaboration engine using WebSockets and operational transforms",
      "Drove microservices migration, reducing deployment complexity by 60%",
      "Mentored 4 junior developers; established testing and review culture",
    ],
    chips: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    delay: 0,
  },
  {
    year: "2022 — 2023",
    company: "StartupXYZ",
    type: "Full-time · Hybrid",
    role: "Full Stack Developer",
    current: false,
    bullets: [
      "Built React Native app from zero to 10k monthly active users in 6 months",
      "Implemented multi-tenant API handling 2M+ daily requests",
      "Integrated Stripe, Twilio, and Mapbox into production workflows",
    ],
    chips: ["React Native", "Node.js", "MongoDB", "Docker"],
    delay: 0.1,
  },
  {
    year: "2021 — 2022",
    company: "AgencyABC",
    type: "Internship · On-site",
    role: "Frontend Developer Intern",
    current: false,
    bullets: [
      "Delivered 8 client projects with React and Vue — pixel-perfect to spec",
      "Lifted Lighthouse scores from 58 → 96 across all properties",
    ],
    chips: ["React", "Vue", "CSS"],
    delay: 0.2,
  },
];

export default function Experience() {
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
        id="experience"
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
            03
          </span>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: "clamp(36px, 5vw, 64px)",
              letterSpacing: "-0.03em",
            }}
          >
            Experience
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

        <div>
          {experiences.map((exp, i) => (
            <div
              key={exp.company}
              className="rv exp-item"
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: "48px",
                padding: "52px 0",
                borderBottom: "1px solid rgba(26,23,18,0.09)",
                borderTop: i === 0 ? "1px solid rgba(26,23,18,0.09)" : undefined,
                position: "relative",
                transitionDelay: `${exp.delay}s`,
              }}
            >
              {/* Vertical divider */}
              <div
                style={{
                  position: "absolute",
                  left: "192px",
                  top: 0,
                  bottom: 0,
                  width: "1px",
                  background: "rgba(26,23,18,0.09)",
                }}
                className="exp-divider"
              />

              {/* Meta */}
              <div style={{ paddingTop: "6px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: "#a07c28",
                    letterSpacing: "0.12em",
                    marginBottom: "16px",
                    display: "block",
                  }}
                >
                  {exp.year}
                </span>
                <div
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontSize: "20px",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    marginBottom: "6px",
                  }}
                >
                  {exp.company}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "rgba(26,23,18,0.45)",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {exp.type}
                </div>
              </div>

              {/* Content */}
              <div>
                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: 500,
                    marginBottom: "20px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {exp.role}{" "}
                  {exp.current && (
                    <em
                      style={{
                        color: "#a07c28",
                        fontStyle: "normal",
                        fontSize: "14px",
                      }}
                    >
                      / Current
                    </em>
                  )}
                </div>

                <ul style={{ listStyle: "none" }}>
                  {exp.bullets.map((b) => (
                    <li
                      key={b}
                      style={{
                        fontSize: "13.5px",
                        lineHeight: 1.8,
                        color: "rgba(26,23,18,0.45)",
                        fontWeight: 300,
                        paddingLeft: "18px",
                        position: "relative",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          color: "rgba(197,162,74,0.4)",
                        }}
                      >
                        —
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "20px" }}>
                  {exp.chips.map((chip) => (
                    <span
                      key={chip}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        letterSpacing: "0.07em",
                        padding: "4px 12px",
                        border: "1px solid rgba(26,23,18,0.09)",
                        borderRadius: "100px",
                        color: "rgba(26,23,18,0.45)",
                      }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 800px) {
          .exp-item { grid-template-columns: 1fr !important; gap: 16px !important; }
          .exp-divider { display: none !important; }
        }
      `}</style>
    </>
  );
}
