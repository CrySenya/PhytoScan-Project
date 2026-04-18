// Calls claude to assist with the write-up
import { Router } from 'express';
import { supabase } from '../lib/supabase';
import axios from 'axios';

const router = Router();

// POST /api/submissions  — submit a new plant discovery
router.post('/', async (req, res): Promise<void> => {
  const { user_id, plant_name, description, images } = req.body;

  const aiRes = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [{
        parts: [{ text: `A community botanist submitted this description of a plant called
'${plant_name}': "${description}". Expand and improve this in the style
of a magical botanical field guide. Keep their observations but add
scientific context and fantasy flavour. Max 150 words.` }]
      }]
    }
  );

  const ai_analysis = aiRes.data.candidates[0].content.parts[0].text;

  const { data, error } = await supabase
    .from('plant_submissions')
    .insert({ user_id, plant_name, description, images, ai_analysis, status: 'pending' })
    .select()
    .single();

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(201).json(data);
});

router.get('/', async (req, res): Promise<void> => {
  const { user_id } = req.query;
  const { data, error } = await supabase
    .from('plant_submissions')
    .select('*')
    .eq('user_id', user_id)
    .order('submitted_at', { ascending: false });
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});

export default router;
