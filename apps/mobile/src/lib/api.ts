import axios from 'axios';
import { API_BASE_URL } from './config';

const client = axios.create({ baseURL: API_BASE_URL });

export interface PlantSpecies {
  id:               string;
  common_name:      string;
  scientific_name:  string;
  description:      string;
  fantasy_lore:     string;
  family:           string;
  habitat:          string;
  images:           string[];
  discovered_by:    string | null;
  is_new_discovery: boolean;
  xp_reward:        number;
  created_at:       string;
}

export const getPlants = async (search?: string): Promise<PlantSpecies[]> => {
  const params = search ? { search } : {};
  const { data } = await client.get('/plants', { params });
  return data;
};

export const getPlant = async (id: string): Promise<PlantSpecies> => {
  const { data } = await client.get(`/plants/${id}`);
  return data;
};

export const scanPlant = async (base64Image: string) => {
  const { data } = await client.post('/scan', { image: base64Image });
  return data;
};

export const submitDiscovery = async (payload: {
  user_id: string;
  plant_name: string;
  description: string;
  images: string[];
}) => {
  const { data } = await client.post('/submissions', payload);
  return data;
};

export const getLeaderboard = async () => {
  const { data } = await client.get('/leaderboard');
  return data;
};