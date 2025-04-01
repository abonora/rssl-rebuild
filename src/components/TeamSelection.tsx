import { useState, useEffect } from 'react';
import { fetchTeams } from '../services/api';

interface TeamSelectionProps {
  onSelectTeam: (teamId: string) => void;
  onCancel: () => void;
}

export const TeamSelection = ({ onSelectTeam, onCancel }: TeamSelectionProps) => {
  const [teams, setTeams] = useState<Array<{
    id: number;
    name: string;
    owner: string;
    logoUrl: string;
  }>>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleTeamClick = (teamId: number) => {
    setSelectedTeamId(teamId.toString());
  };

  const handleSelectClick = () => {
    if (selectedTeamId) {
      onSelectTeam(selectedTeamId);
    }
  };

  if (loading) {
    return (
      <div className="team-selection">
        <h1>Select Your Team</h1>
        <div className="loading">Loading teams...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="team-selection">
        <h1>Select Your Team</h1>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="team-selection container">
      <h1>Select Your Team</h1>
      <div className="team-grid">
        {teams.map((team) => (
          <div
            key={team.id}
            className={`team-card ${selectedTeamId === team.id.toString() ? 'selected' : ''}`}
            onClick={() => handleTeamClick(team.id)}
          >
            <img src={team.logoUrl} alt={`${team.name} Logo`} className="team-logo" />
            <div className="team-info">
              <div className="team-name">{team.name}</div>
              <div className="gm-name">{team.owner}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="action-buttons">
        <button
          className="btn btn-primary"
          onClick={handleSelectClick}
          disabled={!selectedTeamId}
        >
          Select
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TeamSelection; 