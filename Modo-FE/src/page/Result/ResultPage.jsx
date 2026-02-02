// React & 라우터
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// API
import { getPersonaAnalysis } from "../../api/apiStore";

// 컴포넌트
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import RadarChart from "../../components/RadarChart/RadarChart";

// 스타일
import styles from "./ResultPage.module.css";

// 에셋 - 아이콘
import arrowDownIcon from "../../assets/icon/arrow-down.svg";
import arrowUpIcon from "../../assets/icon/arrow-up.svg";
import robotButtonIcon from "../../assets/icon/Button-robot.svg";
import adventurerButtonIcon from "../../assets/icon/Button-adventurer.svg";
import graveButtonIcon from "../../assets/icon/Button-grave robber.svg";
import wizardButtonIcon from "../../assets/icon/Button-wizard.svg";

// 캐릭터별 버튼 아이콘 매핑
const BUTTON_ICONS = {
  "Time Wizard": wizardButtonIcon,
  "Starter-Freeze Bot": robotButtonIcon,
  "Attention-grave": graveButtonIcon,
  "Emotional Adventure": adventurerButtonIcon,
};

// 캐릭터별 레이더 차트 색상 매핑
const RADAR_CHART_COLORS = {
  "Time Wizard": {
    fill: "rgba(187, 144, 221, 0.50)",
    stroke: "#BB90DD",
  },
  "Starter-Freeze Bot": {
    fill: "rgba(125, 167, 219, 0.50)",
    stroke: "#7DA7DB",
  },
  "Attention-grave": {
    fill: "rgba(116, 179, 170, 0.50)",
    stroke: "#74B3AA",
  },
  "Emotional Adventure": {
    fill: "rgba(253, 160, 105, 0.50)",
    stroke: "#FDA069",
  },
};

const RECOMMENDATION_BOX_COLORS = {
  "Time Wizard": "rgba(187, 144, 221, 0.20)", 
  "Starter-Freeze Bot": "rgba(125, 167, 219, 0.20)",
  "Attention-grave": "rgba(116, 179, 170, 0.20)", 
  "Emotional Adventure": "rgba(253, 160, 105, 0.20)",
};

/** statLevel(숫자) → level 텍스트 & levelType */
function statLevelToDisplay(statLevel) {
  if (statLevel === 0 || statLevel === 1) return { level: "낮음", levelType: "low" };
  if (statLevel === 2) return { level: "보통", levelType: "normal" };
  return { level: "높음", levelType: "high" };
}

/**
 * @param {"onboarding" | "allTypes"} [variant="onboarding"] - 온보딩 결과 페이지(모험 떠나기) | 전체 유형 확인하기 페이지
 * @param {number} [personaId] - 서버에서 받은 personaId (분석 조회용)
 */
