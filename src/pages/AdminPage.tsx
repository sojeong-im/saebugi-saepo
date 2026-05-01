import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teamsData, cellCharacters } from '../data';
import { db } from '../firebase';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import './AdminPage.css';

interface ZoneRank {
  zoneId: string;
  zoneName: string;
  teamName: string;
  count: number;
  lastCompleted: Date | null;
}

export default function AdminPage() {
  const [allMissions, setAllMissions] = useState<Record<string, Record<string, unknown>>>({});
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [rawCount, setRawCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, 'missions'), (querySnapshot) => {
      const data: Record<string, Record<string, unknown>> = {};
      querySnapshot.forEach((doc) => {
        data[doc.id] = doc.data();
      });

      setAllMissions(data);
      setRawCount(querySnapshot.size);
      setLoading(false);
      setLastUpdated(new Date().toLocaleTimeString());
    }, (error) => {
      console.error("Firestore Error:", error);
      alert("데이터를 가져오는 중 오류가 발생했습니다: " + error.message);
      setLoading(false);
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
    return cellCharacters.filter(cell => !!missions[cell.id.toString()]).length;
  };

  const getLastCompleted = (zoneId: string): Date | null => {
    const data = allMissions[zoneId];
    if (!data || !data['_lastCompleted']) return null;
    const ts = data['_lastCompleted'] as Timestamp;
    return ts?.toDate ? ts.toDate() : null;
  };

  const getZoneStatusColor = (zoneId: string) => {
    const count = getMissionCount(zoneId);
    if (count === 10) return '#4caf50';
    if (count > 0) return '#ff9800';
    return '#f0f0f0';
  };

  // Build ranking
  const allZones: ZoneRank[] = teamsData.flatMap(team =>
    team.zones.map(zone => ({
      zoneId: zone.id,
      zoneName: zone.name,
      teamName: team.name,
      count: getMissionCount(zone.id),
      lastCompleted: getLastCompleted(zone.id),
    }))
  );

  const ranking = [...allZones]
    .filter(z => z.count > 0)
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count; // More completed = higher
      // Same count → who completed their last mission earlier wins
      if (a.lastCompleted && b.lastCompleted) return a.lastCompleted.getTime() - b.lastCompleted.getTime();
      if (a.lastCompleted) return -1;
      if (b.lastCompleted) return 1;
      return 0;
    })
    .slice(0, 3);

  const medalEmoji = ['🥇', '🥈', '🥉'];
  const medalColor = ['#FFD700', '#C0C0C0', '#CD7F32'];

  // Summary stats
  const totalZones = 26;
  const completedZonesCount = allZones.filter(z => z.count === 10).length;
  const inProgressZonesCount = allZones.filter(z => z.count > 0 && z.count < 10).length;

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
        <div className="admin-meta-info">
          <span>최근 업데이트: {lastUpdated || '없음'}</span>
          <span>수신 데이터: {rawCount}건</span>
        </div>

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
        <>
          {/* 🏆 Ranking Section */}
          {ranking.length > 0 && (
            <div className="ranking-section">
              <h2 className="ranking-title">🏆 미션 달성 순위</h2>
              <div className="ranking-list">
                {ranking.map((zone, i) => (
                  <div key={zone.zoneId} className="ranking-card" style={{ borderLeft: `8px solid ${medalColor[i]}` }}>
                    <span className="ranking-medal">{medalEmoji[i]}</span>
                    <div className="ranking-info">
                      <div className="ranking-zone">
                        <span className="ranking-zone-name">{zone.zoneName}</span>
                        <span className="ranking-team-name">({zone.teamName})</span>
                      </div>
                      <div className="ranking-detail">
                        <span className="ranking-count">{zone.count} / 10 달성</span>
                        {zone.lastCompleted && (
                          <span className="ranking-time">
                            마지막 완료: {zone.lastCompleted.toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ranking-bar-bg">
                      <div className="ranking-bar-fill" style={{ width: `${(zone.count / 10) * 100}%`, background: medalColor[i] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                              className={`mission-dot ${!!zoneData[cell.id.toString()] ? 'done' : ''}`}
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
        </>
      )}

      {rawCount > 0 && Object.keys(allMissions).length > 0 && (
        <div className="admin-debug-section">
          <h3>수신 데이터 ID 목록 (디버그용):</h3>
          <p>{Object.keys(allMissions).join(', ')}</p>
        </div>
      )}
    </div>
  );
}
