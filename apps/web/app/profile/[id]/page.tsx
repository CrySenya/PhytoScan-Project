'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/AuthContext';
import { getRank } from '../../../lib/ranks';
import Link from 'next/link';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { user, profile: myProfile, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isOwn = user?.id === params.id;

  useEffect(() => {
    supabase.from('user_profiles').select('*').eq('id', params.id).single().then(({ data }) => setProfile(data));
    supabase.from('plant_gallery').select('*').eq('user_id', params.id).order('created_at', { ascending: false }).then(({ data }) => {
      setGallery(data ?? []); setLoading(false);
    });
  }, [params.id]);

  const toggleFavorite = async (galleryId: string, current: boolean) => {
    await supabase.from('plant_gallery').update({ is_favorite: !current }).eq('id', galleryId);
    setGallery(prev => prev.map(g => g.id === galleryId ? { ...g, is_favorite: !current } : g));
  };

  const deleteAccount = async () => {
    if (!confirm('Are you sure? This cannot be undone.')) return;
    await supabase.from('user_profiles').delete().eq('id', user!.id);
    await supabase.auth.admin.deleteUser(user!.id).catch(() => {});
    await signOut();
  };

  if (loading) return <div className='text-center py-20 text-green-600'>Loading...</div>;
  if (!profile) return <div className='text-center py-20 text-red-500'>User not found.</div>;

  const rank = getRank(profile.xp_points ?? 0);
  const favorites = gallery.filter(g => g.is_favorite);
  const discoveries = gallery.filter(g => !g.is_favorite);

  return (
    <div className='max-w-2xl mx-auto px-4 py-8'>
      <div className='bg-white rounded-2xl p-6 mb-6 shadow-sm border border-green-100'>
        <div className='flex items-start gap-5'>
          <div className='w-20 h-20 rounded-full bg-green-700 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0'>
            {profile.username?.[0]?.toUpperCase()}
          </div>
          <div className='flex-1'>
            <div className='flex items-center gap-2 flex-wrap'>
              <h1 className='text-2xl font-bold text-green-900'>{profile.username}</h1>
              {profile.is_verified_modder && <span className='text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold'>✓ Verified Modder</span>}
            </div>
            <div className='flex items-center gap-2 mt-1'>
              <span className={`text-xs px-2 py-0.5 rounded-full ${rank.color}`}>{rank.emoji} {rank.name}</span>
              <span className='text-xs text-gray-400'>{profile.xp_points ?? 0} XP</span>
              <span className='text-xs text-gray-400'>·</span>
              <span className='text-xs text-gray-400'>{profile.discoveries ?? 0} discoveries</span>
            </div>
            {profile.bio && <p className='text-gray-600 text-sm mt-2'>{profile.bio}</p>}
            {profile.favorite_plant && (
              <p className='text-sm text-green-700 mt-1'>🌿 Favorite: <strong>{profile.favorite_plant}</strong></p>
            )}
          </div>
        </div>

        {isOwn && (
          <div className='flex gap-3 mt-5 pt-5 border-t border-green-50'>
            <Link href='/profile/edit' className='flex-1 text-center py-2 bg-green-100 text-green-800 rounded-xl text-sm font-semibold hover:bg-green-200 transition'>✏️ Edit Profile</Link>
            <button onClick={signOut} className='flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition'>Sign Out</button>
            <button onClick={deleteAccount} className='flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition'>Delete Account</button>
          </div>
        )}
      </div>

      {favorites.length > 0 && (
        <div className='mb-6'>
          <h2 className='font-bold text-green-900 text-xl mb-3'>⭐ Favorite Plants</h2>
          <div className='grid grid-cols-3 gap-2'>
            {favorites.map(g => (
              <div key={g.id} className='relative group'>
                <img src={g.image_url} alt={g.plant_name} className='w-full h-28 object-cover rounded-xl' />
                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl p-2'>
                  <p className='text-white text-xs font-medium truncate'>{g.plant_name}</p>
                </div>
                {isOwn && (
                  <button onClick={() => toggleFavorite(g.id, g.is_favorite)} className='absolute top-1 right-1 bg-white/80 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-white'>⭐</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className='font-bold text-green-900 text-xl mb-3'>📷 Plant Discoveries</h2>
        {gallery.length === 0 ? (
          <div className='text-center py-12 text-gray-400 bg-white rounded-2xl border border-green-100'>
            <p className='text-3xl mb-2'>🌱</p>
            <p>{isOwn ? 'Scan plants to add them to your gallery!' : 'No discoveries yet.'}</p>
          </div>
        ) : (
          <div className='grid grid-cols-3 gap-2'>
            {gallery.map(g => (
              <div key={g.id} className='relative group'>
                <img src={g.image_url} alt={g.plant_name} className='w-full h-28 object-cover rounded-xl' />
                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl p-2'>
                  <p className='text-white text-xs font-medium truncate'>{g.plant_name}</p>
                </div>
                {isOwn && (
                  <button onClick={() => toggleFavorite(g.id, g.is_favorite)} title='Mark as favorite'
                    className={`absolute top-1 right-1 rounded-full w-6 h-6 flex items-center justify-center text-xs ${g.is_favorite ? 'bg-yellow-400' : 'bg-white/80 hover:bg-white'}`}>
                    ⭐
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
