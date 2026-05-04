import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import styles from "./Ui.module.css";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  spacing?: "default" | "compact";
};

export function Section({ children, className, id, spacing = "default" }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(styles.section, spacing === "compact" && styles.sectionCompact, className)}
    >
      {children}
    </section>
  );
}
