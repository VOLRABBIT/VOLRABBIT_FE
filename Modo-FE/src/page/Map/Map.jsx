import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Map.module.css";

export default function Map() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>지도</h1>
        <p className={styles.description}>지도 페이지입니다.</p>
      </div>
      <Navbar activeItem="map" />
    </div>
  );
}

