import styles from "./TaskActionBar.module.css";
import taskIcon from "../../assets/navbar/task.svg";
import taskAddIcon from "../../assets/navbar/task-add.svg";
import reportIcon from "../../assets/navbar/report.svg";

export default function TaskActionBar() {
  const items = [
    { id: "task-rebuild", label: "task 재구성", icon: taskIcon },
    { id: "task-add", label: "", icon: taskAddIcon },
    { id: "report", label: "리포트", icon: reportIcon },
  ];

  return (
    <nav className={styles.actionBar}>
      <div className={styles.actionBarBackground} />
      <div className={styles.menuContainer}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.menuItem}
          >
            <div className={styles.iconWrapper}>
              <img src={item.icon} alt={item.label || item.id} className={styles.icon} />
            </div>
            {item.label && <span className={styles.label}>{item.label}</span>}
          </button>
        ))}
      </div>
    </nav>
  );
}


