import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teamsData, cellCharacters } from '../data';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import './MissionPage.css';

export default function MissionPage() {
  const [activeTeam, setActiveTeam] = useState<number | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [zoneMissions, setZoneMissions] = useState<Record<number, boolean>>({});
  const [hatchingCellId, setHatchingCellId] = useState<number | null>(null);

  // Subscribe to selected zone's mission status
  useEffect(() => {
    if (!selectedZoneId) return;

    const docRef = doc(db, 'missions', selectedZoneId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setZoneMissions(docSnap.data() as Record<number, boolean>);
      } else {
        setZoneMissions({});
      }
    });

    return () => unsubscribe();
  }, [selectedZoneId]);

  const toggleMission = async (cellId: number) => {
    if (!selectedZoneId) return;

    const isCurrentlyCompleted = zoneMissions[cellId] || false;
    
    if (isCurrentlyCompleted) {
      // Un-complete
      const newMissions = { ...zoneMissions, [cellId]: false };
      await setDoc(doc(db, 'missions', selectedZoneId), newMissions, { merge: true });
    } else {
      // Hatching animation
      setHatchingCellId(cellId);
      setTimeout(async () => {
        const newMissions = { ...zoneMissions, [cellId]: true };
        await setDoc(doc(db, 'missions', selectedZoneId), newMissions, { merge: true });
        setHatchingCellId(null);
      }, 800);
    }
  };

  const currentTeam = teamsData.find(t => t.id === activeTeam);
  const selectedZone = currentTeam?.zones.find(z => z.id === selectedZoneId);

  const completedCount = Object.values(zoneMissions).filter(Boolean).length;
  const totalCount = cellCharacters.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  if (!activeTeam) {
    return (
      <div className="app-container">
        <header className="header">
          <h1 className="logo">새.포 🎯</h1>
          <p className="subtitle">소속 팀을 선택해주세요!</p>
        </header>
        <div className="selection-grid">
          {teamsData.map(team => (
            <button key={team.id} className="selection-card" onClick={() => setActiveTeam(team.id)}>
              {team.name}
            </button>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/" className="mission-link-btn" style={{ background: 'var(--border-color)' }}>🏠 홈으로</Link>
        </div>
      </div>
    );
  }

  if (!selectedZoneId) {
    return (
      <div className="app-container">
        <header className="header">
          <h1 className="logo">{activeTeam}팀 구역 선택</h1>
          <p className="subtitle">본인의 구역을 선택해주세요!</p>
          <button className="mission-link-btn" onClick={() => setActiveTeam(null)} style={{ background: 'var(--border-color)' }}>⬅️ 팀 다시 선택</button>
        </header>
        <div className="selection-grid">
          {currentTeam?.zones.map(zone => (
            <button key={zone.id} className="selection-card" onClick={() => setSelectedZoneId(zone.id)}>
              {zone.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="logo">{selectedZone?.name} 미션</h1>
        <p className="subtitle">10가지 세포 미션을 모두 완료하고 우승하세요!</p>
        <div className="header-buttons">
          <button className="mission-link-btn" onClick={() => setSelectedZoneId(null)} style={{ background: 'var(--border-color)', fontSize: '0.9rem' }}>⬅️ 구역 변경</button>
          <Link to="/" className="mission-link-btn" style={{ background: 'var(--border-color)', fontSize: '0.9rem' }}>🏠 홈으로</Link>
        </div>
      </header>

      <div className="progress-section">
        <div className="progress-label">
          <span>미션 달성률</span>
          <span className="progress-count">{completedCount} / {totalCount}</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="progress-percent">{progress}% 달성!</p>
      </div>

      {completedCount === totalCount && (
        <div className="victory-banner">
          🎉 모든 미션 달성! 우리 구역이 최고다! 🏆🎉
        </div>
      )}

      <div className="mission-grid">
        {cellCharacters.map(cell => {
          const isCompleted = zoneMissions[cell.id] || false;
          const isHatching = hatchingCellId === cell.id;

          return (
            <div
              key={cell.id}
              className={`mission-card ${isCompleted ? 'completed' : ''}`}
              onClick={() => !isHatching && toggleMission(cell.id)}
            >
              <div className="mission-num">No.{cell.id}</div>
              <div className="mission-avatar-container">
                {isCompleted ? (
                  <div className="hatch-wrapper">
                    <img
                      src={cell.img}
                      alt={cell.name}
                      className="mission-avatar hatched"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/cell_joy_1777374728744.png';
                      }}
                    />
                    <span className="sparkle s1">✦</span>
                    <span className="sparkle s2">✦</span>
                    <span className="sparkle s3">✦</span>
                    <span className="sparkle s4">★</span>
                  </div>
                ) : isHatching ? (
                  <div className="egg hatching">🥚</div>
                ) : (
                  <div className="egg">🥚</div>
                )}
              </div>
              <div className="mission-info">
                <h3>{isCompleted ? cell.name : '???'}</h3>
                <p className="mission-desc">🎯 {cell.mission}</p>
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
