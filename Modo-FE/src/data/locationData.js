import dungeonIntroImage from "../assets/map/dungeon_intro.png";
import gorgeIntroImage from "../assets/map/gorge_intro.png";
import castleIntroImage from "../assets/map/castle_intro.png";
import roomIntroImage from "../assets/map/room_intro.png";

export const LOCATION_DATA = {
  dungeon: {
    headerTitle: "환각의 던전",
    title: "환각의 던전",
    description: [
      "자극의 목소리가 사방에서 들려온다는 소문 속의 미궁.",
      "주의와 집중을 앗아가는 환각 장치가 배치되어 있어,\n 목적을 흐리게 만드는 구조.",
      "한번 길을 잃으면 시간이 흐르는 감각조차 사라진다.",
      "던전은 끝이 없는 것처럼 보이지만,\n 사실 출구는 항상 가까운 곳에 있다고 전해진다.",
      "그러나,\n 명확한 정신을 유지한 자만이 찾을 수 있다.",
    ],
    introImage: dungeonIntroImage,
    locationType: "dungeon",
  },
  gorge: {
    headerTitle: "혼돈의 협곡",
    title: "혼돈의 협곡",
    description: [
      "목적을 잃고 엉뚱한 길로 빠져버린다는 소문 속의 협곡.",
      "지형 전체에서 무작위로 튀어나오는 아이디어와 충동\n이 사람의 집중을 갉아먹는 곳이라고 한다.",
      "여기에 들어가면 머릿속이 시끄러워지고,\n무엇이 중요했는지 흐릿해진다.",
      "그럼에도 불구하고,\n일부 사람은 이곳에서 \"예상 밖의 발견\"을 찾아\n돌아온다고 한다.",
      "우연이 행운인지, 저주인지 아무도 증명하지 못했다.",
    ],
    introImage: gorgeIntroImage,
    locationType: "gorge",
  },
  castle: {
    headerTitle: "지연의 성",
    title: "지연의 성",
    description: [
      "구에서 누구나 멈춰 선다는 소문 속의 고성.",
      "사람들은 이유를 설명하지 못하고,\n그저 \"몸이 움직이지 않았다\"고만 증언한다.",
      "건물 전체에 시작을 방해하는 무언가가 깃들어 있다.",
      "그러나 단 한 걸음을 내딛기만 하면,\n성이 기묘할 정도로 빠르게 열리는 구조.",
      "들어갔던 이들 중 일부는 \"시작이 전부였다\"고 말하며\n재빨리 돌아온다고 한다.",
    ],
    introImage: castleIntroImage,
    locationType: "castle",
  },
  room: {
    headerTitle: "환영의 방",
    title: "환영의 방",
    description: [
      "작은 일이 괴물처럼 커져 보인다는 소문 속의 방.",
      "거울과 빛의 왜곡이 존재를 부풀리고,\n부담을 증폭시키는 장치로 작동한다고 한다.",
      "사람은 그 안에서 과장된 두려움과 마주하게 되고,\n스스로의 사소한 일을 끝내 포기하기도 한다.",
      "하지만 아주 잠깐,\n정면으로 그것을 바라볼 수 있는 순간이 있다.",
      "그리고 남는 건 \"이게 뭐라고 무서웠지?\"라는\n허무한 한마디 뿐이라는 방.",
    ],
    introImage: roomIntroImage,
    locationType: "room",
  },
};

