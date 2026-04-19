'use client';
import { createContext, useContext, useState } from 'react';

const mockProfile = {
  id: 'demo-user-123',
  username: 'PhytoAdmin',
  avatar_url: null,
  bio: 'Demo account for PhytoScan',
  xp_points: 1500,
  rank: 'Sage',
  role: 'superadmin' as const,
  is_verified_modder: true,
  discoveries: 12,
  favorite_plant: 'Monstera deliciosa',
  created_at: new Date().toISOString(),
};

const mockUser = { id: 'demo-user-123', email: 'demo@phytoscan.app' };

interface AuthCtx {
  user: any;
  profile: any;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: mockUser,
  profile: mockProfile,
  loading: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user]    = useState(mockUser);
  const [profile] = useState(mockProfile);

  const signOut = async () => {
    window.location.href = '/login';
  };

  return (
    <Ctx.Provider value={{ user, profile, loading: false, signOut, refreshProfile: async () => {} }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);