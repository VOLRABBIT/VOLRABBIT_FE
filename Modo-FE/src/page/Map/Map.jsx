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
      case "gorge":
      case "castle":
      case "room":
        navigate(`/location/${location}`);
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
        
        <button 
          className={`${styles.locationButton} ${styles.shopButton}`}
          onClick={() => handleLocationClick("shop")}
        >
          <img src={shopIcon} alt="상점" className={styles.shopIcon} />
        </button>

        <button 
          className={`${styles.locationButton} ${styles.dungeonButton}`}
          onClick={() => handleLocationClick("dungeon")}
        >
          <img src={dungeonIcon} alt="환각의 던전" className={styles.dungeonIcon} />
        </button>

        <button 
          className={`${styles.locationButton} ${styles.gorgeButton}`}
          onClick={() => handleLocationClick("gorge")}
        >
          <img src={gorgeIcon} alt="혼돈의 협곡" className={styles.locationIcon} />
        </button>

        <button 
          className={`${styles.locationButton} ${styles.castleButton}`}
          onClick={() => handleLocationClick("castle")}
        >
          <img src={castleIcon} alt="지연의 성" className={styles.locationIcon} />
        </button>

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
