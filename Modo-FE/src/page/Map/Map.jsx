import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Map.module.css";
import mapBackground from "../../assets/map/map.png";
import shopIcon from "../../assets/map/assets.png";
import dungeonIcon from "../../assets/map/Dungeon.png";
import gorgeIcon from "../../assets/map/gorge.png";
import castleIcon from "../../assets/map/castle.png";
import roomIcon from "../../assets/map/room.png";

export default function Map() {
  const navigate = useNavigate();

  const handleLocationClick = (location) => {
    switch (location) {
      case "shop":
        navigate("/shop");
        break;
      case "dungeon":
        navigate("/dungeon");
        break;
      case "gorge":
        navigate("/gorge");
        break;
      case "castle":
        navigate("/castle");
        break;
      case "room":
        navigate("/room");
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mapContainer}>
        <img 
          src={mapBackground} 
          alt="지도 배경" 
          className={styles.mapBackground}
        />
        
        {/* 상점 아이콘 */}
        <button 
          className={`${styles.locationButton} ${styles.shopButton}`}
          onClick={() => handleLocationClick("shop")}
        >
          <img src={shopIcon} alt="상점" className={styles.shopIcon} />
        </button>

        {/* 환각의 던전 아이콘 */}
        <button 
          className={`${styles.locationButton} ${styles.dungeonButton}`}
          onClick={() => handleLocationClick("dungeon")}
        >
          <img src={dungeonIcon} alt="환각의 던전" className={styles.dungeonIcon} />
        </button>

        {/* 혼돈의 협곡 아이콘 */}
        <button 
          className={`${styles.locationButton} ${styles.gorgeButton}`}
          onClick={() => handleLocationClick("gorge")}
        >
          <img src={gorgeIcon} alt="혼돈의 협곡" className={styles.locationIcon} />
        </button>

        {/* 지연의 성 아이콘 */}
        <button 
          className={`${styles.locationButton} ${styles.castleButton}`}
          onClick={() => handleLocationClick("castle")}
        >
          <img src={castleIcon} alt="지연의 성" className={styles.locationIcon} />
        </button>

        {/* 환영의 방 아이콘 */}
        <button 
          className={`${styles.locationButton} ${styles.roomButton}`}
          onClick={() => handleLocationClick("room")}
        >
          <img src={roomIcon} alt="환영의 방" className={styles.locationIcon} />
        </button>
      </div>
      <Navbar activeItem="map" />
    </div>
  );
}
