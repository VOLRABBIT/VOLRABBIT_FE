import styles from "../GuildQuestRegister.module.css";

export default function StepHeader({ stepNumber, title, description }) {
  return (
    <div className={styles.stepHeader}>
      <div className={styles.stepNumber}>{stepNumber}</div>
      <div className={styles.stepInfo}>
        <h3 className={styles.stepTitle}>{title}</h3>
        <p className={styles.stepDescription}>{description}</p>
      </div>
    </div>
  );
}
