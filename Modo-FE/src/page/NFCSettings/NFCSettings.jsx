import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import SkipModal from "../../components/Diagnosis/SkipModal";
import nfcIcon from "../../assets/tabler_nfc.svg";
import rightIcon from "../../assets/Right icon.svg";
import plusIcon from "../../assets/icon/plus.svg";
import styles from "./NFCSettings.module.css";

const STORAGE_KEY = "nfc_tags";

export default function NFCSettings() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tags, setTags] = useState(() => {
    // localStorage에서 초기 태그 목록 로드
    const savedTags = localStorage.getItem(STORAGE_KEY);
    return savedTags ? JSON.parse(savedTags) : [];
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const processedKeysRef = useRef(new Set());

  // localStorage에 태그 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    // 등록 페이지에서 새 태그가 전달된 경우에만 추가
    const newTag = location.state?.newTag;
    if (newTag && location.key && !processedKeysRef.current.has(location.key)) {
      processedKeysRef.current.add(location.key);
      queueMicrotask(() => {
        setTags((prevTags) => {
          // 이미 같은 ID의 태그가 있는지 확인
          const exists = prevTags.some((tag) => tag.id === newTag.id);
          if (!exists) {
            return [...prevTags, newTag];
          }
          return prevTags;
        });
        // state 제거 (replace: true로 navigate하여 state만 제거)
        navigate(location.pathname, { replace: true, state: null });
      });
    }
  }, [location.key, location.state, navigate, location.pathname]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRegister = () => {
    navigate("/nfc-register");
  };

  const handleDeleteClick = (tag) => {
    setSelectedTag(tag);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedTag) {
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== selectedTag.id));
      setShowDeleteModal(false);
      setSelectedTag(null);
    }
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setSelectedTag(null);
  };

  return (
    <div className={styles.container}>
      <TopBar
        title="NFC 태그 설정"
        onBack={handleBack}
        showSkip={false}
        textColor="dark"
      />

      <div className={`${styles.content} ${tags.length === 0 ? styles.contentCentered : ''}`}>
        {tags.length === 0 ? (
          /* 빈 상태 카드 */
          <div className={styles.emptyStateCard}>
            <div className={styles.nfcIconContainer}>
              <img src={nfcIcon} alt="NFC" className={styles.nfcIcon} />
            </div>
            <p className={styles.emptyStateText}>
              등록되어 있는 태깅이 없어요.<br />
              등록하기를 클릭해 태깅을 설정하세요.
            </p>
          </div>
        ) : (
          /* 태그 리스트 */
          <div className={styles.tagList}>
            {tags.map((tag) => (
              <div key={tag.id} className={styles.tagItem}>
                <span className={styles.tagName}>{tag.name}</span>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteClick(tag)}
                >
                  <img src={rightIcon} alt="삭제" className={styles.deleteIcon} />
                </button>
              </div>
            ))}
            
            {/* 플러스 버튼 */}
            <button className={styles.addButton} onClick={handleRegister}>
              <img src={plusIcon} alt="추가" className={styles.addIcon} />
            </button>
          </div>
        )}
      </div>

      {/* 등록하기 버튼 (태그가 없을 때만 표시) */}
      {tags.length === 0 && (
        <div className={styles.footer}>
          <button className={styles.registerButton} onClick={handleRegister}>
            등록하기
          </button>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <SkipModal
          title="태그 삭제하기"
          content={`'${selectedTag?.name}' 태그를 삭제하시겠습니까?`}
          stopButtonText="삭제하기"
          continueButtonText="취소"
          onClose={handleDeleteModalClose}
          onStop={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

