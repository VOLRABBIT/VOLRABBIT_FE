import StepCard from "../../../components/StepCard/StepCard";
import taskStyles from "../../TaskCreate/TaskCreate.module.css";

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
      isActive={isActive}
      summaryValue={questName}
      stepClass="step1"
      buttonColor="#7DA7DB"
    >
      <div className={taskStyles.inputWrapper}>
        <input
          type="text"
          className={taskStyles.taskInput}
          value={questName}
          onChange={onQuestNameChange}
          maxLength={10}
        />
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