export interface PlantSpecies {
  id:               string;        // Unique ID (UUID from Supabase)
  common_name:      string;        // e.g. 'Moonbloom Fern'
  scientific_name:  string;        // e.g. 'Pteridium lunaris'
  description:      string;        // Long botanical description
  fantasy_lore:     string;        // The traveller-book style text
  family:           string;        // Plant family e.g. 'Polypodiaceae'
  habitat:          string;        // Where it grows
  images:           string[];      // Array of image URLs
  discovered_by:    string | null; // User ID of discoverer
  is_new_discovery: boolean;       // True if community-submitted new species
  xp_reward:        number;        // XP earned for learning about it
  created_at:       string;        // ISO date string
}
