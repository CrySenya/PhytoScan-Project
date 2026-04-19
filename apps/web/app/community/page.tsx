'use client';
import { useEffect, useState } from 'react';
import { getLeaderboard } from '../../lib/api';
import { getRank } from '../../lib/ranks';
import Link from 'next/link';

export default function CommunityPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getLeaderboard().then(setLeaders).finally(() => setLoading(false)); }, []);

  return (
    <div className='max-w-2xl mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-green-900 mb-2'>🏆 Community Leaderboard</h1>
      <p className='text-green-700 mb-6'>Top botanists ranked by XP. Click a profile to see their discoveries.</p>

      {loading ? <div className='text-center text-green-600 py-20'>Loading...</div> : (
        <div className='space-y-3'>
          {leaders.map((u, i) => {
            const rank = getRank(u.xp_points ?? 0);
            return (
              <Link key={u.id} href={`/profile/${u.id}`}>
                <div className='bg-white rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition border border-green-100 cursor-pointer'>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${ i === 0 ? 'bg-yellow-400 text-yellow-900' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-orange-300 text-orange-900' : 'bg-green-100 text-green-700'}`}>
                    {i < 3 ? ['🥇','🥈','🥉'][i] : i + 1}
                  </div>
                  <div className='w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold'>
                    {u.username?.[0]?.toUpperCase()}
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <p className='font-bold text-green-900'>{u.username}</p>
                      {u.is_verified_modder && <span className='text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold'>✓ Modder</span>}
                    </div>
                    <div className='flex items-center gap-2 mt-0.5'>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${rank.color}`}>{rank.emoji} {rank.name}</span>
                      <span className='text-xs text-gray-400'>{u.discoveries ?? 0} discoveries</span>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-bold text-green-700'>{u.xp_points ?? 0}</p>
                    <p className='text-xs text-gray-400'>XP</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
