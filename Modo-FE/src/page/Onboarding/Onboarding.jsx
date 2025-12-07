import styles from "./Onboarding.module.css";
import onboardingBackground from "../../assets/image/onboarding_background.png";

export default function Onboarding() {
  return (
    <div
      className={styles.intro}
      style={{ backgroundImage: `url(${onboardingBackground})` }}
    >
      <div className={styles.gradientOverlay} />
      <div className={styles.introContent}>
        <h1 className={styles.introTitle}>ADHD 진단 검사</h1>
        <div className={styles.introParagraphs}>
          <p className={styles.introParagraph1}>
            Modod는 더 적합한 투두리스트 작성을 위해 <br />
            ADHD 진단 검사를 근거로 유형을 구분해요.
          </p>
          <p className={styles.introParagraph2}>
            ADHD 진단 검사는 총 8문항으로, <br />
            자신을 잘 설명하는 정도를 체크하면 돼요.
          </p>
          <p className={styles.introParagraph3}>
            Modo 시작 이후, [마이페이지]에서 <br />
            더욱 정밀한 ADHD 진단 검사를 할 수 있어요.
          </p>
        </div>
      </div>

      <div className={styles.introFooter}>
        <p className={styles.introNotice}>
          * Modo가 제공하는 진단 검사만으로 실제 ADHD 여부를 확인할 수 없어요.
        </p>
        <button className={styles.ctaButton}>
          진단하기
        </button>
      </div>
    </div>
  );
}
