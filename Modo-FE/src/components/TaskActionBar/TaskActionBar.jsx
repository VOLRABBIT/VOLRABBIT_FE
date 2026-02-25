import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TaskActionBar.module.css";
import SkipModal from "../Diagnosis/SkipModal";
import taskIcon from "../../assets/navbar/task.svg";
import taskAddIcon from "../../assets/navbar/task-add.svg";
import reportIcon from "../../assets/navbar/report.svg";
import { getCategories } from "../../api/apiStore";

const extractCategoryList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.categories)) return data.categories;
  return [];
};

export default function TaskActionBar({ currentDate, orderScopeTodoId = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCategoryChecking, setIsCategoryChecking] = useState(false);
  const [showNoCategoryModal, setShowNoCategoryModal] = useState(false);
  
  // locationType 가져오기 (기본값: gorge)
  const locationType = location.state?.locationType || "gorge";

  const getCharacterPath = () => {
    const savedPersona = localStorage.getItem("personaType");
    const characterMap = {
      "Starter-Freeze Bot": "robot",
      "Attention-grave": "graverobber",
      "Time Wizard": "wizard",
      "Emotional Adventure": "adventurer",
    };
    return characterMap[savedPersona] || "robot";
  };

  const handleTaskAddClick = async () => {
    if (isCategoryChecking) return;
    setIsCategoryChecking(true);
    try {
      const categoriesData = await getCategories().catch(() => null);
      const categoryList = categoriesData != null ? extractCategoryList(categoriesData) : [];
      if (!Array.isArray(categoryList) || categoryList.length === 0) {
        setShowNoCategoryModal(true);
        return;
      }
      const targetDate = currentDate || (() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      })();
      navigate("/task-create", {
        state: { locationType, targetDate }
      });
    } finally {
      setIsCategoryChecking(false);
    }
  };

  const handleItemClick = (itemId) => {
    switch (itemId) {
      case "task-rebuild": {
        const dateStr = currentDate || (() => {
          const today = new Date();
          return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        })();
        const characterPath = getCharacterPath();
        navigate(`/task-rebuild/${characterPath}/${dateStr}/${locationType}`, {
          state: {
            locationType,
            returnPath: location.pathname,
            orderScopeTodoId,
            todoId: orderScopeTodoId,
          }
        });
        break;
      }
      case "task-add": {
        handleTaskAddClick();
        break;
      }
      case "report":
        navigate("/mypage");
        break;
      default:
        break;
    }
  };

  const items = [
    { id: "task-rebuild", label: "task 재구성", icon: taskIcon },
    { id: "task-add", label: "", icon: taskAddIcon },
    { id: "report", label: "리포트", icon: reportIcon },
  ];

  return (
    <>
      <nav className={styles.actionBar}>
        <div className={styles.actionBarBackground} />
        <div className={styles.menuContainer}>
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.menuItem}
              onClick={() => handleItemClick(item.id)}
            >
              <div className={styles.iconWrapper}>
                <img src={item.icon} alt={item.label || item.id} className={styles.icon} />
              </div>
              {item.label && <span className={styles.label}>{item.label}</span>}
            </button>
          ))}
        </div>
      </nav>

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
    </>
  );
}