import { Routes, Route } from "react-router-dom";

import Onboarding from "./page/Onboarding/Onboarding.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
    </Routes>
  );
}
