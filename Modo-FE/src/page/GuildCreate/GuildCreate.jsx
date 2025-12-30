import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GuildCreateSuccessModal from "../../components/GuildCreateSuccessModal/GuildCreateSuccessModal";
import styles from "./GuildCreate.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";

export default function GuildCreate() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [guildName, setGuildName] = useState("");
  const [memberCount, setMemberCount] = useState(null);
  const [customMemberCount, setCustomMemberCount] = useState("");
  const [duration, setDuration] = useState(null);
  const [durationUnit, setDurationUnit] = useState(null);
  const [customDuration, setCustomDuration] = useState("");
  const [guildCode, setGuildCode] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 길드 고유 코드 생성 (랜덤 5자리 영문+숫자)
  const generateGuildCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  useEffect(() => {
    if (currentStep === 4 && !guildCode) {
      const newCode = generateGuildCode();
      setTimeout(() => {
        setGuildCode(newCode);
      }, 0);
    }
  }, [currentStep, guildCode]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleGuildNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setGuildName(value);
    }
  };

  const handleMemberCountSelect = (count) => {
    setMemberCount(count);
    setCustomMemberCount("");
  };

  const handleCustomMemberCountChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    setCustomMemberCount(numericValue);
    setMemberCount(null);
  };

  const handleDurationSelect = (dur) => {
    setDuration(dur);
    setCustomDuration("");
    setDurationUnit(null);
  };

  const handleDurationUnitSelect = (unit) => {
    setDurationUnit(unit);
    setDuration(null);
  };

  const handleCustomDurationChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    setCustomDuration(numericValue);
    setDuration(null);
  };

  const handleNext = () => {
    if (currentStep <= 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCreate = () => {
    console.log("길드 생성:", {
      name: guildName,
      memberCount: memberCount || customMemberCount,
      duration: duration || (customDuration && durationUnit ? `${customDuration}${durationUnit}` : ""),
      code: guildCode,
    });
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/guild");
  };

  const handleCopyCode = () => {
    console.log("공유 코드 복사:", guildCode);
  };

  const canProceedStep1 = guildName.trim().length > 0;
  const canProceedStep2 = memberCount !== null || customMemberCount.trim().length > 0;
  const canProceedStep3 = duration !== null || (durationUnit !== null && customDuration.trim().length > 0);
  const canProceedStep4 = guildCode.length === 5;
  const canCreate = canProceedStep1 && canProceedStep2 && canProceedStep3 && canProceedStep4 && currentStep > 4;
  
  // step별 완료 상태 표시를 위한 값들
  const displayMemberCount = memberCount ? `${memberCount}명` : (customMemberCount ? `${customMemberCount}명` : "");
  const displayDuration = duration || (customDuration && durationUnit ? `${customDuration}${durationUnit === "월" ? "개월" : durationUnit}` : "");
  const displayCode = guildCode || "";

  const isStepCompleted = (stepNum) => {
    return stepNum < currentStep;
  };

  const isStepActive = (stepNum) => {
    return stepNum === currentStep;
  };

  return (
    <div className={styles.container} style={{ position: 'relative' }}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={arrowLeftIcon} alt="뒤로가기" />
        </button>
        <h1 className={styles.title}>길드 생성하기</h1>
        <div className={styles.placeholder}></div>
      </div>

      <div className={styles.content}>
        {/* Step 1: 길드 이름 */}
        {isStepCompleted(1) ? (
          <div className={`${styles.stepCard} ${styles.stepCardSummary} ${styles.step1}`}>
            <div className={styles.stepSummaryHeader}>
              <div className={styles.stepNumber}>1</div>
              <p className={styles.stepSummaryValue}>{guildName}</p>
            </div>
          </div>
        ) : (
          <div className={`${styles.stepCard} ${styles.step1}`}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepInfo}>
                <h2 className={styles.stepTitle}>길드 이름 입력하기</h2>
                <p className={styles.stepDescription}>
                  길드 이름을 10글자 내로 입력하세요.
                </p>
              </div>
            </div>
            {isStepActive(1) && (
              <>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={guildName}
                    onChange={handleGuildNameChange}
                    placeholder="길드 이름을 입력하세요"
                    maxLength={10}
                  />
                </div>
                <button
                  className={`${styles.nextButton} ${!canProceedStep1 ? styles.nextButtonDisabled : ""}`}
                  onClick={handleNext}
                  disabled={!canProceedStep1}
                >
                  다음
                </button>
              </>
            )}
          </div>
        )}

        {/* Step 2: 길드 인원 */}
        {isStepCompleted(2) ? (
          <div className={`${styles.stepCard} ${styles.stepCardSummary} ${styles.step2}`}>
            <div className={styles.stepSummaryHeader}>
              <div className={styles.stepNumber}>2</div>
              <p className={styles.stepSummaryValue}>{displayMemberCount}</p>
            </div>
          </div>
        ) : (
          <div className={`${styles.stepCard} ${styles.step2}`}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepInfo}>
                <h2 className={styles.stepTitle}>길드 인원 설정</h2>
                <p className={styles.stepDescription}>
                  길드의 최대 인원을 설정해주세요.
                </p>
              </div>
            </div>
            {!isStepCompleted(2) && (
              <>
                <div className={styles.tagContainer}>
                  {[2, 3, 4, 5, 6].map((count) => (
                    <button
                      key={count}
                      className={`${styles.tag} ${memberCount === count ? styles.tagActive : ""}`}
                      onClick={() => handleMemberCountSelect(count)}
                    >
                      {count}명
                    </button>
                  ))}
                  <div className={`${styles.tagInputWrapper} ${customMemberCount ? styles.tagInputActive : ""}`}>
                    <input
                      type="text"
                      className={styles.tagInput}
                      value={customMemberCount}
                      onChange={handleCustomMemberCountChange}
                      placeholder="입력"
                      maxLength={10}
                    />
                    {customMemberCount && (
                      <span className={styles.tagInputSuffix}>명</span>
                    )}
                  </div>
                </div>
                <button
                  className={`${styles.nextButton} ${!isStepActive(2) || !canProceedStep2 ? styles.nextButtonDisabled : ""}`}
                  onClick={handleNext}
                  disabled={!isStepActive(2) || !canProceedStep2}
                >
                  다음
                </button>
              </>
            )}
          </div>
        )}

        {/* Step 3: 길드 유지 기간 */}
        {isStepCompleted(3) ? (
          <div className={`${styles.stepCard} ${styles.stepCardSummary} ${styles.step3}`}>
            <div className={styles.stepSummaryHeader}>
              <div className={styles.stepNumber}>3</div>
              <p className={styles.stepSummaryValue}>{displayDuration}</p>
            </div>
          </div>
        ) : (
          <div className={`${styles.stepCard} ${styles.step3}`}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepInfo}>
                <h2 className={styles.stepTitle}>길드 유지 기간</h2>
                <p className={styles.stepDescription}>
                  길드의 유지 기간을 설정해주세요.
                </p>
              </div>
            </div>
            {!isStepCompleted(3) && (
              <>
                <div className={styles.tagContainer}>
                  {["일주일", "1개월", "6개월", "1년"].map((dur) => (
                    <button
                      key={dur}
                      className={`${styles.tag} ${duration === dur ? styles.tagActive : ""}`}
                      onClick={() => handleDurationSelect(dur)}
                    >
                      {dur}
                    </button>
                  ))}
                  <div className={`${styles.durationInputWrapper} ${customDuration && durationUnit ? styles.tagInputActive : ""}`}>
                    <input
                      type="text"
                      className={styles.durationInput}
                      value={customDuration}
                      onChange={handleCustomDurationChange}
                      placeholder="입력"
                      maxLength={10}
                    />
                    <div className={styles.durationUnitButtons}>
                      {["주", "월", "년"].map((unit) => (
                        <button
                          key={unit}
                          type="button"
                          className={`${styles.durationUnitButton} ${durationUnit === unit ? styles.durationUnitButtonActive : ""}`}
                          onClick={() => handleDurationUnitSelect(unit)}
                        >
                          {unit}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  className={`${styles.nextButton} ${!isStepActive(3) || !canProceedStep3 ? styles.nextButtonDisabled : ""}`}
                  onClick={handleNext}
                  disabled={!isStepActive(3) || !canProceedStep3}
                >
                  다음
                </button>
              </>
            )}
          </div>
        )}

        {/* Step 4: 길드 고유 코드 */}
        {isStepCompleted(4) ? (
          <div className={`${styles.stepCard} ${styles.stepCardSummary} ${styles.step4}`}>
            <div className={styles.stepSummaryHeader}>
              <div className={styles.stepNumber}>4</div>
              <p className={styles.stepSummaryValue}>{displayCode}</p>
            </div>
          </div>
        ) : (
          <div className={`${styles.stepCard} ${styles.step4}`}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepInfo}>
                <h2 className={styles.stepTitle}>길드 고유 코드</h2>
                <p className={styles.stepDescription}>
                  길드 고유 코드를 공유하세요!
                </p>
              </div>
            </div>
            {!isStepCompleted(4) && (
              <>
                <div className={styles.codeContainer}>
                  {guildCode ? (
                    guildCode.split("").map((char, index) => (
                      <div key={index} className={styles.codeBox}>
                        {char}
                      </div>
                    ))
                  ) : (
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className={styles.codeBox}></div>
                    ))
                  )}
                </div>
                <button
                  className={`${styles.nextButton} ${!isStepActive(4) || !canProceedStep4 ? styles.nextButtonDisabled : ""}`}
                  onClick={handleNext}
                  disabled={!isStepActive(4) || !canProceedStep4}
                >
                  다음
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <button 
          className={`${styles.createButton} ${!canCreate ? styles.createButtonDisabled : ""}`}
          onClick={handleCreate}
          disabled={!canCreate}
        >
          생성하기
        </button>
      </div>
      {showSuccessModal && (
        <GuildCreateSuccessModal
          guildName={guildName}
          guildCode={guildCode}
          onClose={handleCloseSuccessModal}
          onCopyCode={handleCopyCode}
        />
      )}
    </div>
  );
}

