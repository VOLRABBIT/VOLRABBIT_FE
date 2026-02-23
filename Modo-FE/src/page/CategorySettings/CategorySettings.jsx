import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import SkipModal from "../../components/Diagnosis/SkipModal";
import plusIcon from "../../assets/icon/plus.svg";
import rightIcon from "../../assets/Right icon.svg";
import styles from "./CategorySettings.module.css";
import { getCategories, createCategory, deleteCategory } from "../../api/apiStore";

const INITIAL_CATEGORIES = { battle: [], guild: [] };

function mapCategoryItem(c, index) {
  return {
    id: c.categoryId ?? c.id ?? index + 1,
    name: c.name ?? c.categoryName ?? "",
    active: c.active ?? true,
  };
}

function normalizeCategoriesResponse(data) {
  if (!data || typeof data !== "object") return INITIAL_CATEGORIES;
  if (Array.isArray(data.battle) || Array.isArray(data.guild)) {
    return {
      battle: Array.isArray(data.battle) ? data.battle.map(mapCategoryItem) : [],
      guild: Array.isArray(data.guild) ? data.guild.map(mapCategoryItem) : [],
    };
  }
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.data) ? data.data
    : Array.isArray(data?.content) ? data.content
    : Array.isArray(data?.categories) ? data.categories
    : [];
  return { battle: list.map(mapCategoryItem), guild: [] };
}

export default function CategorySettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("battle");
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [mutateLoading, setMutateLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  const loadCategories = () => {
    setCategoriesError(null);
    return getCategories()
      .then((data) => {
        setCategories(normalizeCategoriesResponse(data));
        return data;
      })
      .catch((err) => {
        setCategoriesError(err?.message ?? "카테고리 조회 실패");
        setCategories(INITIAL_CATEGORIES);
      });
  };

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
  };

  const handleEditConfirm = async (categoryId) => {
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

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    setMutateLoading(true);
    try {
      await deleteCategory(selectedCategory.id);
      await loadCategories();
      setShowDeleteModal(false);
      setSelectedCategory(null);
    } catch (err) {
      console.error("[CategorySettings] 카테고리 삭제 실패:", err?.response?.data ?? err?.message);
      alert(err?.response?.data?.message ?? err?.message ?? "카테고리 삭제에 실패했어요.");
    } finally {
      setMutateLoading(false);
    }
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setSelectedCategory(null);
  };

  // 카테고리 목록 API 조회
  useEffect(() => {
    let cancelled = false;
    setCategoriesLoading(true);
    getCategories()
      .then((data) => {
        if (!cancelled) setCategories(normalizeCategoriesResponse(data));
      })
      .catch((err) => {
        if (!cancelled) {
          setCategoriesError(err?.message ?? "카테고리 조회 실패");
          setCategories(INITIAL_CATEGORIES);
        }
      })
      .finally(() => {
        if (!cancelled) setCategoriesLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

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

  const handleAddConfirm = async () => {
    if (!newCategoryName.trim()) return;
    setMutateLoading(true);
    try {
      await createCategory({ name: newCategoryName.trim() });
      await loadCategories();
      setNewCategoryName("");
      setIsAddingCategory(false);
    } catch (err) {
      console.error("[CategorySettings] 카테고리 추가 실패:", err?.response?.data ?? err?.message);
      alert(err?.response?.data?.message ?? err?.message ?? "카테고리 추가에 실패했어요.");
    } finally {
      setMutateLoading(false);
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
          {categoriesLoading && (
            <div style={{ padding: "12px", color: "#666" }}>카테고리 불러오는 중...</div>
          )}
          {!categoriesLoading && categoriesError && (
            <div style={{ padding: "12px", color: "#c00" }}>{categoriesError}</div>
          )}
          {!categoriesLoading && !categoriesError && categories[activeTab].length === 0 && (
            <div style={{ padding: "12px", color: "#666" }}>등록된 카테고리가 없어요.</div>
          )}
          {!categoriesLoading && categories[activeTab].map((category) => (
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
                      disabled={!editingCategoryName.trim() || mutateLoading}
                    >
                      {mutateLoading ? "저장 중..." : "확인"}
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
                  <span className={styles.categoryName}>
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
                  disabled={!newCategoryName.trim() || mutateLoading}
                >
                  {mutateLoading ? "저장 중..." : "확인"}
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
          stopButtonText={mutateLoading ? "삭제 중..." : "삭제하기"}
          continueButtonText="취소"
          onClose={handleDeleteModalClose}
          onStop={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
