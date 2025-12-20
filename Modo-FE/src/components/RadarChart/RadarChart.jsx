import styles from "./RadarChart.module.css";

const RadarChart = ({ data, size = 211.2, fillColor, strokeColor }) => {

  const axes = [
    { label: "집중력", labelEn: "A", angle: -90 },
    { label: "시간 관리", labelEn: "T", angle: -18 },
    { label: "활동성", labelEn: "AL", angle: 54 },
    { label: "충동성", labelEn: "I", angle: 126 },
    { label: "감정 조절", labelEn: "E", angle: 198 },
  ];

  const center = { x: 105.602, y: 106.218 };
  // 외곽 폴리곤의 실제 반지름 계산 (중심에서 꼭짓점까지의 거리)
  // 상단 꼭짓점: (105.602, 0.618164), 중심: (105.602, 106.218)
  // 거리 = 106.218 - 0.618164 = 약 105.6
  // 측정값 기준: bounding box 97x92, 위치 Left 103px, Top 59.5px
  // 중심 (105.602, 106.218)에서 bounding box 크기 97x92를 고려하여 반지름 조정
  // 최대 반지름은 대각선 거리를 고려하여 약 48.5 정도
  const maxRadius = 48.5; // 데이터 폴리곤의 최대 반지름 (측정값 97x92 기준)

  const values = [
    data.attention || 0,
    data.timeManagement || 0,
    data.activity || 0,
    data.impulsivity || 0,
    data.emotion || 0,
  ];

  // 점수를 좌표로 변환
  const getPoint = (angle, value, maxValue = 4) => {
    const radian = (angle * Math.PI) / 180;
    const distance = (value / maxValue) * maxRadius;
    const x = center.x + distance * Math.cos(radian);
    const y = center.y + distance * Math.sin(radian);
    return { x, y };
  };

  // 데이터 폴리곤 경로 생성
  const getDataPolygonPath = () => {
    return values
      .map((value, index) => {
        const point = getPoint(axes[index].angle, value);
        return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
      })
      .join(" ") + " Z";
  };

  return (
    <div className={styles.radarChartContainer}>
      <svg
        width={size}
        height={size}
        viewBox="-20 -20 252 252"
        className={styles.radarChart}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {/* 가장 외곽 폴리곤 */}
        <path
          d="M105.602 0.618164L155.817 37.1021L206.033 73.586L186.852 132.618L167.672 191.65H105.602H43.5314L24.3506 132.618L5.16992 73.586L55.3857 37.1021L105.602 0.618164Z"
          fill="white"
        />
        <path
          d="M105.602 0.618164L155.817 37.1021L206.033 73.586M105.602 0.618164L55.3857 37.1021L5.16992 73.586M105.602 0.618164V106.218M206.033 73.586L186.852 132.618L167.672 191.65M206.033 73.586L105.602 106.218M167.672 191.65H105.602H43.5314M167.672 191.65L105.602 106.218M43.5314 191.65L24.3506 132.618L5.16992 73.586M43.5314 191.65L105.602 106.218M5.16992 73.586L55.3857 89.9021L105.602 106.218"
          stroke="black"
          strokeOpacity="0.12"
        />

        {/* 첫 번째 내부 요소 */}
        <g transform="translate(27.1558, 27.1541)">
          <path
            d="M78.4462 0.618164L115.749 27.7205L153.052 54.8228L138.804 98.6753L124.555 142.528H78.4462H32.3369L18.0884 98.6753L3.83984 54.8228L41.143 27.7205L78.4462 0.618164Z"
            fill="#F6F6F6"
          />
          <path
            d="M78.4462 0.618164L115.749 27.7205L153.052 54.8228M78.4462 0.618164L41.143 27.7205L3.83984 54.8228M78.4462 0.618164V79.0639M153.052 54.8228L138.804 98.6753L124.555 142.528M153.052 54.8228L78.4462 79.0639M124.555 142.528H78.4462H32.3369M124.555 142.528L78.4462 79.0639M32.3369 142.528L18.0884 98.6753L3.83984 54.8228M32.3369 142.528L78.4462 79.0639M3.83984 54.8228L41.143 66.9433L78.4462 79.0639"
            stroke="black"
            strokeOpacity="0.12"
          />
        </g>

        {/* 두 번째 내부 요소 */}
        <g transform="translate(54.3073, 54.3084)">
          <path
            d="M51.2947 0.618164L75.6852 18.3389L100.076 36.0597L90.7594 64.7325L81.4431 93.4052H51.2947H21.1464L11.83 64.7325L2.51367 36.0597L26.9042 18.3389L51.2947 0.618164Z"
            fill="white"
          />
          <path
            d="M51.2947 0.618164L75.6852 18.3389L100.076 36.0597M51.2947 0.618164L26.9042 18.3389L2.51367 36.0597M51.2947 0.618164V51.9096M100.076 36.0597L90.7594 64.7324L81.4431 93.4052M100.076 36.0597L51.2947 51.9096M81.4431 93.4052H51.2947H21.1464M81.4431 93.4052L51.2947 51.9096M21.1464 93.4052L11.83 64.7324L2.51367 36.0597M21.1464 93.4052L51.2947 51.9096M2.51367 36.0597L26.9042 43.9846L51.2947 51.9096"
            stroke="black"
            strokeOpacity="0.12"
          />
        </g>

        {/* 세 번째 내부 요소 (가장 안쪽) */}
        <g transform="translate(81.4646, 81.4627)">
          <path
            d="M24.1374 0.618164L35.6153 8.95734L47.0932 17.2965L42.709 30.7896L38.3249 44.2827H24.1374H9.94997L5.56581 30.7896L1.18164 17.2965L12.6595 8.95734L24.1374 0.618164Z"
            fill="#F6F6F6"
          />
          <path
            d="M24.1374 0.618164L35.6153 8.95734L47.0932 17.2965M24.1374 0.618164L12.6595 8.95734L1.18164 17.2965M24.1374 0.618164V24.7553M47.0932 17.2965L42.709 30.7896L38.3249 44.2827M47.0932 17.2965L24.1374 24.7553M38.3249 44.2827H24.1374H9.94997M38.3249 44.2827L24.1374 24.7553M9.94997 44.2827L5.56581 30.7896L1.18164 17.2965M9.94997 44.2827L24.1374 24.7553M1.18164 17.2965L12.6595 21.0259L24.1374 24.7553"
            stroke="black"
            strokeOpacity="0.12"
          />
        </g>

        {/* 캐릭터별 데이터 폴리곤 */}
        <path
          d={getDataPolygonPath()}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
          className={styles.dataPolygon}
        />

        {/* 텍스트 레이블 - 가장 위에 렌더링 */}
        <text
          x="105.602"
          y="-15"
          className={styles.axisLabel}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          집중력(A)
        </text>
        <text
          x="220"
          y="70"
          className={styles.axisLabel}
          textAnchor="start"
          dominantBaseline="middle"
        >
          시간 관리(T)
        </text>
        <text
          x="180"
          y="210"
          className={styles.axisLabel}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          활동성(AL)
        </text>
        <text
          x="20"
          y="210"
          className={styles.axisLabel}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          충동성(I)
        </text>
        <text
          x="-10"
          y="70"
          className={styles.axisLabel}
          textAnchor="end"
          dominantBaseline="middle"
        >
          감정 조절(E)
        </text>
      </svg>
    </div>
  );
};

export default RadarChart;
