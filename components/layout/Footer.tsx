import { siteConfig } from "@/content/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.text}>
        © 2026 {siteConfig.name} - {siteConfig.tagline}
      </div>
      <div className={styles.tagline}>
        {siteConfig.chineseTagline}
      </div>
    </footer>
  );
}
