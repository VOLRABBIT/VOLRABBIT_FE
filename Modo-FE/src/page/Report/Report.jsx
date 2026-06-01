import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Report.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import arrowRightIcon from "../../assets/arrow-right.svg";
import purpleCheckIcon from "../../assets/purple_check.svg";
import { WEEKLY_REPORT_DATA, MONTHLY_REPORT_DATA } from "../../data/reportData";

export default function Report() {
  // State 및 Refs
  const navigate = useNavigate();
  const [periodType, setPeriodType] = useState("주간");
  const [currentPeriod] = useState("2025년 10월 1주차");
  // TODO: 실제 사용자 캐릭터 ID로 교체 필요
  const [userCharacterId] = useState(0);
  
  const abandonBubbleChartRef = useRef(null);
  const failureBubbleChartRef = useRef(null);
  const [abandonChartDimensions, setAbandonChartDimensions] = useState({ width: 303, height: 234 });
  const [failureChartDimensions, setFailureChartDimensions] = useState({ width: 303, height: 234 });
  
  // 버블 차트 컨테이너 크기 추적: 리사이즈 시 버블 위치 재계산을 위해 사용
  useEffect(() => {
    const updateDimensions = () => {
      if (abandonBubbleChartRef.current) {
        const rect = abandonBubbleChartRef.current.getBoundingClientRect();
        setAbandonChartDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
      if (failureBubbleChartRef.current) {
        const rect = failureBubbleChartRef.current.getBoundingClientRect();
        setFailureChartDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // 데이터 계산
  const currentData = useMemo(() => {
    return periodType === "주간" ? WEEKLY_REPORT_DATA : MONTHLY_REPORT_DATA;
  }, [periodType]);

  // 차트 계산 함수
  const calculateBubbleSize = useCallback((value, maxValue, minSize = 50, maxSize = 90) => {
    const ratio = value / maxValue;
    return minSize + (maxSize - minSize) * ratio;
  }, []);

  // 버블 차트 위치 계산: 3개 버블을 고정 위치에 배치하고 컨테이너 경계를 넘지 않도록 보정
  const calculateAllBubblePositions = useCallback((bubbles, dimensions) => {
    const maxValue = Math.max(...bubbles.map(b => b.value));
    const chartHeight = dimensions.height;
    const availableWidth = dimensions.width;
    const padding = 20;
    
    const usableHeight = chartHeight - (padding * 2);
    const usableWidth = availableWidth - (padding * 2);
    
    const bubbleData = bubbles.map(b => {
      const size = calculateBubbleSize(b.value, maxValue);
      return {
        size: size,
        radius: size / 2,
      };
    });
    
    if (bubbleData.length === 3) {
      const [first, second, third] = bubbleData;
      
      const x1 = 26 + first.radius;
      const y1 = 26 + first.radius;
      const x2 = availableWidth - padding - second.radius - 10;
      const y2 = padding + usableHeight * 0.25;
      const x3 = padding + usableWidth * 0.55;
      const y3 = padding + usableHeight * 0.75;
      
      const containerBottom = chartHeight - padding;
      const containerRight = availableWidth - padding;
      
      let finalX1 = Math.min(x1, containerRight - first.radius);
      let finalY1 = Math.min(y1, containerBottom - first.radius);
      finalX1 = Math.max(padding + first.radius, finalX1);
      finalY1 = Math.max(padding + first.radius, finalY1);
      
      let finalX2 = Math.min(x2, containerRight - second.radius);
      let finalY2 = Math.min(y2, containerBottom - second.radius);
      finalX2 = Math.max(padding + second.radius, finalX2);
      finalY2 = Math.max(padding + second.radius, finalY2);
      
      let finalX3 = Math.min(x3, containerRight - third.radius);
      let finalY3 = Math.min(y3, containerBottom - third.radius);
      finalX3 = Math.max(padding + third.radius, finalX3);
      finalY3 = Math.max(padding + third.radius, finalY3);
      
      return [
        { left: `${finalX1}px`, top: `${finalY1}px`, transform: 'translate(-50%, -50%)', size: first.size },
        { left: `${finalX2}px`, top: `${finalY2}px`, transform: 'translate(-50%, -50%)', size: second.size },
        { left: `${finalX3}px`, top: `${finalY3}px`, transform: 'translate(-50%, -50%)', size: third.size }
      ];
    }
    
    return [];
  }, [calculateBubbleSize]);

  // Event Handlers
  const handleBack = () => {
    navigate(-1);
  };

  const handlePeriodPrev = () => {
    console.log("이전 기간");
  };

  const handlePeriodNext = () => {
    console.log("다음 기간");
  };

  const handlePeriodTypeChange = (type) => {
    setPeriodType(type);
  };

  // Memoized Values
  const sortedAbandonReasons = useMemo(() => {
    return [...currentData.abandonReasons].sort((a, b) => b.value - a.value);
  }, [currentData]);

  const sortedFailureReasons = useMemo(() => {
    return [...currentData.failureReasons].sort((a, b) => b.value - a.value);
  }, [currentData]);

  const abandonBubblePositions = useMemo(() => {
    return calculateAllBubblePositions(sortedAbandonReasons, abandonChartDimensions);
  }, [sortedAbandonReasons, abandonChartDimensions, calculateAllBubblePositions]);

  const failureBubblePositions = useMemo(() => {
    return calculateAllBubblePositions(sortedFailureReasons, failureChartDimensions);
  }, [sortedFailureReasons, failureChartDimensions, calculateAllBubblePositions]);

  // 도넛 차트 계산: 세그먼트 간 고정 간격을 유지하며 percentage에 따라 세그먼트 길이 계산
  const calculateDonutChart = (battleTypes) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const fixedGapLength = 5;
    
    const totalGaps = fixedGapLength * battleTypes.length;
    const availableLength = circumference - totalGaps;
    
    let currentOffset = 0;
    
    return battleTypes.map((type) => {
      const segmentLength = (type.percentage / 100) * availableLength;
      const currentGap = fixedGapLength;
      const gap = circumference - segmentLength;
      
      const result = {
        name: type.name,
        color: type.color,
        percentage: type.percentage,
        strokeDasharray: `${segmentLength} ${gap}`,
        strokeDashoffset: -currentOffset,
      };
      
      currentOffset += segmentLength + currentGap;
      
      return result;
    });
  };

  const donutChartData = useMemo(() => {
    return calculateDonutChart(currentData.battleTypes);
  }, [currentData]);

  // Render
  return (
    <div className={styles.container}>
      <TopBar
        title="나의 리포트"
        onBack={handleBack}
        showSkip={false}
        textColor="dark"
      />

      <div className={styles.content}>
        {/* 주간/월간 토글 */}
        <div className={styles.periodToggle}>
          <button
            className={`${styles.toggleButton} ${periodType === "주간" ? styles.toggleButtonActive : ""}`}
            onClick={() => handlePeriodTypeChange("주간")}
          >
            주간
          </button>
          <button
            className={`${styles.toggleButton} ${periodType === "월간" ? styles.toggleButtonActive : ""}`}
            onClick={() => handlePeriodTypeChange("월간")}
          >
            월간
          </button>
        </div>

        {/* 기간 선택기 */}
        <div className={styles.periodSelector}>
          <button className={styles.periodArrow} onClick={handlePeriodPrev}>
            <img src={arrowLeftIcon} alt="이전" />
          </button>
          <span className={styles.periodText}>{currentPeriod}</span>
          <button className={styles.periodArrow} onClick={handlePeriodNext}>
            <img src={arrowRightIcon} alt="다음" />
          </button>
        </div>

        {/* 리포트 콘텐츠 영역 */}
        <div className={styles.reportContent}>
        {/* 통계 카드 (총 전투, 승률, 전투 포기, 전투 실패) */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statCardOrange}`}>
            <div className={styles.statLabel}>총 전투</div>
            <div className={styles.statValue}>{currentData.stats.totalBattles}</div>
          </div>
          <div className={`${styles.statCard} ${styles.statCardTeal}`}>
            <div className={styles.statLabel}>승률</div>
            <div className={styles.statValue}>{currentData.stats.winRate}%</div>
          </div>
          <div className={`${styles.statCard} ${styles.statCardPurple}`}>
            <div className={styles.statLabel}>전투 포기</div>
            <div className={styles.statValue}>{currentData.stats.battlesAbandoned}</div>
          </div>
          <div className={`${styles.statCard} ${styles.statCardLightBlue}`}>
            <div className={styles.statLabel}>전투 실패</div>
            <div className={styles.statValue}>{currentData.stats.battlesFailed}</div>
          </div>
        </div>

        {/* 다시 진행한 전투 카드 (Adventurer 타입만 표시) */}
        {userCharacterId === 0 && currentData.resumedBattles !== undefined && (
          <div className={styles.resumedBattlesCard}>
            <span className={styles.resumedBattlesLabel}>다시 진행한 전투</span>
            <span className={styles.resumedBattlesValue}>{currentData.resumedBattles}</span>
          </div>
        )}

        {/* 전투 유형 도넛 차트 */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>전투 유형</h3>
          <div className={styles.donutChart}>
            <div className={styles.donutChartVisual}>
              <svg viewBox="0 0 120 120" className={styles.donutChartSvg}>
                {donutChartData.map((type) => (
                  <circle
                    key={type.name}
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={type.color}
                    strokeWidth="20"
                    strokeDasharray={type.strokeDasharray}
                    strokeDashoffset={type.strokeDashoffset}
                    strokeLinecap="butt"
                    transform="rotate(-90 60 60)"
                  />
                ))}
              </svg>
            </div>
            <div className={styles.chartLegend}>
              {currentData.battleTypes.map((type) => (
                <div key={type.name} className={styles.legendItem}>
                  <span 
                    className={styles.legendDot}
                    style={{ backgroundColor: type.color }}
                  ></span>
                  <div className={styles.legendContent}>
                    <span className={styles.legendText}>{type.name}</span>
                    <span className={styles.legendPercent}>{type.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 포기 사유 버블 차트 */}
        <div className={styles.bubbleChartCard}>
          <h3 className={styles.chartTitle}>포기 사유</h3>
          <div className={styles.bubbleChart} ref={abandonBubbleChartRef}>
            {sortedAbandonReasons.map((reason, index) => {
              const position = abandonBubblePositions[index];
              return (
                <div
                  key={reason.text}
                  className={styles.bubble}
                  style={{
                    width: `${position.size}px`,
                    height: `${position.size}px`,
                    ...position,
                  }}
                >
                  {reason.text}
                </div>
              );
            })}
          </div>
        </div>

        {/* 실패 사유 버블 차트 */}
        <div className={styles.bubbleChartCard}>
          <h3 className={styles.chartTitle}>실패 사유</h3>
          <div className={styles.bubbleChart} ref={failureBubbleChartRef}>
            {sortedFailureReasons.map((reason, index) => {
              const position = failureBubblePositions[index];
              return (
                <div
                  key={reason.text}
                  className={styles.bubble}
                  style={{
                    width: `${position.size}px`,
                    height: `${position.size}px`,
                    ...position,
                  }}
                >
                  {reason.text}
                </div>
              );
            })}
          </div>
        </div>

        {/* 총 집중시간 카드 */}
        <div className={styles.focusTimeCard}>
          <div className={styles.focusTimeValue}>{currentData.focusTime.total}</div>
          <div className={styles.focusTimeLabel}>총 집중시간</div>
          <div className={styles.topTimeSlots}>
            <div className={styles.topTimeTitle}>가장 생산적이었던 시간대 TOP3</div>
            {currentData.focusTime.topTimeSlots.map((timeSlot, index) => (
              <div key={index} className={styles.timeSlotItem}>
                <img 
                  src={purpleCheckIcon} 
                  alt="check" 
                  className={styles.checkIcon}
                />
                <span className={styles.timeSlotText}>{timeSlot}</span>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>

      <Navbar activeItem="mypage" />
    </div>
  );
}

