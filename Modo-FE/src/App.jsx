import { Routes, Route } from "react-router-dom";
import Onboarding from "./page/Onboarding/Onboarding.jsx";
import AdvancedDiagnosis from "./page/AdvancedDiagnosis/AdvancedDiagnosis.jsx";
import Landing from "./page/Landing/Landing.jsx";
import Login from "./page/Login/Login.jsx";
import Signup from "./page/Signup/Signup.jsx";
import TermsOfService from "./page/TermsOfService/TermsOfService.jsx";
import MarketingAgreement from "./page/MarketingAgreement/MarketingAgreement.jsx";
import BattleModalExample from "./page/BattleModalExample/BattleModalExample.jsx";
import Map from "./page/Map/Map.jsx";
import Shop from "./page/Shop/Shop.jsx";
import LocationIntro from "./page/Map/LocationIntro/LocationIntro.jsx";
import Fight from "./page/Fight/Fight.jsx";
import Guild from "./page/Guild/Guild.jsx";
import GuildJoin from "./page/GuildJoin/GuildJoin.jsx";
import GuildCreate from "./page/GuildCreate/GuildCreate.jsx";
import GuildDetail from "./page/GuildDetail/GuildDetail.jsx";
import GuildQuestRegister from "./page/GuildQuestRegister/GuildQuestRegister.jsx";
import MyPage from "./page/MyPage/MyPage.jsx";
import TaskGiveUp from "./page/TaskGiveUp/TaskGiveUp.jsx";
import TaskPhotoAuth from "./page/TaskPhotoAuth/TaskPhotoAuth.jsx";
import TaskCreate from "./page/TaskCreate/TaskCreate.jsx";
import TaskDetail from "./page/TaskDetail/TaskDetail.jsx";
import TaskRebuild from "./page/TaskRebuild/TaskRebuild.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="viewport-wrapper">
      <div className="app-frame">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/advanced-diagnosis" element={<AdvancedDiagnosis />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/marketing-agreement" element={<MarketingAgreement />} />
            <Route path="/battle-modal-example" element={<BattleModalExample />} />
            <Route path="/map" element={<Map />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/location/:type" element={<LocationIntro />} />
            <Route path="/fight" element={<Fight />} />
            <Route path="/guild" element={<Guild />} />
            <Route path="/guild/:id" element={<GuildDetail />} />
            <Route path="/guild/:id/quest/register" element={<GuildQuestRegister />} />
            <Route path="/guild/join" element={<GuildJoin />} />
            <Route path="/guild/create" element={<GuildCreate />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/task-give-up" element={<TaskGiveUp />} />
            <Route path="/task-photo-auth" element={<TaskPhotoAuth />} />
            <Route path="/task-create" element={<TaskCreate />} />
            <Route path="/task-detail/:date" element={<TaskDetail />} />
            <Route path="/task-rebuild/:date" element={<TaskRebuild />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
