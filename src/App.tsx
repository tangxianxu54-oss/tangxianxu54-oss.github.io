import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import FoodSearch from "@/pages/FoodSearch";
import Calculator from "@/pages/Calculator";
import Diary from "@/pages/Diary";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<FoodSearch />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/diary" element={<Diary />} />
        </Routes>
      </Layout>
    </Router>
  );
}
