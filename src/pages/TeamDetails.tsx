import { useState, useEffect } from 'react';
import { fetchTeams } from '../services/api';
import { PlayerCard } from '../components/PlayerCard';

interface Team {
  id: number;
  title: {
    rendered: string;
  };
  meta_box: {
    owner: string;
    teamLogo: Array<{ full_url: string }>;
    founded?: string;
    homeArena?: string;
    teamColors?: string;
  };
}

interface TeamDetailsProps {
  teamId: string;
  onBackClick: () => void;
}

export function TeamDetails({ teamId, onBackClick }: TeamDetailsProps) {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sample player data - replace with actual data from API when available
  const players = [
    { name: 'John Smith', tenure: 'forever' as const, photoUrl: 'https://picsum.photos/200' },
    { name: 'Mike Johnson', tenure: 'year 1' as const, photoUrl: 'https://picsum.photos/201' },
    { name: 'David Wilson', tenure: 'year 2' as const, photoUrl: 'https://picsum.photos/202' },
    { name: 'Chris Brown', tenure: 'year 3' as const, photoUrl: 'https://picsum.photos/203' },
  ];

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const teams = await fetchTeams();
        const foundTeam = teams.find(t => t.id.toString() === teamId);
        if (foundTeam) {
          setTeam(foundTeam);
        } else {
          setError('Team not found');
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to load team details');
        setLoading(false);
      }
    };

    loadTeam();
  }, [teamId]);

  if (loading) {
    return (
      <div className="team-details container">
        <div className="loading">Loading team details...</div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="team-details container">
        <div className="error">{error || 'Team not found'}</div>
        <button className="all-teams-button" onClick={onBackClick}>
          Back to Teams
        </button>
      </div>
    );
  }

  return (
    <div className="team-details container">
      <div className="team-details-content">
        <div className="team-header">
          <h1>{team.title.rendered}</h1>
          <p className="gm-title">GM: {team.meta_box.owner}</p>
        </div>
        
        <div className="team-info-section">
          <img 
            src={team.meta_box.teamLogo[0]?.full_url || ''} 
            alt={`${team.title.rendered} Logo`} 
            className="team-logo-large" 
          />
          <div className="team-stats">
            <div className="stat-item">
              <h3>Founded</h3>
              <p>{team.meta_box.founded || 'N/A'}</p>
            </div>
            <div className="stat-item">
              <h3>Home Arena</h3>
              <p>{team.meta_box.homeArena || 'N/A'}</p>
            </div>
            <div className="stat-item">
              <h3>Team Colors</h3>
              <p>{team.meta_box.teamColors || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="player-cards">
          {players.map((player, index) => (
            <PlayerCard
              key={index}
              name={player.name}
              tenure={player.tenure}
              photoUrl={player.photoUrl}
            />
          ))}
        </div>

        <button className="all-teams-button" onClick={onBackClick}>
          Back to Teams
        </button>
      </div>
    </div>
  );
} 