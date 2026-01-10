import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import Navbar from "../../components/Navbar/Navbar";
import SkipModal from "../../components/Diagnosis/SkipModal";
import groupIcon from "../../assets/Group.svg";
import rightIcon from "../../assets/Right icon.svg";
import { ONGOING_GUILDS, ENDED_GUILDS } from "../../data/guildManageData";
import styles from "./GuildManage.module.css";

export default function GuildManage() {
  const navigate = useNavigate();
  const [ongoingGuilds, setOngoingGuilds] = useState(ONGOING_GUILDS);
  const [endedGuilds] = useState(ENDED_GUILDS);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGuild, setSelectedGuild] = useState(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = (guildId) => {
    navigate(`/guild/${guildId}/edit`);
  };

  const handleDeleteClick = (guildId) => {
    const guild = ongoingGuilds.find((g) => g.id === guildId);
    if (guild) {
      setSelectedGuild(guild);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedGuild) {
      // 삭제 로직
      setOngoingGuilds(ongoingGuilds.filter((g) => g.id !== selectedGuild.id));
      setShowDeleteModal(false);
      setSelectedGuild(null);
    }
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setSelectedGuild(null);
  };

  return (
    <div className={styles.container}>
      <TopBar
        title="길드 관리하기"
        onBack={handleBack}
        showSkip={false}
        textColor="dark"
      />

      <div className={styles.content}>
        {/* 진행 중인 길드 섹션 */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>진행 중인 길드</h2>
          <p className={styles.sectionDescription}>
            내가 생성한 길드를 관리할 수 있습니다.
          </p>
          <div className={styles.guildList}>
            {ongoingGuilds.map((guild) => (
              <div key={guild.id} className={styles.guildCard}>
                <span className={styles.guildName}>{guild.name}</span>
                <div className={styles.guildActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(guild.id)}
                  >
                    <img src={groupIcon} alt="수정" className={styles.icon} />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteClick(guild.id)}
                  >
                    <img src={rightIcon} alt="삭제" className={styles.icon} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 종료된 길드 섹션 */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>종료된 길드</h2>
          <p className={styles.sectionDescription}>
            종료일로부터 3달 까지만 보관됩니다.
          </p>
          <div className={styles.guildList}>
            {endedGuilds.map((guild) => (
              <div key={guild.id} className={styles.guildCard}>
                <span className={styles.guildName}>{guild.name}</span>
                <span className={styles.endDate}>{guild.endDate}. 종료</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Navbar activeItem="mypage" />

      {showDeleteModal && selectedGuild && (
        <SkipModal
          title="길드를 삭제하시겠습니까?"
          content={`${selectedGuild.name}이 삭제되면 길드원, 퀘스트를 복구할 수 없어요.`}
          stopButtonText="삭제하기"
          continueButtonText="취소"
          onClose={handleDeleteModalClose}
          onStop={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

