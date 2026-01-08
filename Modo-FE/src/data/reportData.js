// 주간 리포트 데이터
export const WEEKLY_REPORT_DATA = {
  stats: {
    totalBattles: 50,
    winRate: 83,
    battlesAbandoned: 11,
    battlesFailed: 5,
  },
  battleTypes: [
    { name: "과제", percentage: 40, color: "#BB90DD" },
    { name: "알바", percentage: 30, color: "#74B3AA" },
    { name: "건강", percentage: 30, color: "#FDA069" },
  ],
  abandonReasons: [
    { text: "시작이 귀찮음", value: 50 },
    { text: "원하지 않음", value: 30 },
    { text: "시간 부족", value: 20 },
  ],
  failureReasons: [
    { text: "시작이 귀찮음", value: 50 },
    { text: "원하지 않음", value: 30 },
    { text: "시간 부족", value: 20 },
  ],
  focusTime: {
    total: "28h 42m",
    topTimeSlots: [
      "오후 3시-4시",
      "오전 10시-11시",
      "오후 8시-9시",
    ],
  },
  resumedBattles: 7, // 다시 진행한 전투 (모험가 전용)
};

// 월간 리포트 데이터
export const MONTHLY_REPORT_DATA = {
  stats: {
    totalBattles: 180,
    winRate: 78,
    battlesAbandoned: 35,
    battlesFailed: 15,
  },
  battleTypes: [
    { name: "과제", percentage: 45, color: "#BB90DD" },
    { name: "알바", percentage: 35, color: "#74B3AA" },
    { name: "건강", percentage: 20, color: "#FDA069" },
  ],
  abandonReasons: [
    { text: "시작이 귀찮음", value: 60 },
    { text: "원하지 않음", value: 25 },
    { text: "시간 부족", value: 15 },
  ],
  failureReasons: [
    { text: "시작이 귀찮음", value: 55 },
    { text: "원하지 않음", value: 30 },
    { text: "시간 부족", value: 15 },
  ],
  focusTime: {
    total: "112h 15m",
    topTimeSlots: [
      "오후 2시-3시",
      "오전 9시-10시",
      "오후 7시-8시",
    ],
  },
  resumedBattles: 25, // 다시 진행한 전투 (모험가 전용)
};

