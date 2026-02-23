import StepCard from "../../../components/StepCard/StepCard";
import taskStyles from "../../TaskCreate/TaskCreate.module.css";
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
      isActive={isActive}
      summaryValue={selectedTag}
      stepClass="step7"
      buttonColor="#7DA7DB"
    >
      <div className={taskStyles.verificationTags}>
        {tagOptions.map((tag) => (
          <button
            key={tag}
            className={`${taskStyles.verificationTag} ${selectedTag === tag ? taskStyles.verificationTagSelected : ""}`}
            onClick={() => onTagSelect(tag)}
            style={{
              backgroundColor: selectedTag === tag ? "#7DA7DB80" : "#7DA7DB4D",
              color: selectedTag === tag ? "#52528F" : "#8391DD",
            }}
          >
            {tag}
          </button>
        ))}
      </div>
      <button
        className={`${taskStyles.nextButton} ${!canProceed || !isActive ? taskStyles.nextButtonDisabled : ""}`}
        onClick={onNext}
        disabled={!canProceed || !isActive}
        style={{ backgroundColor: "#7DA7DB" }}
      >
        완료
      </button>
    </StepCard>
  );
}