/**
 * 설문 답변을 점수로 변환
 * 매우 그렇다: 3, 그렇다: 2, 그렇지 않다: 1, 매우 그렇지 않다: 0
 */
export const convertAnswerToScore = (answer) => {
  const scoreMap = {
    "very-agree": 3,
    "agree": 2,
    "disagree": 1,
    "very-disagree": 0,
  };
  return scoreMap[answer] || 0;
};

/**
 * 온보딩 설문 결과에 따라 페르소나 매칭
 * @param {Object} answers - 질문 인덱스를 키로 하는 답변 객체
 * @returns {string} 페르소나 타입
 */
export const matchPersona = (answers) => {
  // 질문 인덱스는 0부터 시작하지만, Q2부터 시작하므로 +1
  // Q1은 첫 번째 질문 (인덱스 0)이지만 계산에는 사용하지 않음
  const Q2 = convertAnswerToScore(answers[1] || ""); // 복잡한 일을 보면 막막함이 든다.
  const Q3 = convertAnswerToScore(answers[2] || ""); // 잠깐만 하다가 시간이 훅 지나간다.
  const Q4 = convertAnswerToScore(answers[3] || ""); // 마감이 다가와야 움직인다.
  const Q5 = convertAnswerToScore(answers[4] || ""); // 관심 없는 활동에서는 집중이 오래 안 간다.
  const Q6 = convertAnswerToScore(answers[5] || ""); // 작은 실패에도 크게 좌절한다.
  const Q7 = convertAnswerToScore(answers[6] || ""); // 루틴을 유지하는 것이 어렵다.

  // 1) 시간이 사라지는 마법사
  if (Q4 >= 2 || Q5 >= 2) {
    return "Time Wizard";
  }

  // 2) 시작 버튼이 고장난 로봇
  if (Q2 >= 2 && Q3 >= 2) {
    return "Starter-Freeze Bot";
  }

  // 3) 주의력 도굴꾼
  if (Q6 >= 2) {
    return "Attention-grave";
  }

  // 4) 감정형 모험가
  if (Q7 >= 2) {
    return "Emotional Adventure";
  }

  // Default (보편적 유형, 기본세팅)
  return "Starter-Freeze Bot";
};

