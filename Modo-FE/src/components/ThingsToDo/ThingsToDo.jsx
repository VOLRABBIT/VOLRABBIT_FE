import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ThingsToDo.module.css";
import checkedIcon from "../../assets/checked.svg";
import modifyIcon from "../../assets/modify.svg";
import TaskCompleteModal from "../TaskCompleteModal/TaskCompleteModal";
import {
  toggleTaskComplete,
  toggleSubtaskComplete,
  updateTaskTitle,
} from "../../api/taskApi";
import { useTodoVerification } from "../../hooks/useTodoVerification";

const normalizeVerificationType = (value) => {
  if (typeof value !== "string") return "PHOTO_PROOF";
  const code = value.toUpperCase();
  if (code === "CHECK" || code === "PHOTO_PROOF" || code === "TAG") return code;
  if (value === "자가 체크") return "CHECK";
  if (value === "사진") return "PHOTO_PROOF";
  if (value === "태깅") return "TAG";
  return "PHOTO_PROOF";
};

export default function ThingsToDo({
  tasks = [],
  hideModify = false,
  locationType,
  currentDate,
  onVerificationSuccess,
}) {
  const navigate = useNavigate();
  const { isSubmitting, completeTodoByCheck, completeTodoByTag } = useTodoVerification();
  const getTaskKey = (categoryId, taskId, taskIndex) =>
    `task-${categoryId}-${taskId}-${taskIndex}`;
  const getSubtaskKey = (categoryId, taskId, subtaskId) =>
    `subtask-${categoryId}-${taskId}-${subtaskId}`;

  const [taskStates, setTaskStates] = useState(() => {
    const initialState = {};
    (Array.isArray(tasks) ? tasks : []).forEach((category) => {
      const subList = category && category.tasks;
      if (!Array.isArray(subList)) return;
      subList.forEach((task, taskIndex) => {
        const taskKey = getTaskKey(category.id, task.id, taskIndex);
        initialState[taskKey] = task.isCompleted;
        task.subtasks.forEach((subtask) => {
          initialState[getSubtaskKey(category.id, task.id, subtask.id)] =
            subtask.isCompleted;
        });
      });
    });
    return initialState;
  });

  const [taskTitles, setTaskTitles] = useState(() => {
    const initialState = {};
    (Array.isArray(tasks) ? tasks : []).forEach((category) => {
      const subList = category && category.tasks;
      if (!Array.isArray(subList)) return;
      subList.forEach((task, taskIndex) => {
        const taskKey = getTaskKey(category.id, task.id, taskIndex);
        initialState[taskKey] = task.title;
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
    verificationType: "PHOTO_PROOF",
  });
  const [modalError, setModalError] = useState("");

  const handleTaskClick = async (categoryId, taskId, taskIndex, taskTitle, verificationType) => {
    if (editingTask === getTaskKey(categoryId, taskId, taskIndex)) return;
    const key = getTaskKey(categoryId, taskId, taskIndex);
    const currentState = taskStates[key];
    
    if (!currentState) {
      // 완료되지 않은 task 클릭 시 모달 표시
      setModalError("");
      setModalState({
        isOpen: true,
        categoryId,
        taskId,
        taskTitle,
        verificationType: normalizeVerificationType(verificationType),
      });
    } else {
      // 완료된 task 클릭 시 미완료로 변경
      try {
        await toggleTaskComplete(taskId, false);
        setTaskStates((prev) => ({
          ...prev,
          [key]: false,
        }));
      } catch (err) {
        console.error('Task 완료 상태 변경 실패:', err);
      }
    }
  };

  const handleModalClose = () => {
    setModalError("");
    setModalState({
      isOpen: false,
      categoryId: null,
      taskId: null,
      taskTitle: "",
      verificationType: "PHOTO_PROOF",
    });
  };

  const handleModalConfirm = async () => {
    setModalError("");
    const { categoryId, taskId, taskTitle, verificationType } = modalState;
    if (categoryId && taskId) {
      const category = tasks.find((cat) => cat.id === categoryId);
      const taskIndex = (category?.tasks || []).findIndex((t) => t.id === taskId);
      const key = taskIndex >= 0 ? getTaskKey(categoryId, taskId, taskIndex) : null;
      try {
        const verifiedType = normalizeVerificationType(verificationType);
        if (verifiedType === "CHECK") {
          await completeTodoByCheck(taskId);
        } else if (verifiedType === "TAG") {
          await completeTodoByTag(taskId);
        } else {
          handleModalClose();
          navigate("/task-photo-auth", {
            state: { taskTitle, locationType, todoId: taskId, returnDate: currentDate },
          });
          return;
        }

        if (key) {
          setTaskStates((prev) => ({
            ...prev,
            [key]: true,
          }));
        }
        onVerificationSuccess?.();
        handleModalClose();
      } catch (err) {
        console.error('Task 완료 처리 실패:', err);
        const detail = err?.message ?? 'Task 완료 처리에 실패했습니다.';
        setModalError(`${detail} 다시 시도해주세요.`);
      }
    }
  };

  const handleModalGiveUp = () => {
    const { taskTitle, taskId } = modalState;
    handleModalClose();
    navigate("/task-give-up", {
      state: { taskTitle, locationType, todoId: taskId, returnDate: currentDate },
    });
  };

  const handleSubtaskClick = async (categoryId, taskId, subtaskId) => {
    const key = getSubtaskKey(categoryId, taskId, subtaskId);
    const currentState = taskStates[key];
    const newState = !currentState;
    
    try {
      await toggleSubtaskComplete(taskId, subtaskId, newState);
      setTaskStates((prev) => ({
        ...prev,
        [key]: newState,
      }));
    } catch (err) {
      console.error('Subtask 완료 상태 변경 실패:', err);
    }
  };

  const handleModifyClick = (e, categoryId, taskId) => {
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

  const handleSaveEdit = async (categoryId, taskId) => {
    const key = `task-${categoryId}-${taskId}`;
    if (editValue.trim()) {
      try {
        await updateTaskTitle(taskId, editValue.trim());
        setTaskTitles((prev) => ({
          ...prev,
          [key]: editValue.trim(),
        }));
      } catch (err) {
        console.error('Task 제목 수정 실패:', err);
        alert('Task 제목 수정에 실패했습니다.');
      }
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

  const list = Array.isArray(tasks) ? tasks : [];
  return (
    <div className={styles.container}>
      {list.map((category, categoryIndex) => {
        const categoryTasks = category && Array.isArray(category.tasks) ? category.tasks : [];
        const categoryKey = category?.id ?? `category-${categoryIndex}`;
        return (
        <div key={categoryKey} className={styles.categorySection}>
          <div className={styles.categoryTitle}>
            <p>{category?.category ?? ''}</p>
          </div>
          {categoryTasks.map((task, taskIndex) => {
            const taskKey = `task-${category.id}-${task.id}-${taskIndex}`;
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
                        taskIndex,
                        taskTitles[taskKey] || task.title,
                        task.verificationType
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
                      onClick={(e) => handleModifyClick(e, category.id, task.id)}
                      disabled={isEditing}
                    >
                      <img src={modifyIcon} alt="수정" />
                    </button>
                  )}
                </div>
                {(Array.isArray(task.subtasks) ? task.subtasks : []).map((subtask) => (
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
        );
      })}
      {modalState.isOpen && (
        <TaskCompleteModal
          taskTitle={modalState.taskTitle}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
          onRetry={handleModalConfirm}
          onGiveUp={handleModalGiveUp}
          errorMessage={modalError}
          locationType={locationType}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}
