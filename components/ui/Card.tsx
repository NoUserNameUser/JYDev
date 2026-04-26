import { cn } from "@/lib/utils";
import styles from "./Ui.module.css";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn(styles.card, className)}>
      {children}
    </div>
  );
}
