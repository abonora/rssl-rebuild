export interface StandingsResponse {
  id: number;
  title: {
    rendered: string;
  };
  meta_box: {
    year: string;
    standings: [string, string, string, string, string, string, string][];
    quarterFinals: [string, string, string, string, string][];
    semiFinals: [string, string, string, string, string][];
    finals: [string, string, string, string, string][];
  };
}

export interface StandingsData {
  rank: number;
  team: string;
  wins: number;
  losses: number;
  ties: number;
  points: number;
  winPercentage: number;
}

export interface PlayoffMatchup {
  seed1: number;
  team1: string;
  seed2: number;
  team2: string;
  winner: 'team1' | 'team2';
} 