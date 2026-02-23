import StepCard from "../../../components/StepCard/StepCard";
import Dropdown from "../../../components/Dropdown/Dropdown";
import taskStyles from "../../TaskCreate/TaskCreate.module.css";
import { repeatOptions } from "../constants";

export default function Step4Repeat({
  repeatCycle,
  repeatDropdownOpen,
  onRepeatToggle,
  onRepeatSelect,
  isCompleted,
  isActive,
  onNext,
  canProceed,
}) {
  const handleRepeatSelect = (option) => {
    onRepeatSelect(option);
    onRepeatToggle(false);
  };

  return (
    <StepCard
      stepNumber={4}
      title="반복 여부 확인하기"
      description="오늘 내로 끝나는 일이라면 '없음'을 선택해주세요."
      isCompleted={isCompleted}
      isActive={isActive}
      summaryValue={repeatCycle}
      stepClass={`step4 ${repeatDropdownOpen && !isCompleted ? "step4WithDropdown" : ""}`}
      buttonColor="#7DA7DB"
    >
      <Dropdown
        placeholder="반복 주기"
        selectedValue={repeatCycle}
        options={repeatOptions}
        isOpen={repeatDropdownOpen}
        onToggle={onRepeatToggle}
        onSelect={handleRepeatSelect}
        stepClass="step4"
      />
      
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