import type { Team } from '../data';
import ZoneCard from './ZoneCard';

interface TeamSectionProps {
  team: Team;
}

export default function TeamSection({ team }: TeamSectionProps) {
  return (
    <section className="team-section animate-fade-in">
      <h2 className="team-title">{team.name} 전시관</h2>
      <div className="zones-grid">
        {team.zones.map((zone) => (
          <ZoneCard key={zone.id} zone={zone} />
        ))}
      </div>
    </section>
  );
}
