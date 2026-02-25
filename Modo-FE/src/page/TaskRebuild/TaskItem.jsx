import commonStyles from "./TaskRebuild.module.css";
import robotStyles from "./layouts/RobotLayout.module.css";
import checkedIcon from "../../assets/checked.svg";
import slideIcon from "../../assets/slide.svg";

export default function TaskItem({ 
  task, 
  index, 
  onCheckboxClick, 
  getPriorityClass,
  onDragStart,
  onDragOver,
  onDrop,
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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDrop(index);
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
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      className={`${robotStyles.taskItem} ${isDragging ? robotStyles.dragging : ""} ${dragOverIndex === index ? robotStyles.dragOver : ""}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {/* 드래그 핸들 */}
      <div 
        className={robotStyles.dragHandle}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <img src={slideIcon} alt="드래그" className={robotStyles.dragIcon} />
      </div>

      {/* 체크박스 */}
      <button
        className={commonStyles.checkbox}
        onClick={() => onCheckboxClick(task.id, task.title)}
      >
        {task.isCompleted ? (
          <img
            src={checkedIcon}
            alt="체크됨"
            className={commonStyles.checkboxIcon}
          />
        ) : null}
      </button>

      {/* Task 제목 */}
      <p className={robotStyles.taskTitle}>
        {index + 1}. {task.title}
      </p>

      {/* 우선순위 태그 */}
      <div
        className={`${robotStyles.priorityTag} ${getPriorityClass(task.priority)}`}
      >
        {task.priority}
      </div>
    </div>
  );
}