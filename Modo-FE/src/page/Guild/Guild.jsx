import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import GuildAddModal from "../../components/GuildAddModal/GuildAddModal";
import styles from "./Guild.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import plusIcon from "../../assets/icon/plus.svg";
import groupIcon from "../../assets/guild/Group.svg";
import guildIcon from "../../assets/guild/guild.svg";
import { getCachedGuildQuests, getCurrentGuildId, getGuild } from "../../api/guildApi";

function normalizePercent(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  const percentage = numeric <= 1 ? numeric * 100 : numeric;
  const rounded = Math.round(percentage);
  return Math.max(0, Math.min(100, rounded));
}

function getQuestSuccessRateFromCache(guildId) {
  const quests = getCachedGuildQuests(guildId);
  if (!Array.isArray(quests) || quests.length === 0) return null;
  const successCount = quests.filter((quest) => {
    const status = String(quest?.status || "").toUpperCase();
    return (
      quest?.completed === true ||
      status.includes("SUCCESS") ||
      status.includes("COMPLETE") ||
      status.includes("DONE")
    );
  }).length;
  return Math.round((successCount / quests.length) * 100);
}

function resolveGuildWinRate(guild, guildId) {
  const schemaCandidates = [
    guild?.winRate,
    guild?.successRate,
    guild?.questSuccessRate,
    guild?.guildWinRate,
  ];
  for (const candidate of schemaCandidates) {
    const normalized = normalizePercent(candidate);
    if (normalized != null) return normalized;
  }
  return getQuestSuccessRateFromCache(guildId);
}

export default function Guild() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guild, setGuild] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const guildId = getCurrentGuildId();
        if (!guildId) {
          if (!cancelled) setGuild(null);
          return;
        }
        const detail = await getGuild(guildId);
        if (!cancelled) setGuild(detail);
      } catch (e) {
        if (!cancelled) {
          setGuild(null);
          setError(e?.message || "길드 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

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
    setIsModalOpen(false);
    navigate("/guild/create");
  };

  const handleJoin = () => {
    setIsModalOpen(false);
    navigate("/guild/join");
  };

  const guildList = guild ? [guild] : [];

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
          {isLoading ? (
            <div className={styles.emptyState}>
              <p>길드 정보를 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className={styles.emptyState}>
              <p>{error}</p>
            </div>
          ) : guildList.length === 0 ? (
            <div className={styles.emptyState}>
              <p>등록된 길드가 없습니다.</p>
            </div>
          ) : (
            guildList.map((item) => (
              <div
                key={item.guildId ?? item.id}
                className={styles.guildCard}
                onClick={() => navigate(`/guild/${item.guildId ?? item.id}`)}
                style={{ cursor: "pointer" }}
              >
                {(() => {
                  const itemGuildId = Number(item.guildId ?? item.id);
                  const winRate = resolveGuildWinRate(item, itemGuildId);
                  return (
                    <>
                      <div className={styles.guildIconWrapper}>
                        <img src={groupIcon} alt="길드 배경" className={styles.groupIcon} />
                        <img src={guildIcon} alt="길드" className={styles.guildIcon} />
                      </div>
                      <div className={styles.guildName}>{item.name}</div>
                      <div className={styles.guildRate}>
                        승률 {winRate == null ? "-" : `${winRate}%`}
                      </div>
                    </>
                  );
                })()}
              </div>
            ))
          )}
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