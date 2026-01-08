import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import ResultPage from "../Result/ResultPage";
import CharacterCard from "../../components/CharacterCard/CharacterCard";
import { PERSONA_DATA } from "../../data/personaData";
import styles from "./AllTypesPage.module.css";
import wizardCharacter from "../../assets/character/wizard.png";
import robotCharacter from "../../assets/character/robot.png";
import graverobberCharacter from "../../assets/character/graverobber.png";
import adventurerCharacter from "../../assets/character/adventurer.png";
import adventurerOverallType from "../../assets/icon/OverallType-adventurer.svg";
import graverobberOverallType from "../../assets/icon/OverallType-graverobber.svg";
import robotOverallType from "../../assets/icon/OverallType-robot.svg";
import wizardOverallType from "../../assets/icon/OverallType-wizard.svg";

const CHARACTER_TYPES = [
  {
    id: "Time Wizard",
    name: "시간이 사라지는 마법사",
    image: wizardCharacter,
    overallTypeIcon: wizardOverallType,
  },
  {
    id: "Starter-Freeze Bot",
    name: "시작 버튼이 멈춘 로봇",
    image: robotCharacter,
    overallTypeIcon: robotOverallType,
  },
  {
    id: "Attention-grave",
    name: "주의력 도굴꾼",
    image: graverobberCharacter,
    overallTypeIcon: graverobberOverallType,
  },
  {
    id: "Emotional Adventure",
    name: "감정 모험가",
    image: adventurerCharacter,
    overallTypeIcon: adventurerOverallType,
  },
];

export default function AllTypesPage() {
  const navigate = useNavigate();
  const [selectedPersonaData, setSelectedPersonaData] = useState(null);
  const [selectedButtonIcon, setSelectedButtonIcon] = useState(null);

  const handleBack = () => {
    if (selectedPersonaData) {
      setSelectedPersonaData(null);
      setSelectedButtonIcon(null);
    } else {
      navigate(-1);
    }
  };

  const handleCharacterClick = (character) => {
    const personaData = PERSONA_DATA[character.id];
    if (personaData) {
      setSelectedPersonaData(personaData);
      setSelectedButtonIcon(character.overallTypeIcon);
    }
  };

  const handleResultPageClose = () => {
    setSelectedPersonaData(null);
    setSelectedButtonIcon(null);
  };

  // 캐릭터 선택 시 ResultPage 표시
  if (selectedPersonaData) {
    return (
      <ResultPage
        personaData={selectedPersonaData}
        buttonImage={selectedButtonIcon}
        onButtonClick={handleResultPageClose}
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
          {CHARACTER_TYPES.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onClick={() => handleCharacterClick(character)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

