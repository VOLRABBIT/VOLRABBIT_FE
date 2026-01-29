import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import logoImage from "../../assets/landing-logo.png";
import appleIcon from "../../assets/apple.svg";
import googleIcon from "../../assets/google.svg";
import kakaoIcon from "../../assets/kakao-login.png";
import eyeSlashIcon from "../../assets/eye-slash.svg";
import eyeIcon from "../../assets/eye.svg";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import { login, socialLogin, getUserProfile } from "../../api/authApi";

export default function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [showKakaoSnack] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isLoginButtonActive = id.trim() && password.trim();

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!isLoginButtonActive || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      await login(id, password);
      
      // 온보딩 완료 여부 확인
      const profile = await getUserProfile();
      
      // persona가 있으면 기존 사용자이므로 맵 페이지로 이동, 없으면 신규 회원이므로 온보딩 페이지로 이동
      if (profile.persona || profile.personaId) {
        navigate("/map");
      } else {
        navigate("/onboarding");
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 400) {
        setError("이메일 또는 비밀번호가 일치하지 않습니다");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    socialLogin("kakao");
  };

  const handleGoogleLogin = () => {
    socialLogin("google");
  };

  const handleAppleLogin = () => {
    socialLogin("apple");
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={arrowLeftIcon} alt="뒤로가기" />
        </button>
        <h1 className={styles.title}>로그인</h1>
      </div>

      {/* 메인  */}
      <div className={styles.mainContent}>
        {/* 로고 */}
        <div className={styles.logoSection}>
          <img src={logoImage} alt="로고" className={styles.logoImage} />
        </div>

        {/* 입력 필드 */}
        <form className={styles.inputSection} onSubmit={handleLogin}>
          {/* 이메일 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>이메일</label>
            <input
              type="text"
              className={`${styles.input} ${focusedField === "id" ? styles.inputFocused : ""} ${error ? styles.inputError : ""}`}
              placeholder="이메일 입력"
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

          {/* 로그인 버튼 */}
          <button 
            type="submit"
            className={`${styles.loginButton} ${isLoginButtonActive ? styles.loginButtonActive : ""}`} 
            disabled={!isLoginButtonActive || isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* 소셜 로그인 버튼들 */}
        <div className={styles.socialLoginSection}>
          {showKakaoSnack ? (
            <button className={styles.kakaoSnackButton} disabled>
              카카오톡 계정 확인 중 ...
            </button>
          ) : (
            <>
              {/* 카카오톡 로그인 버튼 */}
              <button className={styles.kakaoLoginButton} onClick={handleKakaoLogin}>
                <img src={kakaoIcon} alt="카카오톡으로 로그인" className={styles.kakaoLoginImage} />
              </button>

              {/* 구글 로그인 버튼 */}
              <button className={styles.googleLoginButton} onClick={handleGoogleLogin}>
                <img src={googleIcon} alt="구글" className={styles.socialIcon} />
                <span className={styles.socialButtonText}>Sign in with Google</span>
              </button>

              {/* 애플 로그인 버튼 */}
              <button className={styles.appleLoginButton} onClick={handleAppleLogin}>
                <img src={appleIcon} alt="애플" className={styles.socialIcon} />
                <span className={styles.socialButtonText}>Sign in with Apple</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

