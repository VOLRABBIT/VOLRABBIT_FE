import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import SkipModal from "../../components/Diagnosis/SkipModal";
import ThingsToDo from "../../components/ThingsToDo/ThingsToDo";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import addIcon from "../../assets/map/add.svg";
import { getTasksByDate } from "../../api/taskApi";
import { transformApiResponseToUi } from "../../api/todoApi";
import { getCategories } from "../../api/apiStore";
import { getLocationBackground, getLocationTitle } from "../../utils/locationTheme";
import { getSelectedMap } from "../../utils/selectedMapStorage";
import { filterOutGuildQuestGroups, filterOutGuildQuests } from "../../utils/taskSource";
import {
  applyOrderedIdsToGroupedTasks,
  mergeOrderedIdsWithCurrent,
  readTaskRebuildOrder,
} from "../../utils/taskRebuildOrder";
import styles from "./Fight.module.css";

const extractCategoryList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.categories)) return data.categories;
  return [];
};

export default function Fight() {
  const navigate = useNavigate();
  const location = useLocation();
  const { locationType } = useParams();
  
  // URL 파라미터 또는 location state에서 locationType 가져오기
  const currentLocationType = locationType || location.state?.locationType || getSelectedMap() || "gorge";
  const mapBackground = getLocationBackground(currentLocationType);
  const locationTitle = getLocationTitle(currentLocationType);
  
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesCache, setCategoriesCache] = useState([]);
  const [isCategoryChecking, setIsCategoryChecking] = useState(false);
  const [showNoCategoryModal, setShowNoCategoryModal] = useState(false);

  // 오늘 날짜의 task 목록 조회
  useEffect(() => {
    const fetchTodayTasks = async () => {
      try {
        setIsLoading(true);
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const [response, categoriesData] = await Promise.all([
          getTasksByDate(dateStr),
          getCategories().catch(() => null),
        ]);
        const categoryList = categoriesData != null ? extractCategoryList(categoriesData) : [];
        setCategoriesCache(categoryList);
        const rawList = Array.isArray(response) ? response : (response?.tasks || response?.data || []);
        const sanitizedList =
          Array.isArray(rawList) && rawList.length > 0 && Array.isArray(rawList[0]?.tasks)
            ? filterOutGuildQuestGroups(rawList)
            : filterOutGuildQuests(rawList);
        let taskList = Array.isArray(sanitizedList) && sanitizedList.length > 0
          ? transformApiResponseToUi(sanitizedList)
          : sanitizedList;
        if (Array.isArray(taskList) && taskList.length > 0 && categoriesData != null) {
          const list = categoryList;
          const currentIds = (Array.isArray(list) ? list : []).map((c) => c.categoryId ?? c.id);
          const currentNames = (Array.isArray(list) ? list : []).map((c) => c.name ?? c.categoryName ?? "");
          taskList = taskList.filter(
            (group) =>
              currentIds.some((id) => id == group.id || String(id) === String(group.id)) ||
              currentNames.includes(group.category ?? "")
          );
        }
        // task-rebuild에서 저장한 순서 적용
        if (Array.isArray(taskList) && taskList.length > 0) {
          const flattenedTaskIds = taskList
            .flatMap((group) => (Array.isArray(group?.tasks) ? group.tasks : []))
            .map((task) => String(task?.id ?? task?.todoId));
          const scopeTodoId = flattenedTaskIds[0] ?? null;
          const storedOrderedIds = readTaskRebuildOrder(scopeTodoId);
          const baseOrderedIds = storedOrderedIds ?? [];
          const mergedOrderedIds = mergeOrderedIdsWithCurrent(flattenedTaskIds, baseOrderedIds);
          taskList = applyOrderedIdsToGroupedTasks(taskList, mergedOrderedIds);
        }
        setTasks(taskList);
      } catch (err) {
        console.error('Task 조회 실패:', err);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayTasks();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCreateTaskClick = async () => {
    if (isCategoryChecking) return;
    setIsCategoryChecking(true);
    try {
      let categoryList = categoriesCache;
      if (!Array.isArray(categoryList) || categoryList.length === 0) {
        const categoriesData = await getCategories().catch(() => null);
        categoryList = categoriesData != null ? extractCategoryList(categoriesData) : [];
        setCategoriesCache(categoryList);
      }

      if (!Array.isArray(categoryList) || categoryList.length === 0) {
        setShowNoCategoryModal(true);
        return;
      }

      navigate("/task-create", {
        state: { locationType: currentLocationType }
      });
    } finally {
      setIsCategoryChecking(false);
    }
  };

  const handleDateClick = (day) => {
    const pad = (n) => String(n).padStart(2, "0");
    const dateParam = `${year}-${pad(month)}-${pad(day)}`;
    navigate(`/task-detail/${dateParam}`, {
      state: { locationType: currentLocationType }
    });
  };

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const monthName = monthNames[month - 1];
  
  // 현재 월의 첫 번째 날짜 객체 생성
  const firstDay = new Date(year, month - 1, 1);
  // 첫 번째 날의 요일 (0=일요일, 1=월요일, ..., 6=토요일)
  const firstDayOfWeek = firstDay.getDay();
  const firstDayOfMonth = firstDayOfWeek === 0 ? 7 : firstDayOfWeek; // 월요일=1, ..., 일요일=7
  
  // 현재 월의 마지막 날짜 구하기
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // 캘린더 날짜 배열 생성
  const calendarDays = [];
  
  // 첫 주의 빈 칸 채우기
  for (let i = 0; i < firstDayOfMonth - 1; i++) {
    calendarDays.push(null);
  }
  
  // 날짜 채우기
  for (let day = 1; day <= daysInMonth; day++) {
    // 현재 날짜의 요일 계산
    const currentDate = new Date(year, month - 1, day);
    const dayOfWeek = currentDate.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
    calendarDays.push({
      day,
      isSunday: dayOfWeek === 0,
    });
  }

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
          <h1 className={styles.headerTitle}>{locationTitle}</h1>
        </div>

        {/* 월/년 표시 */}
        <div className={styles.monthYear}>
          {year}년 {monthName}
        </div>

        {/* 캘린더 */}
        <div className={styles.calendar}>
          <div className={styles.weekDays}>
            {weekDays.map((day, index) => (
              <div
                key={index}
                className={`${styles.weekDay} ${day === "Sun" ? styles.sunday : ""}`}
              >
                {day}
              </div>
            ))}
          </div>
          <div className={styles.daysGrid}>
            {calendarDays.map((date, index) => (
              <div
                key={index}
                className={`${styles.dayCell} ${date ? styles.clickable : ""}`}
                onClick={() => date && handleDateClick(date.day)}
              >
                {date && (
                  <span className={date.isSunday ? styles.sunday : ""}>
                    {date.day}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 전투 Task 작성하기 */}
        <button className={styles.taskPrompt} onClick={handleCreateTaskClick}>
          <span>전투 Task 작성하기</span>
          <img src={addIcon} alt="추가" className={styles.plusIcon} />
        </button>

        {/* 전투 Task 목록 */}
        <div className={styles.taskListContainer}>
          {isLoading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
          ) : tasks.length > 0 ? (
            <ThingsToDo tasks={tasks} locationType={currentLocationType} />
          ) : (
            <div style={{ padding: '20px', textAlign: 'center' }}>등록된 task가 없습니다.</div>
          )}
        </div>
      </div>
      <Navbar activeItem="fight" />

      {showNoCategoryModal && (
        <SkipModal
          title="카테고리 설정 안내"
          content="카테고리가 없습니다. 내정보에서 카테고리를 먼저 설정해주세요."
          stopButtonText="내정보로 이동"
          continueButtonText="취소"
          onClose={() => setShowNoCategoryModal(false)}
          onStop={() => {
            setShowNoCategoryModal(false);
            navigate("/mypage", { state: { focusSection: "categorySetting" } });
          }}
        />
      )}
    </div>
  );
}