import { supabase } from '../lib/supabase';

// Rank thresholds — adjust as you like
const RANKS = [
  { name: 'Seedling',     min: 0    },
  { name: 'Sprout',       min: 100  },
  { name: 'Botanist',     min: 500  },
  { name: 'Field Scholar',min: 1500 },
  { name: 'Herbalist',    min: 3000 },
  { name: 'Sage',         min: 6000 },
  { name: 'Grand Sage',   min: 10000},
];

export const getRank = (xp: number): string => {
  const rank = [...RANKS].reverse().find(r => xp >= r.min);
  return rank?.name ?? 'Seedling';
};

// Award XP to a user and update their rank
export const awardXP = async (userId: string, amount: number): Promise<void> => {
  const { data: user } = await supabase
    .from('user_profiles')
    .select('xp_points')
    .eq('id', userId)
    .single();

  if (!user) return;

  const newXP   = user.xp_points + amount;
  const newRank = getRank(newXP);

  await supabase
    .from('user_profiles')
    .update({ xp_points: newXP, rank: newRank })
    .eq('id', userId);
};
