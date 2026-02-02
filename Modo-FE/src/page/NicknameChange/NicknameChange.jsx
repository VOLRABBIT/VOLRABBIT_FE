// React & 라우터
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// API
import { getMyInfo, checkNickname, updateNickname } from "../../api/apiStore";

// 컴포넌트
import TopBar from "../../components/TopBar/TopBar";
import Navbar from "../../components/Navbar/Navbar";

// 스타일
import styles from "./NicknameChange.module.css";

export default function NicknameChange() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [checkResult, setCheckResult] = useState(null); 
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    getMyInfo()
      .then((res) => {
        const profile = res?.data ?? res;
        const current = profile?.nickname ?? profile?.name ?? "";
        if (current) setNickname(String(current).trim());
      })
      .catch(() => {});
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCheckDuplicate = async () => {
    const value = nickname.trim();
    if (!value) {
      setError("닉네임을 입력해주세요.");
      setCheckResult(null);
      return;
    }
    setError("");
    setCheckResult(null);
    setIsChecking(true);
    try {
      const res = await checkNickname(value);
      const data = res?.data ?? res;
      const isDuplicated = data === true || data?.data === true;
      setCheckResult(isDuplicated ? "duplicate" : "available");
    } catch (err) {
      const msg = err.response?.data?.message ?? "중복 확인에 실패했습니다.";
      setError(msg);
      setCheckResult(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSave = async () => {
    const value = nickname.trim();
    if (!value) {
      setError("닉네임을 입력해주세요.");
      return;
    }
    setError("");
    setIsSaving(true);
    try {
      await updateNickname(value);
      setCheckResult(null);
      setShowSuccessModal(true);
    } catch (err) {
      const msg = err.response?.data?.message ?? "닉네임 변경에 실패했습니다.";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = nickname.trim().length > 0 && !isSaving;

  return (
    <div className={styles.container}>
      <TopBar
        title="닉네임 변경"
        onBack={handleBack}
        showSkip={false}
        textColor="dark"
      />

      <div className={styles.content}>
        <p className={styles.description}>
          사용할 닉네임을 입력한 뒤 중복 확인 후 저장해주세요.
        </p>

        <div className={styles.inputGroup}>
          <label className={styles.label}>닉네임</label>
          <input
            type="text"
            className={styles.input}
            placeholder="닉네임 입력"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setCheckResult(null);
              setError("");
            }}
            maxLength={20}
            disabled={isSaving}
          />
          {checkResult === "available" && (
            <p className={styles.available}>사용 가능한 닉네임입니다.</p>
          )}
          {checkResult === "duplicate" && (
            <p className={styles.duplicate}>이미 사용 중인 닉네임입니다.</p>
          )}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={handleCheckDuplicate}
            disabled={isChecking || !nickname.trim()}
          >
            {isChecking ? "확인 중..." : "중복 확인"}
          </button>
          <button
            type="button"
            className={styles.buttonPrimary}
            onClick={handleSave}
            disabled={!canSave}
          >
            {isSaving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </div>

      <Navbar activeItem="mypage" />

      {showSuccessModal && (
        <div className={styles.modalOverlay} onClick={() => { setShowSuccessModal(false); navigate("/mypage"); }}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <p className={styles.modalMessage}>닉네임이 변경되었습니다.</p>
            <button
              type="button"
              className={styles.modalButton}
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/mypage");
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
