import { useEffect } from "react";
import styles from "./InvalidTagToast.module.css";

export default function InvalidTagToast({ onClose, duration = 3000 }) {
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
      <p className={styles.toastMessage}>해당 투두의 태그가 아니예요.</p>
    </div>
  );
}

