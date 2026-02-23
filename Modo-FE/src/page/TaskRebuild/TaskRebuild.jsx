import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getTodosByDate } from "../../api/todoApi";
import { getCategories } from "../../api/apiStore";
import { CATEGORY_PRIORITY_MAP } from "../../data/fightTaskData";
import styles from "./TaskRebuild.module.css";
import robotStyles from "./layouts/RobotLayout.module.css";
import GraveRobberLayout from "./layouts/GraveRobberLayout";
import WizardLayout from "./layouts/WizardLayout";
import RobotLayout from "./layouts/RobotLayout";
import Toast from "../../components/Toast/Toast";
import {
  createTodoTimeLog,
  getDailyTimeLogSummary,
  getTodoTimeLogSummary,
} from "../../api/timeLogApi";
import {
  mergeTasksByOrder,
  readTaskRebuildOrder,
  syncTaskRebuildOrder,
} from "../../utils/taskRebuildOrder";

function resolveScopeTodoId(explicitTodoId, tasks) {
  if (explicitTodoId != null) return String(explicitTodoId);
  const list = Array.isArray(tasks) ? tasks : [];
  const fromStored = list.find((task) => {
    const todoId = task?.todoId ?? task?.id;
    return readTaskRebuildOrder(todoId)?.length > 0;
  });
  if (fromStored) return String(fromStored.todoId ?? fromStored.id);
  const firstTask = list[0];
  return firstTask ? String(firstTask.todoId ?? firstTask.id) : null;
}

