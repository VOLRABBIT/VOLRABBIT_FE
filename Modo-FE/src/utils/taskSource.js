function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  
  function hasAnyOwn(obj, keys) {
    return keys.some((key) => hasOwn(obj, key) && obj[key] != null);
  }
  
  export function isGuildQuest(item) {
    if (!item || typeof item !== "object") return false;
  
    const source = String(item.source ?? "").toUpperCase();
    const type = String(item.type ?? item.taskType ?? "").toUpperCase();
    if (source.includes("GUILD") || type.includes("GUILD_QUEST")) return true;
  
    if (hasAnyOwn(item, ["guildId", "guildQuestId", "questId"])) return true;
  
    if (hasAnyOwn(item, ["acceptedMemberCount", "totalMemberCount", "myStatus", "guildStatus"])) {
      return true;
    }
  
    if (hasAnyOwn(item, ["completedMembers", "checkedMembers", "participants", "provedBy", "performers"])) {
      return true;
    }
  
    const category = String(item.category ?? item.categoryName ?? "").toLowerCase();
    if (category.includes("guild") || category.includes("길드") || category.includes("quest")) {
      return true;
    }
  
    return false;
  }
  
  export function isGuildQuestGroup(group) {
    if (!group || typeof group !== "object") return false;
  
    if (isGuildQuest(group)) return true;
  
    const category = String(group.category ?? group.categoryName ?? "").toLowerCase();
    if (category.includes("guild") || category.includes("길드") || category.includes("quest")) {
      return true;
    }
  
    return false;
  }
  
  export function filterOutGuildQuests(items) {
    const list = Array.isArray(items) ? items : [];
    return list.filter((item) => !isGuildQuest(item));
  }
  
  export function filterOutGuildQuestGroups(groups) {
    const list = Array.isArray(groups) ? groups : [];
    return list
      .filter((group) => !isGuildQuestGroup(group))
      .map((group) => {
        const tasks = Array.isArray(group?.tasks) ? filterOutGuildQuests(group.tasks) : [];
        return { ...group, tasks };
      })
      .filter((group) => Array.isArray(group.tasks) && group.tasks.length > 0);
  }