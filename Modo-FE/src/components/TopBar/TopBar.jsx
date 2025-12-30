import styles from "./TopBar.module.css";
import arrowLeftIcon from "../../assets/icon/arrow-left.svg";

export default function TopBar({
  title,
  onBack,
  onSkip,
  showSkip = false,
  textColor = "dark", 
}) {
  const titleClassName = textColor === "light" 
    ? `${styles.topTitle} ${styles.topTitleLight}` 
    : styles.topTitle;

  return (
    <div className={styles.topBar}>
      <button className={styles.backButton} onClick={onBack}>
        <img src={arrowLeftIcon} className={styles.backIcon} alt="뒤로가기" />
      </button>
      <span className={titleClassName}>{title}</span>
      {showSkip ? (
        <button className={styles.skipButton} onClick={onSkip}>
          건너뛰기
        </button>
      ) : (
        <div className={styles.skipButtonPlaceholder} />
      )}
    </div>
  );
}

