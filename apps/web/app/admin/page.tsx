'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [users,    setUsers]    = useState<any[]>([]);
  const [tab,      setTab]      = useState<'requests'|'users'>('requests');

  useEffect(() => {
    if (!profile) return;
    if (profile.role !== 'superadmin') { router.push('/'); return; }
    supabase.from('rank_requests').select('*, user_profiles(username, rank, xp_points)').eq('status', 'pending').then(({ data }) => setRequests(data ?? []));
    supabase.from('user_profiles').select('*').order('xp_points', { ascending: false }).limit(50).then(({ data }) => setUsers(data ?? []));
  }, [profile]);

  const reviewRequest = async (reqId: string, userId: string, newRank: string, approve: boolean) => {
    await supabase.from('rank_requests').update({ status: approve ? 'approved' : 'rejected', reviewed_by: profile!.id }).eq('id', reqId);
    if (approve) await supabase.from('user_profiles').update({ rank: newRank, is_verified_modder: true, role: 'modder' }).eq('id', userId);
    setRequests(prev => prev.filter(r => r.id !== reqId));
  };

  const toggleModder = async (userId: string, current: boolean) => {
    await supabase.from('user_profiles').update({ is_verified_modder: !current, role: !current ? 'modder' : 'user' }).eq('id', userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_verified_modder: !current, role: !current ? 'modder' : 'user' } : u));
  };

  return (
    <div className='max-w-3xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold text-green-900 mb-6'>🛡 Superadmin Panel</h1>
      <div className='flex gap-2 mb-6'>
        <button onClick={() => setTab('requests')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === 'requests' ? 'bg-green-700 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>Rank Requests ({requests.length})</button>
        <button onClick={() => setTab('users')}    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === 'users'    ? 'bg-green-700 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>Manage Users</button>
      </div>

      {tab === 'requests' && (
        requests.length === 0 ? (
          <div className='text-center py-16 bg-white rounded-2xl border border-green-100'><p className='text-3xl mb-2'>✅</p><p className='text-gray-500'>No pending rank requests.</p></div>
        ) : (
          <div className='space-y-4'>
            {requests.map(r => (
              <div key={r.id} className='bg-white rounded-2xl p-5 border border-green-100 shadow-sm'>
                <p className='font-bold text-green-900'>{r.user_profiles?.username}</p>
                <p className='text-sm text-gray-500 mb-1'>Current: {r.user_profiles?.rank} · {r.user_profiles?.xp_points} XP</p>
                <p className='text-sm text-gray-700 mb-4'>Requesting upgrade to: <strong className='text-green-700'>{r.requested_rank}</strong></p>
                <div className='flex gap-3'>
                  <button onClick={() => reviewRequest(r.id, r.user_id, r.requested_rank, true)} className='flex-1 py-2 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition'>✅ Approve + Grant Modder</button>
                  <button onClick={() => reviewRequest(r.id, r.user_id, r.requested_rank, false)} className='flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition'>❌ Reject</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'users' && (
        <div className='space-y-3'>
          {users.map(u => (
            <div key={u.id} className='bg-white rounded-2xl p-4 border border-green-100 flex items-center gap-3 shadow-sm'>
              <div className='w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold flex-shrink-0'>
                {u.username?.[0]?.toUpperCase()}
              </div>
              <div className='flex-1'>
                <p className='font-bold text-green-900'>{u.username}</p>
                <p className='text-xs text-gray-400'>{u.role} · {u.xp_points} XP · {u.rank}</p>
              </div>
              <button onClick={() => toggleModder(u.id, u.is_verified_modder)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition ${u.is_verified_modder ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}>
                {u.is_verified_modder ? '✗ Remove Modder' : '✓ Grant Modder'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
