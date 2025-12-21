import { useState, useEffect } from "react";

import styles from "./Onboarding.module.css";
import ResultPage from "../Result/ResultPage";

import onboardingBackground from "../../assets/image/onboarding_background.png";
import resultBackground from "../../assets/image/Result_background.png";
import arrowLeftIcon from "../../assets/icon/arrow-left.svg";
import closeIcon from "../../assets/icon/close.svg";
import adventurerCharacter from "../../assets/character/adventurer.png";
import graveRobberCharacter from "../../assets/character/graverobber.png";
import robotCharacter from "../../assets/character/robot.png";
import wizardCharacter from "../../assets/character/wizard.png";

import { matchPersona } from "../../utils/personaCalculator";
import { PERSONA_DATA } from "../../data/personaData";

const QUESTIONS = [
  "해야 할 일을 알지만 시작이 잘 되지 않는다.",
  "복잡한 일을 보면 막막함이 든다.",
  "잠깐만 하다가 시간이 훅 지나간다.",
  "마감이 다가와야 움직인다.",
  "관심 없는 활동에서는 집중이 오래 안 간다.",
  "작은 실패에도 크게 좌절한다.",
  "루틴을 유지하는 것이 어렵다.",
];

const CHARACTERS = [
  adventurerCharacter,
  graveRobberCharacter,
  robotCharacter,
  wizardCharacter,
];

const ANSWER_OPTIONS = [
  { value: "very-agree", label: "매우 그렇다." },
  { value: "agree", label: "그렇다." },
  { value: "disagree", label: "그렇지 않다." },
  { value: "very-disagree", label: "매우 그렇지 않다." },
];

export default function Onboarding() {
  const [isIntro, setIsIntro] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [personaType, setPersonaType] = useState(null);
  const [isSkipped, setIsSkipped] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex] || "";

  // 진단 검사 시작
  const handleStart = () => {
    setIsIntro(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsSkipped(false);
  };

  // 이전 질문으로 이동 또는 인트로로 복귀
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      setIsIntro(true);
    }
  };

  // 건너뛰기 모달 표시
  const handleSkip = () => {
    setShowSkipModal(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowSkipModal(false);
  };

  // 검사 중단 (인트로로 복귀)
  const handleStopTest = () => {
    setIsIntro(true);
    setShowSkipModal(false);
  };

  // 건너뛰기 확인 시 로봇 페르소나로 결과 표시
  const handleSkipConfirm = () => {
    setIsSkipped(true);
    setShowSkipModal(false);
    setIsLoading(true);
  };

  // 다음 질문으로 이동 또는 마지막 질문이면 로딩 시작
  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsLoading(true);
    }
  };

  // 사용자 답변 저장
  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: value,
    });
  };

  const handleStartAdventure = () => {
    // 모험 시작 로직 구현 필요
  };

  // 로딩 화면 처리
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentCharacterIndex((prev) => (prev + 1) % CHARACTERS.length);
      }, 2000);

      const resultTimeout = setTimeout(() => {
        const persona = isSkipped ? "Starter-Freeze Bot" : matchPersona(answers);
        setPersonaType(persona);
        setIsLoading(false);
        setShowResult(true);
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(resultTimeout);
      };
    }
  }, [isLoading, answers, isSkipped]);

  // 인트로 화면
  if (isIntro) {
    return (
      <div
        className={styles.intro}
        style={{ backgroundImage: `url(${onboardingBackground})` }}
      >
        <div className={styles.gradientOverlay} />
        {/* 인트로 콘텐츠 영역 */}
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

        {/* 인트로 하단 영역 (공지사항 및 시작 버튼) */}
        <div className={styles.introFooter}>
          <p className={styles.introNotice}>
            * Modo가 제공하는 진단 검사만으로 실제 ADHD 여부를 확인할 수 없어요.
          </p>
          <button className={styles.ctaButton} onClick={handleStart}>
            진단하기
          </button>
        </div>
      </div>
    );
  }

  // 로딩 화면 (캐릭터 전환 애니메이션)
  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        {/* 배경 이미지 */}
        <div
          className={styles.loadingBackground}
          style={{ backgroundImage: `url(${resultBackground})` }}
        />
        {/* 캐릭터 전환 영역 */}
        <div className={styles.loadingCharacterContainer}>
          <img
            src={CHARACTERS[currentCharacterIndex]}
            className={`${styles.loadingCharacter} ${styles[`character${currentCharacterIndex}`]}`}
            key={currentCharacterIndex}
          />
        </div>
        {/* 로딩 텍스트 영역 */}
        <div className={styles.loadingTextContainer}>
          <p className={styles.loadingText}>loading<span className={styles.loadingDots}> &nbsp;</span></p>
          <p className={styles.loadingSubtext}>나의 캐릭터를 찾고 있어요!</p>
        </div>
      </div>
    );
  }

  // 결과 페이지
  if (showResult && personaType) {
    const personaData = PERSONA_DATA[personaType] || PERSONA_DATA["Starter-Freeze Bot"];
    return (
      <ResultPage
        personaData={personaData}
        onStartAdventure={handleStartAdventure}
      />
    );
  }

  // 질문 화면
  return (
    <>
      <div className={styles.questionWrapper}>
        {/* 상단 바 (뒤로가기, 제목, 건너뛰기) */}
        <div className={styles.topBar}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={arrowLeftIcon} className={styles.backIcon} />
          </button>
          <span className={styles.topTitle}>ADHD 진단 검사</span>
          <button className={styles.skipButton} onClick={handleSkip}>
            건너뛰기
          </button>
        </div>

        {/* 질문 및 답변 선택 영역 */}
        <div className={styles.questionContent}>
          <div className={styles.questionContainer}>
            <h2 className={styles.question}>
              {currentQuestion}
            </h2>

            <div className={styles.options}>
              {ANSWER_OPTIONS.map((option) => (
                <label key={option.value} className={styles.option}>
                  <input
                    type="radio"
                    name={`answer-${currentQuestionIndex}`}
                    value={option.value}
                    checked={selectedAnswer === option.value}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioLabel}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 버튼 영역 (다음/완료) */}
        <div className={styles.bottomButtonContainer}>
          <button
            className={styles.nextButton}
            onClick={handleNext}
            disabled={!selectedAnswer}
          >
            {currentQuestionIndex === QUESTIONS.length - 1 ? "완료" : "다음"}
          </button>
        </div>
      </div>

      {/* 모달 */}
      {showSkipModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={handleCloseModal}>
              <img src={closeIcon} className={styles.modalCloseIcon} />
            </button>
            <h3 className={styles.modalTitle}>진단 검사를 건너뛰시겠습니까?</h3>
            <div className={styles.modalContent}>
              <p className={styles.modalContentText}>
                검사를 중단하면, 자신의 유형을 확실히 파악할 수 없어요.
              </p>
            </div>
            <div className={styles.modalButtons}>
              <button className={styles.modalButtonStop} onClick={handleSkipConfirm}>
                건너뛰기
              </button>
              <button className={styles.modalButtonContinue} onClick={handleCloseModal}>
                계속하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
