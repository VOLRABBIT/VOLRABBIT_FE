import styles from "../GuildQuestRegister.module.css";
import StepHeader from "./StepHeader";
import StepSummary from "./StepSummary";

export default function StepCard({
  stepNumber,
  title,
  description,
  isCompleted,
  summaryValue,
  stepClass,
  children,
}) {
  const stepClassNames = stepClass ? styles[stepClass] : "";
  const summaryClass = isCompleted ? styles.stepCardSummary : "";

  return (
    <div className={`${styles.stepCard} ${stepClassNames} ${summaryClass}`}>
      {!isCompleted && (
        <StepHeader stepNumber={stepNumber} title={title} description={description} />
      )}
      {isCompleted ? (
        <StepSummary stepNumber={stepNumber} value={summaryValue} />
      ) : (
        children
      )}
    </div>
  );
}
