"use client";

import { useEffect, useRef } from "react";

import { SectionTitle } from "@/components/ui/SectionTitle";
import type { ValueItem } from "@/types/content";
import styles from "./PortfolioSections.module.css";

type AboutContent = {
  sectionNumber: string;
  title: string;
  photoLabel: string;
  badge: string;
  headlinePrefix: string;
  headlineHighlight: string;
  headlineSuffix: string;
  paragraphs: string[];
  values: ValueItem[];
};

type AboutSectionProps = {
  content: AboutContent;
};

export function AboutSection({ content }: AboutSectionProps) {
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
    <section id="about" ref={sectionRef} className={styles.section}>
      <SectionTitle number={content.sectionNumber} title={content.title} />

      <div className={styles.aboutGrid}>
        <div className={`rv ${styles.photoWrap}`}>
          <div className={styles.photoCard}>
            <div className={styles.photoPattern} />
            <div className={styles.photoPlaceholder}>
              <div className={styles.photoIcon}>
                <svg className={styles.photoSvg} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c5a24a" strokeWidth="1.2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </div>
              <div className={styles.photoLabel}>
                {content.photoLabel}
              </div>
            </div>
          </div>
          <div className={styles.aboutBadge}>
            {content.badge}
          </div>
        </div>

        <div className={`rv ${styles.aboutCopy}`}>
          <h3 className={styles.aboutHeading}>
            {content.headlinePrefix}
            <em className={styles.accentText}>{content.headlineHighlight}</em>
            {content.headlineSuffix}
          </h3>

          {content.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className={styles.aboutParagraph}
            >
              {paragraph}
            </p>
          ))}

          <div className={styles.valueList}>
            {content.values.map((v) => (
              <div
                key={v.title}
                className={styles.valueRow}
              >
                <div className={styles.valueIcon}>{v.icon}</div>
                <div className={styles.valueTitle}>{v.title}</div>
                <div className={styles.valueDescription}>{v.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
