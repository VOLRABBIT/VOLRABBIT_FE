import api from "./api";

const CURRENT_GUILD_ID_KEY = "currentGuildId";
const GUILD_QUEST_CACHE_KEY_PREFIX = "guildQuestCache:";

function unwrapData(response) {
  return response?.data?.data ?? response?.data ?? response;
}

function toApiErrorMessage(error, fallback) {
  const status = error?.response?.status;
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback;
  if (status) {
    return `[${status}] ${message}`;
  }
  return (
    message
  );
}

export function getCurrentGuildId() {
  const raw = localStorage.getItem(CURRENT_GUILD_ID_KEY);
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export function setCurrentGuildId(guildId) {
  if (!Number.isFinite(Number(guildId))) return;
  localStorage.setItem(CURRENT_GUILD_ID_KEY, String(guildId));
}

export function clearCurrentGuildId() {
  localStorage.removeItem(CURRENT_GUILD_ID_KEY);
}

function getQuestCacheKey(guildId) {
  return `${GUILD_QUEST_CACHE_KEY_PREFIX}${guildId}`;
}

export function getCachedGuildQuests(guildId) {
  try {
    const raw = localStorage.getItem(getQuestCacheKey(guildId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCachedGuildQuests(guildId, quests) {
  try {
    localStorage.setItem(getQuestCacheKey(guildId), JSON.stringify(Array.isArray(quests) ? quests : []));
  } catch {
    // ignore
  }
}

export async function createGuild(payload) {
  try {
    const res = await api.post("/api/guilds", payload);
    return unwrapData(res);
  } catch (error) {
    throw new Error(toApiErrorMessage(error, "길드 생성에 실패했습니다."));
  }
}

export async function getGuild(guildId) {
  try {
    const res = await api.get(`/api/guilds/${guildId}`);
    return unwrapData(res);
  } catch (error) {
    throw new Error(toApiErrorMessage(error, "길드 정보를 불러오지 못했습니다."));
  }
}

export async function updateGuild(guildId, payload) {
  try {
    const res = await api.patch(`/api/guilds/${guildId}`, payload);
    return unwrapData(res);
  } catch (error) {
    throw new Error(toApiErrorMessage(error, "길드 정보 수정에 실패했습니다."));
  }
}

export async function deleteGuild(guildId) {
  try {
    await api.delete(`/api/guilds/${guildId}`);
    return true;
  } catch (error) {
    throw new Error(toApiErrorMessage(error, "길드 삭제에 실패했습니다."));
  }
}

export async function joinGuild(guildId, password = "") {
  try {
    const raw = typeof password === "string" ? password : "";
    const body = JSON.stringify(raw);
    await api.post(`/api/guilds/${guildId}/join`, body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return true;
  } catch (error) {
    throw new Error(toApiErrorMessage(error, "길드 가입에 실패했습니다."));
  }
}

export async function leaveGuild(guildId) {
  try {
    await api.delete(`/api/guilds/${guildId}/members/me`);
    return true;
  } catch (error) {
    throw new Error(toApiErrorMessage(error, "길드 탈퇴에 실패했습니다."));
  }
}

export async function getGuildMembers(guildId) {
  try {
    const res = await api.get(`/api/guilds/${guildId}/members`);
    const data = unwrapData(res);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(toApiErrorMessage(error, "길드 멤버를 불러오지 못했습니다."));
  }
}

export async function proposeGuildQuest(guildId, payload) {
  try {
    const res = await api.post(`/api/guilds/${guildId}/quests`, payload);
    return unwrapData(res);
  } catch (error) {
    throw new Error(toApiErrorMessage(error, "길드 퀘스트 제안에 실패했습니다."));
  }
}

export async function acceptGuildQuest(guildId, questId) {
  try {
    const res = await api.post(`/api/guilds/${guildId}/quests/${questId}/accept`);
    return unwrapData(res);
  } catch (error) {
    throw new Error(toApiErrorMessage(error, "길드 퀘스트 수락에 실패했습니다."));
  }
}

export async function checkGuildQuest(guildId, questId) {
  try {
    const res = await api.post(`/api/guilds/${guildId}/quests/${questId}/check`);
    return unwrapData(res);
  } catch (error) {
    throw new Error(toApiErrorMessage(error, "길드 퀘스트 체크 인증에 실패했습니다."));
  }
}

export async function photoProofGuildQuest(guildId, questId, photoUrl) {
  try {
    const res = await api.post(`/api/guilds/${guildId}/quests/${questId}/photo-proof`, {
      photoUrl,
    });
    return unwrapData(res);
  } catch (error) {
    throw new Error(toApiErrorMessage(error, "길드 퀘스트 사진 인증에 실패했습니다."));
  }
}