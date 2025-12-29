import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./GuildQuestRegister.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import arrowDownIcon from "../../assets/icon/arrow-down.svg";
import arrowUpIcon from "../../assets/icon/arrow-up.svg";
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

  const deadlineDropdownRef = useRef(null);
  const repeatDropdownRef = useRef(null);
  const subdivisionDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        deadlineDropdownRef.current &&
        !deadlineDropdownRef.current.contains(event.target)
      ) {
        setDeadlineDropdownOpen(false);
      }
      if (
        repeatDropdownRef.current &&
        !repeatDropdownRef.current.contains(event.target)
      ) {
        setRepeatDropdownOpen(false);
      }
      if (
        subdivisionDropdownRef.current &&
        !subdivisionDropdownRef.current.contains(event.target)
      ) {
        setSubdivisionDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      setDeadlineDropdownOpen(false);
    } else {
      setDeadline(option);
      setCustomDeadline("");
      setSelectedDate(null);
      setDeadlineDropdownOpen(false);
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
            <div key={step} className={`${styles.stepCard} ${styles.stepCardSummary}`}>
              <div className={styles.stepSummary}>
                <div className={styles.stepNumber}>{step}</div>
                <p className={styles.stepSummaryValue}>{getSummaryValue(step)}</p>
              </div>
            </div>
          )) : [1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step} className={`${styles.stepCard} ${styles.stepCardSummary}`}>
              <div className={styles.stepSummary}>
                <div className={styles.stepNumber}>{step}</div>
                <p className={styles.stepSummaryValue}>{getSummaryValue(step)}</p>
              </div>
            </div>
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
        <div className={`${styles.stepCard} ${styles.step1} ${isStepCompleted(1) ? styles.stepCardSummary : ""}`}>
          {!isStepCompleted(1) && (
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepInfo}>
                <h3 className={styles.stepTitle}>길드 퀘스트 입력하기</h3>
                <p className={styles.stepDescription}>
                  길드 퀘스트를 10글자 내로 입력하세요.
                </p>
              </div>
            </div>
          )}
          {isStepCompleted(1) ? (
            <div className={styles.stepSummary}>
              <div className={styles.stepNumber}>1</div>
              <p className={styles.stepSummaryValue}>{questName}</p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Step 2: 카테고리 선택하기 */}
        <div className={`${styles.stepCard} ${styles.step2} ${isStepCompleted(2) ? styles.stepCardSummary : ""}`}>
          {!isStepCompleted(2) && (
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepInfo}>
                <h3 className={styles.stepTitle}>카테고리 선택하기</h3>
                <p className={styles.stepDescription}>
                  입력한 퀘스트의 카테고리를 설정해주세요.
                </p>
              </div>
            </div>
          )}
          {isStepCompleted(2) ? (
            <div className={styles.stepSummary}>
              <div className={styles.stepNumber}>2</div>
              <p className={styles.stepSummaryValue}>{customCategory || category}</p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Step 3: 마감 기한 설정하기 */}
        <div className={`${styles.stepCard} ${styles.step3} ${isStepCompleted(3) ? styles.stepCardSummary : ""} ${deadline === "직접 입력" && !isStepCompleted(3) ? styles.step3WithCalendar : ""}`}>
          {!isStepCompleted(3) && (
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepInfo}>
                <h3 className={styles.stepTitle}>마감 기한 설정하기</h3>
                <p className={styles.stepDescription}>
                  입력한 할 일의 마감 기한을 설정해주세요.
                </p>
              </div>
            </div>
          )}
          {isStepCompleted(3) ? (
            <div className={styles.stepSummary}>
              <div className={styles.stepNumber}>3</div>
              <p className={styles.stepSummaryValue}>
                {deadline === "직접 입력" ? customDeadline : deadline}
              </p>
            </div>
          ) : (
            <>
              <div className={styles.dropdownWrapper} ref={deadlineDropdownRef}>
                <button
                  className={`${styles.dropdownButton} ${deadline ? styles.selected : ""}`}
                  onClick={() => {
                    setDeadlineDropdownOpen(!deadlineDropdownOpen);
                    setRepeatDropdownOpen(false);
                    setSubdivisionDropdownOpen(false);
                  }}
                >
                  <span className={styles.dropdownPlaceholder}>
                    {deadline ? deadline : "마감 기한"}
                  </span>
                  <img 
                    src={deadlineDropdownOpen ? arrowUpIcon : arrowDownIcon} 
                    alt="드롭다운" 
                    className={styles.dropdownArrow}
                  />
                </button>
                {deadlineDropdownOpen && (
                  <div className={styles.dropdownList}>
                    {deadlineOptions.map((option) => (
                      <button
                        key={option}
                        className={styles.dropdownItem}
                        onClick={() => handleDeadlineSelect(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
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
              </div>
              <button
                className={`${styles.nextButton} ${!canProceedStep3 || !isStepActive(3) ? styles.nextButtonDisabled : ""}`}
                onClick={() => handleNext(3)}
                disabled={!canProceedStep3 || !isStepActive(3)}
              >
                다음
              </button>
            </>
          )}
        </div>

        {/* Step 4: 반복 여부 확인하기 */}
        <div className={`${styles.stepCard} ${styles.step4} ${isStepCompleted(4) ? styles.stepCardSummary : ""} ${repeatDropdownOpen && !isStepCompleted(4) ? styles.step4WithDropdown : ""}`}>
          {!isStepCompleted(4) && (
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepInfo}>
                <h3 className={styles.stepTitle}>반복 여부 확인하기</h3>
                <p className={styles.stepDescription}>
                  오늘 내로 끝나는 일이라면 '없음'을 선택해주세요.
                </p>
              </div>
            </div>
          )}
          {isStepCompleted(4) ? (
            <div className={styles.stepSummary}>
              <div className={styles.stepNumber}>4</div>
              <p className={styles.stepSummaryValue}>{repeatCycle}</p>
            </div>
          ) : (
            <>
              <div className={styles.dropdownWrapper} ref={repeatDropdownRef}>
                <button
                  className={`${styles.dropdownButton} ${repeatCycle ? styles.selected : ""}`}
                  onClick={() => {
                    setRepeatDropdownOpen(!repeatDropdownOpen);
                    setDeadlineDropdownOpen(false);
                    setSubdivisionDropdownOpen(false);
                  }}
                >
                  <span className={styles.dropdownPlaceholder}>
                    {repeatCycle ? repeatCycle : "반복 주기"}
                  </span>
                  <img 
                    src={repeatDropdownOpen ? arrowUpIcon : arrowDownIcon} 
                    alt="드롭다운" 
                    className={styles.dropdownArrow}
                  />
                </button>
                {repeatDropdownOpen && (
                  <div className={styles.dropdownList}>
                    {repeatOptions.map((option) => (
                      <button
                        key={option}
                        className={styles.dropdownItem}
                        onClick={() => handleRepeatSelect(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                className={`${styles.nextButton} ${!canProceedStep4 || !isStepActive(4) ? styles.nextButtonDisabled : ""}`}
                onClick={() => handleNext(4)}
                disabled={!canProceedStep4 || !isStepActive(4)}
              >
                다음
              </button>
            </>
          )}
        </div>

        {/* Step 5: 세분화 단계 설정하기 */}
        <div className={`${styles.stepCard} ${styles.step5} ${isStepCompleted(5) ? styles.stepCardSummary : ""} ${subdivisionDropdownOpen && !isStepCompleted(5) ? styles.step5WithDropdown : ""}`}>
          {!isStepCompleted(5) && (
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>5</div>
              <div className={styles.stepInfo}>
                <h3 className={styles.stepTitle}>세분화 단계 설정하기</h3>
                <p className={styles.stepDescription}>
                  할 일을 작은 일로 세분화할 수 있어요.
                </p>
              </div>
            </div>
          )}
          {isStepCompleted(5) ? (
            <div className={styles.stepSummary}>
              <div className={styles.stepNumber}>5</div>
              <p className={styles.stepSummaryValue}>{subdivision}</p>
            </div>
          ) : (
            <>
              <div className={styles.dropdownWrapper} ref={subdivisionDropdownRef}>
                <button
                  className={`${styles.dropdownButton} ${subdivision ? styles.selected : ""}`}
                  onClick={() => {
                    setSubdivisionDropdownOpen(!subdivisionDropdownOpen);
                    setDeadlineDropdownOpen(false);
                    setRepeatDropdownOpen(false);
                  }}
                >
                  <span className={styles.dropdownPlaceholder}>
                    {subdivision ? subdivision : "단계별 세분화"}
                  </span>
                  <img 
                    src={subdivisionDropdownOpen ? arrowUpIcon : arrowDownIcon} 
                    alt="드롭다운" 
                    className={styles.dropdownArrow}
                  />
                </button>
                {subdivisionDropdownOpen && (
                  <div className={styles.dropdownList}>
                    {subdivisionOptions.map((option) => (
                      <button
                        key={option}
                        className={styles.dropdownItem}
                        onClick={() => handleSubdivisionSelect(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                className={`${styles.nextButton} ${!canProceedStep5 || !isStepActive(5) ? styles.nextButtonDisabled : ""}`}
                onClick={() => handleNext(5)}
                disabled={!canProceedStep5 || !isStepActive(5)}
              >
                다음
              </button>
            </>
          )}
        </div>

        {/* Step 6: 인증방식 선택하기 */}
        <div
          className={`${styles.stepCard} ${styles.step6} ${
            isStepCompleted(6) ? styles.stepCardSummary : ""
          }`}
        >
          {!isStepCompleted(6) && (
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>6</div>
              <div className={styles.stepInfo}>
                <h3 className={styles.stepTitle}>인증방식 선택하기</h3>
                <p className={styles.stepDescription}>
                  할 일의 인증 방식을 선택해주세요.
                </p>
              </div>
            </div>
          )}
          {isStepCompleted(6) ? (
            <div className={styles.stepSummary}>
              <div className={styles.stepNumber}>6</div>
              <p className={styles.stepSummaryValue}>{verification}</p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Step 7: 태그 선택하기 (태깅 선택 시에만 표시) */}
        {verification === "태깅" && (
          <div className={`${styles.stepCard} ${styles.step7} ${isStepCompleted(7) ? styles.stepCardSummary : ""}`}>
            {!isStepCompleted(7) && (
              <div className={styles.stepHeader}>
                <div className={styles.stepNumber}>7</div>
                <div className={styles.stepInfo}>
                  <h3 className={styles.stepTitle}>태그 선택하기</h3>
                  <p className={styles.stepDescription}>
                    인증할 태그의 종류를 선택해주세요.
                  </p>
                </div>
              </div>
            )}
            {isStepCompleted(7) ? (
              <div className={styles.stepSummary}>
                <div className={styles.stepNumber}>7</div>
                <p className={styles.stepSummaryValue}>{selectedTag}</p>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
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