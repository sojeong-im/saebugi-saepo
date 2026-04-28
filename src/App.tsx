import { useState } from 'react';
import './index.css';
import { teamsData } from './data';
import TeamSection from './components/TeamSection';

function App() {
  const [activeTeam, setActiveTeam] = useState<number>(1);

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="logo">새부기의 세포들 🐢</h1>
        <p className="subtitle">5컷 영상 프로젝트 - 실시간 갤러리</p>
      </header>

      <nav className="team-nav">
        {teamsData.map((team) => (
          <button
            key={team.id}
            className={`team-tab ${activeTeam === team.id ? 'active' : ''}`}
            onClick={() => setActiveTeam(team.id)}
          >
            {team.name}
          </button>
        ))}
      </nav>

      <main className="main-content">
        <TeamSection team={teamsData.find((t) => t.id === activeTeam)!} />
      </main>

      <footer className="footer">
        <p>Saebugi's Cells Parody Event Site © 2026</p>
      </footer>
    </div>
  );
}

export default App;
