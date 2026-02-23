import styles from "./TaskCompleteModal.module.css";
import closeIcon from "../../assets/icon/close.svg";
import { getLocationButtonColor } from "../../utils/locationTheme";

export default function TaskCompleteModal({
  taskTitle,
  onClose,
  onConfirm,
  onGiveUp,
  onRetry,
  errorMessage,
  isLoading = false,
  locationType = "dungeon",
}) {
  const buttonColor = getLocationButtonColor(locationType);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  const handleGiveUp = () => {
    onGiveUp?.();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={closeIcon} alt="닫기" className={styles.closeIcon} />
        </button>
        <div className={styles.header}>
          <h2 className={styles.title}>To Do를 완료하셨나요?</h2>
        </div>
        <div className={styles.body}>
          <div className={styles.content}>
            <p className={styles.contentText}>
              {taskTitle ? `(${taskTitle})을 완료하셨다면,` : "(to do 내용)을 완료하셨다면,"}
            </p>
            <p className={styles.contentText}>
              선택한 방법으로 인증을 진행해주세요.
            </p>
            {errorMessage ? (
              <p className={styles.errorText}>{errorMessage}</p>
            ) : null}
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.actions}>
            <button 
              className={styles.confirmButton} 
              onClick={handleConfirm}
              disabled={isLoading}
              style={{ backgroundColor: buttonColor }}
            >
              {isLoading ? "처리 중..." : "인증하기"}
            </button>
            <button className={styles.cancelButton} onClick={handleGiveUp} disabled={isLoading}>
              포기하기
            </button>
          </div>
          {errorMessage ? (
            <button className={styles.retryButton} onClick={onRetry ?? handleConfirm}>
              다시 시도
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}