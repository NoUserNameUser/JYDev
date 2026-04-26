"use client";

import { useEffect, useRef } from "react";

import type { HeroContent } from "@/types/content";
import styles from "./PortfolioSections.module.css";

type HeroSectionProps = {
  content: HeroContent;
};

export function HeroSection({ content }: HeroSectionProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let rafId: number;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const paths = Array.from({ length: 5 }, () => ({
      pts: Array.from({ length: 6 }, (_, j) => ({
        x: Math.random() * window.innerWidth,
        y: (j / 5) * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.08,
      })),
      alpha: Math.random() * 0.035 + 0.008,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      paths.forEach((path) => {
        path.pts.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -width * 0.2) p.vx = Math.abs(p.vx);
          if (p.x > width * 1.2) p.vx = -Math.abs(p.vx);
          if (p.y < 0) p.vy = Math.abs(p.vy);
          if (p.y > height) p.vy = -Math.abs(p.vy);
        });
        ctx.beginPath();
        ctx.moveTo(path.pts[0].x, path.pts[0].y);
        for (let i = 1; i < path.pts.length - 2; i += 1) {
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

  useEffect(() => {
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
    const band = (p: number, start: number, end: number) =>
      ease(Math.max(0, Math.min(1, (p - start) / (end - start))));

    const onScroll = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const scrollable = wrap.offsetHeight - window.innerHeight;
      const p = scrollable > 0 ? Math.max(0, Math.min(1, -rect.top / scrollable)) : 0;

      if (kickerRef.current) {
        const t = band(p, 0.15, 0.45);
        kickerRef.current.style.opacity = String(t);
        kickerRef.current.style.transform = `translateY(${(1 - t) * 22}px)`;
      }

      if (introRef.current) {
        const t = band(p, 0.45, 0.72);
        introRef.current.style.opacity = String(t);
        introRef.current.style.transform = `translateY(${(1 - t) * 28}px)`;
      }

      if (ctaRef.current) {
        const t = band(p, 0.7, 0.92);
        ctaRef.current.style.opacity = String(t);
        ctaRef.current.style.transform = `translateY(${(1 - t) * 22}px)`;
      }

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
    <div ref={wrapRef} id="hero" className={styles.heroWrap}>
      <div className={styles.heroSticky}>
        <canvas ref={canvasRef} className={styles.heroCanvas} />

        <div className={styles.heroContent}>
          <div
            ref={kickerRef}
            className={styles.heroKicker}
          >
            <span className={styles.heroKickerLine} />
            {content.eyebrow}
          </div>

          <h1 className={styles.heroTitle}>
            {content.titleLines.map((line, index) => (
              <span key={line} className={styles.heroTitleMask}>
                <span
                  className={`${styles.heroTitleText} ${heroTitleDelayClasses[index] ?? styles.heroTitleDelay0}`}
                >
                  {line}
                </span>
              </span>
            ))}
            <span className={styles.heroTitleLine}>
              <span
                className={styles.heroTitleTextAlt}
              >
                {content.highlightedTitleLine}
                <span className={styles.heroTitleDot}>.</span>
              </span>
            </span>
          </h1>

          <div ref={introRef} className={styles.heroIntro}>
            <p className={styles.heroIntroText}>
              {content.descriptionPrefix}
              <strong className={styles.strongText}>{content.descriptionStrong}</strong>
              {content.descriptionSuffix}
            </p>
          </div>

          <div ref={ctaRef} className={styles.heroActions}>
            <a
              href={content.primaryAction.href}
              data-magnet
              className={styles.primaryAction}
            >
              {content.primaryAction.label} →
            </a>
            <a
              href={content.secondaryAction.href}
              className={styles.ghostAction}
            >
              {content.secondaryAction.label}
              <span className={styles.ghostArrow}>
                →
              </span>
            </a>
          </div>
        </div>

        <div
          ref={metaRef}
          className={styles.heroMetrics}
        >
          {content.metrics.map((metric) => (
            <div key={metric.label}>
              <div className={styles.heroMetricValue}>
                {metric.value}
                {metric.suffix && <sup className={styles.heroMetricSuffix}>{metric.suffix}</sup>}
              </div>
              <div className={styles.heroMetricLabel}>
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        <div
          id="scroll-hint"
          className={styles.scrollHint}
        >
          <span className={styles.scrollHintArrow}>↓</span>
          Scroll
        </div>
      </div>
    </div>
  );
}
  const heroTitleDelayClasses = [
    styles.heroTitleDelay0,
    styles.heroTitleDelay1,
    styles.heroTitleDelay2,
  ];
