import { useState } from "react";

import styles from "./ResultPage.module.css";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import RadarChart from "../../components/RadarChart/RadarChart";

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

const ResultPage = ({ personaData, onStartAdventure }) => {
  const [expandedStats, setExpandedStats] = useState(false);

  // 스탯별 분석 섹션 확장/축소 토글
  const toggleStats = () => {
    setExpandedStats(!expandedStats);
  };

  const buttonIcon = BUTTON_ICONS[personaData.id] || robotButtonIcon;
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

  return (
    <div className={styles.resultWrapper}>
      <div className={styles.resultContent}>
        {/* 결과 헤더 (제목, 해시태그) */}
        <div className={styles.resultHeader}>
          <h1 className={styles.resultTitle}>{personaData.title}</h1>
          <p className={styles.resultHashtag}>{personaData.hashtag}</p>
        </div>

        {/* 캐릭터 이미지 영역 */}
        <div className={styles.characterSection}>
          <img
            src={personaData.character}
            className={`${styles.resultCharacter} ${getCharacterSizeClass()}`}
          />
        </div>

        {/* 레이더 차트 영역 */}
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
                {personaData.stats.map((stat, index) => (
                  <div key={index} className={styles.statItem}>
                    <div className={styles.statHeader}>
                      <div className={styles.statName}>
                        {stat.name} ({stat.nameEn})
                      </div>
                      <StatusBadge type={stat.levelType}>
                        {stat.level}
                      </StatusBadge>
                    </div>
                    <div className={styles.subStatsList}>
                      {stat.subStats.map((subStat, subIndex) => (
                        <div key={subIndex} className={styles.subStatItem}>
                          <div className={styles.subStatNameBox}>
                            <div className={styles.subStatName}>{subStat.name}</div>
                          </div>
                          <p className={styles.subStatDescription}>
                            {subStat.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.divider}></div>

        {/* 추천 항목 영역 */}
        <div className={styles.recommendationsSection}>
          <div className={styles.recommendationsTitle}>
            {personaData.characterName}에게 추천하는{" "}
            {personaData.id === "Time Wizard" ? "주문" : personaData.id === "Starter-Freeze Bot" ? "마법" : "아이템"}
          </div>
          <div className={styles.recommendationsContainer}>
            <div className={styles.recommendationsList}>
              {personaData.recommendations.map((rec, index) => (
                <div key={index} className={styles.recommendationItem}>
                  <div className={styles.recommendationTitleBox}>
                    <div className={styles.recommendationTitle}>{rec.title}</div>
                  </div>
                  <p className={styles.recommendationDescription}>
                    {rec.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 영역 (모험 시작) */}
      <div className={styles.bottomButtonContainer}>
        <img
          src={buttonIcon}
          className={styles.adventureButton}
          onClick={onStartAdventure}
        />
      </div>
    </div>
  );
};

export default ResultPage;

