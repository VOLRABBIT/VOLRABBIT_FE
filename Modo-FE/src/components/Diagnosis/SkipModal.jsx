import closeIcon from "../../assets/icon/close.svg";
import styles from "./SkipModal.module.css";

// 건너뛰기 확인 모달
export default function SkipModal({
  title,
  content,
  stopButtonText,
  continueButtonText,
  onClose,
  onStop,
}) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>
          <img src={closeIcon} className={styles.modalCloseIcon} alt="닫기" />
        </button>
        <h3 className={styles.modalTitle}>{title}</h3>
        <div className={styles.modalContent}>
          <p className={styles.modalContentText}>
            {content.split('<br></br>').map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
        <div className={styles.modalButtons}>
          <button className={styles.modalButtonStop} onClick={onStop}>
            {stopButtonText}
          </button>
          <button className={styles.modalButtonContinue} onClick={onClose}>
            {continueButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

