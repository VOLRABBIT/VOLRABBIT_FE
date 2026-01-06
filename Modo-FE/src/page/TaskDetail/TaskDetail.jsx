import { useNavigate, useParams } from "react-router-dom";
import TaskActionBar from "../../components/TaskActionBar/TaskActionBar";
import ThingsToDo from "../../components/ThingsToDo/ThingsToDo";
import styles from "./TaskDetail.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import mapBackground from "../../assets/map/MAP-1.png";
import { getTasksByDate } from "../../data/fightTaskData";

export default function TaskDetail() {
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

  const handleBack = () => {
    navigate(-1);
  };

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

        {/* Task 목록 */}
        <div className={styles.taskListContainer}>
          {tasksForDate.length > 0 ? (
            <ThingsToDo tasks={tasksForDate} hideModify={true} />
          ) : (
            <div className={styles.emptyState}>
              <p>이 날짜에는 등록된 task가 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      <TaskActionBar currentDate={dateStr} />
    </div>
  );
}

