import LocationPage from "../../../components/LocationPage/LocationPage";
import introImage from "../../../assets/map/gorge_intro.png";

export default function Gorge() {
  const handleSelect = () => {
    console.log("협곡 선택");
  };

  const description = [
    "목적을 잃고 엉뚱한 길로 빠져버린다는 소문 속의 협곡.",
    "지형 전체에서 무작위로 튀어나오는 아이디어와 충동\n이 사람의 집중을 갉아먹는 곳이라고 한다.",
    "여기에 들어가면 머릿속이 시끄러워지고,\n무엇이 중요했는지 흐릿해진다.",
    "그럼에도 불구하고,\n일부 사람은 이곳에서 \"예상 밖의 발견\"을 찾아\n돌아온다고 한다.",
    "우연이 행운인지, 저주인지 아무도 증명하지 못했다.",
  ];

  return (
    <LocationPage
      headerTitle="혼돈의 협곡"
      title="혼돈의 협곡"
      description={description}
      introImage={introImage}
      locationType="gorge"
      onSelect={handleSelect}
    />
  );
}

