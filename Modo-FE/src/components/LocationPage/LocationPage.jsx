import { useNavigate } from "react-router-dom";
import styles from "./LocationPage.module.css";
import TopBar from "../TopBar/TopBar";
import dungeonIcon from "../../assets/map/dungeon_click.png";
import gorgeIcon from "../../assets/map/gorge_click.png";
import castleIcon from "../../assets/map/castle_click.png";
import roomIcon from "../../assets/map/room_click.png";

export default function LocationPage({
  headerTitle,
  title,
  description,
  introImage,
  locationType,
  onSelect,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/map");
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect();
    }
  };

  const getLocationIcon = () => {
    switch (locationType) {
      case "dungeon":
        return dungeonIcon;
      case "gorge":
        return gorgeIcon;
      case "castle":
        return castleIcon;
      case "room":
        return roomIcon;
      default:
        return null;
    }
  };

  const locationIcon = getLocationIcon();

  return (
    <div 
      className={styles.container}
      style={introImage ? { backgroundImage: `url(${introImage})` } : {}}
    >
      <div className={styles.gradientOverlay} />
      
      <TopBar
        title={headerTitle}
        onBack={handleBack}
        showSkip={false}
        textColor="dark"
      />
      
      <div className={styles.introContent}>
        <h1 className={styles.introTitle}>{title}</h1>
        <div className={styles.introParagraphs}>
          {description.map((text, index) => (
            <p
              key={index}
              className={styles[`introParagraph${index + 1}`] || styles.introParagraph}
            >
              {text}
            </p>
          ))}
        </div>
      </div>

      <div className={styles.introFooter}>
        {locationIcon && (
          <button className={styles.ctaButton} onClick={handleSelect}>
            <img src={locationIcon} alt={title} className={styles.buttonIcon} />
          </button>
        )}
      </div>
    </div>
  );
}

