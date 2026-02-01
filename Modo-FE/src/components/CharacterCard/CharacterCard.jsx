import { useState } from "react";
import styles from "./CharacterCard.module.css";

export default function CharacterCard({ character, onClick }) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = character.iconUrl && !imageError ? character.iconUrl : character.image;

  const getCardClass = () => {
    const name = character.name;
    if (name === "시간이 사라지는 마법사") return `${styles.characterCard} ${styles.characterCardWizard}`;
    if (name === "시작 버튼이 멈춘 로봇") return `${styles.characterCard} ${styles.characterCardRobot}`;
    if (name === "주의력 도굴꾼") return `${styles.characterCard} ${styles.characterCardGraverobber}`;
    if (name === "감정 모험가") return `${styles.characterCard} ${styles.characterCardAdventurer}`;
    return styles.characterCard;
  };

  return (
    <div className={styles.characterCardWrapper} onClick={onClick}>
      <div className={getCardClass()}>
        <div className={styles.characterImageContainer}>
          <img
            src={imageSrc}
            alt={character.name}
            className={styles.characterImage}
            onError={() => setImageError(true)}
          />
        </div>
      </div>
      <div className={styles.characterName}>{character.name}</div>
    </div>
  );
}

