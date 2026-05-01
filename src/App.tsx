import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import MissionPage from './pages/MissionPage';
import AdminPage from './pages/AdminPage';
import SiteGate from './components/SiteGate';
import './index.css';

function App() {
  return (
    <SiteGate>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/mission" element={<MissionPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </SiteGate>
  );
}

export default App;
