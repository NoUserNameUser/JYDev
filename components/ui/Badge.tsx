import { cn } from "@/lib/utils";
import styles from "./Ui.module.css";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export function Badge({ children, className }: BadgeProps) {
  return (
    <span className={cn(styles.badge, className)}>
      {children}
    </span>
  );
}
