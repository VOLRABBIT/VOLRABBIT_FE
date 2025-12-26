import { useState, useEffect } from "react";

export const useDiagnosisFlow = (questions, matchPersonaFn) => {
  // 화면 상태 관리
  const [isIntro, setIsIntro] = useState(true); // 인트로 화면 표시 여부
  const [isLoading, setIsLoading] = useState(false); // 로딩 화면 표시 여부
  const [showResult, setShowResult] = useState(false); // 결과 화면 표시 여부
  const [showSkipModal, setShowSkipModal] = useState(false); // 건너뛰기 모달 표시 여부

  // 질문 진행 상태 관리
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 현재 질문 번호 (0부터 시작)
  const [answers, setAnswers] = useState({}); // 답변 저장 객체 { 질문번호: 답변값 }

  // 결과 및 애니메이션 상태
  const [personaType, setPersonaType] = useState(null); // 매칭된 페르소나 타입
  const [isSkipped, setIsSkipped] = useState(false); // 건너뛰기 여부
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0); // 로딩 화면 캐릭터 인덱스

  // 계산된 값
  const currentQuestion = questions[currentQuestionIndex]; // 현재 질문 텍스트
  const selectedAnswer = answers[currentQuestionIndex] || ""; // 현재 질문의 선택된 답변

  // 진단 검사 시작 (인트로 → 질문 화면)
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

  // 건너뛰기 확인 (로딩 화면으로 이동)
  const handleSkipConfirm = () => {
    setIsSkipped(true);
    setShowSkipModal(false);
    setIsLoading(true);
  };

  // 다음 질문으로 이동 또는 마지막 질문이면 로딩 시작
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsLoading(true);
    }
  };

  // 답변 선택 시 저장
  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: value,
    });
  };

  // 로딩 화면 처리 (캐릭터 애니메이션 및 페르소나 계산)
  useEffect(() => {
    if (isLoading) {
      // 캐릭터 전환 애니메이션 (2초마다 캐릭터 변경)
      const interval = setInterval(() => {
        setCurrentCharacterIndex((prev) => (prev + 1) % 4);
      }, 2000);

      // 5초 후 페르소나 계산 및 결과 화면 표시
      const resultTimeout = setTimeout(() => {
        const persona = isSkipped ? "Starter-Freeze Bot" : matchPersonaFn(answers);
        setPersonaType(persona);
        setIsLoading(false);
        setShowResult(true);
      }, 5000);

      // 정리 함수 (컴포넌트 언마운트 또는 의존성 변경 시 실행)
      return () => {
        clearInterval(interval);
        clearTimeout(resultTimeout);
      };
    }
  }, [isLoading, answers, isSkipped, matchPersonaFn]);

  return {
    isIntro,
    currentQuestionIndex,
    answers,
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
    questionsLength: questions.length,
  };
};

