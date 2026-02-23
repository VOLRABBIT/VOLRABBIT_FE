import { useNavigate } from "react-router-dom";
import styles from "./MarketingAgreement.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";

export default function MarketingAgreement() {
  const navigate = useNavigate();
  const marketingText = `[선택] 마케팅 및 메시지 수신 동의

아래 내용은 선택 동의 항목이며, 동의하지 않아도 서비스 가입 및 이용이 가능합니다.

1. 수집 및 이용 목적
- 신규 기능 안내, 이벤트/프로모션 정보 제공
- 혜택 및 맞춤형 콘텐츠 추천
- 서비스 만족도 조사 및 이용 통계 분석

2. 수집 항목
- 이메일 주소
- 닉네임(또는 계정 식별 정보)
- 서비스 이용 이력(접속/활동 기록, 이벤트 참여 여부 등)

3. 수신 채널
- 이메일
- 앱 푸시(지원 시)
- 서비스 내 알림

4. 보유 및 이용 기간
- 회원 탈퇴 또는 마케팅 수신 동의 철회 시까지
- 관련 법령에 따라 보관이 필요한 경우 해당 법정 보관기간 동안 보관될 수 있습니다.

5. 동의 거부 권리 및 불이익
- 본 동의는 선택 사항이며, 거부해도 기본 서비스 이용에는 제한이 없습니다.
- 단, 이벤트/혜택/프로모션 안내를 받지 못할 수 있습니다.

6. 동의 철회 방법
- 마이페이지 또는 설정 메뉴에서 언제든지 수신 동의를 변경할 수 있습니다.
- 알림/이메일 하단의 수신거부 기능을 통해 철회할 수 있습니다.

시행일자: 2026년 2월 21일`;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={arrowLeftIcon} alt="뒤로가기" />
        </button>
        <h1 className={styles.title}>마케팅 및 메시지 수신 동의</h1>
      </div>

      {/* 메인 */}
      <div className={styles.mainContent}>
        <div className={styles.content}>
          {marketingText}
        </div>
      </div>
    </div>
  );
}