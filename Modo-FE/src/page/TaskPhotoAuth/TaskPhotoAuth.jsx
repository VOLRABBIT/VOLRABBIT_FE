import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TaskPhotoAuth.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import uploadIcon from "../../assets/map/upload.svg";
import { getLocationBackground, getLocationButtonColor, getLocationTitle } from "../../utils/locationTheme";
import {
  preparePhotoUpload,
  revokePhotoPreview,
  uploadPhotoForGuildProof,
} from "../../api/photoApi";
import { useTodoVerification } from "../../hooks/useTodoVerification";
import {
  getCachedGuildQuests,
  photoProofGuildQuest,
  saveCachedGuildQuests,
} from "../../api/guildApi";

export default function TaskPhotoAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSubmitting, completeTodoByPhoto } = useTodoVerification();
  const mode = location.state?.mode === "guildQuest" ? "guildQuest" : "todo";
  const todoId = location.state?.todoId;
  const guildId = location.state?.guildId;
  const questId = location.state?.questId;
  const returnPath = location.state?.returnPath;
  const returnDate = location.state?.returnDate;
  const locationType = location.state?.locationType || "dungeon";
  const mapBackground = getLocationBackground(locationType);
  const buttonColor = getLocationButtonColor(locationType);
  const locationTitle = getLocationTitle(locationType);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadPayload, setUploadPayload] = useState(null);
  const [isGuildSubmitting, setIsGuildSubmitting] = useState(false);
  const isProcessing = isSubmitting || isGuildSubmitting;

  useEffect(() => {
    return () => {
      revokePhotoPreview(imagePreview);
    };
  }, [imagePreview]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const payload = preparePhotoUpload(file);
        revokePhotoPreview(imagePreview);
        setSelectedImage(file);
        setImagePreview(payload.previewUrl);
        setUploadPayload(payload);
      } catch (error) {
        console.error("이미지 처리 실패:", error);
        alert(error?.message || "이미지 처리에 실패했습니다.");
      }
    }
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput")?.click();
  };

  const handleAuthClick = async () => {
    if (!selectedImage || isProcessing) return;

    try {
      if (mode === "guildQuest") {
        if (!guildId || !questId) {
          alert("길드/퀘스트 정보가 없어 인증할 수 없습니다.");
          return;
        }
        setIsGuildSubmitting(true);
        const photoUrl = await uploadPhotoForGuildProof(uploadPayload ?? selectedImage);
        await photoProofGuildQuest(guildId, questId, photoUrl);

        const cachedQuests = getCachedGuildQuests(guildId);
        const updatedQuests = cachedQuests.map((quest) =>
          Number(quest?.id) === Number(questId)
            ? { ...quest, completed: true, status: "ONGOING" }
            : quest
        );
        saveCachedGuildQuests(guildId, updatedQuests);

        navigate(returnPath || `/guild/${guildId}`, {
          replace: true,
          state: {
            guildQuestPhotoProofUpdatedAt: Date.now(),
            guildQuestId: Number(questId),
          },
        });
        return;
      }

      if (!todoId) {
        alert("투두 ID가 없어 인증할 수 없습니다.");
        return;
      }

      await completeTodoByPhoto(todoId, uploadPayload ?? selectedImage);
      if (returnDate) {
        navigate(`/task-detail/${returnDate}`, {
          replace: true,
          state: {
            locationType,
            refreshedAt: Date.now(),
            verifiedTodoId: todoId,
          },
        });
      } else {
        navigate(-1);
      }
    } catch (error) {
      console.error("사진 인증 실패:", error);
      console.error("사진 인증 실패 응답:", error?.response?.status, error?.response?.data);
      alert(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "사진 인증에 실패했습니다."
      );
    } finally {
      setIsGuildSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* 배경 이미지 */}
      <div className={styles.backgroundImage}>
        <img src={mapBackground} alt="배경" />
      </div>

      <div className={styles.content}>
        {/* 헤더 */}
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={arrowLeftIcon} alt="뒤로가기" />
          </button>
          <h1 className={styles.headerTitle}>
            {mode === "guildQuest" ? "길드 퀘스트" : locationTitle}
          </h1>
        </div>

        {/* 사진 인증하기 제목 */}
        <div className={styles.sectionTitle}>사진 인증하기</div>

        {/* 사진 업로드 카드 */}
        <div className={styles.uploadCard} onClick={handleUploadClick}>
          {imagePreview ? (
            <div className={styles.imagePreview}>
              <img src={imagePreview} alt="업로드된 사진" />
              <button
                className={styles.removeButton}
                onClick={(e) => {
                  e.stopPropagation();
                  revokePhotoPreview(imagePreview);
                  setSelectedImage(null);
                  setImagePreview(null);
                  setUploadPayload(null);
                }}
              >
                X
              </button>
            </div>
          ) : (
            <>
              <div className={styles.uploadIcon}>
                <img src={uploadIcon} alt="업로드" />
              </div>
              <p className={styles.uploadText}>사진을 업로드해주세요.</p>
            </>
          )}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className={styles.fileInput}
          />
        </div>
      </div>

      {/* 하단 인증하기 버튼 */}
      <div className={styles.footer}>
        <button
          className={styles.authButton}
          onClick={handleAuthClick}
          disabled={!selectedImage || isProcessing}
          style={{ backgroundColor: buttonColor }}
        >
          {isProcessing ? "처리 중..." : "인증하기"}
        </button>
      </div>
    </div>
  );
}