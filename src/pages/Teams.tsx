import { useState, useEffect } from 'react';
import { fetchTeams } from '../services/api';
import { TeamDetails } from './TeamDetails';

interface Team {
  id: number;
  name: string;
  owner: string;
  logoUrl: string;
}

export const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await fetchTeams();
        const formattedTeams = response.map(team => ({
          id: team.id,
          name: team.title.rendered,
          owner: team.meta_box.owner,
          logoUrl: team.meta_box.teamLogo[0]?.full_url || ''
        }));
        setTeams(formattedTeams);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to load teams');
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  const handleTeamClick = (teamId: string) => {
    setSelectedTeamId(teamId);
  };

  const handleBackClick = () => {
    setSelectedTeamId(null);
  };

  if (loading) {
    return (
      <div className="teams-page">
        <div className="loading">Loading teams...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teams-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (selectedTeamId) {
    return <TeamDetails teamId={selectedTeamId} onBackClick={handleBackClick} />;
  }

  return (
    <div className="teams-page container">
      <h1 className="page-title">Teams</h1>
      <div className="team-grid">
        {teams.map((team) => (
          <div 
            key={team.id} 
            className="team-card"
            onClick={() => handleTeamClick(team.id.toString())}
          >
            <img src={team.logoUrl} alt={`${team.name} Logo`} className="team-logo" />
            <div className="team-info">
              <div className="team-name" dangerouslySetInnerHTML={{__html: team.name}}></div>
              <div className="gm-name">{team.owner}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teams; 