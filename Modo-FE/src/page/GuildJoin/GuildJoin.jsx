import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../../components/Toast/Toast";
import { joinGuild, setCurrentGuildId } from "../../api/guildApi";
import styles from "./GuildJoin.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import SkipModal from "../../components/Diagnosis/SkipModal";

export default function GuildJoin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("invite");
  const [inviteCode, setInviteCode] = useState("");
  const [guildIdInput, setGuildIdInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [showInviteUnsupportedModal, setShowInviteUnsupportedModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [guildName, setGuildName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleInviteCodeChange = (value) => {
    const sanitized = value.replace(/[^A-Za-z0-9_-]/g, "");
    setInviteCode(sanitized);
    setError("");
  };

  const handleGuildIdChange = (value) => {
    const sanitized = value.replace(/[^0-9]/g, "");
    setGuildIdInput(sanitized);
    setError("");
  };

  const handleInviteConfirm = () => {
    const normalized = inviteCode.trim();
    if (!normalized) {
      setError("초대코드를 입력해주세요.");
      return;
    }
    // OpenAPI에 초대코드 가입 endpoint가 없어 프론트 단독 구현 불가
    setShowInviteUnsupportedModal(true);
  };

  const handleGuildIdJoin = async () => {
    if (isSubmitting) return;
    if (!guildIdInput.trim()) {
      setError("길드 ID를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const guildId = Number(guildIdInput.trim());
      if (!Number.isFinite(guildId)) {
        setError("길드 ID가 올바르지 않습니다.");
        return;
      }

      await joinGuild(guildId, passwordInput.trim());
      setCurrentGuildId(guildId);
      setGuildName(`${guildId}번 길드`);
      setShowToast(true);
      setTimeout(() => {
        navigate(`/guild/${guildId}`);
      }, 1500);
    } catch (e) {
      setError(e?.message || "길드 가입에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={arrowLeftIcon} alt="뒤로가기" />
        </button>
        <h1 className={styles.title}>길드 함께하기</h1>
        <div className={styles.placeholder}></div>
      </div>
      <div className={styles.content}>
        <div className={styles.tabContainer}>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "invite" ? styles.tabButtonActive : ""}`}
            onClick={() => {
              setActiveTab("invite");
              setError("");
            }}
          >
            초대코드 가입
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "guildId" ? styles.tabButtonActive : ""}`}
            onClick={() => {
              setActiveTab("guildId");
              setError("");
            }}
          >
            길드ID 가입
          </button>
        </div>

        {activeTab === "invite" ? (
          <>
            <p className={styles.description}>
              초대코드(영문/숫자/하이픈/언더스코어)를 입력해주세요.
            </p>
            <div className={styles.formGroup}>
              <input
                type="text"
                className={`${styles.singleInput} ${error ? styles.codeInputError : ""}`}
                value={inviteCode}
                onChange={(e) => handleInviteCodeChange(e.target.value)}
                placeholder="예: AB12_CD-9"
                autoComplete="off"
              />
            </div>
          </>
        ) : (
          <>
            <p className={styles.description}>
              길드 ID와 비밀번호를 입력해주세요.
            </p>
            <div className={styles.formGroup}>
              <input
                type="text"
                className={`${styles.singleInput} ${error ? styles.codeInputError : ""}`}
                value={guildIdInput}
                onChange={(e) => handleGuildIdChange(e.target.value)}
                placeholder="길드 ID(숫자)"
                autoComplete="off"
              />
              <input
                type="password"
                className={styles.singleInput}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="비공개 길드 비밀번호(문자열)"
                autoComplete="off"
              />
            </div>
          </>
        )}

        {error && (
          <p className={styles.errorMessage}>{error}</p>
        )}

        {activeTab === "invite" ? (
          <p className={styles.helperText}>
            현재 서버는 초대코드 가입 endpoint를 제공하지 않습니다. 길드ID 가입을 이용해주세요.
          </p>
        ) : null}
      </div>
      <div className={styles.footer}>
        <button 
          className={styles.confirmButton}
          onClick={activeTab === "invite" ? handleInviteConfirm : handleGuildIdJoin}
          disabled={isSubmitting}
        >
          {isSubmitting ? "확인 중..." : "확인"}
        </button>
      </div>
      {showInviteUnsupportedModal && (
        <SkipModal
          title="초대코드 가입 미지원"
          content="현재 서버는 초대코드로 가입을 지원하지 않습니다. 길드 ID로 가입하거나 관리자에게 길드 ID를 요청하세요."
          stopButtonText="길드ID 가입으로 이동"
          continueButtonText="닫기"
          onClose={() => setShowInviteUnsupportedModal(false)}
          onStop={() => {
            setShowInviteUnsupportedModal(false);
            setActiveTab("guildId");
          }}
        />
      )}
      {showToast && (
        <Toast
          message={`${guildName}의 동료가 되었어요!`}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}