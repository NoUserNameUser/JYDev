"use client";

export default function Footer() {
  return (
    <footer
      style={{
        padding: "32px 64px 32px 84px",
        borderTop: "1px solid rgba(26,23,18,0.09)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: "rgba(26,23,18,0.45)",
          letterSpacing: "0.06em",
        }}
      >
        © 2026 Jackie Ye — Every encounter is meaningful.
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: "rgba(160,124,40,0.5)",
          letterSpacing: "0.06em",
        }}
      >
        每一次相遇，都是缘分。
      </div>
    </footer>
  );
}
