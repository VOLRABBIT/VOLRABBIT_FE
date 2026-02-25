import StepCard from "../../../components/StepCard/StepCard";
import styles from "../GuildQuestRegister.module.css";
import searchIcon from "../../../assets/guild/search.svg";

export default function CompleteStep({
  verification,
  getSummaryValue,
  questName,
  deadline,
  customDeadline,
}) {
  const stepsToShow = verification === "태깅" ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5, 6];

  return (
    <div className={`${styles.content} ${styles.completeContent}`}>
      {stepsToShow.map((step) => (
        <StepCard
          key={step}
          stepNumber={step}
          isCompleted={true}
          summaryValue={getSummaryValue(step)}
          stepClass="summaryMode"
          buttonColor="#7DA7DB"
        />
      ))}

      <div className={styles.confirmModal}>
        <div className={styles.modalIcon}>
          <img src={searchIcon} alt="검색 아이콘" />
        </div>
        <div className={styles.modalContent}>
          <p className={styles.modalQuestName}>{questName}</p>
          <p className={styles.modalQuestInfo}>
            {deadline === "직접 입력" ? customDeadline : deadline}
          </p>
          <p className={styles.modalQuestInfo}>{verification}</p>
          <p className={styles.modalQuestion}>퀘스트를 추가하시겠습니까?</p>
        </div>
      </div>
    </div>
  );
}