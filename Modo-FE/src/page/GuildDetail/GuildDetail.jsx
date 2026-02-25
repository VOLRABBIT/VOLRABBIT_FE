import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import QuestCompleteModal from "../../components/QuestCompleteModal/QuestCompleteModal";
import MemberAvatar from "../../components/MemberAvatar/MemberAvatar";
import styles from "./GuildDetail.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import groupIcon from "../../assets/guild/Group.svg";
import guildIcon from "../../assets/guild/guild.svg";
import checkedIcon from "../../assets/checked.svg";
import {
  acceptGuildQuest,
  checkGuildQuest,
  getCachedGuildQuests,
  getGuild,
  getGuildMembers,
  saveCachedGuildQuests,
} from "../../api/guildApi";
import { isGuildQuest } from "../../utils/taskSource";

function toUiMember(member) {
  return {
    id: member?.userId ?? member?.id,
    nickname: member?.nickname ?? "멤버",
    avatar: member?.profileImageUrl ?? member?.avatar ?? "",
  };
}

function extractPerformerSource(quest) {
  const candidates = [
    quest?.completedMembers,
    quest?.checkedMembers,
    quest?.participants,
    quest?.provedBy,
    quest?.doneBy,
    quest?.performers,
  ];
  return candidates.find((value) => Array.isArray(value)) || [];
}

function normalizePerformer(entry, membersById, index) {
  const isObject = entry && typeof entry === "object";
  const rawId = isObject ? (entry.userId ?? entry.memberId ?? entry.id) : entry;
  const id = rawId ?? `unknown-${index}`;
  const matched = membersById.get(String(id));
  return {
    id,
    nickname: isObject
      ? (entry.nickname ?? matched?.nickname ?? "멤버")
      : (matched?.nickname ?? "멤버"),
    avatar: isObject
      ? (entry.profileImageUrl ?? entry.avatarUrl ?? entry.avatar ?? matched?.avatar ?? "")
      : (matched?.avatar ?? ""),
  };
}

function AvatarGroup({ members }) {
  if (!Array.isArray(members) || members.length === 0) return null;

  const maxVisible = 4;
  const visible = members.slice(0, maxVisible);
  const extraCount = members.length - maxVisible;

  return (
    <div className={styles.questMembers} aria-label="수행 완료 멤버">
      {visible.map((member, index) => (
        <div
          key={`${member.id}-${index}`}
          className={styles.questMemberAvatar}
          style={{ marginLeft: index === 0 ? 0 : -6 }}
          title={member.nickname}
        >
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.nickname}
              className={styles.questMemberAvatarImg}
            />
          ) : (
            <span className={styles.questMemberAvatarFallback}>
              {(member.nickname || "멤버").slice(0, 1)}
            </span>
          )}
        </div>
      ))}
      {extraCount > 0 ? (
        <div className={styles.questMemberExtra} style={{ marginLeft: -6 }}>
          +{extraCount}
        </div>
      ) : null}
    </div>
  );
}

