import { cn } from "@/lib/utils";
import styles from "./Ui.module.css";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
};

export function Button({ children, className, type = "button" }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(styles.button, className)}
    >
      {children}
    </button>
  );
}
