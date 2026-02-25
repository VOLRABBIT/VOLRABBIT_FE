import StepCard from "../../../components/StepCard/StepCard";
import taskStyles from "../../TaskCreate/TaskCreate.module.css";
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
      isActive={isActive}
      summaryValue={customCategory || category}
      stepClass="step2"
      buttonColor="#7DA7DB"
    >
      <div className={`${taskStyles.categoryTags} ${styles.guildCategoryTags}`}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${taskStyles.categoryTag} ${styles.guildCategoryTag} ${category === cat ? taskStyles.categoryTagSelected : ""}`}
            onClick={() => onCategorySelect(cat)}
            style={{
              backgroundColor: category === cat ? "#7DA7DB80" : "#7DA7DB4D",
              color: category === cat ? "#52528F" : "#8391DD",
            }}
          >
            {cat}
          </button>
        ))}
        <div
          className={`${taskStyles.categoryTag} ${styles.guildCategoryTag} ${styles.customCategoryChip} ${customCategory ? taskStyles.categoryTagSelected : ""}`}
          style={{
            backgroundColor: customCategory ? "#7DA7DB80" : "#7DA7DB4D",
            color: customCategory ? "#52528F" : "#8391DD",
          }}
        >
          <input
            type="text"
            className={styles.customCategoryInput}
            value={customCategory}
            onChange={onCustomCategoryChange}
            placeholder="입력"
            maxLength={10}
          />
        </div>
      </div>
      <button
        className={`${taskStyles.nextButton} ${!canProceed || !isActive ? taskStyles.nextButtonDisabled : ""}`}
        onClick={onNext}
        disabled={!canProceed || !isActive}
        style={{ backgroundColor: "#7DA7DB" }}
      >
        다음
      </button>
    </StepCard>
  );
}