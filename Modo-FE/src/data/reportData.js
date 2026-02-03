const EMPTY_REPORT_STRUCTURE = {
  stats: {
    totalBattles: 0,
    winRate: 0,
    battlesAbandoned: 0,
    battlesFailed: 0,
  },
  battleTypes: [],
  abandonReasons: [],
  failureReasons: [],
  focusTime: {
    total: "0h 0m",
    topTimeSlots: [],
  },
  resumedBattles: 0,
};

export const WEEKLY_REPORT_DATA = { ...EMPTY_REPORT_STRUCTURE };
export const MONTHLY_REPORT_DATA = { ...EMPTY_REPORT_STRUCTURE };
