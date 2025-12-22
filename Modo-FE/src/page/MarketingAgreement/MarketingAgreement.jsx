import { useNavigate } from "react-router-dom";
import styles from "./MarketingAgreement.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";

export default function MarketingAgreement() {
  const navigate = useNavigate();

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
          약관동의
        </div>
      </div>
    </div>
  );
}

