import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type UserRole = 'user' | 'modder' | 'admin' | 'superadmin';

export interface Profile {
  id:                 string;
  username:           string;
  avatar_url:         string | null;
  bio:                string | null;
  xp_points:          number;
  rank:               string;
  role:               UserRole;
  is_verified_modder: boolean;
  discoveries:        number;
  favorite_plant:     string | null;
  created_at:         string;
}