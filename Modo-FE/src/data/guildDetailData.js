import profile1 from "../assets/guild/profile1.svg";
import profile2 from "../assets/guild/profile2.svg";
import profile3 from "../assets/guild/profile3.svg";
import profile4 from "../assets/guild/profile4.svg";

export const getGuildDetailData = (id) => {
  const guildDetailData = {
    "1": {
      id: "1",
      name: "맹그로브 신촌",
      lastScheduleDate: "2025.10.13.",
      members: [
        { id: 1, avatar: profile1 },
        { id: 2, avatar: profile2 },
        { id: 3, avatar: profile3 },
        { id: 4, avatar: profile4 },
      ],
      ongoingQuests: [
        {
          id: 1,
          category: "청소",
          task: "화장실 청소하기",
          assignedMembers: [1, 2, 3],
          completed: false,
        },
      ],
      pendingQuests: [
        {
          id: 2,
          category: "청소",
          task: "쓰레기봉투 규격 정리하기",
          assignedMembers: [1, 4],
          completed: false,
        },
      ],
    },
  };

  return guildDetailData[id] || guildDetailData["1"];
};

