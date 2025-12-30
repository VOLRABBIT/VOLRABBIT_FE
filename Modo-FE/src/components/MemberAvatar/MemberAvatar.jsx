import styles from "./MemberAvatar.module.css";
import profileBg from "../../assets/guild/profile-bg.svg";

export default function MemberAvatar({ member, size = "medium" }) {
  const sizeClass = size === "small" ? styles.small : styles.medium;
  const containerClass = size === "small" ? styles.questMemberAvatar : styles.memberAvatar;
  const bgClass = size === "small" ? styles.questMemberAvatarBg : styles.memberAvatarBg;
  const imgClass = size === "small" ? styles.questMemberAvatarImg : styles.memberAvatarImg;

  return (
    <div className={`${containerClass} ${sizeClass}`}>
      <img
        src={profileBg}
        alt="프로필 배경"
        className={bgClass}
      />
      {member?.avatar && (
        <img
          src={member.avatar}
          alt={`멤버 ${member.id}`}
          className={imgClass}
        />
      )}
    </div>
  );
}

