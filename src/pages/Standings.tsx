import { useState, useEffect } from 'react';
import { FaTshirt } from 'react-icons/fa';
import type { StandingsResponse, StandingsData, PlayoffMatchup } from '../types/standings';
import { fetchStandingsData, fetchTeams } from '../services/api';
import stanleyCup from './../assets/stanleycup.png';

interface TeamLogo {
  name: string;
  slug: string;
  logoUrl: string;
}

export const Standings = () => {
  const [view, setView] = useState<'standings' | 'playoffs'>('standings');
  //const currentSeason =  localStorage.getItem('currentSeason');
  const [selectedSeason, setSelectedSeason] = useState('2024/2025');
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const [seasons, setSeasons] = useState<StandingsResponse[]>([]);
  const [teamLogos, setTeamLogos] = useState<TeamLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [standingsData, teamsData] = await Promise.all([
          fetchStandingsData(),
          fetchTeams()
        ]);

        const logos = teamsData.map(team => ({
          name: team.title.rendered,
          slug: team.slug,
          logoUrl: team.meta_box.teamLogo[0]?.full_url || ''
        }));

        setTeamLogos(logos);
        setSeasons(standingsData);
        setLoading(false);
      } catch {
        setError('Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getTeamLogo = (teamName: string) => {
    return teamLogos.find(team => team.name.replace(/&#8217;/g, '').replace(/'/g, '').replace(/ /g, '-').toLowerCase() === teamName.replace(/'/g, '').replace(/ /g, '-').toLowerCase())?.logoUrl;
  };

  const currentSeasonData = seasons.find(season => season.meta_box.year === selectedSeason);

  const standings: StandingsData[] = currentSeasonData?.meta_box.standings.map(row => ({
    rank: parseInt(row[0]),
    team: row[1],
    wins: parseInt(row[2]),
    losses: parseInt(row[3]),
    ties: parseInt(row[4]),
    points: parseInt(row[5]),
    winPercentage: parseFloat(row[6])
  })) || [];

  const parsePlayoffMatchup = (matchupData: [string, string, string, string, string]): PlayoffMatchup => ({
    seed1: parseInt(matchupData[0]),
    team1: matchupData[1],
    seed2: parseInt(matchupData[2]),
    team2: matchupData[3] === 'Bye' ? '' : matchupData[3],
    winner: matchupData[4] === matchupData[1] ? 'team1' : 'team2'
  });

  const quarterFinals = currentSeasonData?.meta_box.quarterFinals.map(parsePlayoffMatchup) || [];
  const semiFinals = currentSeasonData?.meta_box.semiFinals.map(parsePlayoffMatchup) || [];
  const finals = currentSeasonData?.meta_box.finals.map(parsePlayoffMatchup) || [];

  const handleViewToggle = () => {
    setView(view === 'standings' ? 'playoffs' : 'standings');
  };

  const handleSeasonSelect = (year: string) => {
    setSelectedSeason(year);
    setIsSeasonDropdownOpen(false);
  };

  const renderMatchup = (matchup: PlayoffMatchup) => (
    <div className="matchup">
      <div className={`team ${matchup.winner === 'team1' ? 'winner' : matchup.winner === 'team2' ? 'loser' : ''}`}>
        <span className="seed">{matchup.seed1}</span>
        <span className="name">{matchup.team1}</span>
      </div>
      {matchup.team2 && (
        <>
          <div className="vs">vs</div>
          <div className={`team ${matchup.winner === 'team2' ? 'winner' : matchup.winner === 'team1' ? 'loser' : ''}`}>
            <span className="seed">{matchup.seed2}</span>
            <span className="name">{matchup.team2}</span>
          </div>
        </>
      )}
      {!matchup.team2 && <span className="bye">BYE</span>}
    </div>
  );

  const renderStandingsTable = () => (
    <div className="standings-table">
      <div className="standings-table-content">
        <div className="standings-table-header">
          <div className="rank-cell">Team</div>
          <div className="stat-cell">Wins</div>
          <div className="stat-cell">Losses</div>
          <div className="stat-cell">Ties</div>
          <div className="stat-cell">Pts.</div>
          <div className="stat-cell">Win %</div>
        </div>

        {standings.map((team, index) => (
          <div key={index} className="standings-row">
            <div className="rank-cell">
              <span className="rank">{team.rank}</span>
              <div className="team-logo">
                {getTeamLogo(team.team) ? (
                  <img src={getTeamLogo(team.team)} alt={`${team.team} logo`} />
                ) : (
                  <FaTshirt size={20} color="white" />
                )}
              </div>
              <span className="team-name">{team.team}</span>
            </div>
            <div className="stat-cell">{team.wins}</div>
            <div className="stat-cell">{team.losses}</div>
            <div className="stat-cell">{team.ties}</div>
            <div className="stat-cell">{team.points}</div>
            <div className="stat-cell">{team.winPercentage.toFixed(3)}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPlayoffsBracket = () => (
    <div className="playoffs-bracket">
      <div className="bracket-rounds">
        <div className="round quarters">
          <h3>Quarters</h3>
          {quarterFinals.map((matchup, index) => (
            <div key={index}>{renderMatchup(matchup)}</div>
          ))}
        </div>

        <div className="round semis">
          <h3>Semis</h3>
          {semiFinals.map((matchup, index) => (
            <div key={index}>{renderMatchup(matchup)}</div>
          ))}
        </div>

        <div className="round finals">
          <h3>Finals</h3>
          {finals.map((matchup, index) => (
            <div key={index}>{renderMatchup(matchup)}</div>
          ))}
        </div>
      </div>

      {finals.length > 0 && (
        <div className="trophy-section">
          <img src={stanleyCup} alt="Stanley Cup Trophy" className="trophy-image" />
          <h2 className="champion">{finals[0].winner === 'team1' ? finals[0].team1 : finals[0].team2}</h2>
        </div>
      )}
    </div>
  );

  if (loading) {
    return <div className="loading">Loading standings...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="standings-page container">
      <div className="standings-header">
        <h1 className="page-title">
          {view === 'standings' ? 'Season' : 'Playoffs'} {selectedSeason}
        </h1>
        <div className="standings-controls">
          <div className="season-selector">
            <button 
              className="season-button" 
              onClick={() => setIsSeasonDropdownOpen(!isSeasonDropdownOpen)}
            >
              {selectedSeason} ▼
            </button>
            {isSeasonDropdownOpen && (
              <div className="season-dropdown">
                {seasons.map(season => (
                  <div
                    key={season.id}
                    className={`season-option ${season.meta_box.year === selectedSeason ? 'selected' : ''}`}
                    onClick={() => handleSeasonSelect(season.meta_box.year)}
                  >
                    {season.meta_box.year}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button 
            className="view-toggle-button"
            onClick={handleViewToggle}
          >
            {view === 'standings' ? 'View Playoffs' : 'View Standings'}
          </button>
        </div>
      </div>

      {view === 'standings' ? renderStandingsTable() : renderPlayoffsBracket()}
    </div>
  );
};

export default Standings; 