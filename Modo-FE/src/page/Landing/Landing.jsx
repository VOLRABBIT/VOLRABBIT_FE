import styles from "./Landing.module.css";

export default function Landing() {
  return (
    <div className={styles.container}>
      {/* 메인 콘텐츠 */}
      <div className={styles.mainContent}>
        {/* 로고 영역 */}
        <div className={styles.logoSection}>
          {/* 로고 이미지가 들어갈 영역 */}
        </div>

        {/* 버튼 영역 */}
        <div className={styles.buttonSection}>
          <button className={styles.loginButton}>로그인</button>
          <button className={styles.signupButton}>회원가입</button>
        </div>
      </div>
    </div>
  );
}

