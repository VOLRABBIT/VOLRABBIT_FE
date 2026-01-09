import styles from "./NFCTagToast.module.css";

export default function NFCTagToast({ message, isVisible, onClose }) {
  if (!isVisible) return null;

  return (
    <div className={styles.toastContainer}>
      <div className={styles.toast}>
        <p className={styles.toastMessage}>{message}</p>
      </div>
    </div>
  );
}

