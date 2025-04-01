import { useState, useEffect } from 'react';
import { fetchTeams, fetchPlayerData, PlayerResponse } from '../services/api';
import { PlayerCard } from './PlayerCard';

interface TeamPlayersProps {
  teamId: string;
}

export const TeamPlayers = ({ teamId }: TeamPlayersProps) => {
  const [team, setTeam] = useState<{
    name: string;
    owner: string;
    logoUrl: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<PlayerResponse[]>([]);

  // Sample player data - replace with actual data from API when available
  // const players = [
  //   { name: 'John Smith', tenure: 'forever' as const, photoUrl: 'https://picsum.photos/200' },
  //   { name: 'Mike Johnson', tenure: 'year 1' as const, photoUrl: 'https://picsum.photos/201' },
  //   { name: 'David Wilson', tenure: 'year 2' as const, photoUrl: 'https://picsum.photos/202' },
  //   { name: 'Chris Brown', tenure: 'year 3' as const, photoUrl: 'https://picsum.photos/203' },
  // ];

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const teams = await fetchTeams();
        const selectedTeam = teams.find(t => t.id.toString() === teamId);
        
        if (selectedTeam) {
          setTeam({
            name: selectedTeam.title.rendered,
            owner: selectedTeam.meta_box.owner,
            logoUrl: selectedTeam.meta_box.teamLogo[0]?.full_url || ''
          });
          if (selectedTeam.meta_box.players_to_teams_from) {
            const playerIds = selectedTeam.meta_box.players_to_teams_from.map(Number);
            const playerData = await fetchPlayerData(playerIds);
            setPlayers(playerData);
          }
        } else {
          setError('Team not found');
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to load team');
        setLoading(false);
      }
    };

    loadTeam();
  }, [teamId]);

  if (loading) {
    return <div className="loading">Loading team details...</div>;
  }

  if (error || !team) {
    return <div className="error">{error || 'Team not found'}</div>;
  }

  return (
    <div className="team-details container">
      <div className="team-details-content">
        <div className="team-header">
          <h1>{team.name}</h1>
          <p className="gm-title">Owner: {team.owner}</p>
          <img src={team.logoUrl} alt={`${team.name} Logo`} className="team-logo-small" />
        </div>
        
        <div className="player-cards">
        {players.map((player) => (
            <PlayerCard
              key={player.id}
              name={player.title.rendered}
              tenure={player.meta_box.contractLength}
              photoUrl={player.meta_box.playerPhoto[0].full_url}
              nhlTeam={player.meta_box.nhlTeam}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPlayers; 