import commonStyles from "../TaskRebuild.module.css";
import styles from "./GraveRobberLayout.module.css";
import arrowLeftIcon from "../../../assets/arrow-left.svg";
import checkedIcon from "../../../assets/checked.svg";
import playIcon from "../../../assets/play.svg";
import pauseIcon from "../../../assets/pause.svg";
import TaskActionBar from "../../../components/TaskActionBar/TaskActionBar";
import TaskCompleteModal from "../../../components/TaskCompleteModal/TaskCompleteModal";
import BattleStartModal from "../../../components/BattleStartModal/BattleStartModal";
import TimerFinishedModal from "../../../components/TimerFinishedModal/TimerFinishedModal";
import { getLocationBackground, getLocationButtonColor } from "../../../utils/locationTheme";

export default function GraveRobberLayout({
  formattedDate,
  handleBack,
  timerSeconds,
  isTimerRunning,
  handleTimerToggle,
  currentTask,
  handleCheckboxClick,
  dateStr,
  modalState,
  handleModalClose,
  handleModalConfirm,
  TOTAL_TIMER_SECONDS,
  TIMER_RADIUS,
  TIMER_CIRCUMFERENCE,
  formatTime,
  activeTasks,
  battleStartModalOpen,
  setBattleStartModalOpen,
  handleBattleStart,
  locationType = "gorge",
  timerFinishedModalOpen,
  setTimerFinishedModalOpen,
  handleTimerFinishedConfirm,
}) {
  const mapBackground = getLocationBackground(locationType);
  const buttonColor = getLocationButtonColor(locationType);
  return (
    <div className={commonStyles.container}>
      {/* 배경 이미지 */}
      <div className={commonStyles.backgroundImage}>
        <img src={mapBackground} alt="배경" />
      </div>

      <div className={`${commonStyles.content} ${styles.content}`}>
        {/* 헤더 */}
        <div className={commonStyles.header}>
          <button className={commonStyles.backButton} onClick={handleBack}>
            <img src={arrowLeftIcon} alt="뒤로가기" />
          </button>
          <h1 className={commonStyles.headerTitle}>{formattedDate} 전투</h1>
        </div>

        {/* 날짜 텍스트 */}
        <div className={commonStyles.dateText}>{formattedDate} 전투 task</div>

        {/* 타이머 섹션 */}
        <div className={styles.timerSection}>
          <div className={styles.timerCircle}>
            <svg className={styles.timerSvg} viewBox="0 0 228 228">
              {/* 시계방향으로 줄어드는 링 */}
              <circle
                className={styles.timerProgress}
                cx="114"
                cy="114"
                r={TIMER_RADIUS}
                fill="none"
                stroke={buttonColor}
                strokeWidth="12"
                strokeDasharray={`${(timerSeconds / TOTAL_TIMER_SECONDS) * TIMER_CIRCUMFERENCE} ${TIMER_CIRCUMFERENCE}`}
                strokeLinecap="round"
              />
            </svg>
            <div className={styles.timerText}>{formatTime(timerSeconds)}</div>
            <button 
              className={styles.playButton} 
              onClick={handleTimerToggle}
              style={{ backgroundColor: buttonColor }}
            >
              <img
                src={isTimerRunning ? pauseIcon : playIcon}
                alt={isTimerRunning ? "일시정지" : "재생"}
                className={styles.playIcon}
              />
            </button>
          </div>
        </div>

        {/* 현재 전투 섹션 */}
        <div className={commonStyles.currentBattleContainer}>
          <div className={commonStyles.currentBattleHeader}>
            <h2 className={commonStyles.currentBattleTitle}>현재 전투</h2>
            <p className={commonStyles.currentBattleDescription}>
              현재 전투에 집중하세요!
            </p>
          </div>
          <div 
            className={commonStyles.currentBattleTaskList}
            onClick={() => !currentTask && setBattleStartModalOpen(true)}
            style={{ cursor: !currentTask ? 'pointer' : 'default' }}
          >
            {currentTask ? (
              <div className={commonStyles.currentTaskItem}>
                <button
                  className={commonStyles.checkbox}
                  onClick={() => handleCheckboxClick(currentTask.id, currentTask.title)}
                >
                  {currentTask.isCompleted ? (
                    <img
                      src={checkedIcon}
                      alt="체크됨"
                      className={commonStyles.checkboxIcon}
                    />
                  ) : null}
                </button>
                <p className={commonStyles.currentTaskTitle}>{currentTask.title}</p>
              </div>
            ) : (
              <div className={commonStyles.emptyState}>
                <p>전투를 선택해주세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <TaskActionBar currentDate={dateStr} />

      {/* Task 완료 모달 */}
      {modalState.isOpen && (
        <TaskCompleteModal
          taskTitle={modalState.taskTitle}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
          locationType={locationType}
        />
      )}

      {/* 전투 시작 모달 */}
      {battleStartModalOpen && (
        <BattleStartModal
          tasks={activeTasks}
          onClose={() => setBattleStartModalOpen(false)}
          onStart={handleBattleStart}
          locationType={locationType}
        />
      )}

      {/* 타이머 종료 모달 */}
      {timerFinishedModalOpen && (
        <TimerFinishedModal
          taskTitle={currentTask?.title}
          onClose={() => setTimerFinishedModalOpen(false)}
          onConfirm={handleTimerFinishedConfirm}
          locationType={locationType}
        />
      )}
    </div>
  );
}

