import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StepCard from "../../components/StepCard/StepCard";
import Dropdown from "../../components/Dropdown/Dropdown";
import TaskActionBar from "../../components/TaskActionBar/TaskActionBar";
import styles from "./TaskCreate.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import mapBackground from "../../assets/map/MAP-1.png";
import taskFightIcon from "../../assets/task-fight.svg";

export default function TaskCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const editTaskData = location.state?.task;
  const isEditMode = location.state?.isEditMode || false;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [taskName, setTaskName] = useState("");
  const [category, setCategory] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [customDeadline, setCustomDeadline] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [repeatCycle, setRepeatCycle] = useState(null);
  const [subdivision, setSubdivision] = useState(null);
  const [verification, setVerification] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (isEditMode && editTaskData) {
      setTaskName(editTaskData.title || "");
      setCategory(editTaskData.category || null);
      // 기존 데이터에 없는 필드들은 기본값 유지
    }
  }, [isEditMode, editTaskData]);

  // 드롭다운 상태
  const [deadlineDropdownOpen, setDeadlineDropdownOpen] = useState(false);
  const [repeatDropdownOpen, setRepeatDropdownOpen] = useState(false);
  const [subdivisionDropdownOpen, setSubdivisionDropdownOpen] = useState(false);

  const categories = ["과제", "건강", "집안일", "아르바이트", "휴식"];
  const deadlineOptions = ["오늘", "내일", "직접 입력"];
  const repeatOptions = ["없음", "매일", "매주", "매달"];
  const subdivisionOptions = ["없음", "2단계로 세분화", "3단계로 세분화", "Auto"];
  const verificationOptions = ["자가 체크", "사진", "태깅"];
  const tagOptions = ["전공책", "세탁기", "기숙사 테이블"];

  const handleBack = () => {
    navigate(-1);
  };

  const handleTaskNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setTaskName(value);
    }
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat);
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
    setDeadlineDropdownOpen(false);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    setCustomDeadline(dateStr);
    setDeadline("직접 입력");
  };

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
    setRepeatDropdownOpen(false);
  };

  const handleSubdivisionSelect = (option) => {
    setSubdivision(option);
    setSubdivisionDropdownOpen(false);
  };

  const handleVerificationSelect = (option) => {
    setVerification(option);
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
  };

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
    console.log("태스크 생성 완료", {
      taskName,
      category,
      deadline,
      repeatCycle,
      subdivision,
      verification,
      selectedTag,
    });
    navigate(-1);
  };

  const canProceedStep1 = taskName.length > 0;
  const canProceedStep2 = category !== null;
  const canProceedStep3 = deadline !== null && (deadline !== "직접 입력" || customDeadline.length > 0);
  const canProceedStep4 = repeatCycle !== null;
  const canProceedStep5 = subdivision !== null;
  const canProceedStep6 = verification !== null;
  const canProceedStep7 = selectedTag !== null;

  const isStepCompleted = (step) => currentStep > step;
  const isStepActive = (step) => currentStep === step;

  const getStepSummary = (step) => {
    switch (step) {
      case 1:
        return taskName;
      case 2:
        return category;
      case 3:
        const deadlineValue = deadline === "직접 입력" ? customDeadline : deadline;
        return deadlineValue ? `${deadlineValue}까지` : "";
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

  // 완료 화면
  if (currentStep === 8) {
    return (
      <div className={styles.container}>
        {/* 배경 이미지 */}
        <div className={styles.backgroundImage}>
          <img src={mapBackground} alt="배경" />
        </div>

        {/* 헤더 */}
        <div className={styles.header}>
          <button
            className={styles.backButton}
            onClick={() =>
              setCurrentStep(verification === "태깅" ? 7 : 6)
            }
          >
            <img src={arrowLeftIcon} alt="뒤로가기" />
          </button>
          <h1 className={styles.headerTitle}>
            {isEditMode ? "전투 task 수정하기" : "전투 task 작성하기"}
          </h1>
        </div>

        <div className={`${styles.content} ${styles.completeContent}`}>
          {/* 모든 step의 요약 카드들 */}
          {verification === "태깅"
            ? [1, 2, 3, 4, 5, 6, 7].map((step) => (
                <StepCard
                  key={step}
                  stepNumber={step}
                  isCompleted={true}
                  summaryValue={getStepSummary(step)}
                  stepClass="summaryMode"
                />
              ))
            : [1, 2, 3, 4, 5, 6].map((step) => (
                <StepCard
                  key={step}
                  stepNumber={step}
                  isCompleted={true}
                  summaryValue={getStepSummary(step)}
                  stepClass="summaryMode"
                />
              ))}

          {/* 확인 모달 */}
          <div className={styles.confirmModal}>
            <div className={styles.modalIcon}>
              <img src={taskFightIcon} alt="전투 아이콘" />
            </div>
            <div className={styles.modalContent}>
              <p className={styles.modalTaskName}>{taskName}</p>
              <p className={styles.modalTaskInfo}>
                {deadline === "직접 입력" ? customDeadline : deadline}
              </p>
              <p className={styles.modalTaskInfo}>{verification}</p>
              <p className={styles.modalQuestion}>
                {isEditMode ? "전투를 수정하시겠습니까?" : "전투를 추가하시겠습니까?"}
              </p>
            </div>
          </div>

          <div className={styles.registerSection}>
            <button
              className={styles.registerButton}
              onClick={handleComplete}
            >
              {isEditMode ? "수정하기" : "추가하기"}
            </button>
          </div>
        </div>

        <TaskActionBar />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 배경 이미지 */}
      <div className={styles.backgroundImage}>
        <img src={mapBackground} alt="배경" />
      </div>

      <div className={styles.content}>
        {/* 헤더 */}
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={arrowLeftIcon} alt="뒤로가기" />
          </button>
          <h1 className={styles.headerTitle}>
            {isEditMode ? "전투 task 수정하기" : "전투 task 작성하기"}
          </h1>
        </div>

        {/* Step 1: 전투 내용 입력하기 */}
        <StepCard
          stepNumber={1}
          title="전투 내용 입력하기"
          description="할 일을 10글자 내로 입력하세요."
          isCompleted={isStepCompleted(1)}
          isActive={isStepActive(1)}
          summaryValue={getStepSummary(1)}
          stepClass="step1"
        >
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.taskInput}
              value={taskName}
              onChange={handleTaskNameChange}
              placeholder=""
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
        {isStepCompleted(1) && (
          <StepCard
            stepNumber={2}
            title="카테고리 선택하기"
            description="입력한 할 일의 카테고리를 설정해주세요."
            isCompleted={isStepCompleted(2)}
            isActive={isStepActive(2)}
            summaryValue={getStepSummary(2)}
            stepClass="step2"
          >
          <div className={styles.categoryTags}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.categoryTag} ${category === cat ? styles.categoryTagSelected : ""}`}
                onClick={() => handleCategorySelect(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            className={`${styles.nextButton} ${!canProceedStep2 || !isStepActive(2) ? styles.nextButtonDisabled : ""}`}
            onClick={() => handleNext(2)}
            disabled={!canProceedStep2 || !isStepActive(2)}
          >
            다음
          </button>
        </StepCard>
        )}

        {/* Step 3: 마감 기한 설정하기 */}
        {isStepCompleted(2) && (
          <StepCard
            stepNumber={3}
            title="마감 기한 설정하기"
            description="입력한 할 일의 마감 기한을 설정해주세요."
            isCompleted={isStepCompleted(3)}
            isActive={isStepActive(3)}
            summaryValue={getStepSummary(3)}
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
                        // 일요일만 빨간색
                        const isRedDate = isSunday;
                        
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
        )}

        {/* Step 4: 반복 여부 확인하기 */}
        {isStepCompleted(3) && (
          <StepCard
            stepNumber={4}
            title="반복 여부 확인하기"
            description="오늘 내로 끝나는 일이라면 '없음'을 선택해주세요."
            isCompleted={isStepCompleted(4)}
            isActive={isStepActive(4)}
            summaryValue={getStepSummary(4)}
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
        )}

        {/* Step 5: 세분화 단계 설정하기 */}
        {isStepCompleted(4) && (
          <StepCard
            stepNumber={5}
            title="세분화 단계 설정하기"
            description="할 일을 작은 일로 세분화할 수 있어요."
            isCompleted={isStepCompleted(5)}
            isActive={isStepActive(5)}
            summaryValue={getStepSummary(5)}
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
        )}

        {/* Step 6: 인증방식 선택하기 */}
        {isStepCompleted(5) && (
          <StepCard
            stepNumber={6}
            title="인증방식 선택하기"
            description="할 일의 인증 방식을 선택해주세요."
            isCompleted={isStepCompleted(6)}
            isActive={isStepActive(6)}
            summaryValue={getStepSummary(6)}
            stepClass="step6"
          >
            <div className={styles.verificationTags}>
              {verificationOptions.map((option) => (
                <button
                  key={option}
                  className={`${styles.verificationTag} ${verification === option ? styles.verificationTagSelected : ""}`}
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
              {verification === "태깅" ? "다음" : "완료"}
            </button>
          </StepCard>
        )}

        {/* Step 7: 태그 선택하기 (태깅 선택 시) */}
        {verification === "태깅" && isStepCompleted(6) && (
          <StepCard
            stepNumber={7}
            title="태그 선택하기"
            description="인증할 태그의 종류를 선택해주세요."
            isCompleted={isStepCompleted(7)}
            isActive={isStepActive(7)}
            summaryValue={getStepSummary(7)}
            stepClass="step7"
          >
            <div className={styles.verificationTags}>
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  className={`${styles.verificationTag} ${
                    selectedTag === tag ? styles.verificationTagSelected : ""
                  }`}
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            <button
              className={`${styles.nextButton} ${
                !canProceedStep7 || !isStepActive(7)
                  ? styles.nextButtonDisabled
                  : ""
              }`}
              onClick={() => handleNext(7)}
              disabled={!canProceedStep7 || !isStepActive(7)}
            >
              완료
            </button>
          </StepCard>
        )}
      </div>

      <TaskActionBar />
    </div>
  );
}

