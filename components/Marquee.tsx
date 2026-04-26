"use client";

const items = [
  "React", "Next.js", "TypeScript", "Node.js", "Python",
  "FastAPI", "PostgreSQL", "MongoDB", "Redis", "Docker",
  "AWS", "GraphQL", "Figma", "Git", "Tailwind", "Prisma",
];

export default function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div
      className="overflow-hidden py-5"
      style={{ borderTop: "1px solid rgba(26,23,18,0.09)", borderBottom: "1px solid rgba(26,23,18,0.09)" }}
    >
      <div
        className="flex"
        style={{
          width: "max-content",
          animation: "marquee 30s linear infinite",
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-9 whitespace-nowrap px-9"
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(26,23,18,0.45)",
            }}
          >
            {item}
            <span style={{ color: "#a07c28", fontSize: "8px" }}>◆</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
