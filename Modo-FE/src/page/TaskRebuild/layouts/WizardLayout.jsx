import commonStyles from "../TaskRebuild.module.css";
import styles from "./WizardLayout.module.css";
import arrowLeftIcon from "../../../assets/arrow-left.svg";
import mapBackground from "../../../assets/map/MAP-1.png";
import playIcon from "../../../assets/play.svg";
import pauseIcon from "../../../assets/pause.svg";
import TaskActionBar from "../../../components/TaskActionBar/TaskActionBar";
import TaskCompleteModal from "../../../components/TaskCompleteModal/TaskCompleteModal";
import BattleStartModal from "../../../components/BattleStartModal/BattleStartModal";

export default function WizardLayout({
  formattedDate,
  handleBack,
  activeTasks,
  currentTask,
  isTimerRunning,
  handleTimerToggle,
  handleCardClick,
  dateStr,
  modalState,
  handleModalClose,
  handleModalConfirm,
  battleStartModalOpen,
  setBattleStartModalOpen,
  handleBattleStart,
  elapsedSeconds,
  formatElapsedTime,
}) {
  const timelineLabels = ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22", "24"];
  const lineTop = 42;
  const labelGap = 36;
  const taskBoxHeight = 68;
  const minTaskGap = 8;

  const getTaskPosition = (task) => {
    if (task.startTime === null || task.startTime === undefined) {
      return null;
    }
    
    const startHour = task.startTime;
    const labelIndex = startHour / 2;
    const labelPositionInFrame = labelIndex * labelGap;
    const labelPosition = lineTop + labelPositionInFrame;
    const dotOffset = 4;
    const dotPosition = labelPosition + dotOffset;
    const taskPosition = dotPosition;
    
    return Math.max(0, taskPosition);
  };

  const getTaskHeight = (task) => {
    if (task.duration === null || task.duration === undefined) {
      return taskBoxHeight;
    }
    const durationSlots = task.duration / 2;
    const calculatedHeight = durationSlots * labelGap;
    return Math.max(taskBoxHeight, calculatedHeight);
  };

  const isOverlapping = (task1, task2) => {
    const start1 = task1.startTime;
    const end1 = start1 + (task1.duration || 2);
    const start2 = task2.startTime;
    const end2 = start2 + (task2.duration || 2);
    
    return !(end1 <= start2 || end2 <= start1);
  };

  const layoutTasks = () => {
    const tasksWithTime = activeTasks.filter(t => t.startTime !== null && t.startTime !== undefined);
    const tasksWithoutTime = activeTasks.filter(t => t.startTime === null || t.startTime === undefined);
    
    tasksWithTime.sort((a, b) => a.startTime - b.startTime);
    
    const layoutedTasks = [];
    
    // 각 task를 실제 시간 위치에 맞춰 배치
    tasksWithTime.forEach(task => {
      const basePosition = getTaskPosition(task);
      const taskHeight = getTaskHeight(task);
      
      const overlappingTasks = layoutedTasks.filter(lt => {
        if (!isOverlapping(task, lt)) return false;
        
        const taskTop = basePosition;
        const taskBottom = taskTop + taskHeight;
        const ltTop = lt.top;
        const ltBottom = ltTop + lt.height;
        
        return !(taskBottom <= ltTop || ltBottom <= taskTop);
      });
      
      let offset = 0;
      if (overlappingTasks.length > 0) {
        const maxBottom = Math.max(...overlappingTasks.map(lt => lt.top + lt.height));
        offset = maxBottom - basePosition + minTaskGap;
      }
      
      layoutedTasks.push({
        ...task,
        top: basePosition + offset,
        height: taskHeight,
      });
    });
    
    const maxEndTime = tasksWithTime.length > 0 
      ? Math.max(...tasksWithTime.map(t => {
          const endTime = (t.startTime || 0) + (t.duration || 2);
          return endTime;
        }), 24)
      : 24;
    
    const maxTaskBottom = layoutedTasks.length > 0
      ? Math.max(...layoutedTasks.map(lt => lt.top + lt.height))
      : lineTop;
    const maxSlotIndex = Math.ceil(maxEndTime / 2);
    const baseY = Math.max(maxTaskBottom, lineTop + maxSlotIndex * labelGap) + 20;
    
    tasksWithoutTime.forEach((task, idx) => {
      layoutedTasks.push({
        ...task,
        top: baseY + idx * (taskBoxHeight + minTaskGap),
        height: taskBoxHeight,
      });
    });
    
    return layoutedTasks;
  };

  const layoutedTasks = layoutTasks();

  return (
    <div className={commonStyles.container}>
      <div className={commonStyles.backgroundImage}>
        <img src={mapBackground} alt="배경" />
      </div>

      <div className={`${commonStyles.content} ${styles.content}`}>
        <div className={commonStyles.header}>
          <button className={commonStyles.backButton} onClick={handleBack}>
            <img src={arrowLeftIcon} alt="뒤로가기" />
          </button>
          <h1 className={commonStyles.headerTitle}>{formattedDate} 전투</h1>
        </div>

        <div className={commonStyles.dateText}>{formattedDate} 전투 task</div>

        {/* 타임라인 및 스톱워치 섹션 */}
        <div className={styles.timelineSection}>
          {/* 타임라인 카드 */}
          <div className={styles.timelineCard}>
            <div className={styles.timelineWrapper}>
              <div className={styles.timelineLine} />
              <div className={styles.timelineLabels}>
                {timelineLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>

              <div className={styles.timelineTasks}>
                {layoutedTasks.length > 0 ? (
                  layoutedTasks.map((task) => (
                    <div
                      key={task.id}
                      className={styles.timelineTask}
                      style={{ 
                        top: `${task.top}px`,
                        height: `${task.height}px`
                      }}
                    >
                      <div className={styles.timelineDot} />
                      <div className={styles.timelineTaskBox} style={{ height: `${task.height}px` }}>
                        <p className={styles.timelineTaskTitle}>{task.title}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.timelineEmpty}>등록된 task가 없습니다.</div>
                )}
              </div>
            </div>
          </div>

          {/* 하단 컨트롤 바 */}
          <div className={styles.wizardControlCard} onClick={handleCardClick}>
            <div className={styles.wizardControlText}>
              {currentTask ? (
                <>
                  <div className={styles.wizardControlContainer}>
                    <p className={styles.wizardSubtitle}>{currentTask.title}</p>
                  </div>
                  <div className={styles.wizardControlContainer}>
                    <p className={styles.wizardTime}>{formatElapsedTime(elapsedSeconds).hours}h {formatElapsedTime(elapsedSeconds).minutes}m</p>
                  </div>
                </>
              ) : (
                <div className={styles.wizardControlContainerEmpty}>
                  <p className={styles.wizardSubtitleEmpty}>전투를 선택해주세요.</p>
                </div>
              )}
            </div>
            <button className={styles.wizardPlayButton} onClick={handleTimerToggle}>
              <img
                src={isTimerRunning ? pauseIcon : playIcon}
                alt={isTimerRunning ? "일시정지" : "재생"}
                className={styles.wizardPlayIcon}
              />
            </button>
          </div>
        </div>
      </div>

      <TaskActionBar currentDate={dateStr} />

      {modalState.isOpen && (
        <TaskCompleteModal
          taskTitle={modalState.taskTitle}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
        />
      )}

      {battleStartModalOpen && (
        <BattleStartModal
          tasks={activeTasks}
          onClose={() => setBattleStartModalOpen(false)}
          onStart={handleBattleStart}
        />
      )}
    </div>
  );
}

