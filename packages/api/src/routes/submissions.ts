// Calls claude to assist with the write-up
import { Router } from 'express';
import { supabase } from '../lib/supabase';
import axios from 'axios';

const router = Router();

// POST /api/submissions  — submit a new plant discovery
router.post('/', async (req, res) => {
  const { user_id, plant_name, description, images } = req.body;

  // Ask Claude to enhance the user's draft description
  const aiRes = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: `A community botanist has submitted this description of a plant called
'${plant_name}': "${description}". Expand and improve this description
in the style of a magical botanical field guide. Keep their observations
but add scientific context and fantasy flavour. Max 150 words.`
      }]
    },
    { headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' } }
  );

  const ai_analysis = aiRes.data.content[0].text;

  const { data, error } = await supabase
    .from('plant_submissions')
    .insert({ user_id, plant_name, description, images, ai_analysis, status: 'pending' })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// GET /api/submissions?user_id=xxx  — get user's submissions
router.get('/', async (req, res) => {
  const { user_id } = req.query;
  const { data, error } = await supabase
    .from('plant_submissions')
    .select('*')
    .eq('user_id', user_id)
    .order('submitted_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
