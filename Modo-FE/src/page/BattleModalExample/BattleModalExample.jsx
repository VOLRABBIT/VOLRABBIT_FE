import { useState } from "react";
import BattleModal from "../../components/BattleModal/BattleModal";
import styles from "./BattleModalExample.module.css";

export default function BattleModalExample() {
  const [modalState, setModalState] = useState({
    type: null,
    characterIndex: null,
  });

  const CHARACTERS = [
    { name: "모험가", index: 0 },
    { name: "도굴꾼", index: 1 },
    { name: "로봇", index: 2 },
    { name: "마법사", index: 3 },
  ];

  const showModal = (type, characterIndex) => {
    setModalState({ type, characterIndex });
  };

  const closeModal = () => {
    setModalState({ type: null, characterIndex: null });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>전투 모달 예시</h1>
        <p className={styles.description}>
          아래 버튼을 클릭하여 각 모달을 확인할 수 있습니다.
        </p>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>전투 중 모달</h2>
          <div className={styles.buttonGrid}>
            {CHARACTERS.map((char) => (
              <button
                key={`fighting-${char.index}`}
                className={styles.modalButton}
                onClick={() => showModal("fighting", char.index)}
              >
                {char.name}
                <br />
                <span className={styles.buttonSubtext}>전투 중...</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>전투 승리 모달</h2>
          <div className={styles.buttonGrid}>
            {CHARACTERS.map((char) => (
              <button
                key={`victory-${char.index}`}
                className={`${styles.modalButton} ${styles.victoryButton}`}
                onClick={() => showModal("victory", char.index)}
              >
                {char.name}
                <br />
                <span className={styles.buttonSubtext}>전투 승리!</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.info}>
          <p> 전투 승리 모달은 2초 후 자동으로 닫힙니다.</p>
          <p> 모달을 수동으로 닫으려면 모달 외부를 클릭하세요.</p>
        </div>
      </div>

      {/* 전투 모달 */}
      {modalState.type && (
        <BattleModal
          type={modalState.type}
          characterIndex={modalState.characterIndex}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

