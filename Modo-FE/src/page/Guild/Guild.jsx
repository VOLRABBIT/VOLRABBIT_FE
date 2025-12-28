import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import GuildAddModal from "../../components/GuildAddModal/GuildAddModal";
import styles from "./Guild.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import plusIcon from "../../assets/icon/plus.svg";
import groupIcon from "../../assets/guild/Group.svg";
import guildIcon from "../../assets/guild/guild.svg";
import { GUILD_DATA } from "../../data/guildData";

export default function Guild() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddGuild = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreate = () => {
    // 길드 생성 로직
    console.log("길드 생성");
    setIsModalOpen(false);
  };

  const handleJoin = () => {
    setIsModalOpen(false);
    navigate("/guild/join");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={arrowLeftIcon} alt="뒤로가기" />
        </button>
        <h1 className={styles.title}>길드</h1>
        <button className={styles.addButton} onClick={handleAddGuild}>
          <img src={plusIcon} alt="추가" />
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.guildList}>
          {GUILD_DATA.map((guild) => (
            <div key={guild.id} className={styles.guildCard}>
              <div className={styles.guildIconWrapper}>
                <img src={groupIcon} alt="길드 배경" className={styles.groupIcon} />
                <img src={guildIcon} alt="길드" className={styles.guildIcon} />
              </div>
              <div className={styles.guildName}>{guild.name}</div>
              <div className={styles.guildStats}>
                <span className={styles.statLabel}>승률</span>
                <span className={styles.statValue}>{guild.winRate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Navbar activeItem="guild" />
      {isModalOpen && (
        <GuildAddModal
          onClose={handleCloseModal}
          onCreate={handleCreate}
          onJoin={handleJoin}
        />
      )}
    </div>
  );
}

