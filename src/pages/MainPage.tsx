import { useState } from 'react';
import { teamsData } from '../data';
import TeamSection from '../components/TeamSection';
import { Link } from 'react-router-dom';

export default function MainPage() {
  const [activeTeam, setActiveTeam] = useState<number>(1);

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="logo">셋로그 세포대작전 🐢</h1>
        <p className="subtitle">우리 안의 세포들이 움직이면 구역의 단합이 완성된다!</p>
        <Link to="/mission" className="mission-link-btn">
          🎯 세포별 미션 보러가기
        </Link>
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
        <p>SetLog Cell Great Operation © 2026</p>
      </footer>
    </div>
  );
}
