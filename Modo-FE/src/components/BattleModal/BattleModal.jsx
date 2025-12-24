import { useEffect } from "react";
import styles from "./BattleModal.module.css";
import CharacterFighting1 from "../../assets/Character_fighting1.png";
import CharacterFighting2 from "../../assets/Character_fighting2.png";
import CharacterFighting3 from "../../assets/Character_fighting3.png";
import CharacterFighting4 from "../../assets/Character_fighting4.png";
import CharacterWin1 from "../../assets/Character_win1.png";
import CharacterWin2 from "../../assets/Character_win2.png";
import CharacterWin3 from "../../assets/Character_win3.png";
import CharacterWin4 from "../../assets/Character_win4.png";

const FIGHTING_CHARACTERS = [
  CharacterFighting1,
  CharacterFighting2,
  CharacterFighting3,
  CharacterFighting4,
];

const WIN_CHARACTERS = [
  CharacterWin1,
  CharacterWin2,
  CharacterWin3,
  CharacterWin4,
];

/**
 * 전투 모달 컴포넌트
 * @param {Object} props
 * @param {string} props.type
 * @param {number} props.characterIndex - 캐릭터 인덱스 (0-3)
 * @param {Function} props.onClose - 모달 닫기 콜백 (victory 타입일 때 2초 후 자동 호출)
 */
export default function BattleModal({ type = "fighting", characterIndex = 0, onClose }) {
  const isVictory = type === "victory";
  const characterImage = isVictory 
    ? (WIN_CHARACTERS[characterIndex] || WIN_CHARACTERS[0])
    : (FIGHTING_CHARACTERS[characterIndex] || FIGHTING_CHARACTERS[0]);
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


