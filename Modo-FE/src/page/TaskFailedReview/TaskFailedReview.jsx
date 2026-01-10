import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TaskFailedReview.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import { getLocationBackground, getLocationButtonColor } from "../../utils/locationTheme";

const FAILURE_REASONS = [
  "뭐부터 해야 할지 모르겠어요.",
  "시작이 너무 귀찮고 복잡했어요.",
  "시간이 없어서 그냥 지나갔어요.",
  "갑자기 다른 일이 끼어들었어요.",
  "지금은 하고 싶은 마음이 안 생겼어요.",
  "입력하기",
];

export default function TaskFailedReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const taskTitle = location.state?.taskTitle || "선형대수학2 과제하기";

  const [selectedReason, setSelectedReason] = useState("시간이 없어서 그냥 지나갔어요.");
  const [customReason, setCustomReason] = useState("");
  const [isCustomInput, setIsCustomInput] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleReasonSelect = (reason) => {
    if (reason === "입력하기") {
      setIsCustomInput(true);
      setSelectedReason("입력하기");
    } else {
      setIsCustomInput(false);
      setSelectedReason(reason);
    }
  };

  const handleCustomInputChange = (e) => {
    setCustomReason(e.target.value);
  };

  const handleSave = () => {
    if (!selectedReason || (selectedReason === "입력하기" && !customReason.trim())) {
      return;
    }
    console.log("저장:", selectedReason === "입력하기" ? customReason : selectedReason);
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
          <h1 className={styles.headerTitle}>실패한 전투 회고하기</h1>
          <button className={styles.closeButton} onClick={handleClose}>
            <span>X</span>
          </button>
        </div>

        {/* 태스크 이름 카드 */}
        <div className={styles.taskCard}>
          <p className={styles.taskTitle}>{taskTitle}</p>
        </div>

        {/* 실패 원인 체크하기 */}
        <div className={styles.sectionTitle}>실패 원인 체크하기</div>

        {/* 라디오 버튼 옵션들 */}
        <div className={styles.reasonsList}>
          {FAILURE_REASONS.map((reason, index) => {
            const isSelected = selectedReason === reason;
            const isInputOption = reason === "입력하기";

            return (
              <div key={index} className={styles.reasonItem}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="failureReason"
                    value={reason}
                    checked={isSelected}
                    onChange={() => handleReasonSelect(reason)}
                    className={styles.radioInput}
                  />
                  {isInputOption && isSelected ? (
                    <input
                      type="text"
                      className={styles.customInput}
                      value={customReason}
                      onChange={handleCustomInputChange}
                      placeholder="입력하기"
                      autoFocus
                    />
                  ) : (
                    <span
                      className={`${styles.reasonText} ${
                        isSelected ? styles.selected : ""
                      }`}
                    >
                      {reason}
                    </span>
                  )}
                </label>
              </div>
            );
          })}
        </div>

        {/* 하단 저장 버튼 */}
        <div className={styles.footer}>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={
              !selectedReason ||
              (selectedReason === "입력하기" && !customReason.trim())
            }
            style={{ backgroundColor: buttonColor }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

