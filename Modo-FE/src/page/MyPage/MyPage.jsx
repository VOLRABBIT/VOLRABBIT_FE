import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import Navbar from "../../components/Navbar/Navbar";
import SkipModal from "../../components/Diagnosis/SkipModal";
import ResultPage from "../Result/ResultPage";
import { PERSONA_DATA } from "../../data/personaData";
import styles from "./MyPage.module.css";
import adventurerCharacter from "../../assets/character/adventurer.png";
import graveRobberCharacter from "../../assets/character/graverobber.png";
import robotCharacter from "../../assets/character/robot.png";
import wizardCharacter from "../../assets/character/wizard.png";
import adventurerProfile from "../../assets/character/adventurer_profile.svg";
import graverobberProfile from "../../assets/character/graverobber_profile.svg";
import robotProfile from "../../assets/character/robot_profile.svg";
import wizardProfile from "../../assets/character/wizard_profile.svg";
import profileOutline from "../../assets/character/profile_outline.png";
import arrowRightIcon from "../../assets/arrow-right.svg";
import adventurerOverallType from "../../assets/icon/OverallType-adventurer.svg";
import graverobberOverallType from "../../assets/icon/OverallType-graverobber.svg";
import robotOverallType from "../../assets/icon/OverallType-robot.svg";
import wizardOverallType from "../../assets/icon/OverallType-wizard.svg";

const CHARACTERS = [
  { id: 0, name: "모험가", image: adventurerCharacter, profile: adventurerProfile, transform: "translateX(2px) translateY(3px)" },
  { id: 1, name: "도굴꾼", image: graveRobberCharacter, profile: graverobberProfile, transform: "translateY(13px)" },
  { id: 2, name: "로봇", image: robotCharacter, profile: robotProfile, transform: "translateY(9px)" },
  { id: 3, name: "마법사", image: wizardCharacter, profile: wizardProfile, transform: "translateY(0px)" },
];

const PERSONA_TYPES = {
  0: "모험을 찾는 탐험가",
  1: "보물을 찾는 도굴꾼",
  2: "완벽을 추구하는 로봇",
  3: "시간이 사라지는 마법사",
};

// 캐릭터 ID를 페르소나 타입으로 매핑
const CHARACTER_TO_PERSONA = {
  0: "Emotional Adventure", // 모험가
  1: "Attention-grave", // 도굴꾼
  2: "Starter-Freeze Bot", // 로봇
  3: "Time Wizard", // 마법사
};

// 캐릭터 ID를 OverallType 아이콘으로 매핑
const CHARACTER_TO_OVERALL_TYPE_ICON = {
  0: adventurerOverallType, // 모험가
  1: graverobberOverallType, // 도굴꾼
  2: robotOverallType, // 로봇
  3: wizardOverallType, // 마법사
};

export default function MyPage() {
  const navigate = useNavigate();
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [showResultPage, setShowResultPage] = useState(false);
  const [currentCharacterId, setCurrentCharacterId] = useState(3); // 기본값: 마법사
  const [nickname, setNickname] = useState("identity"); // 기본 닉네임

  const handleBack = () => {
    navigate(-1);
  };

  const handleProfileClick = () => {
    setShowSkipModal(true);
  };

  const handleSkipModalClose = () => {
    setShowSkipModal(false);
  };

  const handleChangeConfirm = () => {
    setShowSkipModal(false);
    navigate("/character-select");
  };

  const currentCharacter = CHARACTERS.find((char) => char.id === currentCharacterId) || CHARACTERS[0];
  const personaType = CHARACTER_TO_PERSONA[currentCharacterId];
  const personaData = PERSONA_DATA[personaType] || PERSONA_DATA["Starter-Freeze Bot"];

  const menuItems = [
    { id: "type", label: "나의 유형 확인하기", path: "/result" },
    { id: "diagnosis", label: "심화 진단하기", path: "/advanced-diagnosis" },
    { id: "guild", label: "길드 관리하기", path: "/guild/manage" },
    { id: "report", label: "나의 리포트", path: "/report" },
    { id: "category", label: "카테고리 설정하기", path: "/category-settings" },
    { id: "pause", label: "일시정지", path: "/pause" },
    { id: "nfc", label: "NFC 태그 설정하기", path: "/nfc-settings" },
  ];

  const handleMenuClick = (path, id) => {
    if (id === "type") {
      // 나의 유형 확인하기 클릭 시 결과 페이지 표시
      setShowResultPage(true);
    } else {
      navigate(path);
    }
  };

  const handleResultPageClose = () => {
    setShowResultPage(false);
  };

  // 결과 페이지가 표시되면 ResultPage만 렌더링
  if (showResultPage) {
    const overallTypeIcon = CHARACTER_TO_OVERALL_TYPE_ICON[currentCharacterId];
    return (
      <ResultPage
        personaData={personaData}
        buttonImage={overallTypeIcon}
        onButtonClick={() => navigate("/all-types")}
      />
    );
  }

  return (
    <div className={styles.container}>
      <TopBar
        title="마이페이지"
        onBack={handleBack}
        showSkip={false}
        textColor="dark"
      />
      
      <div className={styles.content}>
        {/* 프로필 섹션 */}
        <div className={styles.profileSection}>
          <div 
            className={styles.avatarContainer}
            style={{ backgroundImage: `url(${profileOutline})` }}
            onClick={handleProfileClick}
          >
            <img 
              src={currentCharacter.profile} 
              alt="프로필 캐릭터" 
              className={styles.avatar}
              style={{ transform: currentCharacter.transform }}
            />
          </div>
          <div className={styles.profileInfo}>
            <h2 className={styles.identity}>{nickname}</h2>
            <p className={styles.subtitle}>{PERSONA_TYPES[currentCharacterId]}</p>
          </div>
        </div>

        {/* 메뉴 리스트 */}
        <div className={styles.menuList}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={styles.menuItem}
              onClick={() => handleMenuClick(item.path, item.id)}
            >
              <span className={styles.menuLabel}>{item.label}</span>
              <img 
                src={arrowRightIcon} 
                alt="이동" 
                className={styles.menuArrow}
              />
            </div>
          ))}
        </div>
      </div>

      <Navbar activeItem="mypage" />

      {showSkipModal && (
        <SkipModal
          title="선택권을 사용하시겠습니까?"
          content="캐릭터 변경권을 1개 소진하여,<br></br> 원하는 캐릭터로 변경을 진행합니다."
          stopButtonText="변경하기"
          continueButtonText="취소"
          onClose={handleSkipModalClose}
          onStop={handleChangeConfirm}
        />
      )}
    </div>
  );
}
