import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicRanking from "./pages/PublicRanking";
// ...outros imports

export default function App() {
  // ...
  return (
    <Router>
      <Routes>
        <Route path="/ranking" element={<PublicRanking />} />
        {/* demais rotas */}
      </Routes>
    </Router>
  );
}