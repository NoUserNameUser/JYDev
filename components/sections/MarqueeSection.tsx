"use client";

import styles from "./PortfolioSections.module.css";

type MarqueeSectionProps = {
  items: string[];
};

export function MarqueeSection({ items }: MarqueeSectionProps) {
  const doubled = [...items, ...items];

  return (
    <div className={styles.marquee}>
      <div className={styles.marqueeTrack}>
        {doubled.map((item, i) => (
          <div
            key={`${item}-${i}`}
            className={styles.marqueeItem}
          >
            {item}
            <span className={styles.marqueeDot}>◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
