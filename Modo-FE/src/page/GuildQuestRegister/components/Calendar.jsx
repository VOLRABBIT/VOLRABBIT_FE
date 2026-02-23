import taskStyles from "../../TaskCreate/TaskCreate.module.css";
import { weekDays } from "../constants";

export default function Calendar({ selectedDate, onDateSelect }) {
  const getCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const adjustedDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const days = [];
    
    for (let i = 0; i < adjustedDay; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  return (
    <div className={taskStyles.calendarContainer}>
      <div className={taskStyles.calendar}>
        <div className={taskStyles.calendarHeader}>
          {weekDays.map((day, index) => (
            <div key={day} className={`${taskStyles.weekDay} ${index === 6 ? taskStyles.weekDayRed : ""}`}>
              {day}
            </div>
          ))}
        </div>
        <div className={taskStyles.calendarGrid}>
          {getCalendarDays().map((date, index) => {
            if (date === null) {
              return <div key={`empty-${index}`} className={taskStyles.calendarDayEmpty}></div>;
            }
            const dayNumber = date.getDate();
            const dayOfWeek = date.getDay();
            const isSunday = dayOfWeek === 0;
            const isSelected = selectedDate &&
              date.getDate() === selectedDate.getDate() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getFullYear() === selectedDate.getFullYear();
            const isRedDate = isSunday || [7, 14, 21, 28].includes(dayNumber);
            
            return (
              <button
                key={date.getTime()}
                type="button"
                className={`${taskStyles.calendarDay} ${isSelected ? taskStyles.calendarDaySelected : ""} ${isRedDate ? taskStyles.calendarDayRed : ""}`}
                onClick={() => onDateSelect(date)}
              >
                {dayNumber}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}