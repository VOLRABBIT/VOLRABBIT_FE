import { useState } from "react";
import styles from "./BattleStartModal.module.css";

export default function BattleStartModal({
  tasks = [],
  onClose,
  onStart,
}) {
  const [selectedTaskId, setSelectedTaskId] = useState(tasks.length > 0 ? tasks[0].id : null);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleStart = () => {
    if (selectedTaskId && onStart) {
      const selectedTask = tasks.find(t => t.id === selectedTaskId);
      onStart(selectedTask);
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <p className={styles.title}>어떤 전투를 시작할까요?</p>
          </div>
          <div className={styles.descriptionContainer}>
            <p className={styles.description}>전투를 선택하면 바로 타이머가 시작됩니다.</p>
          </div>
        </div>

        {/* 태스크 리스트 */}
        <div className={styles.taskList}>
          {tasks.map((task, index) => {
            const isSelected = selectedTaskId === task.id;
            const topPosition = index === 0 ? 8.49 : 8.49 + index * 66.406;
            return (
              <button
                key={task.id}
                className={`${styles.taskButton} ${isSelected ? styles.taskButtonSelected : ""}`}
                onClick={() => setSelectedTaskId(task.id)}
                style={{ top: `${topPosition}px` }}
              >
                <div className={`${styles.radioButton} ${isSelected ? styles.radioButtonSelected : ""}`}>
                  {isSelected && <div className={styles.radioButtonInner} />}
                </div>
                <div className={styles.taskText}>
                  <p className={styles.taskTitle}>{task.title}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* 버튼 */}
        <div className={styles.footer}>
          <button className={styles.startButton} onClick={handleStart}>
            <span className={styles.buttonText}>시작하기</span>
          </button>
          <button className={styles.cancelButton} onClick={handleCancel}>
            <span className={styles.buttonText}>취소</span>
          </button>
        </div>
      </div>
    </div>
  );
}

