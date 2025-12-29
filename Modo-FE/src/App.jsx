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
import Dungeon from "./page/Map/Dungeon/Dungeon.jsx";
import Gorge from "./page/Map/Gorge/Gorge.jsx";
import Castle from "./page/Map/Castle/Castle.jsx";
import Room from "./page/Map/Room/Room.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="viewport-wrapper">
      <div className="app-frame">
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
          <Route path="/dungeon" element={<Dungeon />} />
          <Route path="/gorge" element={<Gorge />} />
          <Route path="/castle" element={<Castle />} />
          <Route path="/room" element={<Room />} />
        </Routes>
      </div>
    </div>
  );
}
