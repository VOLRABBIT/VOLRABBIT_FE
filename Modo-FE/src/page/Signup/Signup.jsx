import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import eyeSlashIcon from "../../assets/eye-slash.svg";
import eyeIcon from "../../assets/eye.svg";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import arrowRightIcon from "../../assets/arrow-right.svg";
import checkedIcon from "../../assets/checked.svg";

export default function Signup() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [agreements, setAgreements] = useState({
    all: false,
    service: false,
    marketing: false,
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleAgreementChange = (type) => {
    if (type === "all") {
      const newValue = !agreements.all;
      setAgreements({
        all: newValue,
        service: newValue,
        marketing: newValue,
      });
    } else {
      setAgreements((prev) => {
        const updated = { ...prev, [type]: !prev[type] };
        updated.all = updated.service && updated.marketing;
        return updated;
      });
    }
  };

  const handleSignup = () => {};

  const isSignupButtonActive = 
    nickname.trim() && 
    id.trim() && 
    password.trim() && 
    confirmPassword.trim() && 
    agreements.service;

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={arrowLeftIcon} alt="뒤로가기" />
        </button>
        <h1 className={styles.title}>회원가입</h1>
      </div>

      {/* 메인 */}
      <div className={styles.mainContent}>
        {/* 입력 필드 */}
        <div className={styles.inputSection}>
          {/* 닉네임 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>닉네임</label>
            <input
              type="text"
              className={`${styles.input} ${focusedField === "nickname" ? styles.inputFocused : ""}`}
              placeholder="아이디 입력"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onFocus={() => setFocusedField("nickname")}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          {/* 아이디 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>아이디</label>
            <input
              type="text"
              className={`${styles.input} ${focusedField === "id" ? styles.inputFocused : ""}`}
              placeholder="아이디 입력"
              value={id}
              onChange={(e) => setId(e.target.value)}
              onFocus={() => setFocusedField("id")}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          {/* 비밀번호 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>비밀번호</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                className={`${styles.input} ${focusedField === "password" ? styles.inputFocused : ""}`}
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (confirmPassword && e.target.value !== confirmPassword) {
                    setPasswordError("비밀번호가 일치하지 않습니다.");
                  } else if (confirmPassword && e.target.value === confirmPassword) {
                    setPasswordError("");
                  }
                }}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
              <button
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                <img src={showPassword ? eyeIcon : eyeSlashIcon} alt={showPassword ? "비밀번호 숨김" : "비밀번호 표시"} />
              </button>
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>비밀번호 확인</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`${styles.input} ${focusedField === "confirmPassword" ? styles.inputFocused : ""} ${passwordError ? styles.inputError : ""}`}
                placeholder="비밀번호 재입력"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (e.target.value && e.target.value !== password) {
                    setPasswordError("비밀번호가 일치하지 않습니다.");
                  } else {
                    setPasswordError("");
                  }
                }}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => {
                  setFocusedField(null);
                  if (confirmPassword && confirmPassword !== password) {
                    setPasswordError("비밀번호가 일치하지 않습니다.");
                  } else {
                    setPasswordError("");
                  }
                }}
              />
              <button
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                type="button"
              >
                <img src={showConfirmPassword ? eyeIcon : eyeSlashIcon} alt={showConfirmPassword ? "비밀번호 숨김" : "비밀번호 표시"} />
              </button>
            </div>
            {passwordError && (
              <div className={styles.errorMessage}>
                {passwordError}
              </div>
            )}
          </div>
        </div>

        {/* 약관 동의 */}
        <div className={styles.agreementSection}>
          {/* 전체 동의 */}
          <button 
            className={`${styles.agreementCell} ${styles.agreementCellFirst}`}
            onClick={() => handleAgreementChange("all")}
          >
            <div className={styles.agreementLeft}>
              {agreements.all ? (
                <img 
                  src={checkedIcon} 
                  alt="체크됨"
                  className={styles.checkboxIcon}
                />
              ) : (
                <div className={styles.checkbox}></div>
              )}
            </div>
            <div className={styles.agreementText}>
              전체 동의(선택 정보 포함)
            </div>
          </button>

          {/* 서비스 이용 약관 */}
          <div className={styles.agreementCell}>
            <div 
              className={styles.agreementLeft}
            onClick={() => handleAgreementChange("service")}
              style={{ cursor: "pointer" }}
          >
              {agreements.service ? (
                <img 
                  src={checkedIcon} 
                  alt="체크됨"
                  className={styles.checkboxIcon}
                />
              ) : (
                <div className={styles.checkbox}></div>
              )}
            </div>
            <div 
              className={styles.agreementText}
              onClick={() => navigate("/terms-of-service")}
              style={{ cursor: "pointer", flex: 1 }}
            >
              [필수] 서비스 이용 약관
            </div>
            <div 
              className={styles.agreementRight}
              onClick={() => navigate("/terms-of-service")}
              style={{ cursor: "pointer" }}
            >
              <img src={arrowRightIcon} alt="자세히 보기" />
            </div>
          </div>

          {/* 마케팅 동의 */}
          <div className={styles.agreementCell}>
            <div 
              className={styles.agreementLeft}
            onClick={() => handleAgreementChange("marketing")}
              style={{ cursor: "pointer" }}
          >
              {agreements.marketing ? (
                <img 
                  src={checkedIcon} 
                  alt="체크됨"
                  className={styles.checkboxIcon}
                />
              ) : (
                <div className={styles.checkbox}></div>
              )}
            </div>
            <div 
              className={styles.agreementText}
              onClick={() => navigate("/marketing-agreement")}
              style={{ cursor: "pointer", flex: 1 }}
            >
              [선택] 마케팅 및 메시지 수신 동의
            </div>
            <div 
              className={styles.agreementRight}
              onClick={() => navigate("/marketing-agreement")}
              style={{ cursor: "pointer" }}
            >
              <img src={arrowRightIcon} alt="자세히 보기" />
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className={styles.footer}>
        <button 
          className={`${styles.signupButton} ${isSignupButtonActive ? styles.signupButtonActive : ""}`}
          onClick={handleSignup}
          disabled={!isSignupButtonActive}
        >
          가입하기
        </button>
      </div>
    </div>
  );
}

