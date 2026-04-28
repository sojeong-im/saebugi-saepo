import type { Zone } from '../data';

interface ZoneCardProps {
  zone: Zone;
}

export default function ZoneCard({ zone }: ZoneCardProps) {
  return (
    <div className="zone-card">
      <div className="zone-header">
        <div className="cell-avatar-container">
          <img src={zone.cellImage} alt="Cell avatar" className="cell-avatar" />
        </div>
        <div className="zone-info">
          <h3 className="zone-name">{zone.name}</h3>
          <p className="zone-story">{zone.story}</p>
        </div>
      </div>
      
      <div className="cuts-container">
        {zone.cuts.map((cut) => (
          <div key={cut.id} className="cut-item">
            <div className="cut-video-wrapper">
              <img src={cut.image} alt={cut.title} className="cut-thumbnail" />
              <div className="play-icon">▶</div>
            </div>
            <p className="cut-title">{cut.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
