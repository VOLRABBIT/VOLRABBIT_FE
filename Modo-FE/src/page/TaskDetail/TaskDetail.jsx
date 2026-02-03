import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import TaskActionBar from "../../components/TaskActionBar/TaskActionBar";
import ThingsToDo from "../../components/ThingsToDo/ThingsToDo";
import styles from "./TaskDetail.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import { getTasksByDate as getTasksByDateApi } from "../../api/taskApi";
import { transformApiResponseToUi } from "../../api/todoApi";
import { getCategories } from "../../api/apiStore";
import { getLocationBackground } from "../../utils/locationTheme";

export default function TaskDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { date } = useParams();
  
  const locationType = location.state?.locationType;
  const mapBackground = getLocationBackground(locationType);

  const [tasksForDate, setTasksForDate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // API에서 task 목록 조회
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [response, categoriesData] = await Promise.all([
          getTasksByDateApi(dateStr),
          getCategories().catch(() => null),
        ]);
        const rawList = Array.isArray(response) ? response : (response?.tasks || response?.data || []);
        let tasks = Array.isArray(rawList) && rawList.length > 0 ? transformApiResponseToUi(rawList) : rawList;

        // 삭제된 카테고리는 화면에서 제외
        if (Array.isArray(tasks) && tasks.length > 0 && categoriesData != null) {
          const list = Array.isArray(categoriesData)
            ? categoriesData
            : (categoriesData?.data ?? categoriesData?.content ?? categoriesData?.categories ?? []);
          const currentIds = (Array.isArray(list) ? list : []).map((c) => c.categoryId ?? c.id);
          const currentNames = (Array.isArray(list) ? list : []).map((c) => c.name ?? c.categoryName ?? "");
          tasks = tasks.filter(
            (group) =>
              currentIds.some((id) => id == group.id || String(id) === String(group.id)) ||
              currentNames.includes(group.category ?? "")
          );
        }

        setTasksForDate(tasks);
      } catch (err) {
        console.error('Task 조회 실패:', err);
        setError('Task를 불러오는데 실패했습니다.');
        setTasksForDate([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [dateStr]);

  const handleBack = () => {
    navigate(-1, { state: { locationType } });
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
          {isLoading ? (
            <div className={styles.emptyState}>
              <p>로딩 중...</p>
            </div>
          ) : error ? (
            <div className={styles.emptyState}>
              <p>{error}</p>
            </div>
          ) : tasksForDate.length > 0 ? (
            <ThingsToDo tasks={tasksForDate} hideModify={true} locationType={locationType} />
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

