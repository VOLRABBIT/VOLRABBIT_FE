import { useParams, useNavigate } from "react-router-dom";
import LocationPage from "../../../components/LocationPage/LocationPage";
import { LOCATION_DATA } from "../../../data/locationData";

export default function LocationIntro() {
  const { type } = useParams();
  const navigate = useNavigate();

  const locationData = LOCATION_DATA[type];

  // 유효하지 않은 타입인 경우 맵으로 리다이렉트
  if (!locationData) {
    navigate("/map");
    return null;
  }

  const handleSelect = () => {
    navigate(`/fight/${locationData.locationType}`, {
      state: { locationType: locationData.locationType }
    });
  };

  return (
    <LocationPage
      headerTitle={locationData.headerTitle}
      title={locationData.title}
      description={locationData.description}
      introImage={locationData.introImage}
      locationType={locationData.locationType}
      onSelect={handleSelect}
    />
  );
}

