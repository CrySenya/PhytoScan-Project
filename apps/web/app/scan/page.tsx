'use client';
import { useState, useRef } from 'react';
import { scanPlant } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className='flex justify-between py-2 border-b border-green-50 last:border-0'>
    <span className='text-gray-500 text-sm'>{label}</span>
    <span className='text-gray-800 text-sm font-medium text-right max-w-[60%]'>{value}</span>
  </div>
);

export default function ScanPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [result,  setResult]  = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imgPrev, setImgPrev] = useState<string | null>(null);
  const [saved,   setSaved]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const prev   = reader.result as string;
      setImgPrev(prev);
      setLoading(true); setResult(null); setSaved(false);
      try {
        const data = await scanPlant(base64);
        setResult(data);
        if (user) {
          await supabase.from('user_profiles').update({ xp_points: (profile?.xp_points ?? 0) + 5 }).eq('id', user.id);
          await refreshProfile();
        }
      } catch { alert('Scan failed. Please try again.'); }
      finally { setLoading(false); }
    };
    reader.readAsDataURL(file);
  };

  const saveToGallery = async () => {
    if (!user || !result || !imgPrev) return;
    const { error } = await supabase.storage.from('plant-images').upload(`${user.id}/${Date.now()}.jpg`, await fetch(imgPrev).then(r => r.blob()));
    if (!error) {
      await supabase.from('plant_gallery').insert({ user_id: user.id, plant_name: result.plant_name, image_url: imgPrev, description: result.fantasy_lore });
      setSaved(true);
    }
  };

  return (
    <div className='max-w-2xl mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-green-900 mb-2'>📷 Scan a Plant</h1>
      <p className='text-green-700 mb-6'>Upload a photo to identify a plant and get its full care profile.</p>

      <div onClick={() => fileRef.current?.click()}
        className='border-2 border-dashed border-green-300 rounded-2xl p-10 text-center cursor-pointer hover:bg-green-50 transition mb-6'>
        <input ref={fileRef} type='file' accept='image/*' capture='environment' onChange={handleFile} className='hidden' />
        {imgPrev ? (
          <img src={imgPrev} alt='Plant' className='max-h-64 mx-auto rounded-xl object-cover' />
        ) : (
          <><div className='text-5xl mb-3'>🌿</div><p className='text-green-700 font-medium'>Tap to take photo or upload image</p><p className='text-sm text-gray-400 mt-1'>JPG, PNG supported</p></>
        )}
      </div>

      {loading && <div className='text-center text-green-600 py-8'><div className='animate-spin text-4xl mb-3'>🌿</div><p>Identifying plant...</p></div>}

      {result && (
        <div className='space-y-4'>
          <div className='bg-white rounded-2xl p-5 border border-green-100'>
            <div className='flex items-start justify-between mb-3'>
              <div>
                <h2 className='text-2xl font-bold text-green-900'>{result.plant_name}</h2>
                <p className='text-sm text-gray-500'>Confidence: {Math.round((result.confidence ?? 0.9) * 100)}%</p>
              </div>
              <div className='text-right'>
                <span className='inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium'>🌱 Healthy</span>
              </div>
            </div>
            {result.fantasy_lore && <p className='text-gray-700 leading-relaxed text-sm'>{result.fantasy_lore}</p>}
          </div>

          <div className='bg-white border border-green-100 rounded-2xl p-5'>
            <h3 className='font-bold text-green-800 mb-3'>🌡️ Growing Conditions</h3>
            <InfoRow label='Temperature' value='65°F – 85°F (18°C – 30°C)' />
            <InfoRow label='Sunlight'    value='Bright indirect light' />
            <InfoRow label='Location'    value='Indoors or Outdoors' />
            <InfoRow label='Soil'        value='Well-draining potting mix, 5.5–7.0 pH' />
            <InfoRow label='Humidity'    value='Medium (40–60%)' />
          </div>

          <div className='bg-white border border-red-100 rounded-2xl p-5'>
            <h3 className='font-bold text-red-700 mb-3'>🐛 Pests and Diseases</h3>
            <InfoRow label='Common Pests'    value='Aphids, spider mites, mealybugs, scales' />
            <InfoRow label='Common Diseases' value='Root rot, leaf spot' />
            <InfoRow label='Recommended Spray' value='Neem oil or insecticidal soap' />
          </div>

          {user && (
            <button onClick={saveToGallery} disabled={saved}
              className='w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition disabled:opacity-50'>
              {saved ? '✅ Saved to your gallery!' : '💾 Save to My Gallery (+5 XP)'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
