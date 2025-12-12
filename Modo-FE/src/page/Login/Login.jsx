import { useState } from "react";
import styles from "./Login.module.css";
import logoImage from "../../assets/landing-logo.png";
import kakaoLoginImage from "../../assets/kakao-login.png";
import eyeSlashIcon from "../../assets/eye-slash.svg";
import eyeIcon from "../../assets/eye.svg";

export default function Login() {
  const [nickname, setNickname] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [showKakaoSnack, setShowKakaoSnack] = useState(false);

  const isLoginButtonActive = nickname.trim() && id.trim() && password.trim();

  const handleLogin = () => {
    // error test
    // setError("아이디 또는 비밀번호가 일치하지 않습니다");
  };

  const handleKakaoLogin = () => {
    setShowKakaoSnack(true);
    // 3초 후 자동으로 숨김
    setTimeout(() => {
      setShowKakaoSnack(false);
    }, 3000);
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h1 className={styles.title}>로그인</h1>
      </div>

      {/* 메인  */}
      <div className={styles.mainContent}>
        {/* 로고 */}
        <div className={styles.logoSection}>
          <img src={logoImage} alt="로고" className={styles.logoImage} />
        </div>

        {/* 입력 필드 */}
        <div className={styles.inputSection}>
          {/* 닉네임 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>닉네임</label>
            <input
              type="text"
              className={`${styles.input} ${focusedField === "nickname" ? styles.inputFocused : ""}`}
              placeholder="닉네임 입력"
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
              className={`${styles.input} ${focusedField === "id" ? styles.inputFocused : ""} ${error ? styles.inputError : ""}`}
              placeholder="아이디 입력"
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                setError("");
              }}
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
                className={`${styles.input} ${focusedField === "password" ? styles.inputFocused : ""} ${error ? styles.inputError : ""}`}
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
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
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* 로그인 버튼 */}
        <button 
          className={`${styles.loginButton} ${isLoginButtonActive ? styles.loginButtonActive : ""}`} 
          onClick={handleLogin}
          disabled={!isLoginButtonActive}
        >
          로그인
        </button>

        {/* 카카오톡 로그인 버튼 */}
        {showKakaoSnack ? (
          <button className={styles.kakaoSnackButton} disabled>
            카카오톡 계정 확인 중 ...
          </button>
        ) : (
          <button className={styles.kakaoLoginButton} onClick={handleKakaoLogin}>
            <img src={kakaoLoginImage} alt="카카오톡으로 로그인" className={styles.kakaoLoginImage} />
          </button>
        )}
      </div>
    </div>
  );
}

