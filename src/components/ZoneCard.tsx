import type { Zone } from '../data';
import CutItem from './CutItem';

interface ZoneCardProps {
  zone: Zone;
}

export default function ZoneCard({ zone }: ZoneCardProps) {
  return (
    <div className="zone-card">
      <div className="zone-header">
        <div className="cell-avatar-container">
          <img 
            src={zone.cellImage} 
            alt="Cell avatar" 
            className="cell-avatar" 
            onError={(e) => {
              // Fallback to placeholder if character image is missing
              (e.target as HTMLImageElement).src = '/cell_joy_1777374728744.png';
            }}
          />
        </div>
        <div className="zone-info">
          <h3 className="zone-name">{zone.name}</h3>
          <p className="zone-story">{zone.story}</p>
        </div>
      </div>
      
      <div className="cuts-container">
        {zone.cuts.map((cut) => (
          <CutItem key={cut.id} cut={cut} />
        ))}
      </div>
    </div>
  );
}
