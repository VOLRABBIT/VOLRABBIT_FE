import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import mapIcon from "../../assets/navbar/map.svg";
import mapSelectedIcon from "../../assets/navbar/map-selected.svg";
import fightIcon from "../../assets/navbar/fight.svg";
import fightSelectedIcon from "../../assets/navbar/fight-selected.svg";
import guildIcon from "../../assets/navbar/guild.svg";
import guildSelectedIcon from "../../assets/navbar/guild-selected.svg";
import mypageIcon from "../../assets/navbar/mypage.svg";
import mypageSelectedIcon from "../../assets/navbar/mypage-selected.svg";

/**
 * @param {Object} props
 * @param {string} props.activeItem
 */
export default function Navbar({ activeItem = null }) {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "map",
      label: "지도",
      icon: mapIcon,
      selectedIcon: mapSelectedIcon,
      path: "/map",
    },
    {
      id: "fight",
      label: "전투",
      icon: fightIcon,
      selectedIcon: fightSelectedIcon,
      path: "/fight",
    },
    {
      id: "guild",
      label: "길드",
      icon: guildIcon,
      selectedIcon: guildSelectedIcon,
      path: "/guild",
    },
    {
      id: "mypage",
      label: "마이페이지",
      icon: mypageIcon,
      selectedIcon: mypageSelectedIcon,
      path: "/mypage",
    },
  ];

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBackground} />
      <div className={styles.menuContainer}>
        {menuItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <div
              key={item.id}
              className={styles.menuItem}
              onClick={() => handleItemClick(item.path)}
            >
              <div className={styles.iconWrapper}>
                <img
                  src={isActive ? item.selectedIcon : item.icon}
                  alt={item.label}
                  className={styles.icon}
                />
              </div>
              <span
                className={`${styles.label} ${isActive ? styles.labelActive : ""}`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

