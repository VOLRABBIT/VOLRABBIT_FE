import LocationPage from "../../../components/LocationPage/LocationPage";
import introImage from "../../../assets/map/dungeon_intro.png";

export default function Dungeon() {
  const handleSelect = () => {
    console.log("던전 선택");
  };

  const description = [
    "자극의 목소리가 사방에서 들려온다는 소문 속의 미궁.",
    "주의와 집중을 앗아가는 환각 장치가 배치되어 있어,\n 목적을 흐리게 만드는 구조.",
    "한번 길을 잃으면 시간이 흐르는 감각조차 사라진다.",
    "던전은 끝이 없는 것처럼 보이지만,\n 사실 출구는 항상 가까운 곳에 있다고 전해진다.",
    "그러나,\n 명확한 정신을 유지한 자만이 찾을 수 있다.",

  ];

  return (
    <LocationPage
      headerTitle="환각의 던전"
      title="환각의 던전"
      description={description}
      introImage={introImage}
      locationType="dungeon"
      onSelect={handleSelect}
    />
  );
}

