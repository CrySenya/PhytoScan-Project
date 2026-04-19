import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const supabase = createClientComponentClient();

export type UserRole = 'user' | 'modder' | 'admin' | 'superadmin';

export interface Profile {
  id:            string;
  username:      string;
  avatar_url:    string | null;
  bio:           string | null;
  xp_points:     number;
  rank:          string;
  role:          UserRole;
  is_verified_modder: boolean;
  discoveries:   number;
  favorite_plant: string | null;
  created_at:    string;
}
