import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import QuestCompleteModal from "../../components/QuestCompleteModal/QuestCompleteModal";
import MemberAvatar from "../../components/MemberAvatar/MemberAvatar";
import styles from "./GuildDetail.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import groupIcon from "../../assets/guild/Group.svg";
import guildIcon from "../../assets/guild/guild.svg";
import checkedIcon from "../../assets/checked.svg";
import { getGuildDetailData } from "../../data/guildDetailData";

export default function GuildDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [guildData, setGuildData] = useState(() =>
    getGuildDetailData(id || "1")
  );
  const [modalState, setModalState] = useState({
    isOpen: false,
    questType: null,
    questId: null,
    questTask: null,
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleAdd = () => {
    navigate(`/guild/${id}/quest/register`);
  };

  const handleCheckboxClick = (questType, questId, questTask) => {
    const quest = questType === "ongoing"
      ? guildData.ongoingQuests.find((q) => q.id === questId)
      : guildData.pendingQuests.find((q) => q.id === questId);

    if (quest?.completed) {
      setGuildData((prev) => {
        const updated = { ...prev };
        if (questType === "ongoing") {
          updated.ongoingQuests = prev.ongoingQuests.map((q) =>
            q.id === questId ? { ...q, completed: false } : q
          );
        } else if (questType === "pending") {
          updated.pendingQuests = prev.pendingQuests.map((q) =>
            q.id === questId ? { ...q, completed: false } : q
          );
        }
        return updated;
      });
    } else {
      setModalState({
        isOpen: true,
        questType,
        questId,
        questTask,
      });
    }
  };

  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      questType: null,
      questId: null,
      questTask: null,
    });
  };

  const handleModalConfirm = () => {
    const { questType, questId } = modalState;
    setGuildData((prev) => {
      const updated = { ...prev };
      if (questType === "ongoing") {
        updated.ongoingQuests = prev.ongoingQuests.map((quest) =>
          quest.id === questId
            ? { ...quest, completed: true }
            : quest
        );
      } else if (questType === "pending") {
        updated.pendingQuests = prev.pendingQuests.map((quest) =>
          quest.id === questId
            ? { ...quest, completed: true }
            : quest
        );
      }
      return updated;
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={arrowLeftIcon} alt="뒤로가기" />
        </button>
        <h1 className={styles.title}>{guildData.name}</h1>
        <button className={styles.addButton} onClick={handleAdd}>
          +
        </button>
      </div>

      <div className={styles.content}>
        {/* 길드 정보 섹션 */}
        <div className={styles.guildInfoSection}>
          <div className={styles.guildIconWrapper}>
            <img src={groupIcon} alt="Group" className={styles.groupIcon} />
            <img src={guildIcon} alt="Guild" className={styles.guildIcon} />
          </div>
          <h2 className={styles.guildName}>{guildData.name}</h2>
          <div className={styles.memberAvatars}>
            {guildData.members.map((member) => (
              <MemberAvatar key={member.id} member={member} size="medium" />
            ))}
          </div>
          <p className={styles.lastScheduleDate}>
            마지막 일정 등록일: {guildData.lastScheduleDate}
          </p>
        </div>

        {/* 현재 진행 중인 퀘스트 */}
        <div className={styles.questSection}>
          <h3 className={styles.sectionTitle}>현재 진행 중인 퀘스트</h3>
          {guildData.ongoingQuests.map((quest) => (
            <div key={quest.id} className={styles.questCard}>
              <p className={styles.questCategory}>{quest.category}</p>
              <div className={styles.questItem}>
                <button
                  className={styles.checkbox}
                  onClick={() =>
                    handleCheckboxClick("ongoing", quest.id, quest.task)
                  }
                >
                  {quest.completed ? (
                    <img
                      src={checkedIcon}
                      alt="체크됨"
                      className={styles.checkboxIcon}
                    />
                  ) : null}
                </button>
                <p className={styles.questTask}>{quest.task}</p>
                <div className={styles.questMembers}>
                  {quest.assignedMembers.map((memberId) => {
                    const member = guildData.members.find(
                      (m) => m.id === memberId
                    );
                    return (
                      <MemberAvatar
                        key={memberId}
                        member={member}
                        size="small"
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 승인 대기 중인 퀘스트 */}
        <div className={styles.questSection}>
          <h3 className={styles.sectionTitle}>승인 대기 중인 퀘스트</h3>
          {guildData.pendingQuests.map((quest) => (
            <div key={quest.id} className={styles.questCard}>
              <p className={styles.questCategory}>{quest.category}</p>
              <div className={styles.questItem}>
                <button
                  className={styles.checkbox}
                  onClick={() =>
                    handleCheckboxClick("pending", quest.id, quest.task)
                  }
                >
                  {quest.completed ? (
                    <img
                      src={checkedIcon}
                      alt="체크됨"
                      className={styles.checkboxIcon}
                    />
                  ) : null}
                </button>
                <p className={styles.questTask}>{quest.task}</p>
                <div className={styles.questMembers}>
                  {quest.assignedMembers.map((memberId) => {
                    const member = guildData.members.find(
                      (m) => m.id === memberId
                    );
                    return (
                      <MemberAvatar
                        key={memberId}
                        member={member}
                        size="small"
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Navbar activeItem="guild" />

      {modalState.isOpen && (
        <QuestCompleteModal
          questTask={modalState.questTask}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  );
}

