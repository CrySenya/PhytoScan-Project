export const RANKS = [
  { name: 'Seedling',  min: 0,    emoji: '🌱', color: 'bg-green-100 text-green-800' },
  { name: 'Botanist',  min: 200,  emoji: '🌿', color: 'bg-emerald-100 text-emerald-800' },
  { name: 'Traveller', min: 600,  emoji: '🧭', color: 'bg-teal-100 text-teal-800' },
  { name: 'Sage',      min: 1500, emoji: '🌳', color: 'bg-cyan-100 text-cyan-800' },
];

export const getRank = (xp: number) => {
  return [...RANKS].reverse().find(r => xp >= r.min) ?? RANKS[0];
};

export const XP_REWARDS = {
  PHOTO_UPLOAD:       10,
  DESCRIPTION_APPROVED: 25,
  SCAN_PLANT:         5,
};
