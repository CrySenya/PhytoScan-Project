'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function ModerationPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [edits,   setEdits]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    if (!['modder','admin','superadmin'].includes(profile.role)) { router.push('/'); return; }
    supabase.from('description_edits').select('*, user_profiles(username)').eq('status', 'pending').order('created_at', { ascending: true }).then(({ data }) => { setEdits(data ?? []); setLoading(false); });
  }, [profile]);

  const review = async (editId: string, submittedBy: string, plantId: string, fieldName: string, newValue: string, approve: boolean) => {
    await supabase.from('description_edits').update({ status: approve ? 'approved' : 'rejected', reviewed_by: user!.id }).eq('id', editId);
    if (approve) {
      await supabase.from('plant_species').update({ [fieldName]: newValue }).eq('id', plantId);
      const { data: u } = await supabase.from('user_profiles').select('xp_points').eq('id', submittedBy).single();
      await supabase.from('user_profiles').update({ xp_points: (u?.xp_points ?? 0) + 25 }).eq('id', submittedBy);
    }
    setEdits(prev => prev.filter(e => e.id !== editId));
  };

  return (
    <div className='max-w-2xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold text-green-900 mb-2'>⚡ Moderation Queue</h1>
      <p className='text-green-700 mb-6'>Review pending edits. Approving awards the user 25 XP.</p>
      {loading ? <div className='text-center text-green-600 py-20'>Loading...</div> : edits.length === 0 ? (
        <div className='text-center py-16 bg-white rounded-2xl border border-green-100'><p className='text-3xl mb-2'>✅</p><p className='text-gray-500'>No pending edits. All caught up!</p></div>
      ) : (
        <div className='space-y-4'>
          {edits.map(e => (
            <div key={e.id} className='bg-white rounded-2xl p-5 border border-green-100 shadow-sm'>
              <div className='flex items-center gap-2 mb-3'>
                <span className='text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium'>{e.field_name}</span>
                <span className='text-xs text-gray-400'>by {e.user_profiles?.username ?? 'Unknown'}</span>
              </div>
              {e.old_value && (
                <div className='bg-red-50 rounded-xl p-3 mb-2'>
                  <p className='text-xs text-red-500 font-medium mb-1'>Current text:</p>
                  <p className='text-sm text-gray-700 line-clamp-3'>{e.old_value}</p>
                </div>
              )}
              <div className='bg-green-50 rounded-xl p-3 mb-4'>
                <p className='text-xs text-green-600 font-medium mb-1'>Proposed text:</p>
                <p className='text-sm text-gray-700'>{e.new_value}</p>
              </div>
              <div className='flex gap-3'>
                <button onClick={() => review(e.id, e.submitted_by, e.plant_id, e.field_name, e.new_value, true)} className='flex-1 py-2 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition'>✅ Approve (+25 XP)</button>
                <button onClick={() => review(e.id, e.submitted_by, e.plant_id, e.field_name, e.new_value, false)} className='flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition'>❌ Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
