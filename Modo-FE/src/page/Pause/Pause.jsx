import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import Navbar from "../../components/Navbar/Navbar";
import SkipModal from "../../components/Diagnosis/SkipModal";
import PauseToast from "../../components/PauseToast/PauseToast";
import styles from "./Pause.module.css";

export default function Pause() {
  const navigate = useNavigate();
  const [isPauseEnabled, setIsPauseEnabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // TODO: 실제 일시정지권 보유 여부를 API나 상태 관리에서 가져와야 함
  const [pauseTicketCount] = useState(0); // 일시정지권 개수 0또는 개수 설정 가능

  const handleBack = () => {
    navigate(-1);
  };

  const handleToggle = () => {
    if (!isPauseEnabled) {
      // 토글을 켤 때 모달 표시
      setShowModal(true);
    } else {
      // 토글을 끌 때는 바로 비활성화
      setIsPauseEnabled(false);
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    
    // 일시정지권이 없으면 알림창 표시
    if (pauseTicketCount === 0) {
      setShowToast(true);
      // 3초 후 알림창 자동 닫기
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } else {
      // 일시정지권이 있으면 토글 활성화
      setIsPauseEnabled(true);
      // TODO: 일시정지권 1개 소진 처리
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    // 모달을 취소로 닫았을 때는 토글 상태 유지 (변경하지 않음)
  };

  return (
    <div className={styles.container}>
      <TopBar
        title="일시정지"
        onBack={handleBack}
        showSkip={false}
        textColor="dark"
      />
      
      <div className={styles.content}>
        {/* 일시정지 버튼 활성화 섹션 */}
        <div className={styles.toggleSection}>
          <h2 className={styles.toggleTitle}>일시정지 버튼 활성화</h2>
          <label className={styles.toggleWrapper}>
            <input
              type="checkbox"
              className={styles.toggleInput}
              checked={isPauseEnabled}
              onChange={handleToggle}
            />
            <span className={styles.toggleSlider}>
              <span className={styles.toggleKnob}></span>
            </span>
          </label>
        </div>

        {/* 설명 섹션 */}
        <div className={styles.descriptionSection}>
          <h3 className={styles.descriptionTitle}>일시정지 버튼이란?</h3>
          <p className={styles.descriptionText}>
            오늘 날짜에 해당하는 전투를 딱 하루! 쉬어갈 수 있는 기능입니다.<br></br> 멀리 여행을 가거나, 혼자만의 휴식이 필요할 때 사용하길 바라요.
          </p>
        </div>
      </div>

      <Navbar activeItem="mypage" />

      {showModal && (
        <SkipModal
          title="일시정지권을 사용하시겠습니까?"
          content="일시정지권을 1개 소진하여,<br></br>오늘의 전투를 모두 중지합니다."
          stopButtonText="사용하기"
          continueButtonText="취소"
          onClose={handleModalClose}
          onStop={handleModalConfirm}
        />
      )}

      {showToast && <PauseToast />}
    </div>
  );
}

