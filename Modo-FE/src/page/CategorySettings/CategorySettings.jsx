import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import SkipModal from "../../components/Diagnosis/SkipModal";
import plusIcon from "../../assets/icon/plus.svg";
import rightIcon from "../../assets/Right icon.svg";
import styles from "./CategorySettings.module.css";

const INITIAL_CATEGORIES = {
  battle: [
    { id: 1, name: "과제" },
    { id: 2, name: "건강" },
    { id: 3, name: "아르바이트" },
  ],
  guild: [],
};

export default function CategorySettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("battle");
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsAddingCategory(false);
    setNewCategoryName("");
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  const handleDeleteClick = (categoryId, e) => {
    e.stopPropagation();
    if (editingCategoryId === categoryId) return;
    const category = categories[activeTab].find((c) => c.id === categoryId);
    if (category) {
      setSelectedCategory(category);
      setShowDeleteModal(true);
    }
  };

  const handleCategoryNameClick = (categoryId, categoryName) => {
    if (isAddingCategory) return;
    setEditingCategoryId(categoryId);
    setEditingCategoryName(categoryName);
  };

  const handleEditConfirm = (categoryId) => {
    if (editingCategoryName.trim()) {
      setCategories({
        ...categories,
        [activeTab]: categories[activeTab].map((c) =>
          c.id === categoryId
            ? { ...c, name: editingCategoryName.trim() }
            : c
        ),
      });
      setEditingCategoryId(null);
      setEditingCategoryName("");
    }
  };

  const handleEditCancel = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  const handleEditInputKeyPress = (e, categoryId) => {
    if (e.key === "Enter") {
      handleEditConfirm(categoryId);
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedCategory) {
      setCategories({
        ...categories,
        [activeTab]: categories[activeTab].filter(
          (c) => c.id !== selectedCategory.id
        ),
      });
      setShowDeleteModal(false);
      setSelectedCategory(null);
    }
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setSelectedCategory(null);
  };

  useEffect(() => {
    if (isAddingCategory && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingCategory]);

  useEffect(() => {
    if (editingCategoryId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingCategoryId]);

  const handleAddCategory = () => {
    if (editingCategoryId) {
      handleEditCancel();
    }
    setIsAddingCategory(true);
  };

  const handleAddConfirm = () => {
    if (newCategoryName.trim()) {
      const currentCategories = categories[activeTab];
      const maxId = currentCategories.length > 0 
        ? Math.max(...currentCategories.map(c => c.id))
        : 0;
      
      const newCategory = {
        id: maxId + 1,
        name: newCategoryName.trim(),
      };

      setCategories({
        ...categories,
        [activeTab]: [...currentCategories, newCategory],
      });
      setNewCategoryName("");
      setIsAddingCategory(false);
    }
  };

  const handleAddCancel = () => {
    setIsAddingCategory(false);
    setNewCategoryName("");
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddConfirm();
    } else if (e.key === "Escape") {
      handleAddCancel();
    }
  };

  return (
    <div className={styles.container}>
      <TopBar
        title="카테고리 설정"
        onBack={handleBack}
        showSkip={false}
        textColor="dark"
      />

      <div className={styles.content}>
        {/* 탭 */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "battle" ? styles.tabActive : ""
            }`}
            onClick={() => handleTabChange("battle")}
          >
            전투
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "guild" ? styles.tabActive : ""
            }`}
            onClick={() => handleTabChange("guild")}
          >
            길드
          </button>
        </div>

        {/* 카테고리 리스트 */}
        <div className={styles.categoryList}>
          {categories[activeTab].map((category) => (
            <div key={category.id} className={styles.categoryItem}>
              {editingCategoryId === category.id ? (
                <>
                  <input
                    ref={editInputRef}
                    type="text"
                    className={styles.categoryInput}
                    value={editingCategoryName}
                    onChange={(e) => setEditingCategoryName(e.target.value)}
                    onKeyDown={(e) => handleEditInputKeyPress(e, category.id)}
                  />
                  <div className={styles.addActions}>
                    <button
                      className={styles.confirmButton}
                      onClick={() => handleEditConfirm(category.id)}
                      disabled={!editingCategoryName.trim()}
                    >
                      확인
                    </button>
                    <button
                      className={styles.cancelButton}
                      onClick={handleEditCancel}
                    >
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span
                    className={styles.categoryName}
                    onClick={() => handleCategoryNameClick(category.id, category.name)}
                  >
                    {category.name}
                  </span>
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => handleDeleteClick(category.id, e)}
                  >
                    <img src={rightIcon} alt="삭제" className={styles.deleteIcon} />
                  </button>
                </>
              )}
            </div>
          ))}

          {/* 카테고리 추가 입력 필드 */}
          {isAddingCategory && (
            <div className={styles.categoryItem}>
              <input
                ref={inputRef}
                type="text"
                className={styles.categoryInput}
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={handleInputKeyPress}
                placeholder="카테고리 이름 입력"
              />
              <div className={styles.addActions}>
                <button
                  className={styles.confirmButton}
                  onClick={handleAddConfirm}
                  disabled={!newCategoryName.trim()}
                >
                  확인
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={handleAddCancel}
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 카테고리 추가 버튼 */}
        {!isAddingCategory && !editingCategoryId && (
          <button className={styles.addButton} onClick={handleAddCategory}>
            <img src={plusIcon} alt="추가" className={styles.addIcon} />
          </button>
        )}
      </div>

      {showDeleteModal && selectedCategory && (
        <SkipModal
          title="카테고리를 삭제하시겠습니까?"
          content={`${selectedCategory.name} 카테고리를 삭제하면 복구할 수 없어요.`}
          stopButtonText="삭제하기"
          continueButtonText="취소"
          onClose={handleDeleteModalClose}
          onStop={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

