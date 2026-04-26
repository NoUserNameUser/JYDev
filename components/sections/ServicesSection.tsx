"use client";

import { useEffect, useRef } from "react";

import { SectionTitle } from "@/components/ui/SectionTitle";
import type { ServicePillar } from "@/types/content";
import styles from "./PortfolioSections.module.css";

type ServicesContent = {
  sectionNumber: string;
  title: string;
  pillars: ServicePillar[];
};

type ServicesSectionProps = {
  content: ServicesContent;
};

export function ServicesSection({ content }: ServicesSectionProps) {
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
      <section id="build" ref={sectionRef} className={styles.section}>
        <SectionTitle number={content.sectionNumber} title={content.title} />

        <div className={styles.pillarsGrid}>
          {content.pillars.map((pillar, i) => (
            <PillarCard key={pillar.number} pillar={pillar} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}

function PillarCard({ pillar, index }: { pillar: ServicePillar; index: number }) {
  const delayClass = [styles.pillarDelay0, styles.pillarDelay1, styles.pillarDelay2][index] ?? styles.pillarDelay0;

  return (
    <div
      className={`rv ${styles.pillarCard} ${delayClass}`}
    >
      <div className={styles.pillarBar} />
      <div className={styles.pillarNumber}>
        {pillar.number}
      </div>
      <div className={styles.pillarTitle}>{pillar.title}</div>
      <p className={styles.pillarBody}>{pillar.body}</p>
      <div className={styles.tagList}>
        {pillar.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
