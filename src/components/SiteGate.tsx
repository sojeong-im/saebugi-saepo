import { useState } from 'react';
import './SiteGate.css';

interface SiteGateProps {
  children: React.ReactNode;
}

const SITE_PASSWORD = '00347';
const STORAGE_KEY = 'saebugi_site_auth';

export default function SiteGate({ children }: SiteGateProps) {
  const [isAuthed, setIsAuthed] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === SITE_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthed(true);
    } else {
      setShake(true);
      setInput('');
      setTimeout(() => setShake(false), 600);
    }
  };

  if (isAuthed) return <>{children}</>;

  return (
    <div className="gate-overlay">
      <div className={`gate-card ${shake ? 'shake' : ''}`}>
        <div className="gate-logo">새.포 🥚</div>
        <p className="gate-sub">새부기 세포 미션 플랫폼</p>
        <form onSubmit={handleSubmit} className="gate-form">
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="gate-input"
            autoFocus
            autoComplete="off"
          />
          <button type="submit" className="gate-btn">입장하기 →</button>
        </form>
        {shake && <p className="gate-error">❌ 비밀번호가 틀렸습니다</p>}
      </div>
    </div>
  );
}
