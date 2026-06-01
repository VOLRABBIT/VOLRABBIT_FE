import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TaskFailedReview.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import { getLocationBackground, getLocationButtonColor } from "../../utils/locationTheme";
import { failTodo } from "../../api/taskApi";

const FAILURE_REASONS = [
  "뭐부터 해야 할지 모르겠어요.",
  "시작이 너무 귀찮고 복잡했어요.",
  "시간이 없어서 그냥 지나갔어요.",
  "갑자기 다른 일이 끼어들었어요.",
  "지금은 하고 싶은 마음이 안 생겼어요.",
  "입력하기",
];

const REASON_CODES = ["DONT_KNOW_HOW", "TOO_COMPLEX", "NO_TIME", "INTERRUPTED", "ETC", "ETC"];

const isCustomReason = (reason) => reason === FAILURE_REASONS[FAILURE_REASONS.length - 1];

const buildOutcomePayload = (selectedReason, customReason) => {
  const index = FAILURE_REASONS.indexOf(selectedReason);
  const reasonCode = REASON_CODES[index] ?? "ETC";
  const payload = { reasonCode };
  const customText = reasonCode === "ETC" ? customReason.trim() : "";
  if (customText) {
    payload.customText = customText;
  }
  return payload;
};

export default function TaskFailedReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const taskTitle = location.state?.taskTitle || "선형대수학2 과제하기";
  const todoId = location.state?.todoId ?? location.state?.taskId;
  const locationType = location.state?.locationType || "gorge";
  const mapBackground = getLocationBackground(locationType);
  const buttonColor = getLocationButtonColor(locationType);

  const [selectedReason, setSelectedReason] = useState("시간이 없어서 그냥 지나갔어요.");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

  const handleBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleReasonSelect = (reason) => {
    if (isCustomReason(reason)) {
      setSelectedReason(reason);
    } else {
      setSelectedReason(reason);
    }
  };

  const handleCustomInputChange = (e) => {
    setCustomReason(e.target.value);
  };

  const handleSave = async () => {
    if (!selectedReason || (isCustomReason(selectedReason) && !customReason.trim())) {
      return;
    }
    if (!todoId) {
      setActionError("Todo ID가 없어 실패 회고를 저장할 수 없습니다.");
      return;
    }

    setIsSubmitting(true);
    setActionError("");
    try {
      await failTodo(todoId, buildOutcomePayload(selectedReason, customReason));
      navigate(-1);
    } catch (err) {
      setActionError(err?.response?.data?.message ?? err?.message ?? "실패 회고 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
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
            const isInputOption = isCustomReason(reason);

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

        {actionError && (
          <p style={{ color: "#b91c1c", fontSize: 13, margin: "8px 0 0" }}>
            {actionError}
          </p>
        )}

        {/* 하단 저장 버튼 */}
        <div className={styles.footer}>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={
              isSubmitting ||
              !selectedReason ||
              (isCustomReason(selectedReason) && !customReason.trim())
            }
            style={{ backgroundColor: buttonColor }}
          >
            {isSubmitting ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

