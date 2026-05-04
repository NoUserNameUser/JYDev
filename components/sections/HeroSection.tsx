"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import type { HeroContent } from "@/types/content";
import styles from "./PortfolioSections.module.css";

type HeroSectionProps = {
  content: HeroContent;
};

const playModes = [
  {
    label: "Prototype",
    accent: "#77e5c8",
    partner: "#ff7a5c",
    copy: "Shape the first version fast, then keep the fun parts honest with real product logic.",
    stat: "fast loops",
  },
  {
    label: "Systems",
    accent: "#b6f35a",
    partner: "#77e5c8",
    copy: "Turn messy workflows into durable apps, APIs, automations, and admin surfaces.",
    stat: "clean cores",
  },
  {
    label: "Interface",
    accent: "#f2c94c",
    partner: "#ff7a5c",
    copy: "Make the front door feel alive with motion, feedback, and details people can touch.",
    stat: "human UX",
  },
] as const;

export function HeroSection({ content }: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeModeRef = useRef(0);
  const [activeMode, setActiveMode] = useState(0);

  useEffect(() => {
    activeModeRef.current = activeMode;
  }, [activeMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let rafId = 0;

    const pointer = {
      x: window.innerWidth * 0.68,
      y: window.innerHeight * 0.45,
      active: false,
    };

    const nodes = Array.from({ length: 46 }, (_, index) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 2 + Math.random() * 3,
      offset: index * 0.23,
    }));

    const pulses: Array<{ x: number; y: number; radius: number; alpha: number; color: string }> = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const addPulse = (x: number, y: number) => {
      const mode = playModes[activeModeRef.current];
      pulses.push({ x, y, radius: 8, alpha: 0.72, color: mode.partner });
      if (pulses.length > 14) pulses.shift();
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const onPointerDown = (event: PointerEvent) => {
      addPulse(event.clientX, event.clientY);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    const drawGrid = () => {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = "rgba(245, 241, 232, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 56) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 56) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
    };

    const draw = (time = 0) => {
      const mode = playModes[activeModeRef.current];
      ctx.clearRect(0, 0, width, height);
      drawGrid();

      nodes.forEach((node, index) => {
        const dx = pointer.x - node.x;
        const dy = pointer.y - node.y;
        const dist = Math.max(1, Math.hypot(dx, dy));
        const force = pointer.active ? Math.min(1.8, 140 / dist) : 0.18;
        const orbit = Math.sin(time * 0.0007 + node.offset) * 0.08;

        node.vx += (dx / dist) * force * 0.018 + orbit * 0.01;
        node.vy += (dy / dist) * force * 0.018 + Math.cos(time * 0.0005 + node.offset) * 0.004;
        node.vx *= 0.965;
        node.vy *= 0.965;
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;

        for (let j = index + 1; j < nodes.length; j += 1) {
          const other = nodes[j];
          const linkDistance = Math.hypot(node.x - other.x, node.y - other.y);
          if (linkDistance < 150) {
            ctx.globalAlpha = (1 - linkDistance / 150) * 0.18;
            ctx.strokeStyle = mode.accent;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        ctx.globalAlpha = 0.85;
        ctx.fillStyle = index % 5 === 0 ? mode.partner : mode.accent;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
      });

      pulses.forEach((pulse, index) => {
        ctx.globalAlpha = pulse.alpha;
        ctx.strokeStyle = pulse.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        ctx.stroke();
        pulse.radius += 2.4;
        pulse.alpha *= 0.94;
        if (pulse.alpha < 0.02) pulses.splice(index, 1);
      });

      ctx.globalAlpha = 1;
      if (!reducedMotion) {
        rafId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerdown", onPointerDown);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const mode = playModes[activeMode];

  return (
    <section id="hero" className={styles.hero}>
      <canvas ref={canvasRef} className={styles.heroCanvas} aria-hidden="true" />

      <div className={styles.heroShell}>
        <div className={styles.heroCopy}>
          <div className={styles.heroKicker}>
            <span className={styles.signalDot} />
            {content.eyebrow}
          </div>

          <h1 className={styles.heroTitle}>
            <span>{content.titleLines.join(" ")}</span>
            <span className={styles.heroTitleAccent}>{content.highlightedTitleLine}</span>
          </h1>

          <p className={styles.heroIntroText}>
            {content.descriptionPrefix}
            <strong>{content.descriptionStrong}</strong>
            {content.descriptionSuffix}
          </p>

          <div className={styles.heroActions}>
            <a href={content.primaryAction.href} data-magnet className={styles.primaryAction}>
              {content.primaryAction.label}
              <span aria-hidden="true">-&gt;</span>
            </a>
            <a href={content.secondaryAction.href} className={styles.ghostAction}>
              {content.secondaryAction.label}
            </a>
          </div>

          <div className={styles.modeDock} role="group" aria-label="Portfolio modes">
            {playModes.map((item, index) => (
              <button
                key={item.label}
                type="button"
                className={`${styles.modeButton} ${index === activeMode ? styles.modeButtonActive : ""}`}
                onClick={() => setActiveMode(index)}
              >
                <span className={styles.modeIndex}>0{index + 1}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <aside className={styles.playPanel} style={{ "--panel-accent": mode.accent } as CSSProperties}>
          <div className={styles.panelChrome} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className={styles.panelEyebrow}>Current build mode</div>
          <h2 className={styles.panelTitle}>{mode.label}</h2>
          <p className={styles.panelCopy}>{mode.copy}</p>

          <div className={styles.heroMetrics}>
            {content.metrics.map((metric) => (
              <div key={metric.label} className={styles.heroMetric}>
                <div className={styles.heroMetricValue}>
                  {metric.value}
                  {metric.suffix && <sup>{metric.suffix}</sup>}
                </div>
                <div className={styles.heroMetricLabel}>{metric.label}</div>
              </div>
            ))}
          </div>

          <div className={styles.signalStack} aria-hidden="true">
            <span style={{ width: activeMode === 0 ? "92%" : "62%" }} />
            <span style={{ width: activeMode === 1 ? "88%" : "54%" }} />
            <span style={{ width: activeMode === 2 ? "84%" : "58%" }} />
          </div>

          <div className={styles.panelFooter}>
            <span>{mode.stat}</span>
            <span>Jackie Ye</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
