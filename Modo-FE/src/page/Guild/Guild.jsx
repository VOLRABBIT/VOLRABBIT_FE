import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Guild.module.css";

export default function Guild() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>길드</h1>
        <p className={styles.description}>길드 페이지입니다.</p>
      </div>
      <Navbar activeItem="guild" />
    </div>
  );
}

