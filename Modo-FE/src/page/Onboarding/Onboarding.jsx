import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDiagnosisFlow } from "../../hooks/useDiagnosisFlow";
import ResultPage from "../Result/ResultPage";
import IntroScreen from "../../components/Diagnosis/IntroScreen";
import LoadingScreen from "../../components/Diagnosis/LoadingScreen";
import QuestionScreen from "../../components/Diagnosis/QuestionScreen";
import SkipModal from "../../components/Diagnosis/SkipModal";
import { matchPersona } from "../../utils/personaCalculator";
import { PERSONA_DATA, PERSONA_ID_TO_TYPE } from "../../data/personaData";
import { getOnboardingQuestions, submitOnboarding } from "../../api/apiStore";
import { getUserProfile } from "../../api/authApi";
import { convertAnswerToScore } from "../../utils/personaCalculator";
import robotButtonIcon from "../../assets/icon/Button-robot.svg";
import adventurerButtonIcon from "../../assets/icon/Button-adventurer.svg";
import graveButtonIcon from "../../assets/icon/Button-grave robber.svg";
import wizardButtonIcon from "../../assets/icon/Button-wizard.svg";
import styles from "./Onboarding.module.css";

const BUTTON_ICONS = {
  "Time Wizard": wizardButtonIcon,
  "Starter-Freeze Bot": robotButtonIcon,
  "Attention-grave": graveButtonIcon,
  "Emotional Adventure": adventurerButtonIcon,
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [apiQuestions, setApiQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState(null);

  /** 이미 페르소나가 있으면 맵으로 이동 */
  useEffect(() => {
    getUserProfile()
      .then((profile) => {
        const pid = profile?.personaId ?? profile?.persona_id;
        if (pid != null) {
          navigate("/map", { replace: true });
        }
      })
      .catch(() => {});
  }, [navigate]);

  /** 질문 목록 조회 */
  useEffect(() => {
    getOnboardingQuestions()
      .then((data) => setApiQuestions(data?.data ?? []))
      .catch((err) => setQuestionsError(err))
      .finally(() => setQuestionsLoading(false));
  }, []);

  const questions = useMemo(
    () => apiQuestions.map((q) => q.questionText).filter(Boolean),
    [apiQuestions]
  );

  /** 온보딩 제출 API 호출 후 페르소나 타입/ID 반환 */
  const getPersonaFromApi = useCallback(
    async (answers, isSkipped) => {
      try {
        const payload = isSkipped
          ? null
          : apiQuestions.map((q, i) => ({
              questionNo: q.questionNo,
              questionResponse: convertAnswerToScore(answers[i] ?? ""),
            }));
        const res = await submitOnboarding(payload);
        const data = res?.data ?? res;
        const personaId = data?.personaId;
        const personaType = data?.personaType ?? (personaId ? PERSONA_ID_TO_TYPE[personaId] : null);
        if (!personaType && !personaId) {
          throw new Error("서버에서 페르소나 결과를 받지 못했습니다.");
        }
        return personaId ? { personaType: personaType ?? PERSONA_ID_TO_TYPE[personaId], personaId } : personaType;
      } catch (err) {
        throw err;
      }
    },
    [apiQuestions]
  );

  const {
    isIntro,
    currentQuestionIndex,
    showSkipModal,
    isLoading,
    currentCharacterIndex,
    showResult,
    personaType,
    resultPersonaId,
    resultError,
    currentQuestion,
    selectedAnswer,
    handleStart,
    handleBack,
    handleSkip,
    handleCloseModal,
    handleSkipConfirm,
    handleNext,
    handleAnswerChange,
    questionsLength,
  } = useDiagnosisFlow(questions, matchPersona, { getPersonaFromApi });

  /** 모험 시작 버튼 클릭 → 맵으로 이동 */
  const handleStartAdventure = () => {
    navigate("/map");
  };

  // 예외처리: 질문 목록 조회 실패 시
  if (questionsLoading) {
    return (
      <div className={styles.container} style={{ padding: 24, textAlign: "center" }}>
        <p>질문을 불러오는 중...</p>
      </div>
    );
  }

  if (questionsError) {
    const msg = questionsError.response?.data?.message ?? questionsError.message ?? "질문을 불러오지 못했습니다.";
    return (
      <div className={styles.container} style={{ padding: 24, textAlign: "center", color: "#b91c1c" }}>
        <p>{msg}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className={styles.container} style={{ padding: 24, textAlign: "center", color: "#666" }}>
        <p>표시할 질문이 없습니다.</p>
      </div>
    );
  }

  if (isIntro) {
    return (
      <IntroScreen
        title="ADHD 진단 검사"
        paragraphs={[
          "Modod는 더 적합한 투두리스트 작성을 위해\n ADHD 진단 검사를 근거로 유형을 구분해요.",
          "ADHD 진단 검사는 총 8문항으로,\n 자신을 잘 설명하는 정도를 체크하면 돼요.",
          "Modo 시작 이후, [마이페이지]에서\n 더욱 정밀한 ADHD 진단 검사를 할 수 있어요.",
        ]}
        notice="* Modo가 제공하는 진단 검사만으로 실제 ADHD 여부를 확인할 수 없어요."
        buttonText="진단하기"
        onStart={handleStart}
        styles={styles}
      />
    );
  }

  if (isLoading) {
    return <LoadingScreen currentCharacterIndex={currentCharacterIndex} styles={styles} />;
  }

  if (showResult && resultError) {
    const msg = resultError.response?.data?.message ?? resultError.message ?? "결과를 불러오지 못했습니다.";
    return (
      <div className={styles.container} style={{ padding: 24, textAlign: "center", color: "#b91c1c" }}>
        <p>{msg}</p>
      </div>
    );
  }

  if (showResult && personaType) {
    const personaData = PERSONA_DATA[personaType];
    if (!personaData) {
      return (
        <div className={styles.container} style={{ padding: 24, textAlign: "center", color: "#b91c1c" }}>
          <p>알 수 없는 페르소나 유형입니다.</p>
        </div>
      );
    }
    const buttonIcon = BUTTON_ICONS[personaData.id] || robotButtonIcon;
    return (
      <ResultPage
        personaData={personaData}
        buttonImage={buttonIcon}
        onButtonClick={handleStartAdventure}
        variant="onboarding"
        personaId={resultPersonaId ?? undefined}
      />
    );
  }

  return (
    <>
      <QuestionScreen
        title="ADHD 진단 검사"
        currentQuestion={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        selectedAnswer={selectedAnswer}
        questionsLength={questionsLength}
        onBack={handleBack}
        onSkip={handleSkip}
        onAnswerChange={handleAnswerChange}
        onNext={handleNext}
        styles={styles}
      />
      {showSkipModal && (
        <SkipModal
          title="진단 검사를 건너뛰시겠습니까?"
          content="검사를 중단하면, 자신의 유형을 확실히 파악할 수 없어요."
          stopButtonText="건너뛰기"
          continueButtonText="계속하기"
          onClose={handleCloseModal}
          onStop={handleSkipConfirm}
        />
      )}
    </>
  );
}
