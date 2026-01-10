import StepCard from "../components/StepCard";
import StepDropdown from "../components/StepDropdown";
import Calendar from "../components/Calendar";
import styles from "../GuildQuestRegister.module.css";
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
      summaryValue={deadline === "직접 입력" ? customDeadline : deadline}
      stepClass={`step3 ${deadline === "직접 입력" && !isCompleted ? "step3WithCalendar" : ""}`}
    >
      <StepDropdown
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
      </StepDropdown>
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
