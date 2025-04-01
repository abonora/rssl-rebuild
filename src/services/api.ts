import type { StandingsResponse } from '../types/standings';

const STANDINGS_CACHE_KEY = 'hockey-standings-cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  data: StandingsResponse[];
  timestamp: number;
}

interface TeamResponse {
  id: number;
  title: {
    rendered: string;
  };
  meta_box: {
    owner: string;
    teamLogo: {
      full_url: string;
    }[];
  };
}

export const fetchTeams = async (): Promise<TeamResponse[]> => {
  try {
    const response = await fetch('https://run.mocky.io/v3/6879c769-2873-4662-ba15-e2a1a451da48');
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
    const response = await fetch('https://run.mocky.io/v3/ce81c6fd-e184-4d01-b873-f93fb921275c');
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