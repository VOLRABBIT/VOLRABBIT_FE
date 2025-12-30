import styles from "./GuildAddModal.module.css";

export default function GuildAddModal({ onClose, onCreate, onJoin }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCreate = () => {
    if (onCreate) {
      onCreate();
    } else {
      console.log("길드 생성");
      onClose();
    }
  };

  const handleJoin = () => {
    if (onJoin) {
      onJoin();
    } else {
      console.log("길드 참가");
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.buttonContainer}>
          <button className={styles.createButton} onClick={handleCreate}>
            생성하기
          </button>
          <button className={styles.joinButton} onClick={handleJoin}>
            함께하기
          </button>
        </div>
      </div>
    </div>
  );
}

