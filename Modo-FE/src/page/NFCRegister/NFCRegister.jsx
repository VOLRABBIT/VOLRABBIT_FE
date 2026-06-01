import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import NFCTagToast from "../../components/NFCTagToast/NFCTagToast";
import nfcIcon from "../../assets/tabler_nfc.svg";
import styles from "./NFCRegister.module.css";

export default function NFCRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [tagName, setTagName] = useState("");
  const [step1Completed, setStep1Completed] = useState(false);
  const [step2Completed, setStep2Completed] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleBack = () => {
    navigate("/mypage");
  };

  const handleNext = () => {
    // 태그 등록 성공 토스트 표시
    setShowSuccessToast(true);
    // 성공 후 Step 1 완료 처리 및 Step 2로 이동
    setTimeout(() => {
      setShowSuccessToast(false);
      setStep1Completed(true);
      setStep(2);
    }, 2000);
  };

  const handleComplete = () => {
    if (tagName.trim()) {
      setStep2Completed(true);
    }
  };

  const handleRegister = () => {
    if (step === 1) {
      handleNext();
    } else if (step === 2 && tagName.trim() && !step2Completed) {
      handleComplete();
    } else if (step1Completed && step2Completed) {
      // 최종 등록 완료 - toast 없이 바로 돌아가기
      navigate("/nfc-settings", {
        state: { newTag: { id: Date.now(), name: tagName } }
      });
    }
  };

  return (
    <div className={styles.container}>
      <TopBar
        title="NFC 태그 등록"
        onBack={handleBack}
        showSkip={false}
        textColor="dark"
      />

      <div className={styles.content}>
        {/* Step 1 완료 카드 */}
        {step1Completed && (
          <div className={styles.completedStepCard}>
            <div className={styles.stepBadge}>1</div>
            <span className={styles.completedStepText}>태그 등록이 완료되었습니다.</span>
          </div>
        )}

        {/* Step 1 진행 중 카드 */}
        {!step1Completed && (
          <div className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <div className={styles.stepBadge}>1</div>
              <div className={styles.stepInfo}>
                <h3 className={styles.stepTitle}>태그 등록하기</h3>
                <p className={styles.stepDescription}>
                  태그를 원하는 위치에 부착하고, 기기를 가까이 가져다 대세요.
                </p>
              </div>
            </div>
            <button className={styles.stepButton} onClick={handleNext}>
              다음
            </button>
          </div>
        )}

        {/* Step 2 완료 카드 */}
        {step2Completed && (
          <div className={styles.completedStepCard}>
            <div className={styles.stepBadge}>2</div>
            <span className={styles.completedStepText}>태그 이름: {tagName}</span>
          </div>
        )}

        {/* Step 2 진행 중 카드 */}
        {step === 2 && !step2Completed && (
          <div className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <div className={styles.stepBadge}>2</div>
              <div className={styles.stepInfo}>
                <h3 className={styles.stepTitle}>태그 이름을 설정하기</h3>
                <p className={styles.stepDescription}>
                  태그 이름을 10글자 이내로 설정해주세요.
                </p>
              </div>
            </div>
            <input
              type="text"
              className={styles.tagNameInput}
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="태그 이름 입력"
              maxLength={10}
            />
            <button
              className={styles.stepButton}
              onClick={handleComplete}
              disabled={!tagName.trim()}
            >
              완료
            </button>
          </div>
        )}

        {/* 최종 확인 카드 */}
        {step1Completed && step2Completed && (
          <div className={styles.confirmCard}>
            <div className={styles.nfcIconContainer}>
              <img src={nfcIcon} alt="NFC" className={styles.nfcIcon} />
            </div>
            <p className={styles.confirmText}>
              <span className={styles.tagNameText}>'{tagName}'</span>
              <span className={styles.confirmQuestionText}> 태깅을 등록하시겠습니까?</span>
            </p>
          </div>
        )}
      </div>

      {/* 등록하기 버튼 */}
      <div className={styles.footer}>
        <button
          className={styles.registerButton}
          onClick={handleRegister}
          disabled={!(step1Completed && step2Completed)}
        >
          등록하기
        </button>
      </div>

      {/* 성공 토스트 */}
      <NFCTagToast
        message="태그가 성공적으로 등록되었습니다."
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  );
}

