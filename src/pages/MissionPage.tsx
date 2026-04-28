import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cellCharacters } from '../data';
import './MissionPage.css';

export default function MissionPage() {
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);

  const toggleMission = (id: number) => {
    if (completedMissions.includes(id)) {
      setCompletedMissions(completedMissions.filter(mId => mId !== id));
    } else {
      setCompletedMissions([...completedMissions, id]);
    }
  };

  const isAllCompleted = completedMissions.length === cellCharacters.length;

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="logo">세포 미션 보드 🎯</h1>
        <p className="subtitle">모든 미션을 달성하고 최고의 구역이 되세요!</p>
        <Link to="/" className="mission-link-btn" style={{ background: 'var(--text-muted)' }}>
          🏠 메인으로 돌아가기
        </Link>
      </header>

      {isAllCompleted && (
        <div className="victory-banner">
          🎉 축하합니다! 모든 미션을 달성하셨습니다! 우승! 🎉
        </div>
      )}

      <div className="mission-grid">
        {cellCharacters.map(cell => {
          const isCompleted = completedMissions.includes(cell.id);
          return (
            <div 
              key={cell.id} 
              className={`mission-card ${isCompleted ? 'completed' : ''}`}
              onClick={() => toggleMission(cell.id)}
            >
              <div className="mission-avatar-container">
                <img 
                  src={cell.img} 
                  alt={cell.name} 
                  className="mission-avatar" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/cell_joy_1777374728744.png';
                  }}
                />
              </div>
              <div className="mission-info">
                <h3>{cell.name}</h3>
                <p className="mission-desc">{cell.mission}</p>
              </div>
              <div className="mission-status">
                {isCompleted ? '✅ 완료' : '🔲 미완료'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
