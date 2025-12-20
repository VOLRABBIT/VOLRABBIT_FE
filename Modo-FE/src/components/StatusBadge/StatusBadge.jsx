import styles from "./StatusBadge.module.css";

const StatusBadge = ({ type = "normal", children }) => {
  return (
    <div className={`${styles.statusBadge} ${styles[type]}`}>
      <span className={styles.dot} />
      <span className={styles.text}>{children}</span>
    </div>
  );
};

export default StatusBadge;

