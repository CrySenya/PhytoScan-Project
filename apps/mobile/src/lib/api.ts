import axios from 'axios';
import { API_BASE_URL } from './config';
import type { PlantSpecies, PlantSubmission } from '@phytoscan/shared';

const client = axios.create({ baseURL: API_BASE_URL });

// Fetch all plants (with optional search term)
export const getPlants = async (search?: string): Promise<PlantSpecies[]> => {
  const params = search ? { search } : {};
  const { data } = await client.get('/plants', { params });
  return data;
};

// Fetch one plant by ID
export const getPlant = async (id: string): Promise<PlantSpecies> => {
  const { data } = await client.get(`/plants/${id}`);
  return data;
};

// Scan a plant photo — base64 image string
export const scanPlant = async (base64Image: string) => {
  const { data } = await client.post('/scan', { image: base64Image });
  return data;
};

// Submit a new discovery
export const submitDiscovery = async (payload: {
  user_id: string;
  plant_name: string;
  description: string;
  images: string[];
}): Promise<PlantSubmission> => {
  const { data } = await client.post('/submissions', payload);
  return data;
};

// Fetch leaderboard
export const getLeaderboard = async () => {
  const { data } = await client.get('/leaderboard');
  return data;
};
