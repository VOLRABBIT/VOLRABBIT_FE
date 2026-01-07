// 카테고리별 우선순위 매핑(임시시)
export const CATEGORY_PRIORITY_MAP = {
  "과제": "긴급·중요",
  "건강": "중요",
  "집안일": "긴급",
  "알바": "중요",
  "휴식": "중요",
};

// 날짜별 task 데이터
export const FIGHT_TASK_DATA_BY_DATE = {
  "2025-10-10": [
    {
      id: 1,
      category: "과제",
      tasks: [
        {
          id: 1,
          title: "선형대수학2 과제하기",
          isCompleted: false,
          priority: "긴급·중요",
          subtasks: [],
          startTime: 6,
          duration: 4,
        },
        {
          id: 2,
          title: "경영통계학 팀플 자료조사",
          isCompleted: false,
          priority: "긴급·중요",
          subtasks: [],
        },
        {
          id: 3,
          title: "데이터베이스 설계 레포트 작성",
          isCompleted: false,
          priority: "긴급·중요",
          subtasks: [],
        },
        {
          id: 4,
          title: "웹프로그래밍 프로젝트 발표 준비",
          isCompleted: false,
          priority: "긴급·중요",
          subtasks: [],
        },
      ],
    },
    {
      id: 2,
      category: "알바",
      tasks: [
        {
          id: 5,
          title: "파리바게트",
          isCompleted: false,
          priority: "중요",
          startTime: 18,
          duration: 5,
          subtasks: [
            {
              id: 1,
              title: "마감 재고 점검",
              isCompleted: false,
            },
            {
              id: 2,
              title: "마감 청소",
              isCompleted: false,
            },
          ],
        },
        {
          id: 6,
          title: "편의점 야간 근무",
          isCompleted: false,
          priority: "중요",
          subtasks: [],
        },
      ],
    },
    {
      id: 3,
      category: "건강",
      tasks: [
        {
          id: 7,
          title: "헬스장 가기",
          isCompleted: false,
          priority: "중요",
          subtasks: [],
        },
        {
          id: 8,
          title: "병원 예약 확인",
          isCompleted: false,
          priority: "긴급",
          subtasks: [],
        },
      ],
    },
    {
      id: 4,
      category: "집안일",
      tasks: [
        {
          id: 9,
          title: "방 청소하기",
          isCompleted: false,
          priority: "긴급",
          subtasks: [],
        },
        {
          id: 10,
          title: "빨래 돌리기",
          isCompleted: false,
          priority: "긴급",
          subtasks: [],
        },
        {
          id: 11,
          title: "장보기",
          isCompleted: false,
          priority: "긴급",
          subtasks: [],
        },
      ],
    },
    {
      id: 5,
      category: "기타",
      tasks: [
        {
          id: 12,
          title: "은행 방문하기",
          isCompleted: false,
          priority: "긴급",
          subtasks: [],
        },
        {
          id: 13,
          title: "친구 생일 선물 준비",
          isCompleted: false,
          priority: "중요",
          subtasks: [],
        },
        {
          id: 14,
          title: "이메일 확인 및 답장",
          isCompleted: false,
          priority: "중요",
          subtasks: [],
        },
      ],
    },
  ],
  // 2026-01-11 예시 데이터
  "2026-01-11": [
    {
      id: 1,
      category: "과제",
      tasks: [
        {
          id: 1,
          title: "선형대수학2 복습하기",
          isCompleted: false,
          priority: "중요",
          startTime: 6,
          duration: 4,
          subtasks: [],
        },
      ],
    },
    {
      id: 2,
      category: "알바",
      tasks: [
        {
          id: 5,
          title: "파리바게트 마감 알바",
          isCompleted: false,
          priority: "중요",
          startTime: 18,
          duration: 5,
          subtasks: [],
        },
      ],
    },
  ],
};

export const FIGHT_TASK_DATA = [
  {
    id: 1,
    category: "과제",
    tasks: [
      {
        id: 1,
        title: "선형대수학2 과제하기",
        isCompleted: false,
        priority: "긴급·중요",
        subtasks: [],
      },
      {
        id: 2,
        title: "경영통계학 팀플 자료조사",
        isCompleted: false,
        priority: "긴급·중요",
        subtasks: [],
      },
      {
        id: 3,
        title: "데이터베이스 설계 레포트 작성",
        isCompleted: false,
        priority: "긴급·중요",
        subtasks: [],
      },
      {
        id: 4,
        title: "웹프로그래밍 프로젝트 발표 준비",
        isCompleted: false,
        priority: "긴급·중요",
        subtasks: [],
      },
    ],
  },
  {
    id: 2,
    category: "알바",
    tasks: [
      {
        id: 5,
        title: "파리바게트",
        isCompleted: false,
        priority: "중요",
        subtasks: [
          {
            id: 1,
            title: "마감 재고 점검",
            isCompleted: false,
          },
          {
            id: 2,
            title: "마감 청소",
            isCompleted: false,
          },
        ],
      },
      {
        id: 6,
        title: "편의점 야간 근무",
        isCompleted: false,
        priority: "중요",
        subtasks: [],
      },
    ],
  },
  {
    id: 3,
    category: "건강",
    tasks: [
      {
        id: 7,
        title: "헬스장 가기",
        isCompleted: false,
        priority: "중요",
        subtasks: [],
      },
      {
        id: 8,
        title: "병원 예약 확인",
        isCompleted: false,
        priority: "긴급",
        subtasks: [],
      },
    ],
  },
  {
    id: 4,
    category: "집안일",
    tasks: [
      {
        id: 9,
        title: "방 청소하기",
        isCompleted: false,
        priority: "긴급",
        subtasks: [],
      },
      {
        id: 10,
        title: "빨래 돌리기",
        isCompleted: false,
        priority: "긴급",
        subtasks: [],
      },
      {
        id: 11,
        title: "장보기",
        isCompleted: false,
        priority: "긴급",
        subtasks: [],
      },
    ],
  },
  {
    id: 5,
    category: "기타",
    tasks: [
      {
        id: 12,
        title: "은행 방문하기",
        isCompleted: false,
        priority: "긴급",
        subtasks: [],
      },
      {
        id: 13,
        title: "친구 생일 선물 준비",
        isCompleted: false,
        priority: "중요",
        subtasks: [],
      },
      {
        id: 14,
        title: "이메일 확인 및 답장",
        isCompleted: false,
        priority: "중요",
        subtasks: [],
      },
    ],
  },
];

// 날짜에 해당하는 task 데이터를 가져오는 함수
export const getTasksByDate = (dateStr) => {
  return FIGHT_TASK_DATA_BY_DATE[dateStr] || [];
};

