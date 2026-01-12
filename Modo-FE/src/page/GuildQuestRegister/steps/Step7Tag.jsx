import StepCard from "../components/StepCard";
import styles from "../GuildQuestRegister.module.css";
import { tagOptions } from "../constants";

export default function Step7Tag({
  selectedTag,
  onTagSelect,
  isCompleted,
  isActive,
  onNext,
  canProceed,
}) {
  return (
    <StepCard
      stepNumber={7}
      title="태그 선택하기"
      description="인증할 태그의 종류를 선택해주세요."
      isCompleted={isCompleted}
      summaryValue={selectedTag}
      stepClass="step7"
    >
      <div className={styles.verificationTagContainer}>
        {tagOptions.map((tag) => (
          <button
            key={tag}
            className={`${styles.verificationTag} ${selectedTag === tag ? styles.verificationTagActive : ""}`}
            onClick={() => onTagSelect(tag)}
          >
            {tag}
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
