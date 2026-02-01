// React & 라우터
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// API
import { getPersonas } from "../../api/apiStore";

// 컴포넌트
import TopBar from "../../components/TopBar/TopBar";
import ResultPage from "../Result/ResultPage";
import CharacterCard from "../../components/CharacterCard/CharacterCard";

// 데이터
import { PERSONA_DATA } from "../../data/personaData";

// 스타일
import styles from "./AllTypesPage.module.css";

// 에셋 - 캐릭터
import wizardCharacter from "../../assets/character/wizard.png";
import robotCharacter from "../../assets/character/robot.png";
import graverobberCharacter from "../../assets/character/graverobber.png";
import adventurerCharacter from "../../assets/character/adventurer.png";

// 에셋 - 아이콘
import adventurerOverallType from "../../assets/icon/OverallType-adventurer.svg";
import graverobberOverallType from "../../assets/icon/OverallType-graverobber.svg";
import robotOverallType from "../../assets/icon/OverallType-robot.svg";
import wizardOverallType from "../../assets/icon/OverallType-wizard.svg";

const CHARACTER_TYPES = [
  { id: "Time Wizard", personaId: 1, name: "시간이 사라지는 마법사", image: wizardCharacter, overallTypeIcon: wizardOverallType },
  { id: "Starter-Freeze Bot", personaId: 2, name: "시작 버튼이 멈춘 로봇", image: robotCharacter, overallTypeIcon: robotOverallType },
  { id: "Attention-grave", personaId: 3, name: "주의력 도굴꾼", image: graverobberCharacter, overallTypeIcon: graverobberOverallType },
  { id: "Emotional Adventure", personaId: 4, name: "감정 모험가", image: adventurerCharacter, overallTypeIcon: adventurerOverallType },
];

// API 없을 때 쓸 폴백 리스트 (로컬 이미지를 iconUrl로도 사용)
const FALLBACK_CHARACTERS = CHARACTER_TYPES.map((c) => ({ ...c, iconUrl: c.image }));

export default function AllTypesPage() {
  const navigate = useNavigate();
  const [selectedPersonaData, setSelectedPersonaData] = useState(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);
  const [selectedButtonIcon, setSelectedButtonIcon] = useState(null);
  const [displayCharacters, setDisplayCharacters] = useState(FALLBACK_CHARACTERS);

  useEffect(() => {
    getPersonas()
      .then((res) => {
        const list = res?.data ?? res ?? [];
        const arr = Array.isArray(list) ? list : [];
        if (arr.length === 0) {
          setDisplayCharacters(FALLBACK_CHARACTERS);
          return;
        }
        const built = arr
          .filter((p) => p?.name)
          .map((p) => {
            const local = CHARACTER_TYPES.find((c) => c.name === p.name);
            if (!local) return null;
            return {
              ...local,
              name: p.name ?? local.name,
              iconUrl: p.iconUrl || local.image,
              personaId: p.personaId ?? local.personaId,
            };
          })
          .filter(Boolean);
        setDisplayCharacters(built.length > 0 ? built : FALLBACK_CHARACTERS);
      })
      .catch(() => setDisplayCharacters(FALLBACK_CHARACTERS));
  }, []);

  const handleBack = () => {
    if (selectedPersonaData) {
      setSelectedPersonaData(null);
      setSelectedPersonaId(null);
      setSelectedButtonIcon(null);
    } else {
      navigate(-1);
    }
  };

  const handleCharacterClick = (character) => {
    const personaData = PERSONA_DATA[character.id];
    if (personaData) {
      setSelectedPersonaData(personaData);
      setSelectedPersonaId(character.personaId);
      setSelectedButtonIcon(character.overallTypeIcon);
    }
  };

  const handleResultPageClose = () => {
    setSelectedPersonaData(null);
    setSelectedPersonaId(null);
    setSelectedButtonIcon(null);
  };

  // 캐릭터 선택 시 ResultPage 표시
  if (selectedPersonaData) {
    return (
      <ResultPage
        personaData={selectedPersonaData}
        buttonImage={selectedButtonIcon}
        onButtonClick={handleResultPageClose}
        variant="allTypes"
        personaId={selectedPersonaId ?? undefined}
      />
    );
  }

  return (
    <div className={styles.container}>
      <TopBar
        title="전체 유형 확인하기"
        onBack={handleBack}
        showSkip={false}
        textColor="dark"
      />

      <div className={styles.content}>
        <div className={styles.characterGrid}>
          {displayCharacters.map((character) => (
            <CharacterCard
              key={`${character.id}-${character.personaId}`}
              character={character}
              onClick={() => handleCharacterClick(character)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

