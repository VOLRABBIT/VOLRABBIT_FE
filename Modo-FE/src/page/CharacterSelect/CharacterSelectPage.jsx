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
import { updateUserPersona } from "../../api/apiStore";

const CHARACTER_TYPES = [
  {
    id: "Time Wizard",
    personaId: 1,
    name: "시간이 사라지는 마법사",
    image: wizardCharacter,
  },
  {
    id: "Starter-Freeze Bot",
    personaId: 2,
    name: "시작 버튼이 멈춘 로봇",
    image: robotCharacter,
  },
  {
    id: "Attention-grave",
    personaId: 3,
    name: "주의력 도굴꾼",
    image: graverobberCharacter,
  },
  {
    id: "Emotional Adventure",
    personaId: 4,
    name: "감정 모험가",
    image: adventurerCharacter,
  },
];

export default function CharacterSelectPage() {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setShowCancelModal(true);
  };

  const handleCharacterClick = async (character) => {
    if (isSaving) return;
    setIsSaving(true);
    setError("");
    try {
      await updateUserPersona(character.personaId);
      localStorage.setItem("personaType", character.id);
      navigate(-1);
    } catch (err) {
      setError(err?.response?.data?.message ?? err?.message ?? "캐릭터 변경에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
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
        {error && (
          <p style={{ color: "#b91c1c", fontSize: 13, margin: "0 0 12px" }}>
            {error}
          </p>
        )}
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
          title="캐릭터 선택을 그만할까요?"
          content="캐릭터 변경을 중단하고 이전 화면으로 돌아갑니다."
          stopButtonText="중단하기"
          continueButtonText="취소"
          onClose={() => setShowCancelModal(false)}
          onStop={() => {
            setShowCancelModal(false);
            navigate(-1);
          }}
        />
      )}
    </div>
  );
}
