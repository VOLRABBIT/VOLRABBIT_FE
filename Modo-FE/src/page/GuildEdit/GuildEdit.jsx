import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MemberAvatar from "../../components/MemberAvatar/MemberAvatar";
import SkipModal from "../../components/Diagnosis/SkipModal";
import styles from "./GuildEdit.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import closeIcon from "../../assets/icon/close.svg";
import groupIcon from "../../assets/guild/Group.svg";
import guildIcon from "../../assets/guild/guild.svg";
import correctionIcon from "../../assets/correction.svg";
import checkedIcon from "../../assets/checked.svg";
import { getGuildDetailData } from "../../data/guildDetailData";

export default function GuildEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const guildNameInputRef = useRef(null);
  
  const initialGuildData = getGuildDetailData(id || "1");
  
  const [guildName, setGuildName] = useState(initialGuildData.name);
  const [members, setMembers] = useState(initialGuildData.members);
  const [memberCount, setMemberCount] = useState(initialGuildData.members?.length ?? 0);
  const [customMemberCount, setCustomMemberCount] = useState("");
  const [duration, setDuration] = useState(null);
  const [customDuration, setCustomDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState(null);
  const [showDeleteMemberModal, setShowDeleteMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [showMemberCountInput, setShowMemberCountInput] = useState(false);
  const [showDurationInput, setShowDurationInput] = useState(false);
  const [memberCountInputFocused, setMemberCountInputFocused] = useState(false);
  const [durationInputFocused, setDurationInputFocused] = useState(false);

  const handleBack = () => {
    if (hasChanges) {
      setShowUnsavedChangesModal(true);
    } else {
      navigate(-1);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowUnsavedChangesModal(true);
    } else {
      navigate(-1);
    }
  };

  const handleGuildNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setGuildName(value);
      setHasChanges(true);
    }
  };

  const handleEditIconClick = () => {
    if (guildNameInputRef.current) {
      guildNameInputRef.current.focus();
      guildNameInputRef.current.select();
    }
  };

  const handleMemberCountSelect = (count) => {
    setMemberCount(count);
    setCustomMemberCount("");
    setShowMemberCountInput(false);
    setHasChanges(true);
  };

  const handleCustomMemberCountChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    setCustomMemberCount(numericValue);
    setMemberCount(null);
    if (numericValue) {
      setHasChanges(true);
    }
  };

  const handleDurationSelect = (dur) => {
    setDuration(dur);
    setCustomDuration("");
    setDurationUnit(null);
    setShowDurationInput(false);
    setHasChanges(true);
  };

  const handleDurationUnitSelect = (unit) => {
    setDurationUnit(unit);
    setDuration(null);
    setHasChanges(true);
  };

  const handleCustomDurationChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    setCustomDuration(numericValue);
    setDuration(null);
    if (numericValue) {
      setHasChanges(true);
    }
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setShowDeleteMemberModal(true);
  };

  const handleDeleteMemberConfirm = () => {
    if (selectedMember) {
      console.log("길드원 삭제:", selectedMember.id);
      setMembers(prevMembers => prevMembers.filter(member => member.id !== selectedMember.id));
      setHasChanges(true);
      setShowDeleteMemberModal(false);
      setSelectedMember(null);
    }
  };

  const handleDeleteMemberModalClose = () => {
    setShowDeleteMemberModal(false);
    setSelectedMember(null);
  };

  const handleSave = () => {
    console.log("길드 수정 저장:", {
      name: guildName,
      memberCount: memberCount || customMemberCount,
      duration: duration || (customDuration && durationUnit ? `${customDuration}${durationUnit === "월" ? "개월" : durationUnit}` : ""),
    });
    setHasChanges(false);
    navigate(-1);
  };

  const handleUnsavedChangesModalSave = () => {
    handleSave();
    setShowUnsavedChangesModal(false);
  };

  const handleUnsavedChangesModalCancel = () => {
    setShowUnsavedChangesModal(false);
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={arrowLeftIcon} alt="뒤로가기" />
        </button>
        <h1 className={styles.title}>길드 수정하기</h1>
        <button className={styles.closeButton} onClick={handleClose}>
          <img src={closeIcon} alt="닫기" />
        </button>
      </div>

      <div className={styles.content}>
        {/* 길드 정보 섹션 */}
        <div className={styles.guildInfoSection}>
          <div className={styles.guildIconWrapper}>
            <img src={groupIcon} alt="Group" className={styles.groupIcon} />
            <img src={guildIcon} alt="Guild" className={styles.guildIcon} />
          </div>
          <div className={styles.guildNameWrapper}>
            <input
              ref={guildNameInputRef}
              type="text"
              className={styles.guildNameInput}
              value={guildName}
              onChange={handleGuildNameChange}
              maxLength={10}
            />
            <button
              type="button"
              onClick={handleEditIconClick}
              className={styles.editIconButton}
            >
              <img src={correctionIcon} alt="수정" className={styles.editIcon} />
            </button>
          </div>
          <div className={styles.memberAvatars}>
            {members.map((member) => (
              <button
                key={member.id}
                type="button"
                className={styles.memberAvatarButton}
                onClick={() => handleMemberClick(member)}
              >
                <MemberAvatar member={member} size="medium" />
              </button>
            ))}
          </div>
        </div>

        {/* 길드 인원 설정 카드 */}
        <div className={styles.settingCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardNumber}>1</div>
            <div className={styles.cardInfo}>
              <h2 className={styles.cardTitle}>길드 인원 설정</h2>
              <p className={styles.cardDescription}>
                길드의 최대 인원을 설정해주세요.
              </p>
            </div>
          </div>
          <div className={styles.tagContainer}>
            {[2, 3, 4, 5, 6].map((count) => (
              <button
                key={count}
                className={`${styles.tag} ${memberCount === count ? styles.tagActive : ""}`}
                onClick={() => handleMemberCountSelect(count)}
              >
                {count}명
              </button>
            ))}
            <button
              className={`${styles.tag} ${showMemberCountInput ? styles.tagActive : ""}`}
              onClick={() => {
                setShowMemberCountInput(true);
                setMemberCount(null);
                setCustomMemberCount("");
              }}
            >
              입력
            </button>
          </div>
          {showMemberCountInput && (
            <div className={styles.inputSection}>
              <div className={`${styles.tagInputWrapper} ${customMemberCount ? styles.tagInputActive : ""}`}>
                <input
                  type="text"
                  className={styles.tagInput}
                  value={customMemberCount}
                  onChange={handleCustomMemberCountChange}
                  onFocus={() => setMemberCountInputFocused(true)}
                  onBlur={() => setMemberCountInputFocused(false)}
                  placeholder={memberCountInputFocused ? "" : "입력"}
                  maxLength={10}
                />
                {customMemberCount && (
                  <span className={styles.tagInputSuffix}>명</span>
                )}
              </div>
            </div>
          )}
          <button className={styles.modifyButton}>
            수정하기
          </button>
        </div>

        {/* 길드 유지 기간 카드 */}
        <div className={styles.settingCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardNumber}>2</div>
            <div className={styles.cardInfo}>
              <h2 className={styles.cardTitle}>길드 유지 기간</h2>
              <p className={styles.cardDescription}>
                길드의 유지 기간을 설정해주세요.
              </p>
            </div>
          </div>
          <div className={styles.tagContainer}>
            {["일주일", "1개월", "6개월", "1년"].map((dur) => (
              <button
                key={dur}
                className={`${styles.tag} ${duration === dur ? styles.tagActive : ""}`}
                onClick={() => handleDurationSelect(dur)}
              >
                {dur}
              </button>
            ))}
            <button
              className={`${styles.tag} ${showDurationInput ? styles.tagActive : ""}`}
              onClick={() => {
                setShowDurationInput(true);
                setDuration(null);
                setCustomDuration("");
                setDurationUnit(null);
              }}
            >
              입력
            </button>
          </div>
          {showDurationInput && (
            <div className={styles.inputSection}>
              <div className={`${styles.durationInputWrapper} ${customDuration && durationUnit ? styles.tagInputActive : ""}`}>
                <input
                  type="text"
                  className={styles.durationInput}
                  value={customDuration}
                  onChange={handleCustomDurationChange}
                  onFocus={() => setDurationInputFocused(true)}
                  onBlur={() => setDurationInputFocused(false)}
                  placeholder={durationInputFocused ? "" : "입력"}
                  maxLength={10}
                />
                <div className={styles.durationUnitButtons}>
                  {["주", "월", "년"].map((unit) => (
                    <button
                      key={unit}
                      type="button"
                      className={`${styles.durationUnitButton} ${durationUnit === unit ? styles.durationUnitButtonActive : ""}`}
                      onClick={() => handleDurationUnitSelect(unit)}
                    >
                      <span className={`${styles.durationUnitCircle} ${durationUnit === unit ? styles.durationUnitCircleFilled : ""}`}></span>
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <button className={styles.modifyButton}>
            수정하기
          </button>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.saveButton} onClick={handleSave}>
          저장하기
        </button>
      </div>

      {showDeleteMemberModal && selectedMember && (
        <SkipModal
          title="길드원 삭제하기"
          content={`${selectedMember.nickname || `멤버 ${selectedMember.id}`}을 퇴출시키겠습니까?`}
          stopButtonText="삭제하기"
          continueButtonText="취소"
          onClose={handleDeleteMemberModalClose}
          onStop={handleDeleteMemberConfirm}
        />
      )}

      {showUnsavedChangesModal && (
        <SkipModal
          title="수정사항이 반영되지 않았어요."
          content="길드 수정 내용이 반영되지 않았어요.<br></br>지금까지의 변경 사항을 저장할까요?"
          stopButtonText="저장하기"
          continueButtonText="취소"
          onClose={handleUnsavedChangesModalCancel}
          onStop={handleUnsavedChangesModalSave}
        />
      )}
    </div>
  );
}

