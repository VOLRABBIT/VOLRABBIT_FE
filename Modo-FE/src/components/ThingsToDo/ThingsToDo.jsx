import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ThingsToDo.module.css";
import checkedIcon from "../../assets/checked.svg";
import modifyIcon from "../../assets/modify.svg";
import TaskCompleteModal from "../TaskCompleteModal/TaskCompleteModal";

export default function ThingsToDo({ tasks = [], hideModify = false, locationType }) {
  const navigate = useNavigate();
  const [taskStates, setTaskStates] = useState(() => {
    const initialState = {};
    tasks.forEach((category) => {
      category.tasks.forEach((task) => {
        initialState[`task-${category.id}-${task.id}`] = task.isCompleted;
        task.subtasks.forEach((subtask) => {
          initialState[`subtask-${category.id}-${task.id}-${subtask.id}`] =
            subtask.isCompleted;
        });
      });
    });
    return initialState;
  });

  const [taskTitles, setTaskTitles] = useState(() => {
    const initialState = {};
    tasks.forEach((category) => {
      category.tasks.forEach((task) => {
        initialState[`task-${category.id}-${task.id}`] = task.title;
      });
    });
    return initialState;
  });

  const [editingTask, setEditingTask] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    categoryId: null,
    taskId: null,
    taskTitle: "",
  });

  const handleTaskClick = (categoryId, taskId, taskTitle) => {
    if (editingTask === `task-${categoryId}-${taskId}`) return;
    const key = `task-${categoryId}-${taskId}`;
    if (!taskStates[key]) {
      setModalState({
        isOpen: true,
        categoryId,
        taskId,
        taskTitle,
      });
    } else {
      setTaskStates((prev) => ({
        ...prev,
        [key]: false,
      }));
    }
  };

  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      categoryId: null,
      taskId: null,
      taskTitle: "",
    });
  };

  const handleModalConfirm = () => {
    const { categoryId, taskId } = modalState;
    if (categoryId && taskId) {
      const key = `task-${categoryId}-${taskId}`;
      setTaskStates((prev) => ({
        ...prev,
        [key]: true,
      }));
    }
    handleModalClose();
  };

  const handleSubtaskClick = (categoryId, taskId, subtaskId) => {
    const key = `subtask-${categoryId}-${taskId}-${subtaskId}`;
    setTaskStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleModifyClick = (e, categoryId, taskId, task) => {
    e.stopPropagation();
    // TaskCreate 페이지로 이동하면서 task 데이터 전달
    const category = tasks.find((cat) => cat.id === categoryId);
    const taskData = category?.tasks.find((t) => t.id === taskId);
    
    if (taskData) {
      navigate("/task-create", {
        state: {
          isEditMode: true,
          task: {
            ...taskData,
            category: category.category,
            categoryId: categoryId,
          },
          locationType: locationType,
        },
      });
    }
  };

  const handleSaveEdit = (categoryId, taskId) => {
    const key = `task-${categoryId}-${taskId}`;
    if (editValue.trim()) {
      setTaskTitles((prev) => ({
        ...prev,
        [key]: editValue.trim(),
      }));
    }
    setEditingTask(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditValue("");
  };

  const handleKeyDown = (e, categoryId, taskId) => {
    if (e.key === "Enter") {
      handleSaveEdit(categoryId, taskId);
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div className={styles.container}>
      {tasks.map((category) => (
        <div key={category.id} className={styles.categorySection}>
          <div className={styles.categoryTitle}>
            <p>{category.category}</p>
          </div>
          {category.tasks.map((task) => {
            const taskKey = `task-${category.id}-${task.id}`;
            const isEditing = editingTask === taskKey;
            return (
              <div key={task.id} className={styles.taskWrapper}>
                <div className={styles.taskItem}>
                  <button
                    className={styles.checkbox}
                    onClick={() =>
                      handleTaskClick(
                        category.id,
                        task.id,
                        taskTitles[taskKey] || task.title
                      )
                    }
                    disabled={isEditing}
                  >
                    {taskStates[taskKey] ? (
                      <img
                        src={checkedIcon}
                        alt="체크됨"
                        className={styles.checkboxIcon}
                      />
                    ) : null}
                  </button>
                  {isEditing ? (
                    <input
                      type="text"
                      className={styles.taskInput}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleSaveEdit(category.id, task.id)}
                      onKeyDown={(e) => handleKeyDown(e, category.id, task.id)}
                      autoFocus
                    />
                  ) : (
                    <p className={styles.taskText}>
                      {taskTitles[taskKey] || task.title}
                    </p>
                  )}
                  {!hideModify && (
                    <button
                      className={styles.modifyButton}
                      onClick={(e) => handleModifyClick(e, category.id, task.id, task)}
                      disabled={isEditing}
                    >
                      <img src={modifyIcon} alt="수정" />
                    </button>
                  )}
                </div>
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className={styles.subtaskItem}>
                    <button
                      className={styles.checkbox}
                      onClick={() =>
                        handleSubtaskClick(category.id, task.id, subtask.id)
                      }
                    >
                      {taskStates[
                        `subtask-${category.id}-${task.id}-${subtask.id}`
                      ] ? (
                        <img
                          src={checkedIcon}
                          alt="체크됨"
                          className={styles.checkboxIcon}
                        />
                      ) : null}
                    </button>
                    <p className={styles.taskText}>{subtask.title}</p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
      {modalState.isOpen && (
        <TaskCompleteModal
          taskTitle={modalState.taskTitle}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
          locationType={locationType}
        />
      )}
    </div>
  );
}

