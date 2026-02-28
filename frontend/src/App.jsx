import { Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import PricingPage from './pages/PricingPage';

export default function App() {
  return (
    <Routes>
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/editor" element={<EditorPage />} />
      <Route path="/" element={<DashboardPage />} />
    </Routes>
  );
}
