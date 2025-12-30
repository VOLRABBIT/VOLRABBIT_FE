import styles from "./StepCard.module.css";

export default function StepCard({
  stepNumber,
  title,
  description,
  isCompleted,
  isActive,
  summaryValue,
  stepClass,
  children,
}) {
  const stepClassNames = stepClass
    ? stepClass
        .split(" ")
        .map((cls) => styles[cls])
        .filter(Boolean)
        .join(" ")
    : "";
  const summaryClass = isCompleted ? styles.stepCardSummary : "";

  return (
    <div className={`${styles.stepCard} ${stepClassNames} ${summaryClass}`}>
      {!isCompleted && (
        <div className={styles.stepHeader}>
          <div className={styles.stepNumber}>{stepNumber}</div>
          <div className={styles.stepInfo}>
            <h3 className={styles.stepTitle}>{title}</h3>
            <p className={styles.stepDescription}>{description}</p>
          </div>
        </div>
      )}
      {isCompleted ? (
        <div className={styles.stepSummary}>
          <div className={styles.stepNumber}>{stepNumber}</div>
          <p className={styles.stepSummaryValue}>{summaryValue}</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
