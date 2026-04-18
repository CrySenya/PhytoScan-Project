// Handles browsing of plant species
import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// GET /api/plants  — list all plants (with optional search query)
router.get('/', async (req, res): Promise<void> => {
  const { search, limit = '20', offset = '0' } = req.query;
  let query = supabase
    .from('plant_species')
    .select('*')
    .order('created_at', { ascending: false })
    .range(Number(offset), Number(offset) + Number(limit) - 1);

  if (search) {
    query = query.ilike('common_name', `%${search}%`);
  }

  const { data, error } = await query;
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});

router.get('/:id', async (req, res): Promise<void> => {
  const { data, error } = await supabase
    .from('plant_species')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) { res.status(404).json({ error: 'Plant not found' }); return; }
  res.json(data);
});

export default router;
