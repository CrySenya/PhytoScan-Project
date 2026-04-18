import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({ path: 'packages/api/.env' });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function seedPlants() {
  console.log('Fetching plants from GBIF...');

  // GBIF free API — returns real plant species records
  const { data } = await axios.get(
    'https://api.gbif.org/v1/species/search?rank=SPECIES&kingdom=Plantae&limit=100'
  );

  const plants = data.results.map((species: any) => ({
    common_name:     species.vernacularName || species.canonicalName,
    scientific_name: species.canonicalName,
    family:          species.family || 'Unknown',
    description:     `A species of the family ${species.family ?? 'plants'}.`,
    fantasy_lore:    `A specimen awaiting its full botanical chronicle.`,
    xp_reward:       10,
  }));

  const { error } = await supabase
    .from('plant_species')
    .upsert(plants, { onConflict: 'scientific_name' });

  if (error) console.error('Seed error:', error.message);
  else console.log(`Seeded ${plants.length} plant species successfully.`);
}

seedPlants();
