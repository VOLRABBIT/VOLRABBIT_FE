import styles from "./LoadingScreen.module.css";
import resultBackground from "../../assets/image/Result_background.png";
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

// 로딩 화면 (캐릭터 전환 애니메이션)
export default function LoadingScreen({ currentCharacterIndex, styles: customStyles }) {
  const mergedStyles = { ...styles, ...customStyles };

  return (
    <div className={mergedStyles.loadingWrapper}>
      <div
        className={mergedStyles.loadingBackground}
        style={{ backgroundImage: `url(${resultBackground})` }}
      />
      <div className={mergedStyles.loadingCharacterContainer}>
        <img
          src={CHARACTERS[currentCharacterIndex]}
          className={`${mergedStyles.loadingCharacter} ${mergedStyles[`character${currentCharacterIndex}`]}`}
          key={currentCharacterIndex}
        />
      </div>
      <div className={mergedStyles.loadingTextContainer}>
        <p className={mergedStyles.loadingText}>
          loading<span className={mergedStyles.loadingDots}> &nbsp;</span>
        </p>
        <p className={mergedStyles.loadingSubtext}>나의 캐릭터를 찾고 있어요!</p>
      </div>
    </div>
  );
}

