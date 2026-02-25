export const getGuildDetailData = (id) => {
  return {
    id: id || "",
    name: "",
    lastScheduleDate: "",
    members: [],
    ongoingQuests: [],
    pendingQuests: [],
  };
};
