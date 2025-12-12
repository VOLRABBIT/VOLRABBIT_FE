import { useNavigate } from "react-router-dom";
import styles from "./Landing.module.css";
import logoImage from "../../assets/landing-logo.png";

export default function Landing() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div className={styles.container}>
      {/* 메인 콘텐츠 */}
      <div className={styles.mainContent}>
        {/* 로고 영역 */}
        <div className={styles.logoSection}>
          <img src={logoImage} alt="로고" className={styles.logoImage} />
        </div>

        {/* 버튼 영역 */}
        <div className={styles.buttonSection}>
          <button className={styles.loginButton} onClick={handleLogin}>
            로그인
          </button>
          <button className={styles.signupButton} onClick={handleSignup}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

