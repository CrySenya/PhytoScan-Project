export interface PhytoUser {
  id:            string;
  username:      string;
  email:         string;
  avatar_url:    string | null;
  xp_points:     number;          // Total XP earned
  rank:          string;          // e.g. 'Seedling', 'Botanist', 'Sage'
  discoveries:   number;          // Count of confirmed new species
  created_at:    string;
}
