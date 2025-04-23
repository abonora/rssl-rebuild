import type { StandingsResponse } from '../types/standings';

const STANDINGS_CACHE_KEY = 'hockey-standings-cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  data: StandingsResponse[];
  timestamp: number;
}

export interface TeamResponse {
  slug: any;
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
    players_to_teams_from?: number[];
  };
}

export interface HomeContent {
  id: number,
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
}

export interface PlayerResponse {
  id: number,
  title: {
    rendered: string;
  };
  meta_box: {
    contractLength: string;
    nhlTeam: string;
    playerPhoto: Array<{ full_url: string }>;
  };
}

export const fetchTeams = async (): Promise<TeamResponse[]> => {
  try {
    const response = await fetch('https://albertobonora.com/feeds/wp-json/wp/v2/teams/');
    if (!response.ok) {
      throw new Error('Failed to fetch teams');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const fetchStandingsData = async (): Promise<StandingsResponse[]> => {
  // Check cache first
  const cached = localStorage.getItem(STANDINGS_CACHE_KEY);
  if (cached) {
    const { data, timestamp }: CachedData = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }

  try {
    const response = await fetch('https://albertobonora.com/feeds/wp-json/wp/v2/seasons/');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: StandingsResponse[] = await response.json();
    
    // Cache the new data
    const cacheData: CachedData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(STANDINGS_CACHE_KEY, JSON.stringify(cacheData));
    localStorage.setItem('currentSeason', data[0].meta_box.year);
    return data;
  } catch (error) {
    // If we have cached data, return it as fallback even if expired
    const cached = localStorage.getItem(STANDINGS_CACHE_KEY);
    if (cached) {
      const { data }: CachedData = JSON.parse(cached);
      return data;
    }
    throw error;
  }
}; 

export const fetchHomeContent = async (): Promise<HomeContent> => {
  try {
    const response = await fetch('https://albertobonora.com/feeds/wp-json/wp/v2/pages/830');
    if (!response.ok) {
      throw new Error('Failed to fetch home content');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching home content:', error);
    throw error;
  }
};

export const fetchPlayerData = async (playerIds: number[]): Promise<PlayerResponse[]> => {
  try {
    const response = await fetch(`https://albertobonora.com/feeds/wp-json/wp/v2/players?include=${playerIds.join(',')}`);
    if (!response.ok) {
      throw new Error('Failed to fetch player data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching player data:', error);
    throw error;
  }
};