import StepCard from "../components/StepCard";
import styles from "../GuildQuestRegister.module.css";
import { categories } from "../constants";

export default function Step2Category({
  category,
  customCategory,
  onCategorySelect,
  onCustomCategoryChange,
  isCompleted,
  isActive,
  onNext,
  canProceed,
}) {
  return (
    <StepCard
      stepNumber={2}
      title="카테고리 선택하기"
      description="입력한 퀘스트의 카테고리를 설정해주세요."
      isCompleted={isCompleted}
      summaryValue={customCategory || category}
      stepClass="step2"
    >
      <div className={styles.tagContainer}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.tag} ${category === cat ? styles.tagActive : ""}`}
            onClick={() => onCategorySelect(cat)}
          >
            {cat}
          </button>
        ))}
        <div className={`${styles.tagInputWrapper} ${customCategory ? styles.tagInputActive : ""}`}>
          <input
            type="text"
            className={styles.tagInput}
            value={customCategory}
            onChange={onCustomCategoryChange}
            placeholder="입력"
            maxLength={10}
          />
        </div>
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
