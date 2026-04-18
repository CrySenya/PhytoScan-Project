import { Router } from 'express';
import axios from 'axios';

const router = Router();

// POST /api/scan  — body: { image: 'base64string' }
router.post('/', async (req, res): Promise<void> => {
  const { image } = req.body as { image: string };
  if (!image) { res.status(400).json({ error: 'No image provided' }); return; }

  try {
    const buffer   = Buffer.from(image, 'base64');
    const FormData = require('form-data');
    const form     = new FormData();
    form.append('image', buffer, { filename: 'plant.jpg', contentType: 'image/jpeg' });

    const plantRes = await axios.post(
      'https://api.inaturalist.org/v1/computervision/score_image',
      form,
      { headers: { ...form.getHeaders() } }
    );

    const topMatch   = plantRes.data.results[0];
    const plantName  = topMatch.taxon.preferred_common_name || topMatch.taxon.name;
    const confidence = topMatch.combined_score;

    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: `You are a botanical scholar writing entries for a
traveller's field guide in a fantastical world where plants have magical
properties. Write a detailed entry for: ${plantName}.
Include: 1) What it looks like, 2) Where it grows, 3) Its real-world
uses written as magical properties, 4) A short traveller's lore.
Keep it educational but enchanting. About 200 words.` }]
        }]
      }
    );

    const fantasyDescription = geminiRes.data.candidates[0].content.parts[0].text;

    res.json({ plant_name: plantName, confidence, fantasy_lore: fantasyDescription });

  } catch (err: any) {
    console.error('Scan error:', err.message);
    res.status(500).json({ error: 'Scan failed. Please try again.' });
  }
});

export default router;