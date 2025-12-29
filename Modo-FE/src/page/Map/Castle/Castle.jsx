import LocationPage from "../../../components/LocationPage/LocationPage";
import introImage from "../../../assets/map/castle_intro.png";

export default function Castle() {
  const handleSelect = () => {
    console.log("성 선택");
  };

  const description = [
    "구에서 누구나 멈춰 선다는 소문 속의 고성.",
    "사람들은 이유를 설명하지 못하고,\n그저 \"몸이 움직이지 않았다\"고만 증언한다.",
    "건물 전체에 시작을 방해하는 무언가가 깃들어 있다.",
    "그러나 단 한 걸음을 내딛기만 하면,\n성이 기묘할 정도로 빠르게 열리는 구조.",
    "들어갔던 이들 중 일부는 \"시작이 전부였다\"고 말하며\n재빨리 돌아온다고 한다.",
  ];

  return (
    <LocationPage
      headerTitle="지연의 성"
      title="지연의 성"
      description={description}
      introImage={introImage}
      locationType="castle"
      onSelect={handleSelect}
    />
  );
}

