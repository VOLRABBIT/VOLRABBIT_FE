import StepCard from "../../../components/StepCard/StepCard";
import taskStyles from "../../TaskCreate/TaskCreate.module.css";
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
      isActive={isActive}
      summaryValue={verification}
      stepClass="step6"
      buttonColor="#7DA7DB"
    >
      <div className={taskStyles.verificationTags}>
        {verificationOptions.map((option) => (
          <button
            key={option}
            className={`${taskStyles.verificationTag} ${verification === option ? taskStyles.verificationTagSelected : ""}`}
            onClick={() => onVerificationSelect(option)}
            style={{
              backgroundColor: verification === option ? "#7DA7DB80" : "#7DA7DB4D",
              color: verification === option ? "#52528F" : "#8391DD",
            }}
          >
            {option}
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