export default function TaskRebuild() {
  const navigate = useNavigate();
  const location = useLocation();
  const { date, character, locationType: locationTypeParam } = useParams();
  const explicitScopeTodoId = location.state?.todoId ?? location.state?.orderScopeTodoId ?? null;
  
  const locationType = locationTypeParam || location.state?.locationType || "gorge";
  
  // 캐릭터 경로를 타입으로 변환
  const getCharacterType = () => {
    if (character) {
      const characterMap = {
        robot: "Starter-Freeze Bot",
        graverobber: "Attention-grave",
        wizard: "Time Wizard",
        adventurer: "Emotional Adventure",
      };
      return characterMap[character] || "Starter-Freeze Bot";
    }
    
    const savedPersona = localStorage.getItem("personaType");
    return savedPersona || "Starter-Freeze Bot";
  };
  
  const characterType = getCharacterType();

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

  const isGraveRobber = characterType === "Attention-grave";
  const isWizard = characterType === "Time Wizard";

  const [lastFetchedDate, setLastFetchedDate] = useState(null);
  const [error, setError] = useState(null);
  const loading = lastFetchedDate !== dateStr;

  const calculatePriority = (task, category) => {
    if (task.priority) {
      return task.priority;
    }
    return CATEGORY_PRIORITY_MAP[category] || "중요";
  };

  const flattenTasks = useCallback((categoryGroups) => {
    const allTasks = [];
    (categoryGroups || []).forEach((categoryGroup) => {
      (categoryGroup.tasks || []).forEach((task) => {
        if (!task.isCompleted) {
          const priority = calculatePriority(task, categoryGroup.category);
          allTasks.push({
            id: `task-${categoryGroup.id}-${task.id}`,
            todoId: task.id,
            title: task.title,
            category: categoryGroup.category,
            priority,
            isCompleted: false,
            startTime: task.startTime ?? null,
            duration: task.duration ?? null,
          });
        }
      });
    });
    const priorityOrder = { "긴급·중요": 1, "긴급": 2, "중요": 3 };
    return allTasks.sort((a, b) => {
      if (a.startTime !== null && b.startTime !== null) {
        return a.startTime - b.startTime;
      }
      if (a.startTime !== null) return -1;
      if (b.startTime !== null) return 1;
      return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
    });
  }, []);

  const [tasks, setTasks] = useState([]);
  const activeScopeTodoIdRef = useRef(explicitScopeTodoId != null ? String(explicitScopeTodoId) : null);
  const dropCommittedRef = useRef(false);

  const persistOrder = useCallback((scopeTodoId, orderedTodoIds) => {
    if (!scopeTodoId) return;
    syncTaskRebuildOrder(scopeTodoId, orderedTodoIds);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getTodosByDate(dateStr), getCategories().catch(() => null)])
      .then(([data, categoriesData]) => {
        if (!cancelled) {
          let categoryGroups = data ?? [];

          // 삭제된 카테고리는 제외하고 전투 목록 구성
          if (Array.isArray(categoryGroups) && categoryGroups.length > 0 && categoriesData != null) {
            const list = Array.isArray(categoriesData)
              ? categoriesData
              : (categoriesData?.data ?? categoriesData?.content ?? categoriesData?.categories ?? []);
            const currentIds = (Array.isArray(list) ? list : []).map((c) => c.categoryId ?? c.id);
            const currentNames = (Array.isArray(list) ? list : []).map((c) => c.name ?? c.categoryName ?? "");
            categoryGroups = categoryGroups.filter(
              (group) =>
                currentIds.some((id) => id == group.id || String(id) === String(group.id)) ||
                currentNames.includes(group.category ?? "")
            );
          }

          const flattenedTasks = flattenTasks(categoryGroups);
          const scopeTodoId = resolveScopeTodoId(activeScopeTodoIdRef.current, flattenedTasks);
          activeScopeTodoIdRef.current = scopeTodoId;
          const savedOrderedIds = readTaskRebuildOrder(scopeTodoId);
          const { mergedTasks, mergedOrderIds } = mergeTasksByOrder(flattenedTasks, savedOrderedIds);
          setTasks(mergedTasks);
          persistOrder(scopeTodoId, mergedOrderIds);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.response?.data?.message ?? err?.message ?? "목록을 불러오지 못했습니다.");
          setTasks([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLastFetchedDate(dateStr);
      });
    return () => { cancelled = true; };
  }, [dateStr, flattenTasks, persistOrder]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    taskTitle: "",
    taskId: null,
  });
  const [battleStartModalOpen, setBattleStartModalOpen] = useState(false);
  const [selectedBattleTask, setSelectedBattleTask] = useState(null);
  const [timerFinishedModalOpen, setTimerFinishedModalOpen] = useState(false);

  // 타이머
  const TOTAL_TIMER_SECONDS = 25 * 60;
  const TIMER_RADIUS = 108;
  const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;
  const [timerSeconds, setTimerSeconds] = useState(TOTAL_TIMER_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [todayTotalSeconds, setTodayTotalSeconds] = useState(null);
  const [selectedTodoTotalSeconds, setSelectedTodoTotalSeconds] = useState(null);
  const [timeLogErrorToast, setTimeLogErrorToast] = useState("");
  const sessionStartedAtRef = useRef(null);
  const currentTask = selectedBattleTask || null;

  const refreshDailyTimeSummary = useCallback(async () => {
    try {
      const summary = await getDailyTimeLogSummary(dateStr);
      setTodayTotalSeconds(Number(summary?.totalSeconds ?? 0));
    } catch {
      setTodayTotalSeconds(null);
    }
  }, [dateStr]);

  const refreshTodoTimeSummary = useCallback(async (todoId) => {
    if (!todoId) {
      setSelectedTodoTotalSeconds(null);
      return;
    }

    try {
      const summary = await getTodoTimeLogSummary(todoId);
      setSelectedTodoTotalSeconds(Number(summary?.totalSeconds ?? 0));
    } catch {
      setSelectedTodoTotalSeconds(null);
    }
  }, []);

  const flushCurrentTimerSession = useCallback(async () => {
    const startedAt = sessionStartedAtRef.current;
    const todoId = currentTask?.todoId ?? currentTask?.id;
    if (!startedAt || !todoId) {
      sessionStartedAtRef.current = null;
      return;
    }

    const durationSeconds = Math.max(1, Math.floor((Date.now() - startedAt) / 1000));
    sessionStartedAtRef.current = null;

    try {
      const created = await createTodoTimeLog(todoId, durationSeconds);
      if (Number.isFinite(Number(created?.totalSeconds))) {
        setSelectedTodoTotalSeconds(Number(created.totalSeconds));
      } else {
        void refreshTodoTimeSummary(todoId);
      }
      void refreshDailyTimeSummary();
    } catch {
      setTimeLogErrorToast("시간 기록 저장에 실패했어요. 로컬 누적은 유지됩니다.");
    }
  }, [currentTask, refreshDailyTimeSummary, refreshTodoTimeSummary]);

  // 타이머 동작
  useEffect(() => {
    if (!isTimerRunning) return;

    const intervalId = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setIsTimerRunning(false);
          void flushCurrentTimerSession();
          if (isGraveRobber) {
            setTimerFinishedModalOpen(true);
          }
          return 0;
        }
        return prev - 1;
      });
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [flushCurrentTimerSession, isGraveRobber, isTimerRunning]);

  useEffect(() => {
    let cancelled = false;
    getDailyTimeLogSummary(dateStr)
      .then((summary) => {
        if (!cancelled) {
          setTodayTotalSeconds(Number(summary?.totalSeconds ?? 0));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTodayTotalSeconds(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [dateStr]);

  useEffect(() => {
    const todoId = currentTask?.todoId ?? currentTask?.id ?? null;
    if (!todoId) {
      return;
    }

    let cancelled = false;
    getTodoTimeLogSummary(todoId)
      .then((summary) => {
        if (!cancelled) {
          setSelectedTodoTotalSeconds(Number(summary?.totalSeconds ?? 0));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSelectedTodoTotalSeconds(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentTask]);

  const handleCardClick = () => {
    setBattleStartModalOpen(true);
  };

  const handleTimerToggle = (e) => {
    e.stopPropagation();
    
    if (!currentTask) {
      return;
    }

    if (isTimerRunning) {
      setIsTimerRunning(false);
      void flushCurrentTimerSession();
      return;
    }

    if (timerSeconds === 0) {
      setTimerSeconds(TOTAL_TIMER_SECONDS);
    }
    sessionStartedAtRef.current = Date.now();
    setIsTimerRunning(true);
  };

  const handleBattleStart = (task) => {
    if (isTimerRunning) {
      void flushCurrentTimerSession();
    }
    setSelectedBattleTask(task);
    sessionStartedAtRef.current = Date.now();
    setIsTimerRunning(true);
  };

  const formatTime = (totalSeconds) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const formatElapsedTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return {
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0")
    };
  };

  // 드래그 정렬
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const persistActiveTaskOrder = useCallback((nextTasks) => {
    const scopeTodoId = activeScopeTodoIdRef.current;
    if (!scopeTodoId) return;
    const activeTodoIds = (nextTasks || [])
      .filter((task) => !task.isCompleted)
      .map((task) => task.todoId ?? task.id);
    try {
      persistOrder(scopeTodoId, activeTodoIds);
    } catch {
      // ignore storage failure
    }
  }, [persistOrder]);

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

  const reorderActiveTasks = useCallback((fromIndex, toIndex) => {
    if (fromIndex === null || toIndex === null || fromIndex === toIndex) return false;
    setTasks((prevTasks) => {
      const activeTasks = prevTasks.filter((task) => !task.isCompleted);
      const newActiveTasks = [...activeTasks];
      const [removed] = newActiveTasks.splice(fromIndex, 1);
      newActiveTasks.splice(toIndex, 0, removed);
      const completedTasks = prevTasks.filter((task) => task.isCompleted);
      const nextTasks = [...newActiveTasks, ...completedTasks];
      persistActiveTaskOrder(nextTasks);
      return nextTasks;
    });
    return true;
  }, [persistActiveTaskOrder]);

  const handleDrop = (index) => {
    dropCommittedRef.current = true;
    reorderActiveTasks(draggedIndex, index);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // 드래그 종료
  const handleDragEnd = () => {
    if (dropCommittedRef.current) {
      dropCommittedRef.current = false;
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    if (dragOverIndex !== null) {
      reorderActiveTasks(draggedIndex, dragOverIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleBack = () => {
    const activeOrderedIds = tasks
      .filter((task) => !task.isCompleted)
      .map((task) => String(task.todoId ?? task.id));
    const returnPath = location.state?.returnPath;
    if (returnPath) {
      navigate(returnPath, {
        replace: true,
        state: {
          locationType,
          refreshedAt: Date.now(),
          orderScopeTodoId: activeScopeTodoIdRef.current,
          updatedOrderedIds: activeOrderedIds,
        },
      });
      return;
    }
    navigate(-1, { state: { locationType } });
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
        return robotStyles.priorityUrgentImportant;
      case "긴급":
        return robotStyles.priorityUrgent;
      case "중요":
        return robotStyles.priorityImportant;
      default:
        return robotStyles.priorityImportant;
    }
  };

  const activeTasks = tasks.filter((task) => !task.isCompleted);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content} style={{ justifyContent: "center", alignItems: "center" }}>
          <p>불러오는 중...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.content} style={{ justifyContent: "center", alignItems: "center" }}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content} style={{ justifyContent: "center", alignItems: "center" }}>
          <p>불러오는 중...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.content} style={{ justifyContent: "center", alignItems: "center" }}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const handleTimerFinishedConfirm = () => {
    // 타이머 리셋
    setTimerSeconds(TOTAL_TIMER_SECONDS);
    setIsTimerRunning(false);
  };

  let content = (
    <RobotLayout
      formattedDate={formattedDate}
      handleBack={handleBack}
      activeTasks={activeTasks}
      handleCheckboxClick={handleCheckboxClick}
      getPriorityClass={getPriorityClass}
      handleDragStart={handleDragStart}
      handleDragOver={handleDragOver}
      handleDrop={handleDrop}
      handleDragEnd={handleDragEnd}
      draggedIndex={draggedIndex}
      dragOverIndex={dragOverIndex}
      dateStr={dateStr}
      modalState={modalState}
      handleModalClose={handleModalClose}
      handleModalConfirm={handleModalConfirm}
      locationType={locationType}
    />
  );

  // 캐릭터별 레이아웃 렌더링
  if (isGraveRobber) {
    content = (
      <GraveRobberLayout
        formattedDate={formattedDate}
        handleBack={handleBack}
        timerSeconds={timerSeconds}
        isTimerRunning={isTimerRunning}
        handleTimerToggle={handleTimerToggle}
        currentTask={currentTask}
        handleCheckboxClick={handleCheckboxClick}
        dateStr={dateStr}
        modalState={modalState}
        handleModalClose={handleModalClose}
        handleModalConfirm={handleModalConfirm}
        TOTAL_TIMER_SECONDS={TOTAL_TIMER_SECONDS}
        TIMER_RADIUS={TIMER_RADIUS}
        TIMER_CIRCUMFERENCE={TIMER_CIRCUMFERENCE}
        formatTime={formatTime}
        formatElapsedTime={formatElapsedTime}
        activeTasks={activeTasks}
        battleStartModalOpen={battleStartModalOpen}
        setBattleStartModalOpen={setBattleStartModalOpen}
        handleBattleStart={handleBattleStart}
        locationType={locationType}
        timerFinishedModalOpen={timerFinishedModalOpen}
        setTimerFinishedModalOpen={setTimerFinishedModalOpen}
        handleTimerFinishedConfirm={handleTimerFinishedConfirm}
        todayTotalSeconds={todayTotalSeconds}
        selectedTodoTotalSeconds={selectedTodoTotalSeconds}
      />
    );
  } else if (isWizard) {
    content = (
      <WizardLayout
        formattedDate={formattedDate}
        handleBack={handleBack}
        activeTasks={activeTasks}
        currentTask={currentTask}
        isTimerRunning={isTimerRunning}
        handleTimerToggle={handleTimerToggle}
        handleCardClick={handleCardClick}
        dateStr={dateStr}
        modalState={modalState}
        handleModalClose={handleModalClose}
        handleModalConfirm={handleModalConfirm}
        battleStartModalOpen={battleStartModalOpen}
        setBattleStartModalOpen={setBattleStartModalOpen}
        handleBattleStart={handleBattleStart}
        elapsedSeconds={elapsedSeconds}
        formatElapsedTime={formatElapsedTime}
        locationType={locationType}
        todayTotalSeconds={todayTotalSeconds}
        selectedTodoTotalSeconds={selectedTodoTotalSeconds}
      />
    );
  }

  return (
    <>
      {content}
      {timeLogErrorToast && (
        <Toast
          message={timeLogErrorToast}
          onClose={() => setTimeLogErrorToast("")}
        />
      )}
    </>
  );
}