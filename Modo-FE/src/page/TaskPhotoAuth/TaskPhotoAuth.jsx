import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TaskPhotoAuth.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import uploadIcon from "../../assets/map/upload.svg";
import { getLocationBackground, getLocationButtonColor, getLocationTitle } from "../../utils/locationTheme";

export default function TaskPhotoAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const taskTitle = location.state?.taskTitle || "";
  const locationType = location.state?.locationType || "dungeon";
  const mapBackground = getLocationBackground(locationType);
  const buttonColor = getLocationButtonColor(locationType);
  const locationTitle = getLocationTitle(locationType);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput")?.click();
  };

  const handleAuthClick = () => {
    if (selectedImage) {
      navigate(-1);
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
          <h1 className={styles.headerTitle}>{locationTitle}</h1>
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
                  setSelectedImage(null);
                  setImagePreview(null);
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
          disabled={!selectedImage}
          style={{ backgroundColor: buttonColor }}
        >
          인증하기
        </button>
      </div>
    </div>
  );
}

