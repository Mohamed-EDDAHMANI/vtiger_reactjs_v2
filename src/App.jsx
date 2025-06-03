import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VtigerLogin from "./vtiger_login";
import Home from "./Home";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VtigerLogin />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}
