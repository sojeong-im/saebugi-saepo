import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import MissionPage from './pages/MissionPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/mission" element={<MissionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
