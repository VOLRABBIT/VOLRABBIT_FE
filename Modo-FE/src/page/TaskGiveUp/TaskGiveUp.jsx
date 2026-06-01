import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TaskGiveUp.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import { getLocationBackground, getLocationButtonColor } from "../../utils/locationTheme";
import TaskGiveUpConfirmModal from "../../components/TaskGiveUpConfirmModal/TaskGiveUpConfirmModal";
import TaskGiveUpRetryModal from "../../components/TaskGiveUpRetryModal/TaskGiveUpRetryModal";
import { createRetryTodo, giveUpTodo } from "../../api/taskApi";

const GIVE_UP_REASONS = [
  "뭐부터 해야 할지 모르겠어요.",
  "시작이 너무 귀찮고 복잡했어요.",
  "시간이 없어서 그냥 지나갔어요.",
  "갑자기 다른 일이 끼어들었어요.",
  "지금은 하고 싶은 마음이 안 생겼어요.",
  "입력하기",
];

const REASON_CODES = ["DONT_KNOW_HOW", "TOO_COMPLEX", "NO_TIME", "INTERRUPTED", "ETC", "ETC"];

const isCustomReason = (reason) => reason === GIVE_UP_REASONS[GIVE_UP_REASONS.length - 1];

const getTomorrowYmd = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildOutcomePayload = (selectedReason, customReason) => {
  const index = GIVE_UP_REASONS.indexOf(selectedReason);
  const reasonCode = REASON_CODES[index] ?? "ETC";
  const payload = { reasonCode };
  const customText = reasonCode === "ETC" ? customReason.trim() : "";
  if (customText) {
    payload.customText = customText;
  }
  return payload;
};

export default function TaskGiveUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const taskTitle = location.state?.taskTitle || "";
  const todoId = location.state?.todoId ?? location.state?.taskId;
  const locationType = location.state?.locationType || "dungeon";
  const mapBackground = getLocationBackground(locationType);
  const buttonColor = getLocationButtonColor(locationType);

  const [selectedReason, setSelectedReason] = useState(null);
  const [customReason, setCustomReason] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRetryModal, setShowRetryModal] = useState(false);
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

  const handleGiveUpClick = () => {
    if (!selectedReason || (isCustomReason(selectedReason) && !customReason.trim())) {
      return;
    }
    setActionError("");
    setShowConfirmModal(true);
  };

  const handleConfirmModalClose = () => {
    setShowConfirmModal(false);
  };

  const handleConfirmModalConfirm = () => {
    setShowConfirmModal(false);
    setShowRetryModal(true);
  };

  const submitGiveUpAndExit = async () => {
    if (!todoId) {
      setShowRetryModal(false);
      setActionError("Todo ID가 없어 포기 기록을 저장할 수 없습니다.");
      return;
    }

    setIsSubmitting(true);
    setActionError("");
    try {
      await giveUpTodo(todoId, buildOutcomePayload(selectedReason, customReason));
      setShowRetryModal(false);
      navigate(-1);
    } catch (err) {
      setShowRetryModal(false);
      setActionError(err?.response?.data?.message ?? err?.message ?? "포기 기록 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitRetryAndExit = async () => {
    if (!todoId) {
      setShowRetryModal(false);
      setActionError("Todo ID가 없어 재도전 task를 만들 수 없습니다.");
      return;
    }

    setIsSubmitting(true);
    setActionError("");
    try {
      await createRetryTodo(todoId, {
        ...buildOutcomePayload(selectedReason, customReason),
        dueType: "TOMORROW",
        dueDate: getTomorrowYmd(),
      });
      setShowRetryModal(false);
      navigate(-1);
    } catch (err) {
      setShowRetryModal(false);
      setActionError(err?.response?.data?.message ?? err?.message ?? "재도전 task 생성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetryModalClose = () => {
    void submitGiveUpAndExit();
  };

  const handleRetryModalRetry = () => {
    void submitRetryAndExit();
  };

  const handleRetryModalGiveUp = () => {
    void submitGiveUpAndExit();
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
          <h1 className={styles.headerTitle}>전투 포기하기</h1>
          <button className={styles.closeButton} onClick={handleClose}>
            <span>X</span>
          </button>
        </div>

        {/* 태스크 이름 카드 */}
        <div className={styles.taskCard}>
          <p className={styles.taskTitle}>{taskTitle}</p>
        </div>

        {/* 포기 원인 체크하기 */}
        <div className={styles.sectionTitle}>포기 원인 체크하기</div>

        {/* 라디오 버튼 옵션들 */}
        <div className={styles.reasonsList}>
          {GIVE_UP_REASONS.map((reason, index) => {
            const isSelected = selectedReason === reason;
            const isInputOption = isCustomReason(reason);

            return (
              <div key={index} className={styles.reasonItem}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="giveUpReason"
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

        {/* 하단 포기하기 버튼 */}
        <div className={styles.footer}>
          <button
            className={styles.giveUpButton}
            onClick={handleGiveUpClick}
            disabled={
              isSubmitting ||
              !selectedReason ||
              (isCustomReason(selectedReason) && !customReason.trim())
            }
            style={{ backgroundColor: buttonColor }}
          >
            {isSubmitting ? "처리 중..." : "포기하기"}
          </button>
        </div>
      </div>

      {/* 포기 확인 모달 */}
      {showConfirmModal && (
        <TaskGiveUpConfirmModal
          onClose={handleConfirmModalClose}
          onConfirm={handleConfirmModalConfirm}
        />
      )}

      {/* 재시도 제안 모달 */}
      {showRetryModal && (
        <TaskGiveUpRetryModal
          onClose={handleRetryModalClose}
          onRetry={handleRetryModalRetry}
          onGiveUp={handleRetryModalGiveUp}
          locationType={locationType}
        />
      )}
    </div>
  );
}

