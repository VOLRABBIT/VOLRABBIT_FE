import commonStyles from "../TaskRebuild.module.css";
import styles from "./RobotLayout.module.css";
import arrowLeftIcon from "../../../assets/arrow-left.svg";
import mapBackground from "../../../assets/map/MAP-1.png";
import TaskActionBar from "../../../components/TaskActionBar/TaskActionBar";
import TaskCompleteModal from "../../../components/TaskCompleteModal/TaskCompleteModal";
import TaskItem from "../TaskItem";

export default function RobotLayout({
  formattedDate,
  handleBack,
  activeTasks,
  handleCheckboxClick,
  getPriorityClass,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  draggedIndex,
  dragOverIndex,
  dateStr,
  modalState,
  handleModalClose,
  handleModalConfirm,
}) {
  return (
    <div className={commonStyles.container}>
      {/* 배경 이미지 */}
      <div className={commonStyles.backgroundImage}>
        <img src={mapBackground} alt="배경" />
      </div>

      <div className={commonStyles.content}>
        {/* 헤더 */}
        <div className={commonStyles.header}>
          <button className={commonStyles.backButton} onClick={handleBack}>
            <img src={arrowLeftIcon} alt="뒤로가기" />
          </button>
          <h1 className={commonStyles.headerTitle}>{formattedDate} 전투</h1>
        </div>

        {/* 날짜 텍스트 */}
        <div className={commonStyles.dateText}>{formattedDate} 전투 task</div>

        {/* 우선순위 전투 목록 */}
        <div className={styles.priorityListContainer}>
          <div className={styles.priorityListHeader}>
            <h2 className={styles.priorityListTitle}>우선순위 전투 목록</h2>
            <p className={styles.priorityListDescription}>
              드래그하여 순서를 변경할 수 있습니다.
            </p>
          </div>

          <div className={styles.taskList}>
            {activeTasks.length > 0 ? (
              activeTasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  onCheckboxClick={handleCheckboxClick}
                  getPriorityClass={getPriorityClass}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedIndex === index}
                  dragOverIndex={dragOverIndex}
                />
              ))
            ) : (
              <div className={commonStyles.emptyState}>
                <p>등록된 task가 없습니다.</p>
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
        />
      )}
    </div>
  );
}

