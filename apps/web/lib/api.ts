import axios from 'axios';

const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

export const getPlants  = async (search?: string) => {
  const { data } = await client.get('/plants', { params: search ? { search } : {} });
  return data;
};
export const getPlant   = async (id: string) => {
  const { data } = await client.get(`/plants/${id}`);
  return data;
};
export const scanPlant  = async (base64: string) => {
  const { data } = await client.post('/scan', { image: base64 });
  return data;
};
export const getLeaderboard = async () => {
  const { data } = await client.get('/leaderboard');
  return data;
};
