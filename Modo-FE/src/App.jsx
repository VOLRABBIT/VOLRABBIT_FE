import { Routes, Route } from "react-router-dom";
import Onboarding from "./page/Onboarding/Onboarding.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="viewport-wrapper">
      <div className="app-frame">
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </div>
    </div>
  );
}
