import styles from "./TaskGiveUpRetryModal.module.css";
import closeIcon from "../../assets/icon/close.svg";

export default function TaskGiveUpRetryModal({ onClose, onRetry, onGiveUp }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  const handleGiveUp = () => {
    if (onGiveUp) {
      onGiveUp();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={closeIcon} alt="닫기" className={styles.closeIcon} />
        </button>
        <div className={styles.header}>
          <h2 className={styles.title}>포기한 전투를 다시 진행해볼까요?</h2>
        </div>
        <div className={styles.body}>
          <div className={styles.content}>
            <p className={styles.contentText}>
              포기한 전투를 내일 다시 진행해볼까요?
            </p>
            <p className={styles.contentText}>
              이대로 포기하기엔 아쉬워요.
            </p>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.actions}>
            <button className={styles.confirmButton} onClick={handleRetry}>
              내일 진행하기
            </button>
            <button className={styles.cancelButton} onClick={handleGiveUp}>
              포기하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

