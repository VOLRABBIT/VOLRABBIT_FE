import dungeonIntroImage from "../assets/map/dungeon_intro.png";
import gorgeIntroImage from "../assets/map/gorge_intro.png";
import castleIntroImage from "../assets/map/castle_intro.png";
import roomIntroImage from "../assets/map/room_intro.png";

export const LOCATION_BACKGROUNDS = {
  dungeon: dungeonIntroImage, // 환각의 던전
  gorge: gorgeIntroImage,     // 혼돈의 협곡
  castle: castleIntroImage,    // 지연의 성
  room: roomIntroImage,        // 환영의 방
};

export const LOCATION_TITLES = {
  dungeon: "환각의 던전",
  gorge: "혼돈의 협곡",
  castle: "지연의 성",
  room: "환영의 방",
};

export const getLocationBackground = (locationType) => {
  return LOCATION_BACKGROUNDS[locationType] || LOCATION_BACKGROUNDS.gorge;
};

export const LOCATION_BUTTON_COLORS = {
  gorge: "#624040",   // 혼돈의 협곡
  room: "#3E6F77",    // 환영의 방
  castle: "#404062",  // 지연의 성
  dungeon: "#40625D", // 환각의 던전
};

export const getLocationTitle = (locationType) => {
  return LOCATION_TITLES[locationType] || LOCATION_TITLES.gorge;
};

export const getLocationButtonColor = (locationType) => {
  return LOCATION_BUTTON_COLORS[locationType] || LOCATION_BUTTON_COLORS.gorge;
};
