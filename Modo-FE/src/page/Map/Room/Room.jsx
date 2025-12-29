import LocationPage from "../../../components/LocationPage/LocationPage";
import introImage from "../../../assets/map/room_intro.png";

export default function Room() {
  const handleSelect = () => {
    console.log("방 선택");
  };

  const description = [
    "작은 일이 괴물처럼 커져 보인다는 소문 속의 방.",
    "거울과 빛의 왜곡이 존재를 부풀리고,\n부담을 증폭시키는 장치로 작동한다고 한다.",
    "사람은 그 안에서 과장된 두려움과 마주하게 되고,\n스스로의 사소한 일을 끝내 포기하기도 한다.",
    "하지만 아주 잠깐,\n정면으로 그것을 바라볼 수 있는 순간이 있다.",
    "그리고 남는 건 \"이게 뭐라고 무서웠지?\"라는\n허무한 한마디 뿐이라는 방.",
  ];

  return (
    <LocationPage
      headerTitle="환영의 방"
      title="환영의 방"
      description={description}
      introImage={introImage}
      locationType="room"
      onSelect={handleSelect}
    />
  );
}

