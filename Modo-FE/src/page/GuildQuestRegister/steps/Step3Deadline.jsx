import StepCard from "../../../components/StepCard/StepCard";
import Dropdown from "../../../components/Dropdown/Dropdown";
import Calendar from "../components/Calendar";
import taskStyles from "../../TaskCreate/TaskCreate.module.css";
import { deadlineOptions } from "../constants";

export default function Step3Deadline({
  deadline,
  customDeadline,
  selectedDate,
  deadlineDropdownOpen,
  onDeadlineToggle,
  onDeadlineSelect,
  onDateSelect,
  isCompleted,
  isActive,
  onNext,
  canProceed,
}) {
  const handleDeadlineSelect = (option) => {
    onDeadlineSelect(option);
    onDeadlineToggle(false);
  };

  return (
    <StepCard
      stepNumber={3}
      title="마감 기한 설정하기"
      description="입력한 할 일의 마감 기한을 설정해주세요."
      isCompleted={isCompleted}
      isActive={isActive}
      summaryValue={deadline === "직접 입력" ? customDeadline : deadline}
      stepClass={`step3 ${deadline === "직접 입력" && !isCompleted ? "step3WithCalendar" : ""}`}
      buttonColor="#7DA7DB"
    >
      <Dropdown
        placeholder="마감 기한"
        selectedValue={deadline}
        options={deadlineOptions}
        isOpen={deadlineDropdownOpen}
        onToggle={onDeadlineToggle}
        onSelect={handleDeadlineSelect}
        stepClass="step3"
      >
        {deadline === "직접 입력" && !deadlineDropdownOpen && (
          <Calendar selectedDate={selectedDate} onDateSelect={onDateSelect} />
        )}
      </Dropdown>
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