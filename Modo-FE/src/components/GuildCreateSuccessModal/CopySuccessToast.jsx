import { useEffect } from "react";
import styles from "./CopySuccessToast.module.css";

export default function CopySuccessToast({ onClose, duration = 3000 }) {
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  return (
    <div className={styles.toast}>
      <p className={styles.message}>
        길드 고유 코드가 복사되었어요. 길드원을 모아보세요!
      </p>
    </div>
  );
}

