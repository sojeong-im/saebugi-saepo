import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teamsData, cellCharacters } from '../data';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import './AdminPage.css';

export default function AdminPage() {
  const [allMissions, setAllMissions] = useState<Record<string, Record<number, boolean>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'missions'), (querySnapshot) => {
      const data: Record<string, Record<number, boolean>> = {};
      querySnapshot.forEach((doc) => {
        data[doc.id] = doc.data() as Record<number, boolean>;
      });
      setAllMissions(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title">새.포 관리자 🛠️</h1>
        <p className="admin-subtitle">실시간 미션 현황판 (총 26개 구역)</p>
        <Link to="/" className="mission-link-btn" style={{ background: 'var(--border-color)', color: 'white' }}>🏠 홈으로</Link>
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
                  return (
                    <div 
                      key={zone.id} 
                      className="admin-zone-card"
                      style={{ borderLeft: `8px solid ${getZoneStatusColor(zone.id)}` }}
                    >
                      <div className="admin-zone-info">
                        <span className="admin-zone-name">{zone.name}</span>
                        <span className="admin-zone-count">{count} / 10</span>
                      </div>
                      <div className="admin-mission-dots">
                        {cellCharacters.map(cell => (
                          <div 
                            key={cell.id} 
                            className={`mission-dot ${allMissions[zone.id]?.[cell.id] ? 'done' : ''}`}
                            title={cell.name}
                          />
                        ))}
                      </div>
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
