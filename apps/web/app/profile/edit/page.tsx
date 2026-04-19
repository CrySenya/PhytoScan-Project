'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const [username, setUsername]     = useState('');
  const [bio,      setBio]          = useState('');
  const [favPlant, setFavPlant]     = useState('');
  const [saving,   setSaving]       = useState(false);
  const [msg,      setMsg]          = useState('');

  useEffect(() => {
    if (profile) { setUsername(profile.username ?? ''); setBio(profile.bio ?? ''); setFavPlant(profile.favorite_plant ?? ''); }
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await supabase.from('user_profiles').update({ username, bio, favorite_plant: favPlant }).eq('id', user.id);
    await refreshProfile();
    setMsg('Profile updated!');
    setSaving(false);
    setTimeout(() => router.push(`/profile/${user.id}`), 1200);
  };

  return (
    <div className='max-w-lg mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold text-green-900 mb-6'>✏️ Edit Profile</h1>
      {msg && <div className='bg-green-50 border border-green-200 text-green-800 rounded-xl p-3 mb-4 text-sm'>{msg}</div>}
      <form onSubmit={save} className='space-y-4 bg-white rounded-2xl p-6 shadow-sm border border-green-100'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)}
            className='w-full px-4 py-3 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400' />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
            placeholder='Tell the community about yourself...'
            className='w-full px-4 py-3 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none' />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Favorite Plant</label>
          <input value={favPlant} onChange={e => setFavPlant(e.target.value)}
            placeholder='e.g. Monstera deliciosa'
            className='w-full px-4 py-3 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400' />
        </div>
        <button type='submit' disabled={saving}
          className='w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition disabled:opacity-50'>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
