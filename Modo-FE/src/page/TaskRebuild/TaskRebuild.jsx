import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskActionBar from "../../components/TaskActionBar/TaskActionBar";
import TaskCompleteModal from "../../components/TaskCompleteModal/TaskCompleteModal";
import styles from "./TaskRebuild.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import mapBackground from "../../assets/map/MAP-1.png";
import { getTasksByDate, CATEGORY_PRIORITY_MAP } from "../../data/fightTaskData";
import checkedIcon from "../../assets/checked.svg";
import slideIcon from "../../assets/slide.svg";

function TaskItem({ 
  task, 
  index, 
  onCheckboxClick, 
  getPriorityClass,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  dragOverIndex
}) {
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
    onDragStart(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    onDragOver(index);
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (dragOverIndex === index) {
      onDragOver(null);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`${styles.taskItem} ${isDragging ? styles.dragging : ""} ${dragOverIndex === index ? styles.dragOver : ""}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {/* 드래그 핸들 */}
      <div 
        className={styles.dragHandle}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <img src={slideIcon} alt="드래그" className={styles.dragIcon} />
      </div>

      {/* 체크박스 */}
      <button
        className={styles.checkbox}
        onClick={() => onCheckboxClick(task.id, task.title)}
      >
        {task.isCompleted ? (
          <img
            src={checkedIcon}
            alt="체크됨"
            className={styles.checkboxIcon}
          />
        ) : null}
      </button>

      {/* Task 제목 */}
      <p className={styles.taskTitle}>
        {index + 1}. {task.title}
      </p>

      {/* 우선순위 태그 */}
      <div
        className={`${styles.priorityTag} ${getPriorityClass(task.priority)}`}
      >
        {task.priority}
      </div>
    </div>
  );
}

export default function TaskRebuild() {
  const navigate = useNavigate();
  const { date } = useParams();

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const dateStr = date || getTodayDateString();
  const [year, month, day] = dateStr.split("-");
  const formattedDate = `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;

  const tasksForDate = getTasksByDate(dateStr);

  const calculatePriority = (task, category) => {
    if (task.priority) {
      return task.priority;
    }
    
    return CATEGORY_PRIORITY_MAP[category] || "중요";
  };

  const flattenTasks = () => {
    const allTasks = [];
    tasksForDate.forEach((categoryGroup) => {
      categoryGroup.tasks.forEach((task) => {
        if (!task.isCompleted) {
          const priority = calculatePriority(task, categoryGroup.category);
          allTasks.push({
            id: `task-${categoryGroup.id}-${task.id}`,
            title: task.title,
            category: categoryGroup.category,
            priority,
            isCompleted: false,
          });
        }
      });
    });
    
    // 우선순위에 따라 정렬
    return allTasks.sort((a, b) => {
      const priorityOrder = { "긴급·중요": 1, "긴급": 2, "중요": 3 };
      return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
    });
  };

  const [tasks, setTasks] = useState(flattenTasks());
  const [modalState, setModalState] = useState({
    isOpen: false,
    taskTitle: "",
    taskId: null,
  });

  // 드래그 정렬
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index) => {
    if (draggedIndex === null || draggedIndex === index) {
      if (index === null) {
        setDragOverIndex(null);
      }
      return;
    }
    setDragOverIndex(index);
  };

  // 드래그 종료
  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const activeTasks = tasks.filter((task) => !task.isCompleted);
      // activeTasks 기준으로 재정렬
      const newActiveTasks = [...activeTasks];
      const [removed] = newActiveTasks.splice(draggedIndex, 1);
      newActiveTasks.splice(dragOverIndex, 0, removed);
      
      // 전체 tasks 배열 업데이트
      const completedTasks = tasks.filter((task) => task.isCompleted);
      setTasks([...newActiveTasks, ...completedTasks]);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCheckboxClick = (taskId, taskTitle) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task.isCompleted) {
      setModalState({
        isOpen: true,
        taskTitle,
        taskId,
      });
    } else {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, isCompleted: false } : t))
      );
    }
  };

  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      taskTitle: "",
      taskId: null,
    });
  };

  const handleModalConfirm = () => {
    const { taskId } = modalState;
    if (taskId) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, isCompleted: true } : t))
      );
    }
    handleModalClose();
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "긴급·중요":
        return styles.priorityUrgentImportant;
      case "긴급":
        return styles.priorityUrgent;
      case "중요":
        return styles.priorityImportant;
      default:
        return styles.priorityImportant;
    }
  };

  const activeTasks = tasks.filter((task) => !task.isCompleted);

  return (
    <div className={styles.container}>
      {/* 배경 이미지 */}
      <div className={styles.backgroundImage}>
        <img src={mapBackground} alt="배경" />
      </div>

      <div className={styles.content}>
        {/* 헤더 */}
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={arrowLeftIcon} alt="뒤로가기" />
          </button>
          <h1 className={styles.headerTitle}>{formattedDate} 전투</h1>
        </div>

        {/* 날짜 텍스트 */}
        <div className={styles.dateText}>{formattedDate} 전투 task</div>

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
              <div className={styles.emptyState}>
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
