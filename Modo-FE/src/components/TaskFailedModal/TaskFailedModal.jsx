import styles from "./TaskFailedModal.module.css";
import closeIcon from "../../assets/icon/close.svg";

export default function TaskFailedModal({ onClose, onConfirm }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={closeIcon} alt="닫기" className={styles.closeIcon} />
        </button>
        <div className={styles.header}>
          <h2 className={styles.title}>실패한 전투가 있어요.</h2>
        </div>
        <div className={styles.body}>
          <div className={styles.content}>
            <p className={styles.contentText}>
              어제까지 달성하지 못한 전투가 있어요.
            </p>
            <p className={styles.contentText}>
              실패한 전투를 회고해볼까요?
            </p>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.actions}>
            <button className={styles.confirmButton} onClick={handleConfirm}>
              회고하기
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

