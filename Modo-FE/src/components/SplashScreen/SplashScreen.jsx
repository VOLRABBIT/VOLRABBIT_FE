import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import logo from "../../assets/logo.png";
import styles from "./SplashScreen.module.css";

function isPwaMobile() {
  if (typeof window === "undefined") return false;
  // 브라우저 탭/창에서 열린 경우 제외
  if (window.matchMedia("(display-mode: browser)").matches) return false;
  // PWA로 설치 후 실행된 경우만 (홈 화면에서 실행)
  const isPwa =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    window.navigator.standalone === true;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  return isPwa && isMobile;
}

export default function SplashScreen({ children }) {
  const [showSplash, setShowSplash] = useState(() => isPwaMobile());

  useEffect(() => {
    if (!showSplash) return;
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, [showSplash]);

  const splashContent =
    showSplash &&
    createPortal(
      <div className={`${styles.splash} ${styles.fadeOut}`}>
        <img src={logo} alt="Modo" className={styles.logo} />
      </div>,
      document.body
    );

  return (
    <>
      {splashContent}
      <div className={showSplash ? styles.hiddenContent : undefined}>
        {children}
      </div>
    </>
  );
}
