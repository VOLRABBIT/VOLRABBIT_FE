import { useState } from "react";
import styles from "./CharacterCard.module.css";

export default function CharacterCard({ character, onClick }) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = character.iconUrl && !imageError ? character.iconUrl : character.image;

  const getCardClass = () => {
    if (character.id === "Time Wizard") {
      return `${styles.characterCard} ${styles.characterCardWizard}`;
    } else if (character.id === "Starter-Freeze Bot") {
      return `${styles.characterCard} ${styles.characterCardRobot}`;
    } else if (character.id === "Attention-grave") {
      return `${styles.characterCard} ${styles.characterCardGraverobber}`;
    } else if (character.id === "Emotional Adventure") {
      return `${styles.characterCard} ${styles.characterCardAdventurer}`;
    }
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

