import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import CharacterCard from "../../components/CharacterCard/CharacterCard";
import SkipModal from "../../components/Diagnosis/SkipModal";
import styles from "./CharacterSelectPage.module.css";
import wizardCharacter from "../../assets/character/wizard.png";
import robotCharacter from "../../assets/character/robot.png";
import graverobberCharacter from "../../assets/character/graverobber.png";
import adventurerCharacter from "../../assets/character/adventurer.png";

const CHARACTER_TYPES = [
  {
    id: "Time Wizard",
    name: "시간이 사라지는 마법사",
    image: wizardCharacter,
  },
  {
    id: "Starter-Freeze Bot",
    name: "시작 버튼이 멈춘 로봇",
    image: robotCharacter,
  },
  {
    id: "Attention-grave",
    name: "주의력 도굴꾼",
    image: graverobberCharacter,
  },
  {
    id: "Emotional Adventure",
    name: "감정 모험가",
    image: adventurerCharacter,
  },
];

export default function CharacterSelectPage() {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleClose = () => {
    setShowCancelModal(true);
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
  };

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    navigate(-1);
  };

  const handleCharacterClick = (character) => {
    // TODO: 캐릭터 선택 로직 구현
    console.log("캐릭터 선택:", character.id);
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <TopBar
        title="유형 선택하기"
        onClose={handleClose}
        showClose={true}
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

      {showCancelModal && (
        <SkipModal
          title="캐릭터 선택을 그만둘까요?"
          content="캐릭터의 변경을 중단하고,<br></br> 소진한 캐릭터 변경권이 회복됩니다."
          stopButtonText="중단하기"
          continueButtonText="취소"
          onClose={handleCancelModalClose}
          onStop={handleCancelConfirm}
        />
      )}
    </div>
  );
}

