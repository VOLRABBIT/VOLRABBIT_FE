import { useState } from "react";
import styles from "./CharacterChangeModal.module.css";
import adventurerCharacter from "../../assets/character/adventurer.png";
import graveRobberCharacter from "../../assets/character/graverobber.png";
import robotCharacter from "../../assets/character/robot.png";
import wizardCharacter from "../../assets/character/wizard.png";
import profileOutline from "../../assets/character/profile_outline.png";
import closeIcon from "../../assets/icon/close.svg";

const CHARACTERS = [
  { id: 0, name: "모험가", image: adventurerCharacter },
  { id: 1, name: "도굴꾼", image: graveRobberCharacter },
  { id: 2, name: "로봇", image: robotCharacter },
  { id: 3, name: "마법사", image: wizardCharacter },
];

export default function CharacterChangeModal({ onClose, onSelect, currentCharacterId = 3 }) {
  const [selectedCharacter, setSelectedCharacter] = useState(currentCharacterId);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(selectedCharacter);
    }
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={closeIcon} alt="닫기" className={styles.closeIcon} />
        </button>
        
        <h2 className={styles.title}>캐릭터 선택</h2>
        
        <div className={styles.characterGrid}>
          {CHARACTERS.map((character) => (
            <div
              key={character.id}
              className={`${styles.characterItem} ${
                selectedCharacter === character.id ? styles.selected : ""
              }`}
              onClick={() => setSelectedCharacter(character.id)}
            >
              <div
                className={styles.characterContainer}
                style={{ backgroundImage: `url(${profileOutline})` }}
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className={styles.characterImage}
                />
              </div>
              <span className={styles.characterName}>{character.name}</span>
            </div>
          ))}
        </div>

        <button className={styles.confirmButton} onClick={handleSelect}>
          선택하기
        </button>
      </div>
    </div>
  );
}

