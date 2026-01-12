import StepCard from "../components/StepCard";
import styles from "../GuildQuestRegister.module.css";
import { verificationOptions } from "../constants";

export default function Step6Verification({
  verification,
  onVerificationSelect,
  isCompleted,
  isActive,
  onNext,
  canProceed,
}) {
  return (
    <StepCard
      stepNumber={6}
      title="인증방식 선택하기"
      description="할 일의 인증 방식을 선택해주세요."
      isCompleted={isCompleted}
      summaryValue={verification}
      stepClass="step6"
    >
      <div className={styles.verificationTagContainer}>
        {verificationOptions.map((option) => (
          <button
            key={option}
            className={`${styles.verificationTag} ${verification === option ? styles.verificationTagActive : ""}`}
            onClick={() => onVerificationSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        className={`${styles.nextButton} ${!canProceed || !isActive ? styles.nextButtonDisabled : ""}`}
        onClick={onNext}
        disabled={!canProceed || !isActive}
      >
        완료
      </button>
    </StepCard>
  );
}
