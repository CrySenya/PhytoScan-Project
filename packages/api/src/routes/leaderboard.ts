// 
import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// GET /api/leaderboard  — top 50 users by XP
router.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .limit(50);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
