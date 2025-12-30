import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import StepCard from "../../components/StepCard/StepCard";
import Dropdown from "../../components/Dropdown/Dropdown";
import styles from "./GuildQuestRegister.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import searchIcon from "../../assets/guild/search.svg";

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

  // 드롭다운 상태
  const [deadlineDropdownOpen, setDeadlineDropdownOpen] = useState(false);
  const [repeatDropdownOpen, setRepeatDropdownOpen] = useState(false);
  const [subdivisionDropdownOpen, setSubdivisionDropdownOpen] = useState(false);

  const categories = ["과제", "청소", "요리", "프로젝트"];
  const deadlineOptions = ["오늘", "내일", "직접 입력"];
  const repeatOptions = ["없음", "매일", "매주", "매달"];
  const subdivisionOptions = ["없음", "2단계로 세분화", "3단계로 세분화", "Auto"];
  const verificationOptions = ["자가 체크", "사진", "태깅"];

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
    if (option === "직접 입력") {
      setDeadline("직접 입력");
      setCustomDeadline("");
      setSelectedDate(null);
    } else {
      setDeadline(option);
      setCustomDeadline("");
      setSelectedDate(null);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    setCustomDeadline(dateStr);
  };

  // 달력 생성성
  const getCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const adjustedDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const days = [];
    
    for (let i = 0; i < adjustedDay; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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


  // 태깅이면 step7로, 아니면 step8로 이동
  const handleNext = (step) => {
    if (currentStep === step && step < 6) {
      setCurrentStep(step + 1);
    } else if (currentStep === step && step === 6) {
      if (verification === "태깅") {
        setCurrentStep(7);
      } else {
        setCurrentStep(8);
      }
    } else if (currentStep === step && step === 7) {
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

  const canProceedStep1 = questName.length > 0;
  const canProceedStep2 = category !== null || customCategory.length > 0;
  const canProceedStep3 =
    deadline !== null && (deadline !== "직접 입력" || customDeadline.length > 0);
  const canProceedStep4 = repeatCycle !== null;
  const canProceedStep5 = subdivision !== null;
  const canProceedStep6 = verification !== null;
  const canProceedStep7 = selectedTag !== null;
  const canRegister = currentStep === 8;

  const isStepCompleted = (step) => currentStep > step;
  const isStepActive = (step) => currentStep === step;

  const handleRegister = () => {
    if (!canRegister) return;
    handleComplete();
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

  const tagOptions = ["전공책", "세탁기", "기숙사 테이블"];

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

        <div className={`${styles.content} ${styles.completeContent}`}>
          {/* 모든 step의 요약 카드들 */}
          {verification === "태깅" ? [1, 2, 3, 4, 5, 6, 7].map((step) => (
            <StepCard
              key={step}
              stepNumber={step}
              isCompleted={true}
              summaryValue={getSummaryValue(step)}
            />
          )) : [1, 2, 3, 4, 5, 6].map((step) => (
            <StepCard
              key={step}
              stepNumber={step}
              isCompleted={true}
              summaryValue={getSummaryValue(step)}
            />
          ))}

          {/* 확인 모달 */}
          <div className={styles.confirmModal}>
            <div className={styles.modalIcon}>
              <img src={searchIcon} alt="검색 아이콘" />
            </div>
            <div className={styles.modalContent}>
              <p className={styles.modalQuestName}>{questName}</p>
              <p className={styles.modalQuestInfo}>
                {deadline === "직접 입력" ? customDeadline : deadline}
              </p>
              <p className={styles.modalQuestInfo}>{verification}</p>
              <p className={styles.modalQuestion}>퀘스트를 추가하시겠습니까?</p>
            </div>
          </div>
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
        {/* Step 1: 길드 퀘스트 입력하기 */}
        <StepCard
          stepNumber={1}
          title="길드 퀘스트 입력하기"
          description="길드 퀘스트를 10글자 내로 입력하세요."
          isCompleted={isStepCompleted(1)}
          isActive={isStepActive(1)}
          summaryValue={questName}
          stepClass="step1"
        >
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.textInput}
              value={questName}
              onChange={handleQuestNameChange}
              maxLength={10}
            />
          </div>
          <button
            className={`${styles.nextButton} ${!canProceedStep1 || !isStepActive(1) ? styles.nextButtonDisabled : ""}`}
            onClick={() => handleNext(1)}
            disabled={!canProceedStep1 || !isStepActive(1)}
          >
            다음
          </button>
        </StepCard>

        {/* Step 2: 카테고리 선택하기 */}
        <StepCard
          stepNumber={2}
          title="카테고리 선택하기"
          description="입력한 퀘스트의 카테고리를 설정해주세요."
          isCompleted={isStepCompleted(2)}
          isActive={isStepActive(2)}
          summaryValue={customCategory || category}
          stepClass="step2"
        >
          <div className={styles.tagContainer}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.tag} ${category === cat ? styles.tagActive : ""}`}
                onClick={() => handleCategorySelect(cat)}
              >
                {cat}
              </button>
            ))}
            <div className={`${styles.tagInputWrapper} ${customCategory ? styles.tagInputActive : ""}`}>
              <input
                type="text"
                className={styles.tagInput}
                value={customCategory}
                onChange={handleCustomCategoryChange}
                placeholder="입력"
                maxLength={10}
              />
            </div>
          </div>
          <button
            className={`${styles.nextButton} ${!canProceedStep2 || !isStepActive(2) ? styles.nextButtonDisabled : ""}`}
            onClick={() => handleNext(2)}
            disabled={!canProceedStep2 || !isStepActive(2)}
          >
            다음
          </button>
        </StepCard>

        {/* Step 3: 마감 기한 설정하기 */}
        <StepCard
          stepNumber={3}
          title="마감 기한 설정하기"
          description="입력한 할 일의 마감 기한을 설정해주세요."
          isCompleted={isStepCompleted(3)}
          isActive={isStepActive(3)}
          summaryValue={deadline === "직접 입력" ? customDeadline : deadline}
          stepClass={`step3 ${deadline === "직접 입력" && !isStepCompleted(3) ? "step3WithCalendar" : ""}`}
        >
          <Dropdown
            placeholder="마감 기한"
            selectedValue={deadline}
            options={deadlineOptions}
            isOpen={deadlineDropdownOpen}
            onToggle={(open) => {
              setDeadlineDropdownOpen(open);
              setRepeatDropdownOpen(false);
              setSubdivisionDropdownOpen(false);
            }}
            onSelect={handleDeadlineSelect}
            stepClass="step3"
          >
            {deadline === "직접 입력" && !deadlineDropdownOpen && (
              <div className={styles.calendarContainer}>
                <div className={styles.calendar}>
                  <div className={styles.calendarHeader}>
                    {weekDays.map((day, index) => (
                      <div key={day} className={`${styles.weekDay} ${index === 6 ? styles.weekDayRed : ""}`}>
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className={styles.calendarGrid}>
                    {getCalendarDays().map((date, index) => {
                      if (date === null) {
                        return <div key={`empty-${index}`} className={styles.calendarDayEmpty}></div>;
                      }
                      const dayNumber = date.getDate();
                      const dayOfWeek = date.getDay();
                      const isSunday = dayOfWeek === 0;
                      const isSelected = selectedDate && 
                        date.getDate() === selectedDate.getDate() &&
                        date.getMonth() === selectedDate.getMonth() &&
                        date.getFullYear() === selectedDate.getFullYear();
                      // 일요일이거나 7, 14, 21, 28일인 경우 빨간색
                      const isRedDate = isSunday || [7, 14, 21, 28].includes(dayNumber);
                      
                      return (
                        <button
                          key={date.getTime()}
                          type="button"
                          className={`${styles.calendarDay} ${isSelected ? styles.calendarDaySelected : ""} ${isRedDate ? styles.calendarDayRed : ""}`}
                          onClick={() => handleDateSelect(date)}
                        >
                          {dayNumber}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </Dropdown>
          <button
            className={`${styles.nextButton} ${!canProceedStep3 || !isStepActive(3) ? styles.nextButtonDisabled : ""}`}
            onClick={() => handleNext(3)}
            disabled={!canProceedStep3 || !isStepActive(3)}
          >
            다음
          </button>
        </StepCard>

        {/* Step 4: 반복 여부 확인하기 */}
        <StepCard
          stepNumber={4}
          title="반복 여부 확인하기"
          description="오늘 내로 끝나는 일이라면 '없음'을 선택해주세요."
          isCompleted={isStepCompleted(4)}
          isActive={isStepActive(4)}
          summaryValue={repeatCycle}
          stepClass={`step4 ${repeatDropdownOpen && !isStepCompleted(4) ? "step4WithDropdown" : ""}`}
        >
          <Dropdown
            placeholder="반복 주기"
            selectedValue={repeatCycle}
            options={repeatOptions}
            isOpen={repeatDropdownOpen}
            onToggle={(open) => {
              setRepeatDropdownOpen(open);
              setDeadlineDropdownOpen(false);
              setSubdivisionDropdownOpen(false);
            }}
            onSelect={handleRepeatSelect}
            stepClass="step4"
          />
          <button
            className={`${styles.nextButton} ${!canProceedStep4 || !isStepActive(4) ? styles.nextButtonDisabled : ""}`}
            onClick={() => handleNext(4)}
            disabled={!canProceedStep4 || !isStepActive(4)}
          >
            다음
          </button>
        </StepCard>

        {/* Step 5: 세분화 단계 설정하기 */}
        <StepCard
          stepNumber={5}
          title="세분화 단계 설정하기"
          description="할 일을 작은 일로 세분화할 수 있어요."
          isCompleted={isStepCompleted(5)}
          isActive={isStepActive(5)}
          summaryValue={subdivision}
          stepClass={`step5 ${subdivisionDropdownOpen && !isStepCompleted(5) ? "step5WithDropdown" : ""}`}
        >
          <Dropdown
            placeholder="단계별 세분화"
            selectedValue={subdivision}
            options={subdivisionOptions}
            isOpen={subdivisionDropdownOpen}
            onToggle={(open) => {
              setSubdivisionDropdownOpen(open);
              setDeadlineDropdownOpen(false);
              setRepeatDropdownOpen(false);
            }}
            onSelect={handleSubdivisionSelect}
            stepClass="step5"
          />
          <button
            className={`${styles.nextButton} ${!canProceedStep5 || !isStepActive(5) ? styles.nextButtonDisabled : ""}`}
            onClick={() => handleNext(5)}
            disabled={!canProceedStep5 || !isStepActive(5)}
          >
            다음
          </button>
        </StepCard>

        {/* Step 6: 인증방식 선택하기 */}
        <StepCard
          stepNumber={6}
          title="인증방식 선택하기"
          description="할 일의 인증 방식을 선택해주세요."
          isCompleted={isStepCompleted(6)}
          isActive={isStepActive(6)}
          summaryValue={verification}
          stepClass="step6"
        >
          <div className={styles.verificationTagContainer}>
            {verificationOptions.map((option) => (
              <button
                key={option}
                className={`${styles.verificationTag} ${verification === option ? styles.verificationTagActive : ""}`}
                onClick={() => handleVerificationSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            className={`${styles.nextButton} ${!canProceedStep6 || !isStepActive(6) ? styles.nextButtonDisabled : ""}`}
            onClick={() => handleNext(6)}
            disabled={!canProceedStep6 || !isStepActive(6)}
          >
            완료
          </button>
        </StepCard>

        {/* Step 7: 태그 선택하기 (태깅 선택 시에만 표시) */}
        {verification === "태깅" && (
          <StepCard
            stepNumber={7}
            title="태그 선택하기"
            description="인증할 태그의 종류를 선택해주세요."
            isCompleted={isStepCompleted(7)}
            isActive={isStepActive(7)}
            summaryValue={selectedTag}
            stepClass="step7"
          >
            <div className={styles.verificationTagContainer}>
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  className={`${styles.verificationTag} ${selectedTag === tag ? styles.verificationTagActive : ""}`}
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            <button
              className={`${styles.nextButton} ${!canProceedStep7 || !isStepActive(7) ? styles.nextButtonDisabled : ""}`}
              onClick={() => handleNext(7)}
              disabled={!canProceedStep7 || !isStepActive(7)}
            >
              완료
            </button>
          </StepCard>
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