const ResultPage = ({ personaData: propPersonaData, buttonImage, onButtonClick, variant = "onboarding", personaId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedStats, setExpandedStats] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [characterImageError, setCharacterImageError] = useState(false);

  // location state에서 personaData를 가져오거나 props에서 가져옴
  const personaData = location.state?.personaData || propPersonaData;

  // 분석 데이터 변경 시 이미지 에러 상태 초기화
  useEffect(() => {
    setCharacterImageError(false);
  }, [analysisData, personaId]);

  // personaId가 있으면 GET /api/personas/{personaId}/analysis 조회
  useEffect(() => {
    if (personaId == null) return;
    setAnalysisLoading(true);
    getPersonaAnalysis(personaId)
      .then((res) => setAnalysisData(res?.data ?? null))
      .catch(() => setAnalysisData(null))
      .finally(() => {
        setAnalysisLoading(false);
      });
  }, [personaId]);

  // personaData가 없으면 이전 페이지로 이동
  if (!personaData) {
    navigate(-1);
    return null;
  }

  // 스탯별 분석 섹션 확장/축소 토글
  const toggleStats = () => {
    setExpandedStats(!expandedStats);
  };

  // buttonImage가 없으면 기본 버튼 아이콘 사용 (하위 호환성)
  const buttonIcon = buttonImage || BUTTON_ICONS[personaData.id] || robotButtonIcon;
  const radarChartColor = RADAR_CHART_COLORS[personaData.id] || RADAR_CHART_COLORS["Starter-Freeze Bot"];

  // 캐릭터별 사이즈 매핑
  const getCharacterSizeClass = () => {
    const sizeMap = {
      "Emotional Adventure": styles.character0,
      "Attention-grave": styles.character1,
      "Starter-Freeze Bot": styles.character2,
      "Time Wizard": styles.character3,
    };
    return sizeMap[personaData.id];
  };

  const useApiData = !!analysisData;
  const title = useApiData ? analysisData.name : personaData.id;
  const hashtag = useApiData ? analysisData.hashtag : (personaData.hashtag ?? "");
  const characterSrc =
    useApiData && analysisData.iconUrl && !characterImageError
      ? analysisData.iconUrl
      : personaData.character;
  const recommendationSuffix = useApiData && analysisData.recommendation?.recommendationSuffix
    ? analysisData.recommendation.recommendationSuffix
    : personaData.id === "Time Wizard"
      ? "주문"
      : personaData.id === "Starter-Freeze Bot"
        ? "마법"
        : personaData.id === "Attention-grave"
          ? "아이템"
          : "장소"; 

  if (personaId != null && analysisLoading) {
    return (
      <div className={styles.resultWrapper} style={{ padding: 24, textAlign: "center" }}>
        <p>결과를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className={styles.resultWrapper}>
      <div className={styles.resultContent}>
        {/* 결과 헤더 (제목, 해시태그) */}
        <div className={styles.resultHeader}>
          <h1 className={styles.resultTitle}>{title}</h1>
          <p className={styles.resultHashtag}>{hashtag}</p>
        </div>

        {/* 캐릭터 이미지 영역 */}
        <div className={styles.characterSection}>
          <img
            src={characterSrc}
            className={`${styles.resultCharacter} ${getCharacterSizeClass()}`}
            alt=""
            onError={() => setCharacterImageError(true)}
          />
        </div>

        {/* 레이더 차트 영역 (API 응답에는 없음 → 기존 personaData 사용) */}
        <div className={styles.radarChartContainer}>
          <div className={styles.radarChartSection}>
            <RadarChart
              data={personaData.radarData}
              size={280}
              fillColor={radarChartColor.fill}
              strokeColor={radarChartColor.stroke}
            />
          </div>

          <div className={styles.disclaimer}>
            본 검사는 성인 ADHD 진단 검사의 일부로, 보다 명확한 진단은 가까운 병원을 방문하시어 별도의 검사를 진행하시기 바랍니다.
          </div>
        </div>

        {/* 스탯별 분석 영역 */}
        <div className={styles.statsSection}>
          <button className={styles.statsToggle} onClick={toggleStats}>
            <span className={styles.statsTitle}>스탯별 분석</span>
            <img
              src={expandedStats ? arrowUpIcon : arrowDownIcon}
              className={styles.statsToggleIcon}
            />
          </button>

          {expandedStats && (
            <div className={styles.statsContainer}>
              <div className={styles.statsList}>
                {(useApiData && analysisData.statAnalyses
                  ? analysisData.statAnalyses.map((stat, index) => {
                      const { level, levelType } = statLevelToDisplay(stat.statLevel);
                      return (
                        <div key={index} className={styles.statItem}>
                          <div className={styles.statHeader}>
                            <div className={styles.statName}>
                              {stat.statKor} ({stat.statEng})
                            </div>
                            <StatusBadge type={levelType}>{level}</StatusBadge>
                          </div>
                          <div className={styles.subStatsList}>
                            {(stat.statDetails || []).map((subStat, subIndex) => (
                              <div key={subIndex} className={styles.subStatItem}>
                                <div className={styles.subStatNameBox}>
                                  <div className={styles.subStatName}>{subStat.title}</div>
                                </div>
                                <p className={styles.subStatDescription}>{subStat.detail}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  : (personaData.stats || []).map((stat, index) => (
                      <div key={index} className={styles.statItem}>
                        <div className={styles.statHeader}>
                          <div className={styles.statName}>
                            {stat.name} ({stat.nameEn})
                          </div>
                          <StatusBadge type={stat.levelType}>{stat.level}</StatusBadge>
                        </div>
                        <div className={styles.subStatsList}>
                          {stat.subStats.map((subStat, subIndex) => (
                            <div key={subIndex} className={styles.subStatItem}>
                              <div className={styles.subStatNameBox}>
                                <div className={styles.subStatName}>{subStat.name}</div>
                              </div>
                              <p className={styles.subStatDescription}>{subStat.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.divider}></div>

        {/* 추천 항목 영역 */}
        <div className={styles.recommendationsSection}>
          <div className={styles.recommendationsTitle}>
            {useApiData ? analysisData.name : personaData.id}에게 추천하는 {recommendationSuffix}
          </div>
          <div className={styles.recommendationsContainer}>
            <div className={styles.recommendationsList}>
              {(useApiData && analysisData.recommendation?.recommendationItems
                ? analysisData.recommendation.recommendationItems.map((rec, index) => (
                    <div key={index} className={styles.recommendationItem}>
                      <div
                        className={styles.recommendationTitleBox}
                        style={{
                          background: RECOMMENDATION_BOX_COLORS[personaData.id] || RECOMMENDATION_BOX_COLORS["Starter-Freeze Bot"],
                        }}
                      >
                        <div className={styles.recommendationTitle}>{rec.title}</div>
                      </div>
                      <p className={styles.recommendationDescription}>{rec.detail}</p>
                    </div>
                  ))
                : (personaData.recommendations || []).map((rec, index) => (
                    <div key={index} className={styles.recommendationItem}>
                      <div
                        className={styles.recommendationTitleBox}
                        style={{
                          background: RECOMMENDATION_BOX_COLORS[personaData.id] || RECOMMENDATION_BOX_COLORS["Starter-Freeze Bot"],
                        }}
                      >
                        <div className={styles.recommendationTitle}>{rec.title}</div>
                      </div>
                      <p className={styles.recommendationDescription}>{rec.description}</p>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div
        className={`${styles.bottomButtonContainer} ${
          variant === "onboarding" ? styles.bottomButtonContainerOnboarding : styles.bottomButtonContainerAllTypes
        }`}
      >
        <img
          src={buttonIcon}
          className={styles.adventureButton}
          onClick={onButtonClick || (() => navigate("/all-types"))}
          alt="버튼"
        />
      </div>
    </div>
  );
};

export default ResultPage;

