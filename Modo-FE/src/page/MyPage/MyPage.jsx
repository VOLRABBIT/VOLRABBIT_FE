import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./MyPage.module.css";

export default function MyPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>마이페이지</h1>
        <p className={styles.description}>마이페이지입니다.</p>
      </div>
      <Navbar activeItem="mypage" />
    </div>
  );
}