export default function GuildDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const guildId = Number(id);

  const [guild, setGuild] = useState(null);
  const [members, setMembers] = useState([]);
  const [quests, setQuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    questType: null,
    questId: null,
    questTask: null,
    verificationType: "CHECK",
  });

  const reloadGuildSnapshot = useCallback(async () => {
    const [guildDetail, guildMembers] = await Promise.all([
      getGuild(guildId),
      getGuildMembers(guildId),
    ]);
    setGuild(guildDetail);
    setMembers((Array.isArray(guildMembers) ? guildMembers : []).map(toUiMember));
  }, [guildId]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!Number.isFinite(guildId)) {
        navigate("/guild", { replace: true });
        return;
      }

      setIsLoading(true);
      try {
        const [guildDetail, guildMembers] = await Promise.all([
          getGuild(guildId),
          getGuildMembers(guildId),
        ]);
        if (cancelled) return;
        setGuild(guildDetail);
        setMembers((Array.isArray(guildMembers) ? guildMembers : []).map(toUiMember));
        setQuests(getCachedGuildQuests(guildId).filter(isGuildQuest));
      } catch (e) {
        if (!cancelled) {
          alert(e?.message || "길드 정보를 불러오지 못했습니다.");
          navigate("/guild", { replace: true });
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [guildId, navigate]);

  const pendingQuests = useMemo(
    () =>
      (Array.isArray(quests) ? quests : []).filter((q) =>
        String(q.status || "").toUpperCase().includes("PENDING")
      ),
    [quests]
  );

  const ongoingQuests = useMemo(
    () =>
      (Array.isArray(quests) ? quests : []).filter(
        (q) => !String(q.status || "").toUpperCase().includes("PENDING")
      ),
    [quests]
  );

  const membersById = useMemo(
    () => new Map(members.map((member) => [String(member.id), member])),
    [members]
  );

  const handleBack = () => {
    navigate(-1);
  };

  const handleAdd = () => {
    navigate(`/guild/${id}/quest/register`);
  };

  const handleCheckboxClick = (questType, questId, questTask, verificationType) => {
    const quest = quests.find((q) => q.id === questId);

    if (quest?.completed) {
      const updated = quests.map((q) =>
        q.id === questId ? { ...q, completed: false } : q
      );
      setQuests(updated);
      saveCachedGuildQuests(guildId, updated);
      return;
    }

    setModalState({
      isOpen: true,
      questType,
      questId,
      questTask,
      verificationType: verificationType || "CHECK",
    });
  };

  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      questType: null,
      questId: null,
      questTask: null,
      verificationType: "CHECK",
    });
  };

  const handleModalConfirm = async () => {
    if (isActionLoading) return;
    const { questType, questId, verificationType } = modalState;
    setIsActionLoading(true);
    try {
      let actionResponse = null;
      if (questType === "pending") {
        actionResponse = await acceptGuildQuest(guildId, questId);
      } else if (String(verificationType).toUpperCase() === "PHOTO_PROOF") {
        handleModalClose();
        navigate("/task-photo-auth", {
          state: {
            mode: "guildQuest",
            guildId,
            questId,
            returnPath: `/guild/${guildId}`,
            locationType: "dungeon",
          },
        });
        return;
      } else {
        actionResponse = await checkGuildQuest(guildId, questId);
      }

      const updated = quests.map((q) =>
        q.id === questId
          ? {
              ...q,
              ...(actionResponse && typeof actionResponse === "object" ? actionResponse : {}),
              completed: true,
              status: questType === "pending" ? "ONGOING" : q.status,
            }
          : q
      );
      setQuests(updated);
      saveCachedGuildQuests(guildId, updated);
      await reloadGuildSnapshot();
      handleModalClose();
    } catch (e) {
      alert(e?.message || "요청 처리에 실패했습니다.");
    } finally {
      setIsActionLoading(false);
    }
  };

  useEffect(() => {
    const refreshedAt = location.state?.guildQuestPhotoProofUpdatedAt;
    if (!refreshedAt || !Number.isFinite(guildId)) return;
    setQuests(getCachedGuildQuests(guildId).filter(isGuildQuest));
  }, [guildId, location.state?.guildQuestPhotoProofUpdatedAt]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.content} style={{ padding: 24, textAlign: "center" }}>
          길드 정보를 불러오는 중...
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={arrowLeftIcon} alt="뒤로가기" />
        </button>
        <h1 className={styles.title}>{guild?.name || "길드"}</h1>
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
          <h2 className={styles.guildName}>{guild?.name || "-"}</h2>
          <div className={styles.memberAvatars}>
            {members.map((member) => (
              <MemberAvatar key={member.id} member={member} size="medium" />
            ))}
          </div>
          <p className={styles.lastScheduleDate}>
            길드 인원: {members.length}명
          </p>
        </div>

        {/* 현재 진행 중인 퀘스트 */}
        <div className={styles.questSection}>
          <h3 className={styles.sectionTitle}>현재 진행 중인 퀘스트</h3>
          <div className={styles.questList}>
            {ongoingQuests.length === 0 ? (
              <div className={styles.emptyQuestCard}>현재 등록된 퀘스트가 없습니다</div>
            ) : (
              ongoingQuests.map((quest) => (
                <div key={quest.id} className={styles.questCard}>
                  <p className={styles.questCategory}>{quest.category}</p>
                  {(() => {
                    const performerSource = extractPerformerSource(quest);
                    const performers = performerSource
                      .map((entry, index) => normalizePerformer(entry, membersById, index))
                      .filter((member) => member.id != null);
                    return performers.length > 0 ? (
                      <div className={styles.questPerformerRow}>
                        <AvatarGroup members={performers} />
                      </div>
                    ) : null;
                  })()}
                  <div className={styles.questItem}>
                    <button
                      className={styles.checkbox}
                      onClick={() =>
                        handleCheckboxClick("ongoing", quest.id, quest.task, quest.verificationType)
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
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 승인 대기 중인 퀘스트 */}
        <div className={styles.questSection}>
          <h3 className={styles.sectionTitle}>승인 대기 중인 퀘스트</h3>
          <div className={styles.questList}>
            {pendingQuests.length === 0 ? (
              <div className={styles.emptyQuestCard}>승인 대기 중인 퀘스트가 없습니다</div>
            ) : (
              pendingQuests.map((quest) => (
                <div key={quest.id} className={styles.questCard}>
                  <p className={styles.questCategory}>{quest.category}</p>
                  {(() => {
                    const performerSource = extractPerformerSource(quest);
                    const performers = performerSource
                      .map((entry, index) => normalizePerformer(entry, membersById, index))
                      .filter((member) => member.id != null);
                    return performers.length > 0 ? (
                      <div className={styles.questPerformerRow}>
                        <AvatarGroup members={performers} />
                      </div>
                    ) : null;
                  })()}
                  <div className={styles.questItem}>
                    <button
                      className={styles.checkbox}
                      onClick={() =>
                        handleCheckboxClick("pending", quest.id, quest.task, quest.verificationType)
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
                  </div>
                </div>
              ))
            )}
          </div>
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