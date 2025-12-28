import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Toast from "../../components/Toast/Toast";
import styles from "./GuildJoin.module.css";
import arrowLeftIcon from "../../assets/arrow-left.svg";

export default function GuildJoin() {
  const navigate = useNavigate();
  const [codes, setCodes] = useState(["", "", "", "", ""]);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [guildName, setGuildName] = useState("");
  const inputRefs = useRef([]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCodeChange = (index, value) => {
    // 우선 숫자, 영문 허용
    const sanitizedValue = value.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
    
    if (sanitizedValue.length <= 1) {
      const newCodes = [...codes];
      newCodes[index] = sanitizedValue;
      setCodes(newCodes);
      setError("");

      // 다음 입력 필드로 자동 이동
      if (sanitizedValue && index < 4) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9A-Za-z]/g, "").toUpperCase();
    
    if (pastedData.length > 0) {
      const newCodes = [...codes];
      for (let i = 0; i < Math.min(pastedData.length, 5); i++) {
        newCodes[i] = pastedData[i] || "";
      }
      setCodes(newCodes);
      
      // 마지막 입력 필드로 포커스 이동
      const focusIndex = Math.min(pastedData.length - 1, 4);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleConfirm = () => {
    const code = codes.join("");
    if (code.length !== 5) {
      return;
    }

    // 임시로 코드 검증
    const isValidCode = validateCode(code);
    
    if (isValidCode) {
      // 성공 시 토스트 메시지 표시
      setGuildName("XX팀");
      setShowToast(true);
      setTimeout(() => {
        navigate("/guild");
      }, 3000);
    } else {
      setError("코드 번호가 일치하지 않습니다.");
    }
  };

  const validateCode = (code) => {
    // 임시 검증 코드드
    return code === "ABCDE";
  };

  const isButtonDisabled = codes.join("").length !== 5;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={arrowLeftIcon} alt="뒤로가기" />
        </button>
        <h1 className={styles.title}>길드 함께하기</h1>
        <div className={styles.placeholder}></div>
      </div>
      <div className={styles.content}>
        <p className={styles.description}>
          공유 받은 참여 코드를 입력해주세요.
        </p>
        <div className={styles.codeInputContainer}>
          {codes.map((code, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              className={`${styles.codeInput} ${error ? styles.codeInputError : ""}`}
              value={code}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              maxLength={1}
              autoComplete="off"
            />
          ))}
        </div>
        {error && (
          <p className={styles.errorMessage}>{error}</p>
        )}
      </div>
      <div className={styles.footer}>
        <button 
          className={`${styles.confirmButton} ${isButtonDisabled ? styles.confirmButtonDisabled : ""}`}
          onClick={handleConfirm}
          disabled={isButtonDisabled}
        >
          확인
        </button>
      </div>
      <Navbar activeItem="guild" />
      {showToast && (
        <Toast
          message={`${guildName}의 동료가 되었어요!`}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

