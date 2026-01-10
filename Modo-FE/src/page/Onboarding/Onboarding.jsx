import { useDiagnosisFlow } from "../../hooks/useDiagnosisFlow";
import ResultPage from "../Result/ResultPage";
import IntroScreen from "../../components/Diagnosis/IntroScreen";
import LoadingScreen from "../../components/Diagnosis/LoadingScreen";
import QuestionScreen from "../../components/Diagnosis/QuestionScreen";
import SkipModal from "../../components/Diagnosis/SkipModal";
import { matchPersona } from "../../utils/personaCalculator";
import { PERSONA_DATA } from "../../data/personaData";
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

const QUESTIONS = [
  "해야 할 일을 알지만 시작이 잘 되지 않는다.",
  "복잡한 일을 보면 막막함이 든다.",
  "잠깐만 하다가 시간이 훅 지나간다.",
  "마감이 다가와야 움직인다.",
  "관심 없는 활동에서는 집중이 오래 안 간다.",
  "작은 실패에도 크게 좌절한다.",
  "루틴을 유지하는 것이 어렵다.",
];

export default function Onboarding() {
  const {
    isIntro,
    currentQuestionIndex,
    showSkipModal,
    isLoading,
    currentCharacterIndex,
    showResult,
    personaType,
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
  } = useDiagnosisFlow(QUESTIONS, matchPersona);

  const handleStartAdventure = () => {
    // 모험 시작 로직 구현 필요
  };

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

  if (showResult && personaType) {
    const personaData = PERSONA_DATA[personaType] || PERSONA_DATA["Starter-Freeze Bot"];
    const buttonIcon = BUTTON_ICONS[personaData.id] || robotButtonIcon;
    return (
      <ResultPage
        personaData={personaData}
        buttonImage={buttonIcon}
        onButtonClick={handleStartAdventure}
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
