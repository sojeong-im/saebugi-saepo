import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teamsData, cellCharacters } from '../data';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import './AdminPage.css';

export default function AdminPage() {
  const [allMissions, setAllMissions] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribe = onSnapshot(collection(db, 'missions'), (querySnapshot) => {
      const data: Record<string, Record<string, boolean>> = {};
      querySnapshot.forEach((doc) => {
        // Force all keys to be strings for consistency
        const docData = doc.data();
        const formattedData: Record<string, boolean> = {};
        Object.entries(docData).forEach(([key, value]) => {
          formattedData[key.toString()] = !!value;
        });
        data[doc.id] = formattedData;
      });
      setAllMissions(data);
      setLoading(false);
      setLastUpdated(new Date().toLocaleTimeString());
    }, (error) => {
      console.error("Firestore Error:", error);
      alert("데이터를 가져오는 중 오류가 발생했습니다: " + error.message);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0314') {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다!');
      setPassword('');
    }
  };

  const getMissionCount = (zoneId: string) => {
    const missions = allMissions[zoneId] || {};
    return Object.values(missions).filter(Boolean).length;
  };

  const getZoneStatusColor = (zoneId: string) => {
    const count = getMissionCount(zoneId);
    if (count === 10) return '#4caf50'; // Completed
    if (count > 0) return '#ff9800'; // In Progress
    return '#f0f0f0'; // Not Started
  };

  // Total Summary stats
  const totalZones = 26;
  const zoneList = Object.keys(allMissions);
  const completedZonesCount = zoneList.filter(id => {
    const missions = allMissions[id] || {};
    return Object.values(missions).filter(Boolean).length === 10;
  }).length;
  
  const inProgressZonesCount = zoneList.filter(id => {
    const count = Object.values(allMissions[id] || {}).filter(Boolean).length;
    return count > 0 && count < 10;
  }).length;

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <h1 className="admin-title">새.포 관리자 🔒</h1>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-password-input"
              autoFocus
            />
            <button type="submit" className="mission-link-btn" style={{ width: '100%', marginTop: '1rem' }}>
              접속하기
            </button>
          </form>
          <Link to="/" style={{ display: 'block', marginTop: '1.5rem', color: 'var(--text-muted)' }}>홈으로 돌아가기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title">새.포 관리자 🛠️</h1>
        <p className="admin-subtitle">실시간 미션 현황판 (총 26개 구역)</p>
        {lastUpdated && <p className="last-updated">최근 업데이트: {lastUpdated}</p>}
        
        <div className="admin-summary-grid">
          <div className="summary-item">
            <span className="summary-label">전체 구역</span>
            <span className="summary-value">{totalZones}</span>
          </div>
          <div className="summary-item completed">
            <span className="summary-label">완료 구역</span>
            <span className="summary-value">{completedZonesCount}</span>
          </div>
          <div className="summary-item in-progress">
            <span className="summary-label">진행 중</span>
            <span className="summary-value">{inProgressZonesCount}</span>
          </div>
        </div>

        <Link to="/" className="mission-link-btn" style={{ background: 'var(--border-color)', color: 'white', marginTop: '1.5rem' }}>🏠 홈으로</Link>
      </header>

      {loading ? (
        <div className="loading">현황판을 불러오는 중...</div>
      ) : (
        <div className="admin-content">
          {teamsData.map(team => (
            <div key={team.id} className="admin-team-section">
              <h2 className="admin-team-title">{team.name} 현황</h2>
              <div className="admin-zone-grid">
                {team.zones.map(zone => {
                  const count = getMissionCount(zone.id);
                  const isFullyCompleted = count === 10;
                  const zoneData = allMissions[zone.id] || {};
                  
                  return (
                    <div 
                      key={zone.id} 
                      className={`admin-zone-card ${isFullyCompleted ? 'fully-done' : ''}`}
                      style={{ borderLeft: `8px solid ${getZoneStatusColor(zone.id)}` }}
                    >
                      <div className="admin-zone-info">
                        <div className="admin-zone-meta">
                          <span className="admin-zone-name">{zone.name}</span>
                          <span className="admin-cell-name">{zone.cellName}</span>
                        </div>
                        <span className="admin-zone-count">{count} / 10</span>
                      </div>
                      <div className="admin-mission-dots">
                        {cellCharacters.map(cell => (
                          <div 
                            key={cell.id} 
                            className={`mission-dot ${zoneData[cell.id.toString()] ? 'done' : ''}`}
                            title={`${cell.name}: ${cell.mission}`}
                          />
                        ))}
                      </div>
                      {isFullyCompleted && <div className="complete-badge">완료! 🏆</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
