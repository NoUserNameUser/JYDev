"use client";

import styles from "./PortfolioSections.module.css";

type MarqueeSectionProps = {
  items: string[];
};

export function MarqueeSection({ items }: MarqueeSectionProps) {
  const doubled = [...items, ...items];

  return (
    <div className={styles.marquee} aria-label="Technology and product strengths">
      <div className={styles.marqueeTrack}>
        {doubled.map((item, index) => (
          <div key={`${item}-${index}`} className={styles.marqueeItem}>
            {item}
            <span className={styles.marqueeDot} aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}
