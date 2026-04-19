'use client';
import { useEffect, useState } from 'react';
import { getPlants } from '../lib/api';
import PlantCard from '../components/PlantCard';
import { useAuth } from '../lib/AuthContext';
import { useRouter } from 'next/navigation';
import { getRank } from '../lib/ranks';

export default function HomePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [plants,  setPlants]  = useState<any[]>([]);
  const [search,  setSearch]  = useState('');
  const [fetching,setFetching]= useState(true);
  const rank = profile ? getRank(profile.xp_points) : null;

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  useEffect(() => {
    getPlants().then(setPlants).finally(() => setFetching(false));
  }, []);

  const handleSearch = async () => {
    setFetching(true);
    const data = await getPlants(search || undefined);
    setPlants(data);
    setFetching(false);
  };

  if (loading) return <div className='flex justify-center items-center min-h-screen'><div className='text-green-700 text-lg'>Loading...</div></div>;

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      {profile && rank && (
        <div className='bg-white rounded-2xl p-5 mb-8 flex items-center gap-4 shadow-sm border border-green-100'>
          <div className='w-14 h-14 rounded-full bg-green-700 flex items-center justify-center text-2xl font-bold text-white'>
            {profile.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className='font-bold text-green-900 text-lg'>Welcome back, {profile.username}!</p>
            <div className='flex items-center gap-2 mt-1'>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rank.color}`}>{rank.emoji} {rank.name}</span>
              <span className='text-xs text-gray-500'>{profile.xp_points} XP</span>
              {profile.is_verified_modder && <span className='text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold'>✓ Verified Modder</span>}
            </div>
          </div>
        </div>
      )}

      <div className='mb-8'>
        <h2 className='text-2xl font-bold text-green-900 mb-4'>🔍 Search Plants</h2>
        <div className='flex gap-2'>
          <input type='text' placeholder='Search by name, family, or habitat...'
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className='flex-1 px-4 py-3 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white' />
          <button onClick={handleSearch} className='px-6 py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition'>Search</button>
        </div>
      </div>

      <h2 className='text-2xl font-bold text-green-900 mb-4'>🌿 Plant Directory</h2>
      {fetching ? (
        <div className='text-center text-green-600 py-20'>Loading plants...</div>
      ) : plants.length === 0 ? (
        <div className='text-center text-green-600 py-20'>No plants found.</div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {plants.map(p => <PlantCard key={p.id} {...p} />)}
        </div>
      )}
    </div>
  );
}
