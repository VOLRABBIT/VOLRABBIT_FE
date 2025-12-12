import { useState } from "react";
import styles from "./Login.module.css";
import logoImage from "../../assets/landing-logo.png";
import kakaoLoginImage from "../../assets/kakao-login.png";
import eyeSlashIcon from "../../assets/eye-slash.svg";

export default function Login() {
  const [nickname, setNickname] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {};

  const handleKakaoLogin = () => {};

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
              className={styles.input}
              placeholder="닉네임 입력"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          {/* 아이디 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>아이디</label>
            <input
              type="text"
              className={styles.input}
              placeholder="아이디 입력"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          {/* 비밀번호 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>비밀번호</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                className={styles.input}
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                <img src={eyeSlashIcon} alt="비밀번호 표시/숨김" />
              </button>
            </div>
          </div>
        </div>

        {/* 로그인 버튼 */}
        <button className={styles.loginButton} onClick={handleLogin}>
          로그인
        </button>

        {/* 카카오톡 로그인 버튼 - 임시 이미지로 대체 */}
        <button className={styles.kakaoLoginButton} onClick={handleKakaoLogin}>
          <img src={kakaoLoginImage} alt="카카오톡으로 로그인" className={styles.kakaoLoginImage} />
        </button>
      </div>
    </div>
  );
}

