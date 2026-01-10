import styles from "../GuildQuestRegister.module.css";

export default function StepSummary({ stepNumber, value }) {
  return (
    <div className={styles.stepSummary}>
      <div className={styles.stepNumber}>{stepNumber}</div>
      <p className={styles.stepSummaryValue}>{value}</p>
    </div>
  );
}
