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

  const completedCount = completedMissions.length;
  const totalCount = cellCharacters.length;
  const isAllCompleted = completedCount === totalCount;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="logo">세포 미션 보드 🎯</h1>
        <p className="subtitle">모든 미션을 달성하고 최고의 구역이 되세요!</p>
        <Link to="/" className="mission-link-btn" style={{ background: 'var(--border-color)' }}>
          🏠 메인으로 돌아가기
        </Link>
      </header>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-label">
          <span>미션 달성 현황</span>
          <span className="progress-count">{completedCount} / {totalCount}</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="progress-percent">{progress}% 달성!</p>
      </div>

      {isAllCompleted && (
        <div className="victory-banner">
          🎉 모든 미션 달성! 우리 구역이 최고다! 🏆🎉
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
              <div className="mission-num">No.{cell.id}</div>
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
                <p className="mission-desc">🎯 {cell.mission}</p>
              </div>
              <div className={`mission-status ${isCompleted ? 'done' : 'todo'}`}>
                {isCompleted ? '✅ 완료!' : '터치해서 완료 체크'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
