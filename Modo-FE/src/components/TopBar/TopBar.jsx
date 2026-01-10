import styles from "./TopBar.module.css";
import arrowLeftIcon from "../../assets/icon/arrow-left.svg";
import closeIcon from "../../assets/icon/close.svg";

export default function TopBar({
  title,
  onBack,
  onSkip,
  onClose,
  showSkip = false,
  showClose = false,
  textColor = "dark", 
}) {
  const titleClassName = textColor === "light" 
    ? `${styles.topTitle} ${styles.topTitleLight}` 
    : styles.topTitle;

  return (
    <div className={styles.topBar}>
      {showClose ? (
        <div className={styles.backButtonPlaceholder} />
      ) : (
        <button className={styles.backButton} onClick={onBack}>
          <img src={arrowLeftIcon} className={styles.backIcon} alt="뒤로가기" />
        </button>
      )}
      <span className={titleClassName}>{title}</span>
      {showSkip ? (
        <button className={styles.skipButton} onClick={onSkip}>
          건너뛰기
        </button>
      ) : showClose ? (
        <button className={styles.closeButton} onClick={onClose}>
          <img src={closeIcon} className={styles.closeIcon} alt="닫기" />
        </button>
      ) : (
        <div className={styles.skipButtonPlaceholder} />
      )}
    </div>
  );
}

