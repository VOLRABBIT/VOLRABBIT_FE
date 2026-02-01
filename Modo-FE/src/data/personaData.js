import adventurerCharacter from "../assets/character/adventurer.png";
import graveRobberCharacter from "../assets/character/graverobber.png";
import robotCharacter from "../assets/character/robot.png";
import wizardCharacter from "../assets/character/wizard.png";

/**
 * API(분석 조회)에서 제공하지 않는 데이터만 보관
 * - radarData: 레이더 차트
 * - character: 캐릭터 이미지 (API iconUrl 로드 실패 시 폴백)
 */
export const PERSONA_DATA = {
  "Time Wizard": {
    id: "Time Wizard",
    radarData: { attention: 3, timeManagement: 4, activity: 4, impulsivity: 2, emotion: 3 },
    character: wizardCharacter,
  },
  "Starter-Freeze Bot": {
    id: "Starter-Freeze Bot",
    radarData: { attention: 4, timeManagement: 2, activity: 4, impulsivity: 4, emotion: 4 },
    character: robotCharacter,
  },
  "Attention-grave": {
    id: "Attention-grave",
    radarData: { attention: 2, timeManagement: 4, activity: 2, impulsivity: 4, emotion: 4 },
    character: graveRobberCharacter,
  },
  "Emotional Adventure": {
    id: "Emotional Adventure",
    radarData: { attention: 4, timeManagement: 2, activity: 8.5, impulsivity: 8.5, emotion: 2 },
    character: adventurerCharacter,
  },
};

// PersonaID
export const PERSONA_ID_TO_TYPE = {
  1: "Time Wizard",
  2: "Starter-Freeze Bot",
  3: "Attention-grave",
  4: "Emotional Adventure",
};
