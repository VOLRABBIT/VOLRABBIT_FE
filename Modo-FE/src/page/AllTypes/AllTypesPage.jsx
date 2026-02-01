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

export default function AllTypesPage() {
  const navigate = useNavigate();
  const [selectedPersonaData, setSelectedPersonaData] = useState(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);
  const [selectedButtonIcon, setSelectedButtonIcon] = useState(null);
  const [personasFromApi, setPersonasFromApi] = useState({}); // personaId -> { name, iconUrl }

  useEffect(() => {
    getPersonas()
      .then((res) => {
        const list = res?.data ?? res ?? [];
        const map = {};
        (Array.isArray(list) ? list : []).forEach((p) => {
          if (p?.personaId != null) map[p.personaId] = { name: p.name, iconUrl: p.iconUrl };
        });
        setPersonasFromApi(map);
      })
      .catch(() => {});
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
          {CHARACTER_TYPES.map((character) => {
            const apiData = personasFromApi[character.personaId];
            const merged = {
              ...character,
              name: apiData?.name ?? character.name,
              image: character.image,
              iconUrl: apiData?.iconUrl,
            };
            return (
              <CharacterCard
                key={character.id}
                character={merged}
                onClick={() => handleCharacterClick(character)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

