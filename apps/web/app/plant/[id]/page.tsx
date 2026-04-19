'use client';
import { useEffect, useState } from 'react';
import { getPlant } from '../../../lib/api';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/AuthContext';
import Link from 'next/link';

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className='flex justify-between py-2 border-b border-green-50 last:border-0'>
    <span className='text-gray-500 text-sm'>{label}</span>
    <span className='text-gray-800 text-sm font-medium text-right max-w-[60%]'>{value}</span>
  </div>
);

export default function PlantDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [plant,   setPlant]   = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [submitMsg, setSubmitMsg] = useState('');

  useEffect(() => {
    getPlant(params.id).then(setPlant).finally(() => setLoading(false));
    supabase.from('plant_gallery').select('*').eq('plant_name', params.id).limit(8).then(({ data }) => setGallery(data ?? []));
  }, [params.id]);

  const submitEdit = async () => {
    if (!user || !editValue.trim()) return;
    await supabase.from('description_edits').insert({
      plant_id: params.id, submitted_by: user.id,
      field_name: editField, old_value: plant?.[editField] ?? '',
      new_value: editValue, status: 'pending',
    });
    setEditing(false); setEditField(''); setEditValue('');
    setSubmitMsg('Your edit has been submitted for moderation. You will earn 25 XP if approved!');
  };

  if (loading) return <div className='flex justify-center items-center min-h-screen'><p className='text-green-600'>Loading...</p></div>;
  if (!plant) return <div className='text-center py-20'><p className='text-red-500'>Plant not found.</p></div>;

  return (
    <div className='max-w-3xl mx-auto px-4 py-8'>
      <Link href='/' className='text-green-700 hover:underline text-sm mb-6 block'>← Back to directory</Link>

      {plant.images?.[0] ? (
        <img src={plant.images[0]} alt={plant.common_name} className='w-full h-72 object-cover rounded-2xl mb-6 shadow' />
      ) : (
        <div className='w-full h-72 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center text-9xl mb-6'>🌿</div>
      )}

      <div className='flex items-start justify-between mb-2'>
        <div>
          <h1 className='text-3xl font-bold text-green-900'>{plant.common_name}</h1>
          <p className='text-green-600 italic'>{plant.scientific_name}</p>
        </div>
        {user && (<button onClick={() => setEditing(true)} className='text-sm bg-green-100 text-green-800 px-3 py-1.5 rounded-xl hover:bg-green-200 transition font-medium'>✏️ Suggest Edit</button>)}
      </div>

      {submitMsg && <div className='bg-green-50 border border-green-200 text-green-800 rounded-xl p-3 mb-4 text-sm'>{submitMsg}</div>}

      {plant.fantasy_lore && (
        <div className='bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-5'>
          <h2 className='font-bold text-amber-800 mb-2'>✨ Field Guide Entry</h2>
          <p className='text-amber-900 leading-relaxed'>{plant.fantasy_lore}</p>
        </div>
      )}

      {plant.description && (
        <div className='bg-white border border-green-100 rounded-2xl p-5 mb-5'>
          <h2 className='font-bold text-green-800 mb-2'>📋 Description</h2>
          <p className='text-gray-700 leading-relaxed'>{plant.description}</p>
        </div>
      )}

      <div className='bg-white border border-green-100 rounded-2xl p-5 mb-5'>
        <h2 className='font-bold text-green-800 mb-3'>🌡️ Growing Conditions</h2>
        <InfoRow label='Family'     value={plant.family ?? 'Unknown'} />
        <InfoRow label='Habitat'    value={plant.habitat ?? 'Unknown'} />
        <InfoRow label='Temperature' value={plant.temperature ?? '65°F – 85°F (18°C – 30°C)'} />
        <InfoRow label='Sunlight'   value={plant.sunlight ?? 'Bright indirect light'} />
        <InfoRow label='Location'   value={plant.location ?? 'Indoors or Outdoors'} />
        <InfoRow label='Soil'       value={plant.soil_type ?? 'Well-draining potting mix'} />
        <InfoRow label='Soil pH'    value={plant.soil_ph ?? '6.0 – 7.0'} />
        <InfoRow label='Humidity'   value={plant.humidity ?? 'Medium (40–60%)'} />
      </div>

      <div className='bg-white border border-green-100 rounded-2xl p-5 mb-5'>
        <h2 className='font-bold text-green-800 mb-3'>🐛 Pests and Diseases</h2>
        <InfoRow label='Common Pests'    value={plant.pests ?? 'Aphids, spider mites, mealybugs'} />
        <InfoRow label='Common Diseases' value={plant.diseases ?? 'Root rot, leaf spot'} />
        <InfoRow label='Recommended Spray' value={plant.pest_spray ?? 'Neem oil or insecticidal soap'} />
      </div>

      <div className='grid grid-cols-2 gap-4 mb-5'>
        <div className={`rounded-2xl p-4 flex items-center gap-3 ${plant.pet_friendly ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <span className='text-2xl'>{plant.pet_friendly ? '✅' : '⚠️'}</span>
          <div>
            <p className='font-bold text-sm'>{plant.pet_friendly ? 'Pet Friendly' : 'Pet Toxic'}</p>
            <p className='text-xs text-gray-500'>{plant.pet_friendly ? 'Safe around pets' : 'Keep away from animals'}</p>
          </div>
        </div>
        <div className='bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3'>
          <span className='text-2xl'>💊</span>
          <div>
            <p className='font-bold text-sm text-blue-800'>Health Benefits</p>
            <p className='text-xs text-gray-600'>{plant.health_benefits ?? 'Air purifying'}</p>
          </div>
        </div>
      </div>

      {plant.planting_guide && (
        <div className='bg-white border border-green-100 rounded-2xl p-5 mb-5'>
          <h2 className='font-bold text-green-800 mb-3'>🪴 How to Plant — Step by Step</h2>
          <ol className='space-y-3'>
            {(Array.isArray(plant.planting_guide) ? plant.planting_guide : plant.planting_guide.split('\n').filter(Boolean)).map((step: string, i: number) => (
              <li key={i} className='flex gap-3'>
                <span className='w-6 h-6 rounded-full bg-green-700 text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5'>{i+1}</span>
                <span className='text-gray-700 text-sm leading-relaxed'>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {gallery.length > 0 && (
        <div className='mb-5'>
          <h2 className='font-bold text-green-800 mb-3'>📷 Community Photo Gallery</h2>
          <div className='grid grid-cols-3 gap-2'>
            {gallery.map(g => (
              <img key={g.id} src={g.image_url} alt={g.plant_name} className='w-full h-28 object-cover rounded-xl' />
            ))}
          </div>
        </div>
      )}

      {editing && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4'>
          <div className='bg-white rounded-2xl p-6 w-full max-w-lg'>
            <h3 className='font-bold text-green-900 text-xl mb-4'>Suggest an Edit</h3>
            <p className='text-sm text-gray-500 mb-4'>Your suggestion will be reviewed by a verified modder. You earn 25 XP if approved.</p>
            <select value={editField} onChange={e => { setEditField(e.target.value); setEditValue(plant[e.target.value] ?? ''); }}
              className='w-full px-3 py-2 rounded-xl border border-green-200 mb-3 text-sm'>
              <option value=''>Select field to edit</option>
              <option value='description'>Description</option>
              <option value='common_name'>Common Name</option>
              <option value='habitat'>Habitat</option>
              <option value='health_benefits'>Health Benefits</option>
              <option value='planting_guide'>Planting Guide</option>
            </select>
            <textarea value={editValue} onChange={e => setEditValue(e.target.value)} rows={5}
              className='w-full px-3 py-2 rounded-xl border border-green-200 mb-4 text-sm resize-none' placeholder='Enter your suggested text...' />
            <div className='flex gap-3'>
              <button onClick={submitEdit} className='flex-1 py-2 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition text-sm'>Submit for Review</button>
              <button onClick={() => setEditing(false)} className='flex-1 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition text-sm'>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
