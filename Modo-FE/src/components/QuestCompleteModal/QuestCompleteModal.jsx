import styles from "./QuestCompleteModal.module.css";

export default function QuestCompleteModal({
  questTask,
  onClose,
  onConfirm,
}) {
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
        <div className={styles.header}>
          <h2 className={styles.title}>{questTask}을(를) 완료하셨나요?</h2>
        </div>
        <div className={styles.footer}>
          <div className={styles.actions}>
            <button className={styles.cancelButton} onClick={onClose}>
              취소
            </button>
            <button className={styles.confirmButton} onClick={handleConfirm}>
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

