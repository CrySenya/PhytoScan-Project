import Link from 'next/link';

interface Props {
  id: string; common_name: string; scientific_name: string;
  images: string[]; is_new_discovery?: boolean; family?: string;
}

export default function PlantCard({ id, common_name, scientific_name, images, is_new_discovery, family }: Props) {
  return (
    <Link href={`/plant/${id}`}>
      <div className='bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-green-100 cursor-pointer h-full'>
        <div className='relative'>
          {images?.[0] ? (
            <img src={images[0]} alt={common_name} className='w-full h-48 object-cover' />
          ) : (
            <div className='w-full h-48 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center text-6xl'>🌿</div>
          )}
          {is_new_discovery && (
            <span className='absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full'>✨ New</span>
          )}
        </div>
        <div className='p-4'>
          <h3 className='font-bold text-green-900 text-lg leading-tight'>{common_name}</h3>
          <p className='text-green-600 text-sm italic mb-1'>{scientific_name}</p>
          {family && <span className='text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full'>{family}</span>}
        </div>
      </div>
    </Link>
  );
}
