import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./GuildQuestRegister.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import Step1QuestName from "./steps/Step1QuestName";
import Step2Category from "./steps/Step2Category";
import Step3Deadline from "./steps/Step3Deadline";
import Step4Repeat from "./steps/Step4Repeat";
import Step5Subdivision from "./steps/Step5Subdivision";
import Step6Verification from "./steps/Step6Verification";
import Step7Tag from "./steps/Step7Tag";
import CompleteStep from "./components/CompleteStep";

export default function GuildQuestRegister() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [questName, setQuestName] = useState("");
  const [category, setCategory] = useState(null);
  const [customCategory, setCustomCategory] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [customDeadline, setCustomDeadline] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [repeatCycle, setRepeatCycle] = useState(null);
  const [subdivision, setSubdivision] = useState(null);
  const [verification, setVerification] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  // 드롭다운 상태 관리
  const [deadlineDropdownOpen, setDeadlineDropdownOpen] = useState(false);
  const [repeatDropdownOpen, setRepeatDropdownOpen] = useState(false);
  const [subdivisionDropdownOpen, setSubdivisionDropdownOpen] = useState(false);


  const handleBack = () => {
    navigate(-1);
  };

  const handleQuestNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setQuestName(value);
    }
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setCustomCategory("");
  };

  const handleCustomCategoryChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setCustomCategory(value);
      setCategory(null);
    }
  };

  const handleDeadlineSelect = (option) => {
    setDeadline(option);
    if (option !== "직접 입력") {
      setCustomDeadline("");
      setSelectedDate(null);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    setCustomDeadline(`${year}.${month}.${day}`);
    setDeadline("직접 입력");
  };

  const handleRepeatSelect = (option) => {
    setRepeatCycle(option);
  };

  const handleSubdivisionSelect = (option) => {
    setSubdivision(option);
  };

  const handleVerificationSelect = (option) => {
    setVerification(option);
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
  };

  // 다음 step으로 이동
  const handleNext = (step) => {
    if (currentStep !== step) return;
    
    if (step < 6) {
      setCurrentStep(step + 1);
    } else if (step === 6) {
      setCurrentStep(verification === "태깅" ? 7 : 8);
    } else if (step === 7) {
      setCurrentStep(8);
    }
  };

  const handleComplete = () => {
    console.log("퀘스트 등록 완료", {
      questName,
      category,
      deadline,
      repeatCycle,
      subdivision,
      verification,
    });
    navigate(-1);
  };

  // Step 진행 가능 여부
  const canProceedSteps = {
    1: questName.length > 0,
    2: category !== null || customCategory.length > 0,
    3: deadline !== null && (deadline !== "직접 입력" || customDeadline.length > 0),
    4: repeatCycle !== null,
    5: subdivision !== null,
    6: verification !== null,
    7: selectedTag !== null,
  };

  const canProceedStep1 = canProceedSteps[1];
  const canProceedStep2 = canProceedSteps[2];
  const canProceedStep3 = canProceedSteps[3];
  const canProceedStep4 = canProceedSteps[4];
  const canProceedStep5 = canProceedSteps[5];
  const canProceedStep6 = canProceedSteps[6];
  const canProceedStep7 = canProceedSteps[7];
  const canRegister = currentStep === 8;

  const isStepCompleted = (step) => currentStep > step;
  const isStepActive = (step) => currentStep === step;

  const handleRegister = () => {
    if (canRegister) {
      handleComplete();
    }
  };

  // 요약 카드
  const getSummaryValue = (step) => {
    switch (step) {
      case 1:
        return questName;
      case 2:
        return customCategory || category;
      case 3:
        return deadline === "직접 입력" ? customDeadline : deadline;
      case 4:
        return repeatCycle;
      case 5:
        return subdivision;
      case 6:
        return verification;
      case 7:
        return selectedTag;
      default:
        return "";
    }
  };

  if (currentStep === 8) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={() => setCurrentStep(verification === "태깅" ? 7 : 6)}>
            <img src={arrowLeftIcon} alt="뒤로가기" />
          </button>
          <h1 className={styles.title}>길드 퀘스트 등록하기</h1>
          <div className={styles.placeholder}></div>
        </div>

        <CompleteStep
          verification={verification}
          getSummaryValue={getSummaryValue}
          questName={questName}
          deadline={deadline}
          customDeadline={customDeadline}
        />

        <div className={styles.registerSection}>
          <button
            className={`${styles.registerButton} ${
              !canRegister ? styles.completeButtonDisabled : ""
            }`}
            onClick={handleRegister}
            disabled={!canRegister}
          >
            등록하기
          </button>
        </div>

        <Navbar activeItem="guild" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={arrowLeftIcon} alt="뒤로가기" />
        </button>
        <h1 className={styles.title}>길드 퀘스트 등록하기</h1>
        <div className={styles.placeholder}></div>
      </div>

      <div className={styles.content}>
        <Step1QuestName
          questName={questName}
          onQuestNameChange={handleQuestNameChange}
          isCompleted={isStepCompleted(1)}
          isActive={isStepActive(1)}
          onNext={() => handleNext(1)}
          canProceed={canProceedStep1}
        />

        {isStepCompleted(1) && (
          <Step2Category
            category={category}
            customCategory={customCategory}
            onCategorySelect={handleCategorySelect}
            onCustomCategoryChange={handleCustomCategoryChange}
            isCompleted={isStepCompleted(2)}
            isActive={isStepActive(2)}
            onNext={() => handleNext(2)}
            canProceed={canProceedStep2}
          />
        )}

        {isStepCompleted(2) && (
          <Step3Deadline
            deadline={deadline}
            customDeadline={customDeadline}
            selectedDate={selectedDate}
            deadlineDropdownOpen={deadlineDropdownOpen}
            onDeadlineToggle={(open) => {
              setDeadlineDropdownOpen(open);
              if (open) {
                setRepeatDropdownOpen(false);
                setSubdivisionDropdownOpen(false);
              }
            }}
            onDeadlineSelect={handleDeadlineSelect}
            onDateSelect={handleDateSelect}
            isCompleted={isStepCompleted(3)}
            isActive={isStepActive(3)}
            onNext={() => handleNext(3)}
            canProceed={canProceedStep3}
          />
        )}

        {isStepCompleted(3) && (
          <Step4Repeat
            repeatCycle={repeatCycle}
            repeatDropdownOpen={repeatDropdownOpen}
            onRepeatToggle={(open) => {
              setRepeatDropdownOpen(open);
              if (open) {
                setDeadlineDropdownOpen(false);
                setSubdivisionDropdownOpen(false);
              }
            }}
            onRepeatSelect={handleRepeatSelect}
            isCompleted={isStepCompleted(4)}
            isActive={isStepActive(4)}
            onNext={() => handleNext(4)}
            canProceed={canProceedStep4}
          />
        )}

        {isStepCompleted(4) && (
          <Step5Subdivision
            subdivision={subdivision}
            subdivisionDropdownOpen={subdivisionDropdownOpen}
            onSubdivisionToggle={(open) => {
              setSubdivisionDropdownOpen(open);
              if (open) {
                setDeadlineDropdownOpen(false);
                setRepeatDropdownOpen(false);
              }
            }}
            onSubdivisionSelect={handleSubdivisionSelect}
            isCompleted={isStepCompleted(5)}
            isActive={isStepActive(5)}
            onNext={() => handleNext(5)}
            canProceed={canProceedStep5}
          />
        )}

        {isStepCompleted(5) && (
          <Step6Verification
            verification={verification}
            onVerificationSelect={handleVerificationSelect}
            isCompleted={isStepCompleted(6)}
            isActive={isStepActive(6)}
            onNext={() => handleNext(6)}
            canProceed={canProceedStep6}
          />
        )}

        {isStepCompleted(6) && verification === "태깅" && (
          <Step7Tag
            selectedTag={selectedTag}
            onTagSelect={handleTagSelect}
            isCompleted={isStepCompleted(7)}
            isActive={isStepActive(7)}
            onNext={() => handleNext(7)}
            canProceed={canProceedStep7}
          />
        )}
      </div>

      <div className={styles.registerSection}>
        <button
          className={`${styles.registerButton} ${
            !canRegister ? styles.completeButtonDisabled : ""
          }`}
          onClick={handleRegister}
          disabled={!canRegister}
        >
          등록하기
        </button>
      </div>

      <Navbar activeItem="guild" />
    </div>
  );
}
