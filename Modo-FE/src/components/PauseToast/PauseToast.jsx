import styles from "./PauseToast.module.css";

export default function PauseToast({ onClose }) {
  return (
    <div className={styles.toast}>
      <p className={styles.toastText}>
        보유한 일시정지권이 없습니다. 상점에서 구매해주세요.
      </p>
    </div>
  );
}

