import StepCard from "../components/StepCard";
import StepDropdown from "../components/StepDropdown";
import styles from "../GuildQuestRegister.module.css";
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
      summaryValue={repeatCycle}
      stepClass={`step4 ${repeatDropdownOpen && !isCompleted ? "step4WithDropdown" : ""}`}
    >
      <StepDropdown
        placeholder="반복 주기"
        selectedValue={repeatCycle}
        options={repeatOptions}
        isOpen={repeatDropdownOpen}
        onToggle={onRepeatToggle}
        onSelect={handleRepeatSelect}
        stepClass="step4"
      />
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
