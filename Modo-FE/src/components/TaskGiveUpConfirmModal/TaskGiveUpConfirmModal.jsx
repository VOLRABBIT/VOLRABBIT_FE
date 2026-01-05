import styles from "./TaskGiveUpConfirmModal.module.css";
import closeIcon from "../../assets/icon/close.svg";

export default function TaskGiveUpConfirmModal({ onClose, onConfirm }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={closeIcon} alt="닫기" className={styles.closeIcon} />
        </button>
        <div className={styles.header}>
          <h2 className={styles.title}>전투를 포기하시겠습니까?</h2>
        </div>
        <div className={styles.body}>
          <div className={styles.content}>
            <p className={styles.contentText}>
              포기한 전투는 회복할 수 없어요.
            </p>
            <p className={styles.contentText}>
              끝까지 시도해보는 건 어때요?
            </p>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.actions}>
            <button className={styles.confirmButton} onClick={handleConfirm}>
              포기하기
            </button>
            <button className={styles.cancelButton} onClick={onClose}>
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

