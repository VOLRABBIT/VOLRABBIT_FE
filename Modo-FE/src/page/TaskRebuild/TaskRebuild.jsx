import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getTasksByDate, CATEGORY_PRIORITY_MAP } from "../../data/fightTaskData";
import robotStyles from "./layouts/RobotLayout.module.css";
import GraveRobberLayout from "./layouts/GraveRobberLayout";
import WizardLayout from "./layouts/WizardLayout";
import RobotLayout from "./layouts/RobotLayout";

export default function TaskRebuild() {
  const navigate = useNavigate();
  const location = useLocation();
  const { date, character, locationType: locationTypeParam } = useParams();
  
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
            startTime: task.startTime ?? null,
            duration: task.duration ?? null, 
          });
        }
      });
    });
    
    // 우선순위에 따라 정렬
    return allTasks.sort((a, b) => {
      if (a.startTime !== null && b.startTime !== null) {
        return a.startTime - b.startTime;
      }
      if (a.startTime !== null) return -1;
      if (b.startTime !== null) return 1;
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

  // 타이머 동작
  useEffect(() => {
    if (!isTimerRunning) return;

    const intervalId = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setIsTimerRunning(false);
          // 타이머 종료 시 모달 표시
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
  }, [isTimerRunning, isGraveRobber]);

  const handleCardClick = () => {
    setBattleStartModalOpen(true);
  };

  const handleTimerToggle = (e) => {
    e.stopPropagation();
    
    if (!currentTask) {
      return;
    }
    
    // 플레이/일시정지 버튼 클릭 시에만 타이머 토글
    setIsTimerRunning((prev) => {
      // 리셋
      if (!prev && timerSeconds === 0) {
        setTimerSeconds(TOTAL_TIMER_SECONDS);
      }
      return !prev;
    });
  };

  const handleBattleStart = (task) => {
    setSelectedBattleTask(task);
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
  const currentTask = selectedBattleTask || null;

  const handleTimerFinishedConfirm = () => {
    // 타이머 리셋
    setTimerSeconds(TOTAL_TIMER_SECONDS);
    setIsTimerRunning(false);
  };

  // 캐릭터별 레이아웃 렌더링
  if (isGraveRobber) {
    return (
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
        activeTasks={activeTasks}
        battleStartModalOpen={battleStartModalOpen}
        setBattleStartModalOpen={setBattleStartModalOpen}
        handleBattleStart={handleBattleStart}
        locationType={locationType}
        timerFinishedModalOpen={timerFinishedModalOpen}
        setTimerFinishedModalOpen={setTimerFinishedModalOpen}
        handleTimerFinishedConfirm={handleTimerFinishedConfirm}
      />
    );
  }

  if (isWizard) {
    return (
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
      />
    );
  }

  return (
    <RobotLayout
      formattedDate={formattedDate}
      handleBack={handleBack}
      activeTasks={activeTasks}
      handleCheckboxClick={handleCheckboxClick}
      getPriorityClass={getPriorityClass}
      handleDragStart={handleDragStart}
      handleDragOver={handleDragOver}
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
}
