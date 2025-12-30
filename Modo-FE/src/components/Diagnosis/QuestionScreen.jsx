import TopBar from "../TopBar/TopBar";

// 답변 선택지 옵션
const ANSWER_OPTIONS = [
  { value: "very-agree", label: "매우 그렇다." },
  { value: "agree", label: "그렇다." },
  { value: "disagree", label: "그렇지 않다." },
  { value: "very-disagree", label: "매우 그렇지 않다." },
];

// 질문 화면 컴포넌트
export default function QuestionScreen({
  title,
  currentQuestion,
  currentQuestionIndex,
  selectedAnswer,
  questionsLength,
  onBack,
  onSkip,
  onAnswerChange,
  onNext,
  styles: customStyles,
}) {
  // 마지막 질문인지 확인
  const isLastQuestion = currentQuestionIndex === questionsLength - 1;
  const buttonText = isLastQuestion ? "완료" : "다음";

  // 답변 선택 핸들러
  const handleAnswerSelect = (value) => {
    onAnswerChange(value);
  };

  return (
    <div className={customStyles.questionWrapper}>
      {/* 상단 바: 뒤로가기, 제목, 건너뛰기 */}
      <TopBar
        title={title}
        onBack={onBack}
        onSkip={onSkip}
        showSkip={true}
      />

      {/* 질문 및 답변 영역 */}
      <div className={customStyles.questionContent}>
        <div className={customStyles.questionContainer}>
          {/* 질문 텍스트 */}
          <h2 className={customStyles.question}>{currentQuestion}</h2>

          {/* 답변 선택지 */}
          <div className={customStyles.options}>
            {ANSWER_OPTIONS.map((option) => {
              const isSelected = selectedAnswer === option.value;
              
              return (
                <label key={option.value} className={customStyles.option}>
                  <input
                    type="radio"
                    name={`answer-${currentQuestionIndex}`}
                    value={option.value}
                    checked={isSelected}
                    onChange={(e) => handleAnswerSelect(e.target.value)}
                    className={customStyles.radioInput}
                  />
                  <span className={customStyles.radioLabel}>{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className={customStyles.bottomButtonContainer}>
        <button
          className={customStyles.nextButton}
          onClick={onNext}
          disabled={!selectedAnswer}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

