// Receives photo and sends to Plant.id for identification
import { Router } from 'express';
import axios from 'axios';

const router = Router();

// POST /api/scan  — body: { image: 'base64string' }
router.post('/', async (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ error: 'No image provided' });

  try {
    // ── Step 1: Identify the plant with Plant.id ─────────────────────────
    const plantIdResponse = await axios.post(
      'https://api.plant.id/v2/identify',
      { images: [image], plant_details: ['common_names', 'taxonomy', 'wiki_description'] },
      { headers: { 'Api-Key': process.env.PLANTID_API_KEY } }
    );

    const topMatch    = plantIdResponse.data.suggestions[0];
    const plantName   = topMatch.plant_name;
    const confidence  = topMatch.probability;
    const commonNames = topMatch.plant_details?.common_names || [];

    // ── Step 2: Ask Claude for a deep botanical description ───────────────
    const claudeResponse = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are a botanical scholar writing entries for a traveller's
field guide in a fantastical world where plants have magical properties.
Write a detailed entry for: ${plantName} (also known as ${commonNames.join(', ')}).
Include: 1) What the plant looks like, 2) Where it grows, 3) Its real-world
medicinal or ecological uses written as if they are magical properties,
4) A short piece of lore a traveller might tell about this plant.
Keep it educational but enchanting. About 200 words.`
        }]
      },
      { headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' } }
    );

    const fantasyDescription = claudeResponse.data.content[0].text;

    // ── Step 3: Return everything to the app ─────────────────────────────
    res.json({
      plant_name:    plantName,
      common_names:  commonNames,
      confidence:    confidence,
      fantasy_lore:  fantasyDescription,
    });

  } catch (err: any) {
    console.error('Scan error:', err.message);
    res.status(500).json({ error: 'Scan failed. Please try again.' });
  }
});

export default router;
