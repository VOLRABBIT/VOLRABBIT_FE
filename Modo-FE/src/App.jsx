// React & 라우터
import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

// 페이지
import Landing from "./page/Landing/Landing.jsx";
import Login from "./page/Login/Login.jsx";
import OAuthCallback from "./page/OAuthCallback/OAuthCallback.jsx";
import Signup from "./page/Signup/Signup.jsx";
import TermsOfService from "./page/TermsOfService/TermsOfService.jsx";
import MarketingAgreement from "./page/MarketingAgreement/MarketingAgreement.jsx";
import Onboarding from "./page/Onboarding/Onboarding.jsx";
import AdvancedDiagnosis from "./page/AdvancedDiagnosis/AdvancedDiagnosis.jsx";
import Map from "./page/Map/Map.jsx";
import LocationIntro from "./page/Map/LocationIntro/LocationIntro.jsx";
import Fight from "./page/Fight/Fight.jsx";
import Guild from "./page/Guild/Guild.jsx";
import GuildJoin from "./page/GuildJoin/GuildJoin.jsx";
import GuildCreate from "./page/GuildCreate/GuildCreate.jsx";
import GuildDetail from "./page/GuildDetail/GuildDetail.jsx";
import GuildQuestRegister from "./page/GuildQuestRegister/GuildQuestRegister.jsx";
import GuildManage from "./page/GuildManage/GuildManage.jsx";
import GuildEdit from "./page/GuildEdit/GuildEdit.jsx";
import MyPage from "./page/MyPage/MyPage.jsx";
import NicknameChange from "./page/NicknameChange/NicknameChange.jsx";
import Shop from "./page/Shop/Shop.jsx";
import TaskGiveUp from "./page/TaskGiveUp/TaskGiveUp.jsx";
import TaskPhotoAuth from "./page/TaskPhotoAuth/TaskPhotoAuth.jsx";
import TaskCreate from "./page/TaskCreate/TaskCreate.jsx";
import TaskDetail from "./page/TaskDetail/TaskDetail.jsx";
import TaskRebuild from "./page/TaskRebuild/TaskRebuild.jsx";
import TaskFailedReview from "./page/TaskFailedReview/TaskFailedReview.jsx";
import Pause from "./page/Pause/Pause.jsx";
import Report from "./page/Report/Report.jsx";
import AllTypesPage from "./page/AllTypes/AllTypesPage.jsx";
import CharacterSelectPage from "./page/CharacterSelect/CharacterSelectPage.jsx";
import CategorySettings from "./page/CategorySettings/CategorySettings.jsx";
import NFCSettings from "./page/NFCSettings/NFCSettings.jsx";
import NFCRegister from "./page/NFCRegister/NFCRegister.jsx";

// 스타일
import "./App.css";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/terms-of-service", "/marketing-agreement", "/oauth/callback"];

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isPublic = PUBLIC_PATHS.some((p) => location.pathname === p || location.pathname.startsWith(p + "/"));
    if (!isPublic && !localStorage.getItem("accessToken")) {
      navigate("/", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>
      <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/advanced-diagnosis" element={<AdvancedDiagnosis />} />
            <Route path="/login" element={<Login />} />
            <Route path="/oauth/callback/:provider" element={<OAuthCallback />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/marketing-agreement" element={<MarketingAgreement />} />
            <Route path="/map" element={<Map />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/location/:type" element={<LocationIntro />} />
            <Route path="/fight/:locationType" element={<Fight />} />
            <Route path="/fight" element={<Fight />} />
            <Route path="/guild" element={<Guild />} />
            <Route path="/guild/:id" element={<GuildDetail />} />
            <Route path="/guild/:id/quest/register" element={<GuildQuestRegister />} />
            <Route path="/guild/join" element={<GuildJoin />} />
            <Route path="/guild/create" element={<GuildCreate />} />
            <Route path="/guild/manage" element={<GuildManage />} />
            <Route path="/guild/:id/edit" element={<GuildEdit />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/nickname-change" element={<NicknameChange />} />
            <Route path="/task-give-up" element={<TaskGiveUp />} />
            <Route path="/task-failed-review" element={<TaskFailedReview />} />
            <Route path="/task-failed-review/:locationType" element={<TaskFailedReview />} />
            <Route path="/task-photo-auth" element={<TaskPhotoAuth />} />
            <Route path="/task-create" element={<TaskCreate />} />
            <Route path="/task-detail/:date" element={<TaskDetail key={location.pathname} />} />
            <Route path="/task-rebuild/:date/:locationType?" element={<TaskRebuild />} />
            <Route path="/task-rebuild/:character/:date/:locationType?" element={<TaskRebuild />} />
            <Route path="/pause" element={<Pause />} />
            <Route path="/report" element={<Report />} />
            <Route path="/all-types" element={<AllTypesPage />} />
            <Route path="/character-select" element={<CharacterSelectPage />} />
            <Route path="/category-settings" element={<CategorySettings />} />
            <Route path="/nfc-settings" element={<NFCSettings />} />
            <Route path="/nfc-register" element={<NFCRegister />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <div className="viewport-wrapper">
      <div className="app-frame">
        <AppContent />
      </div>
    </div>
  );
}
