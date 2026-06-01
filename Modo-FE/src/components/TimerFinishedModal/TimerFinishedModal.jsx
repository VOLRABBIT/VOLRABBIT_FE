import { useNavigate } from "react-router-dom";
import styles from "./TimerFinishedModal.module.css";
import closeIcon from "../../assets/icon/close.svg";
import { getLocationButtonColor } from "../../utils/locationTheme";

export default function TimerFinishedModal({
  taskTitle,
  taskId,
  onClose,
  onConfirm,
  locationType = "dungeon",
}) {
  const navigate = useNavigate();
  const buttonColor = getLocationButtonColor(locationType);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleGiveUp = () => {
    onClose();
    if (taskTitle) {
      console.log("TimerFinishedModal - navigating with locationType:", locationType);
      navigate(`/task-failed-review/${locationType}`, { state: { taskTitle, taskId, locationType } });
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={closeIcon} alt="닫기" className={styles.closeIcon} />
        </button>
        <div className={styles.header}>
          <h2 className={styles.title}>타이머가 종료되었습니다</h2>
        </div>
        <div className={styles.body}>
          <div className={styles.content}>
            <p className={styles.contentText}>
              {taskTitle ? `(${taskTitle})` : "전투"} 시간이 모두 지났습니다.
            </p>
            <p className={styles.contentText}>
              어떻게 하시겠어요?
            </p>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.actions}>
            <button 
              className={styles.confirmButton} 
              onClick={handleConfirm}
              style={{ backgroundColor: buttonColor }}
            >
              계속하기
            </button>
            <button className={styles.cancelButton} onClick={handleGiveUp}>
              포기하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
