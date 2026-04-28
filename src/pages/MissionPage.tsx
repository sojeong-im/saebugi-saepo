import { useState } from 'react';
import { Link } from 'react-router-dom';
import { teamsData } from '../data';
import './MissionPage.css';

export default function MissionPage() {
  const [activeTeam, setActiveTeam] = useState<number>(1);
  const [completedZones, setCompletedZones] = useState<string[]>([]);
  const [hatchingZones, setHatchingZones] = useState<string[]>([]); // currently animating

  const toggleZone = (zoneId: string) => {
    if (completedZones.includes(zoneId)) {
      // Un-complete: just remove
      setCompletedZones(completedZones.filter(id => id !== zoneId));
    } else {
      // Start hatch animation, then mark complete after delay
      setHatchingZones(prev => [...prev, zoneId]);
      setTimeout(() => {
        setCompletedZones(prev => [...prev, zoneId]);
        setHatchingZones(prev => prev.filter(id => id !== zoneId));
      }, 800); // egg shake duration
    }
  };

  const allZones = teamsData.flatMap(t => t.zones);
  const totalZones = allZones.length;
  const completedCount = completedZones.length;
  const progress = totalZones > 0 ? Math.round((completedCount / totalZones) * 100) : 0;
  const isAllCompleted = completedCount === totalZones;

  const currentTeam = teamsData.find(t => t.id === activeTeam)!;
  const teamCompleted = currentTeam.zones.filter(z => completedZones.includes(z.id)).length;

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="logo">세포 미션 보드 🎯</h1>
        <p className="subtitle">모든 구역의 미션을 달성하고 최고의 팀이 되세요!</p>
        <Link to="/" className="mission-link-btn" style={{ background: 'var(--border-color)' }}>
          🏠 메인으로 돌아가기
        </Link>
      </header>

      {/* Overall Progress */}
      <div className="progress-section">
        <div className="progress-label">
          <span>전체 미션 달성 현황</span>
          <span className="progress-count">{completedCount} / {totalZones} 구역</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="progress-percent">{progress}% 달성!</p>
      </div>

      {isAllCompleted && (
        <div className="victory-banner">
          🎉 모든 구역 미션 달성! 우리가 최고다! 🏆🎉
        </div>
      )}

      {/* Team Tabs */}
      <nav className="team-nav">
        {teamsData.map(team => {
          const teamZonesDone = team.zones.filter(z => completedZones.includes(z.id)).length;
          const isTeamDone = teamZonesDone === team.zones.length;
          return (
            <button
              key={team.id}
              className={`team-tab ${activeTeam === team.id ? 'active' : ''} ${isTeamDone ? 'team-done' : ''}`}
              onClick={() => setActiveTeam(team.id)}
            >
              {isTeamDone ? '✅ ' : ''}{team.name}
              <span className="tab-progress"> {teamZonesDone}/{team.zones.length}</span>
            </button>
          );
        })}
      </nav>

      <div className="team-progress-info">
        <strong>{currentTeam.name}</strong> — {teamCompleted} / {currentTeam.zones.length} 구역 완료
      </div>

      {/* Zone Mission Cards */}
      <div className="mission-grid">
        {currentTeam.zones.map((zone) => {
          const isCompleted = completedZones.includes(zone.id);
          const isHatching = hatchingZones.includes(zone.id);

          return (
            <div
              key={zone.id}
              className={`mission-card ${isCompleted ? 'completed' : ''}`}
              onClick={() => !isHatching && toggleZone(zone.id)}
            >
              <div className="mission-num">구역 {zone.id}</div>

              {/* Avatar: egg or character */}
              <div className="mission-avatar-container">
                {isCompleted ? (
                  /* Hatched: show character with pop-in animation */
                  <div className="hatch-wrapper">
                    <img
                      src={zone.cellImage}
                      alt={zone.cellName}
                      className="mission-avatar hatched"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/cell_joy_1777374728744.png';
                      }}
                    />
                    {/* Sparkle elements */}
                    <span className="sparkle s1">✦</span>
                    <span className="sparkle s2">✦</span>
                    <span className="sparkle s3">✦</span>
                    <span className="sparkle s4">★</span>
                  </div>
                ) : isHatching ? (
                  /* Hatching: egg shaking */
                  <div className="egg hatching">🥚</div>
                ) : (
                  /* Idle: egg */
                  <div className="egg">🥚</div>
                )}
              </div>

              <div className="mission-info">
                <h3>{isCompleted ? zone.cellName : '???'}</h3>
                <p className="mission-zone-label">{zone.name}</p>
                <p className="mission-desc">🎯 {zone.mission}</p>
              </div>

              <div className={`mission-status ${isCompleted ? 'done' : isHatching ? 'hatching-status' : 'todo'}`}>
                {isCompleted ? '✅ 완료!' : isHatching ? '🥚 부화 중...' : '클릭해서 완료 체크'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
