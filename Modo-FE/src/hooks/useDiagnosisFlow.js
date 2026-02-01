import { useState, useEffect } from "react";

/** 진단 검사 플로우 관리 (질문 진행, 답변 저장, 결과 계산) */
export const useDiagnosisFlow = (questions, matchPersonaFn, options = {}) => {
  const { getPersonaFromApi } = options;
  const [isIntro, setIsIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [personaType, setPersonaType] = useState(null);
  const [resultPersonaId, setResultPersonaId] = useState(null);
  const [resultError, setResultError] = useState(null);
  const [isSkipped, setIsSkipped] = useState(false);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex] || "";

  /** 진단 검사 시작 */
  const handleStart = () => {
    setIsIntro(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsSkipped(false);
  };

  /** 이전 질문 또는 인트로로 이동 */
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      setIsIntro(true);
    }
  };

  /** 건너뛰기 모달 표시 */
  const handleSkip = () => {
    setShowSkipModal(true);
  };

  /** 모달 닫기 */
  const handleCloseModal = () => {
    setShowSkipModal(false);
  };

  /** 건너뛰기 확인 → 로딩 화면 */
  const handleSkipConfirm = () => {
    setIsSkipped(true);
    setShowSkipModal(false);
    setIsLoading(true);
  };

  /** 다음 질문 또는 마지막이면 로딩 시작 */
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsLoading(true);
    }
  };

  /** 답변 저장 */
  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: value,
    });
  };

  /** 로딩 중: 페르소나 계산 및 결과 표시 */
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentCharacterIndex((prev) => (prev + 1) % 4);
      }, 2000);

      const minDelayMs = 5000;
      const personaPromise = getPersonaFromApi
        ? getPersonaFromApi(answers, isSkipped)
        : isSkipped
          ? Promise.reject(new Error("결과를 처리할 수 없습니다."))
          : Promise.resolve(matchPersonaFn(answers));
      const delayPromise = new Promise((r) => setTimeout(r, minDelayMs));

      let cancelled = false;
      Promise.all([personaPromise, delayPromise])
        .then(([result]) => {
          if (!cancelled) {
            const isObject = typeof result === "object" && result !== null;
            const personaType = isObject ? result.personaType : result;
            const personaId = isObject ? result.personaId : null;
            if (!personaType) {
              setResultError(new Error("결과를 받지 못했습니다."));
            } else {
              setPersonaType(personaType);
              setResultError(null);
            }
            setResultPersonaId(personaId);
            setIsLoading(false);
            setShowResult(true);
          }
        })
        .catch((err) => {
          if (!cancelled) {
            setResultError(err);
            setIsLoading(false);
            setShowResult(true);
          }
        });

      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }
  }, [isLoading, answers, isSkipped, matchPersonaFn, getPersonaFromApi]);

  return {
    isIntro,
    currentQuestionIndex,
    answers,
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
    questionsLength: questions.length,
  };
};

