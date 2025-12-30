import { useEffect } from "react";
import styles from "./Toast.module.css";

export default function Toast({ message, onClose, duration = 3000 }) {
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
      <p className={styles.toastMessage}>{message}</p>
    </div>
  );
}

