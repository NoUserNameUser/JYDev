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
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
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
        <div className={`rv ${styles.profileBoard}`}>
          <div className={styles.profileTopline}>
            <span>{content.badge}</span>
            <span>Open to thoughtful builds</span>
          </div>
          <div className={styles.profileMark}>
            <span>J</span>
            <span>Y</span>
          </div>
          <div className={styles.profileCaption}>{content.photoLabel}</div>
          <div className={styles.profileStrips} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className={`rv ${styles.aboutCopy}`}>
          <h3 className={styles.aboutHeading}>
            {content.headlinePrefix}
            <em>{content.headlineHighlight}</em>
            {content.headlineSuffix}
          </h3>

          {content.paragraphs.map((paragraph) => (
            <p key={paragraph} className={styles.aboutParagraph}>
              {paragraph}
            </p>
          ))}

          <div className={styles.valueList}>
            {content.values.map((value, index) => (
              <div key={value.title} className={styles.valueRow}>
                <div className={styles.valueIcon}>0{index + 1}</div>
                <div>
                  <div className={styles.valueTitle}>{value.title}</div>
                  <div className={styles.valueDescription}>{value.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
