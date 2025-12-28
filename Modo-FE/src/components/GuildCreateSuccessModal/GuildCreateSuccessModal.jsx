import { useState } from "react";
import styles from "./GuildCreateSuccessModal.module.css";
import closeIcon from "../../assets/icon/close.svg";
import CopySuccessToast from "./CopySuccessToast";

export default function GuildCreateSuccessModal({ guildName, guildCode, onClose, onCopyCode }) {
  const [showToast, setShowToast] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCopyCode = () => {
    if (guildCode) {
      navigator.clipboard.writeText(guildCode);
      setShowToast(true);
      if (onCopyCode) {
        onCopyCode();
      }
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={closeIcon} alt="닫기" />
        </button>
        <div className={styles.header}>
          <h2 className={styles.title}>새로운 길드가 생성되었습니다!</h2>
        </div>
        <div className={styles.body}>
          <div className={styles.content}>
            <p className={styles.message}>
              {guildName}이 성공적으로 창설되었습니다!
            </p>
            <p className={styles.message}>
              만들어진 길드는
            </p>
            <p className={styles.message}>
              [마이페이지]에서 관리할 수 있습니다.
            </p>
          </div>
        </div>
        <div className={styles.footer}>
          <button className={styles.copyButton} onClick={handleCopyCode}>
            공유 코드 복사하기
          </button>
        </div>
      </div>
      {showToast && (
        <CopySuccessToast onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}

