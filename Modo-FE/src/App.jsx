import { Routes, Route } from "react-router-dom";
import Onboarding from "./page/Onboarding/Onboarding.jsx";
import Landing from "./page/Landing/Landing.jsx";
import Login from "./page/Login/Login.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="viewport-wrapper">
      <div className="app-frame">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}
