import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Fight.module.css";

export default function Fight() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>전투</h1>
        <p className={styles.description}>전투 페이지입니다.</p>
      </div>
      <Navbar activeItem="fight" />
    </div>
  );
}

