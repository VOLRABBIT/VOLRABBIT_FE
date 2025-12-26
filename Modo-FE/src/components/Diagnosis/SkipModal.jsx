import closeIcon from "../../assets/icon/close.svg";

// 건너뛰기 확인 모달
export default function SkipModal({
  title,
  content,
  stopButtonText,
  continueButtonText,
  onClose,
  onStop,
  styles: customStyles,
}) {
  return (
    <div className={customStyles.modalOverlay} onClick={onClose}>
      <div className={customStyles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={customStyles.modalClose} onClick={onClose}>
          <img src={closeIcon} className={customStyles.modalCloseIcon} alt="닫기" />
        </button>
        <h3 className={customStyles.modalTitle}>{title}</h3>
        <div className={customStyles.modalContent}>
          <p className={customStyles.modalContentText}>
            {content.split('<br></br>').map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
        <div className={customStyles.modalButtons}>
          <button className={customStyles.modalButtonStop} onClick={onStop}>
            {stopButtonText}
          </button>
          <button className={customStyles.modalButtonContinue} onClick={onClose}>
            {continueButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

