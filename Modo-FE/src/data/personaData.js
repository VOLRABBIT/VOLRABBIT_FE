import adventurerCharacter from "../assets/character/adventurer.png";
import graveRobberCharacter from "../assets/character/graverobber.png";
import robotCharacter from "../assets/character/robot.png";
import wizardCharacter from "../assets/character/wizard.png";

export const PERSONA_DATA = {
  "Time Wizard": {
    id: "Time Wizard",
    title: "시간이 사라지는 마법사",
    hashtag: "#시간이 너무 빨리 지나가요",
    character: wizardCharacter,
    characterName: "마법사",
    radarData: {
      attention: 3,
      timeManagement: 4,
      activity: 4,
      impulsivity: 2,
      emotion: 3,
    },
    stats: [
      {
        name: "집중력",
        nameEn: "Attention",
        level: "보통",
        levelType: "normal",
        subStats: [
          {
            name: "지속력",
            description: "일을 시작하긴 했는데, 어느새 시간이 증발해 있다.",
          },
          {
            name: "차단력",
            description: "집중하고 싶지만 갑자기 온 알림이나 다른 사람 한 마디에 마법처럼 풀려버린다.",
          },
          {
            name: "정확도",
            description: "시간을 쫓다 보면 중요한 걸 빼먹곤 한다. 실수는 늘 나중에 발견한다.",
          },
        ],
      },
      {
        name: "감정 조절",
        nameEn: "Emotion",
        level: "보통",
        levelType: "normal",
        subStats: [
          {
            name: "회복력",
            description: "실패 후에도 다시 일어설 수 있는 마법을 배워야 한다.",
          },
          {
            name: "안정성",
            description: "일정하게 흐르는 감정선은 시간만큼이나 붙잡기 어렵다.",
          },
          {
            name: "제어력",
            description: "감정 폭발은 드물지만, 쌓이면 통제할 수 없을 만큼 크다.",
          },
        ],
      },
      {
        name: "충동성",
        nameEn: "Impulsivity",
        level: "낮음",
        levelType: "low",
        subStats: [
          {
            name: "억제력",
            description: "충동은 조용히 찾아 오지만, 그 틈을 자주 놓치는 듯 하다.",
          },
          {
            name: "숙고력",
            description: "계획은 많지만, 즉흥적 실행이 종종 끼어 들어 방해가 된다.",
          },
          {
            name: "지연력",
            description: "지금 당장 하고 싶은 걸 미루는 건 어려운 주문이다.",
          },
        ],
      },
      {
        name: "활동성",
        nameEn: "Activity level",
        level: "보통",
        levelType: "normal",
        subStats: [
          {
            name: "언변력",
            description: "필요할 땐 말이 많지만, 그 외엔 조용한 편이다.",
          },
          {
            name: "움직임",
            description: "바쁜 듯 조용히 이동한다. 멈춰 있는 건 드물다.",
          },
          {
            name: "휴식력",
            description: "쉬려고 계획했지만 또 뭘 하게 된다. 쉽 마법을 익허야 한다.",
          },
        ],
      },
      {
        name: "시간 관리",
        nameEn: "Time",
        level: "낮음",
        levelType: "low",
        subStats: [
          {
            name: "마감력",
            description: "시간은 늘 부족하다. 마감 기한을 마법처럼 놓친다.",
          },
          {
            name: "추산력",
            description: "계획은 분명 완벽하다. 하지만, 시간 계산은 늘 빗나간다.",
          },
          {
            name: "실행력",
            description: "계획만 하다 행동이 늦어진다.",
          },
        ],
      },
    ],
    recommendations: [
      {
        title: "시간 기록",
        description: "나의 시간은 어디로 갔을까? 하루에 벌어진 일들을 기록하고, 사라진 시간 흐름 흔적을 찾아갈 수 있는 주문",
      },
      {
        title: "집중 타이머",
        description: "생각 하나, 알림 하나에도 방해할 수 없다. 외부로부터 나의 영역을 지키는 주문",
      },
    ],
  },
  "Starter-Freeze Bot": {
    id: "Starter-Freeze Bot",
    title: "시작 버튼이 멈춘 로봇",
    hashtag: "#시작부터 어려워요",
    character: robotCharacter,
    characterName: "로봇",
    radarData: {
      attention: 4,
      timeManagement: 2,
      activity: 4,
      impulsivity: 4,
      emotion: 4,
    },
    stats: [
      {
        name: "집중력",
        nameEn: "Attention",
        level: "보통",
        levelType: "normal",
        subStats: [
          {
            name: "지속력",
            description: "집중을 유지하고 싶지만, 시작 버튼도 안 눌린 상태가 많다.",
          },
          {
            name: "차단력",
            description: "버튼을 눌렀을 때 동작까지 시간이 걸리는 구버전 모델이다.",
          },
          {
            name: "정확도",
            description: "머리가 복잡해 일 자체를 누락시키기 쉽다.",
          },
        ],
      },
      {
        name: "감정 조절",
        nameEn: "Emotion",
        level: "보통",
        levelType: "normal",
        subStats: [
          {
            name: "회복력",
            description: "한 번 전원이 꺼지면, 재부팅 시간이 오래 걸린다.",
          },
          {
            name: "안정성",
            description: "마비되면 무기력해지고, 작동하면 쉽게 과열된다.",
          },
          {
            name: "제어력",
            description: "말하지 않고 삼키는 감정이 많다.",
          },
        ],
      },
      {
        name: "충동성",
        nameEn: "Impulsivity",
        level: "보통",
        levelType: "normal",
        subStats: [
          {
            name: "억제력",
            description: "가만히 있다가, 갑자기 혼자 작동을 시작한다.",
          },
          {
            name: "숙고력",
            description: "시작 전 생각이 너무 많아 실행이 느려진다.",
          },
          {
            name: "지연력",
            description: "시작을 미루는 건 잘 하지만, 욕구는 잘 못 참는다.",
          },
        ],
      },
      {
        name: "활동성",
        nameEn: "Activity level",
        level: "보통",
        levelType: "normal",
        subStats: [
          {
            name: "언변력",
            description: "말수는 적다. 다만 단도직입적이다.",
          },
          {
            name: "움직임",
            description: "움직이기 전까지 가만히 있는 시간이 길다.",
          },
          {
            name: "휴식력",
            description: "명령과 지시 없이 휴식하지 않는다.",
          },
        ],
      },
      {
        name: "시간 관리",
        nameEn: "Time",
        level: "낮음",
        levelType: "low",
        subStats: [
          {
            name: "마감력",
            description: "마감 기한이 다 되어서야 작동을 시작하는 경향이 있다.",
          },
          {
            name: "추산력",
            description: "시작도 못하고 어느새 밤이 되었다.",
          },
          {
            name: "실행력",
            description: "시작 버튼이 녹슬었다. 눌러도 반응이 없다.",
          },
        ],
      },
    ],
    recommendations: [
      {
        title: "투두 세분화",
        description: "시작하기 힘든 큰 일은 작게 줄여서 시작하자. 해야 할 일을 입력하면 달성 가능한 수준으로 세분화하는 마법",
      },
      {
        title: "다음 할 일",
        description: "쉽게 할 수 있는 것부터 시작해볼까? 당장 지금 전원 버튼이 켜질 수 있는 일을 알려주는 마법",
      },
    ],
  },
  "Attention-grave": {
    id: "Attention-grave",
    title: "주의력 도굴꾼",
    hashtag: "#일에 집중하기 어려워요",
    character: graveRobberCharacter,
    characterName: "도굴꾼",
    radarData: {
      attention: 2,
      timeManagement: 4,
      activity: 2,
      impulsivity: 4,
      emotion: 4,
    },
    stats: [
      {
        name: "집중력",
        nameEn: "Attention",
        level: "낮음",
        levelType: "low",
        subStats: [
          {
            name: "지속력",
            description: "집중은 짧고 강하게, 하지만 금방 꺼져버린다.",
          },
          {
            name: "차단력",
            description: "주변 자극에 반응하느라 본래 과제를 잊어버린다. '이것만 보고'가 반복된다.",
          },
          {
            name: "정확도",
            description: "한 가지에 오래 집중 못하다 보니 빠뜨리는 게 많다. 꼼꼼함보단 빨리 끝내기에 치중한다.",
          },
        ],
      },
      {
        name: "감정 조절",
        nameEn: "Emotion",
        level: "보통",
        levelType: "normal",
        subStats: [
          {
            name: "회복력",
            description: "실패하면 흥미가 떨어져 도전 자체를 포기한다.",
          },
          {
            name: "안정성",
            description: "감정은 비교적 안정적이지만, 피드백에 예민하다.",
          },
          {
            name: "제어력",
            description: "말보다 태도나 행동으로 더 드러난다.",
          },
        ],
      },
      {
        name: "충동성",
        nameEn: "Impulsivity",
        level: "보통",
        levelType: "normal",
        subStats: [
          {
            name: "억제력",
            description: "참아야 한다는 생각을 하지만, 손은 언제나 다른 것보다 빠르다.",
          },
          {
            name: "숙고력",
            description: "생각 없이 시작하고, 중간에 멈출 때가 많다.",
          },
          {
            name: "지연력",
            description: "하고 싶은 건 바로 지금 해야 직성이 풀린다.",
          },
        ],
      },
      {
        name: "활동성",
        nameEn: "Activity level",
        level: "낮음",
        levelType: "low",
        subStats: [
          {
            name: "언변력",
            description: "말이 많아지면 집중이 흐려진다.",
          },
          {
            name: "움직임",
            description: "꼼지락거리거나 자리에서 자주 일어난다.",
          },
          {
            name: "휴식력",
            description: "쉬면서도 뇌가 바쁘다. 멍 때리기를 잘 못한다.",
          },
        ],
      },
      {
        name: "시간 관리",
        nameEn: "Time",
        level: "보통",
        levelType: "normal",
        subStats: [
          {
            name: "마감력",
            description: "잊고 있다가 놓치는 경우가 많다.",
          },
          {
            name: "추산력",
            description: "한 일에 시간이 얼마나 걸렸는지 기억이 안 난다.",
          },
          {
            name: "실행력",
            description: "시작은 하지만 곧 다른 생각에 멈추게 된다.",
          },
        ],
      },
    ],
    recommendations: [
      {
        title: "리포트",
        description: "집중이 약해지는 때는 언제이고, 나는 왜 계속 일을 포기하는 걸까? 원인을 파악할 수 있는 아이템",
      },
    ],
  },
  "Emotional Adventure": {
    id: "Emotional Adventure",
    title: "감정 모험가",
    hashtag: "#완벽히 끝내지 못하는 경우가 많아요",
    character: adventurerCharacter,
    characterName: "모험가",
    radarData: {
      attention: 4,
      timeManagement: 2,
      activity: 8.5,
      impulsivity: 8.5,
      emotion: 2,
    },
    stats: [
      {
        name: "집중력",
        nameEn: "Attention",
        level: "보통",
        levelType: "normal",
        subStats: [
          {
            name: "지속력",
            description: "일을 시작하긴 했는데, 어느새 시간이 증발해 있다.",
          },
          {
            name: "차단력",
            description: "집중하고 싶지만 갑자기 온 알림이나 다른 사람 한 마디에 마법처럼 풀려버린다.",
          },
          {
            name: "정확도",
            description: "시간을 쫓다 보면 중요한 걸 빼먹곤 한다. 실수는 늘 나중에 발견한다.",
          },
        ],
      },
      {
        name: "감정 조절",
        nameEn: "Emotion",
        level: "낮음",
        levelType: "low",
        subStats: [
          {
            name: "회복력",
            description: "작은 실패에도 마음이 크게 흔들린다.",
          },
          {
            name: "안정성",
            description: "아침과 저녁의 기분이 다르고, 순간마다 흔들린다.",
          },
          {
            name: "제어력",
            description: "늘 감정이 앞선다.",
          },
        ],
      },
      {
        name: "충동성",
        nameEn: "Impulsivity",
        level: "높음",
        levelType: "high",
        subStats: [
          {
            name: "억제력",
            description: "생각보다 발이 먼저 움직인다.",
          },
          {
            name: "숙고력",
            description: "뇌보다 감정이 우선 결정을 내린다.",
          },
          {
            name: "지연력",
            description: "감정적 보상은 바로 받아야 한다.",
          },
        ],
      },
      {
        name: "활동성",
        nameEn: "Activity level",
        level: "높음",
        levelType: "high",
        subStats: [
          {
            name: "언변력",
            description: "감정이 올라오면 말이 쏟아진다.",
          },
          {
            name: "움직임",
            description: "가만히 있는 걸 못 참는다. 움직임이 많다.",
          },
          {
            name: "휴식력",
            description: "감정적으로 지칠 때마다 쉰다.",
          },
        ],
      },
      {
        name: "시간 관리",
        nameEn: "Time",
        level: "낮음",
        levelType: "low",
        subStats: [
          {
            name: "마감력",
            description: "기분 따라 미뤘다가, 달성하지 못한 퀘스트가 가득하다.",
          },
          {
            name: "추산력",
            description: "기분이 좋을 때는 빨리 끝낼 줄 알고 과소평가한다.",
          },
          {
            name: "실행력",
            description: "감정이 진정되어야만 할 일이 시작된다.",
          },
        ],
      },
    ],
    recommendations: [
      {
        title: "감정 기록",
        description: "감정 상태에 따라 내 할 일 달성률이 달라진다고? 직접 확인해보자.",
      },
      {
        title: "행동 피드백",
        description: "할 일을 지속적으로 하기 위한 마법의 동기부여, 무기력해질 때는 피드백을 따라가보자.",
      },
    ],
  },
};

