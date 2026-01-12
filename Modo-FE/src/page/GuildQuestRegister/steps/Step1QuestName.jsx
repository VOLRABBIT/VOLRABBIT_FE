import StepCard from "../components/StepCard";
import styles from "../GuildQuestRegister.module.css";

export default function Step1QuestName({
  questName,
  onQuestNameChange,
  isCompleted,
  isActive,
  onNext,
  canProceed,
}) {
  return (
    <StepCard
      stepNumber={1}
      title="길드 퀘스트 입력하기"
      description="길드 퀘스트를 10글자 내로 입력하세요."
      isCompleted={isCompleted}
      summaryValue={questName}
      stepClass="step1"
    >
      <div className={styles.inputWrapper}>
        <input
          type="text"
          className={styles.textInput}
          value={questName}
          onChange={onQuestNameChange}
          maxLength={10}
        />
      </div>
      <button
        className={`${styles.nextButton} ${!canProceed || !isActive ? styles.nextButtonDisabled : ""}`}
        onClick={onNext}
        disabled={!canProceed || !isActive}
      >
        다음
      </button>
    </StepCard>
  );
}
