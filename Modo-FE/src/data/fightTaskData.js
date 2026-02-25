// 카테고리별 우선순위 매핑
export const CATEGORY_PRIORITY_MAP = {
  "과제": "긴급·중요",
  "건강": "중요",
  "집안일": "긴급",
  "알바": "중요",
  "휴식": "중요",
};

export const FIGHT_TASK_DATA_BY_DATE = {};

export const FIGHT_TASK_DATA = [];

export const getTasksByDate = (dateStr) => {
  return FIGHT_TASK_DATA_BY_DATE[dateStr] || [];
};
