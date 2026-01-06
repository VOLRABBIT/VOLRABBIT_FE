import { useNavigate } from "react-router-dom";
import styles from "./TaskActionBar.module.css";
import taskIcon from "../../assets/navbar/task.svg";
import taskAddIcon from "../../assets/navbar/task-add.svg";
import reportIcon from "../../assets/navbar/report.svg";

export default function TaskActionBar({ currentDate }) {
  const navigate = useNavigate();

  const handleItemClick = (itemId) => {
    switch (itemId) {
      case "task-rebuild":
        const dateStr = currentDate || (() => {
          const today = new Date();
          return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        })();
        navigate(`/task-rebuild/${dateStr}`);
        break;
      case "task-add":
        navigate("/task-create");
        break;
      case "report":
        navigate("/mypage");
        break;
      default:
        break;
    }
  };

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
            onClick={() => handleItemClick(item.id)}
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


