import { useEffect } from "react";
import styles from "./BattleModal.module.css";
import adventurerCharacter from "../../assets/character/adventurer.png";
import graveRobberCharacter from "../../assets/character/graverobber.png";
import robotCharacter from "../../assets/character/robot.png";
import wizardCharacter from "../../assets/character/wizard.png";

const CHARACTERS = [
  adventurerCharacter,
  graveRobberCharacter,
  robotCharacter,
  wizardCharacter,
];

/**
 * 전투 모달 컴포넌트
 * @param {Object} props
 * @param {string} props.type
 * @param {number} props.characterIndex - 캐릭터 인덱스 (0-3)
 * @param {Function} props.onClose - 모달 닫기 콜백 (victory 타입일 때 2초 후 자동 호출)
 */
export default function BattleModal({ type = "fighting", characterIndex = 0, onClose }) {
  const characterImage = CHARACTERS[characterIndex] || CHARACTERS[0];
  const isVictory = type === "victory";
  const text = isVictory ? "전투 승리!" : "전투 중...";

  // victory 모달은 2초 후 소멸
  useEffect(() => {
    if (isVictory && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVictory, onClose]);

  const handleContainerClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.modalContainer} onClick={handleContainerClick}>
      <div 
        className={`${styles.modal} ${isVictory ? styles.victory : styles.fighting}`}
        onClick={handleModalClick}
      >
        <div className={styles.textContainer}>
          <p className={styles.text}>{text}</p>
        </div>
        <div className={styles.characterContainer}>
          <img 
            src={characterImage} 
            alt="캐릭터" 
            className={styles.character}
          />
        </div>
      </div>
    </div>
  );
}


