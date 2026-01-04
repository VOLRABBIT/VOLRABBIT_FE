import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import ThingsToDo from "../../components/ThingsToDo/ThingsToDo";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import addIcon from "../../assets/map/add.svg";
import fightTaskIcon from "../../assets/map/fight-task.svg";
import mapBackground from "../../assets/map/MAP-1.png";
import { FIGHT_TASK_DATA } from "../../data/fightTaskData";
import styles from "./Fight.module.css";

export default function Fight() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleDateClick = (day) => {
    console.log(`날짜 ${day}일 클릭됨 - 전투 Task 작성 페이지로 이동`);
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
          <h1 className={styles.headerTitle}>혼돈의 협곡</h1>
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
        <div className={styles.taskPrompt}>
          <span>전투 Task 작성하기</span>
          <img src={addIcon} alt="추가" className={styles.plusIcon} />
        </div>

        {/* 전투 Task 목록 */}
        <div className={styles.taskListContainer}>
          <ThingsToDo tasks={FIGHT_TASK_DATA} />
        </div>
      </div>
      <Navbar activeItem="fight" />
    </div>
  );
}
