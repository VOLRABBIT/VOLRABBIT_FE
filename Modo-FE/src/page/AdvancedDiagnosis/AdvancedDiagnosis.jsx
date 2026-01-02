import { useDiagnosisFlow } from "../../hooks/useDiagnosisFlow";
import ResultPage from "../Result/ResultPage";
import IntroScreen from "../../components/Diagnosis/IntroScreen";
import LoadingScreen from "../../components/Diagnosis/LoadingScreen";
import QuestionScreen from "../../components/Diagnosis/QuestionScreen";
import SkipModal from "../../components/Diagnosis/SkipModal";
import { matchAdvancedPersona } from "../../utils/personaCalculator";
import { PERSONA_DATA } from "../../data/personaData";
import styles from "./AdvancedDiagnosis.module.css";

const QUESTIONS = [
  "일의 세부 사항에 주의를 기울이지 못하거나,\n부주의한 실수를 한다.",
  "과제를 하거나 대화를 할 때\n 지속적으로 주의를 집중하기 어렵다.",
  "다른 사람이 직접 말을 할 때,\n마치 딴생각을 하는 것처럼 경청하지 않는 모습을 보인다.",
  "지시를 끝까지 따르지 못하고, 일을 마무리하지 못한다.",
  "과제나 활동을 체계적으로 계획하고\n 조직하는 데 어려움이 있다.",
  "지속적인 정신적 노력이 필요한 일거나 싫어한다.",
  "일상 활동에 필요한 물건을 자주 잃어버린다.",
  "외부의 사소한 자극에도 쉽게 주의가 산만해진다.",
  "중요한 약속이나 해야 할 일을 자주 잊어버린다.",
  "가만히 앉아 있어야 하는 회의나 식사 자리에서\n 손발을 만지작거리거나 안절부절못한다.",
  "오래 앉아 있어야 할 상황에서\n 자리를 뜨고 싶은 충동을 느낀다.",
  "끊임없이 무언가를 해야 할 것처럼 느끼거나,\n 마치 모터가 달린 듯 행동한다.",
  "대화 중에 불필요하게 말을 너무 많이 하는 경향이 있다.",
  "질문이 채 끝나기도 전에 성급하게 대답한다.",
  "차례를 기다리는 것에 어려움을 느낀다.",
  "다른 사람의 대화나 활동에 불쑥 끼어든다.",
  "생각할 시간 없이 충동적으로 결정을 내리는 경우가 많다.",
  "안절부절못하거나, 가만히 있지 못하고 꼼지락거린다.",
];

export default function AdvancedDiagnosis() {
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
  } = useDiagnosisFlow(QUESTIONS, matchAdvancedPersona);

  const handleStartAdventure = () => {
    // 모험 시작 로직 구현 필요
  };

  if (isIntro) {
    return (
      <IntroScreen
        title="ADHD 심화 진단"
        paragraphs={[
          "Modo는 실제 성인의 ADHD 진단 근거로 사용되는 DSM-5 검사의 내용을 일부 제공합니다.",
          "ADHD 심화 진단은 총 18문항으로,\n 자신을 잘 설명하는 정도를 체크하면 돼요.",
          "심화 진단을 바탕으로, 나의 유형을 점검하고\n 결과에 따라 일부 변화가 발생할 수 있어요.",
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
    return (
      <ResultPage
        personaData={personaData}
        onStartAdventure={handleStartAdventure}
      />
    );
  }

  return (
    <>
      <QuestionScreen
        title="ADHD 심화 진단"
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
          title="심화 진단을 중단하시겠습니까?"
          content="검사를 중단하면,<br></br> 원래 자신의 유형으로 돌아가요."
          stopButtonText="중단하기"
          continueButtonText="계속하기"
          onClose={handleCloseModal}
          onStop={handleSkipConfirm}
        />
      )}
    </>
  );
}
