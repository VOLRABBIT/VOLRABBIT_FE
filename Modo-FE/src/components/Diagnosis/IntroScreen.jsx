import onboardingBackground from "../../assets/image/onboarding_background.png";

// 진단 검사 인트로 화면 (제목, 설명 문단, 공지사항, 시작 버튼)
export default function IntroScreen({
  title,
  paragraphs,
  notice,
  buttonText,
  onStart,
  styles: customStyles,
}) {
  return (
    <div
      className={customStyles.intro}
      style={{ backgroundImage: `url(${onboardingBackground})` }}
    >
      <div className={customStyles.gradientOverlay} />
      <div className={customStyles.introContent}>
        <h1 className={customStyles.introTitle}>{title}</h1>
        <div className={customStyles.introParagraphs}>
          {paragraphs.map((paragraph, index) => {
            return (
              <p
                key={index}
                className={customStyles[`introParagraph${index + 1}`]}
              >
                {paragraph.replace(/<br\s*\/?>/gi, '\n')}
              </p>
            );
          })}
        </div>
      </div>

      <div className={customStyles.introFooter}>
        <p className={customStyles.introNotice}>{notice}</p>
        <button className={customStyles.ctaButton} onClick={onStart}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}

