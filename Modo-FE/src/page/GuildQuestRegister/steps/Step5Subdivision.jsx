import StepCard from "../../../components/StepCard/StepCard";
import Dropdown from "../../../components/Dropdown/Dropdown";
import taskStyles from "../../TaskCreate/TaskCreate.module.css";
import { subdivisionOptions } from "../constants";

export default function Step5Subdivision({
  subdivision,
  subdivisionDropdownOpen,
  onSubdivisionToggle,
  onSubdivisionSelect,
  isCompleted,
  isActive,
  onNext,
  canProceed,
}) {
  const handleSubdivisionSelect = (option) => {
    onSubdivisionSelect(option);
    onSubdivisionToggle(false);
  };

  return (
    <StepCard
      stepNumber={5}
      title="세분화 단계 설정하기"
      description="할 일을 작은 일로 세분화할 수 있어요."
      isCompleted={isCompleted}
      isActive={isActive}
      summaryValue={subdivision}
      stepClass={`step5 ${subdivisionDropdownOpen && !isCompleted ? "step5WithDropdown" : ""}`}
      buttonColor="#7DA7DB"
    >
      <Dropdown
        placeholder="단계별 세분화"
        selectedValue={subdivision}
        options={subdivisionOptions}
        isOpen={subdivisionDropdownOpen}
        onToggle={onSubdivisionToggle}
        onSelect={handleSubdivisionSelect}
        stepClass="step5"
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