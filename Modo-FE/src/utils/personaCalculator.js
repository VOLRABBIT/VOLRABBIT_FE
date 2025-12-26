// 답변을 점수로 변환 (매우 그렇다: 3, 그렇다: 2, 그렇지 않다: 1, 매우 그렇지 않다: 0)
export const convertAnswerToScore = (answer) => {
  const scoreMap = {
    "very-agree": 3,
    "agree": 2,
    "disagree": 1,
    "very-disagree": 0,
  };
  return scoreMap[answer] || 0;
};

// 온보딩 설문 결과에 따라 페르소나 매칭
export const matchPersona = (answers) => {
  const Q2 = convertAnswerToScore(answers[1] || "");
  const Q3 = convertAnswerToScore(answers[2] || "");
  const Q4 = convertAnswerToScore(answers[3] || "");
  const Q5 = convertAnswerToScore(answers[4] || "");
  const Q6 = convertAnswerToScore(answers[5] || "");
  const Q7 = convertAnswerToScore(answers[6] || "");

  if (Q4 >= 2 || Q5 >= 2) {
    return "Time Wizard";
  }

  if (Q2 >= 2 && Q3 >= 2) {
    return "Starter-Freeze Bot";
  }

  if (Q6 >= 2) {
    return "Attention-grave";
  }

  if (Q7 >= 2) {
    return "Emotional Adventure";
  }

  return "Starter-Freeze Bot";
};

// 심화 진단 설문 결과에 따라 페르소나 매칭 (도메인별 평균 점수로 결정)
export const matchAdvancedPersona = (answers) => {
  const DOMAIN_MAP = {
    time: [3, 4, 8],
    starter: [0, 5, 13, 16],
    attention: [1, 2, 7, 12, 15],
    emotion: [6, 9, 10, 11, 14, 17],
  };

  const PERSONA_MAP = {
    time: "Time Wizard",
    starter: "Starter-Freeze Bot",
    attention: "Attention-grave",
    emotion: "Emotional Adventure",
  };

  const domainScores = {};

  for (const [domain, questionIndices] of Object.entries(DOMAIN_MAP)) {
    const scores = questionIndices
      .map((index) => convertAnswerToScore(answers[index] || ""))
      .filter((score) => score !== undefined);
    
    if (scores.length > 0) {
      const total = scores.reduce((sum, score) => sum + score, 0);
      domainScores[domain] = total / scores.length;
    } else {
      domainScores[domain] = 0;
    }
  }

  const bestDomain = Object.keys(domainScores).reduce((a, b) =>
    domainScores[a] > domainScores[b] ? a : b
  );

  return PERSONA_MAP[bestDomain] || "Starter-Freeze Bot";
};

