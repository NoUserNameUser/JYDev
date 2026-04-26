"use client";

import { useEffect, useRef } from "react";

import { SectionTitle } from "@/components/ui/SectionTitle";
import type { ExperienceItem } from "@/types/content";
import styles from "./PortfolioSections.module.css";

type ExperienceContent = {
  sectionNumber: string;
  title: string;
  items: ExperienceItem[];
};

type ExperienceSectionProps = {
  content: ExperienceContent;
};

export function ExperienceSection({ content }: ExperienceSectionProps) {
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
      <hr className={styles.divider} />
      <section id="experience" ref={sectionRef} className={styles.section}>
        <SectionTitle number={content.sectionNumber} title={content.title} />

        <div>
          {content.items.map((exp, index) => {
            const delayClass = [styles.experienceDelay0, styles.experienceDelay1, styles.experienceDelay2][index] ?? styles.experienceDelay0;

            return (
            <div
              key={exp.company}
              className={`rv ${styles.experienceItem} ${delayClass}`}
            >
              <div className={styles.experienceDivider} />

              <div className={styles.experienceMeta}>
                <span className={styles.experienceYear}>{exp.year}</span>
                <div className={styles.experienceCompany}>{exp.company}</div>
                <div className={styles.experienceType}>{exp.type}</div>
              </div>

              <div>
                <div className={styles.experienceRole}>
                  {exp.role}{" "}
                  {exp.current && <em className={styles.current}>/ Current</em>}
                </div>

                <ul className={styles.bulletList}>
                  {exp.bullets.map((b) => (
                    <li key={b} className={styles.bullet}>
                      {b}
                    </li>
                  ))}
                </ul>

                <div className={styles.chipList}>
                  {exp.chips.map((chip) => (
                    <span key={chip} className={styles.chip}>
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
