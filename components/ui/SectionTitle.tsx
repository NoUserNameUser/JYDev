import styles from "./Ui.module.css";

type SectionTitleProps = {
  number: string;
  title: string;
};

export function SectionTitle({ number, title }: SectionTitleProps) {
  return (
    <div className={`rv ${styles.sectionTitle}`}>
      <span className={styles.sectionNumber}>
        {number}
      </span>
      <h2 className={styles.sectionHeading}>
        {title}
      </h2>
      <div className={styles.sectionLine} />
    </div>
  );
}
