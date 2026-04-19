'use client';
import Link from 'next/link';
import { useAuth } from '../lib/AuthContext';
import { getRank } from '../lib/ranks';
import { useState } from 'react';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const rank = profile ? getRank(profile.xp_points) : null;

  return (
    <nav className='bg-green-900 text-white sticky top-0 z-50 shadow-lg'>
      <div className='max-w-6xl mx-auto px-4 py-3 flex items-center justify-between'>
        <Link href='/' className='text-xl font-bold flex items-center gap-2'>
          🌿 <span>PhytoScan</span>
        </Link>

        <div className='hidden md:flex items-center gap-6 text-sm font-medium'>
          <Link href='/' className='hover:text-green-300 transition'>Home</Link>
          <Link href='/scan' className='hover:text-green-300 transition'>Scan</Link>
          <Link href='/community' className='hover:text-green-300 transition'>Community</Link>
          {profile?.role === 'modder' || profile?.role === 'admin' || profile?.role === 'superadmin' ? (
            <Link href='/moderation' className='hover:text-yellow-300 transition'>⚡ Moderate</Link>
          ) : null}
          {profile?.role === 'superadmin' ? (
            <Link href='/admin' className='hover:text-red-300 transition'>🛡 Admin</Link>
          ) : null}
        </div>

        <div className='flex items-center gap-3'>
          {user && profile ? (
            <div className='relative'>
              <button onClick={() => setMenuOpen(!menuOpen)} className='flex items-center gap-2'>
                <div className='w-8 h-8 rounded-full bg-green-600 flex items-center justify-center font-bold text-sm'>
                  {profile.username?.[0]?.toUpperCase() ?? 'U'}
                </div>
                {rank && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rank.color}`}>
                    {rank.emoji} {rank.name}
                  </span>
                )}
                {profile.is_verified_modder && (
                  <span className='text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold'>✓ Modder</span>
                )}
              </button>
              {menuOpen && (
                <div className='absolute right-0 top-10 bg-white text-gray-800 rounded-xl shadow-xl w-48 py-2 z-50'>
                  <Link href={`/profile/${profile.id}`} className='block px-4 py-2 hover:bg-green-50 text-sm' onClick={() => setMenuOpen(false)}>My Profile</Link>
                  <Link href='/profile/edit' className='block px-4 py-2 hover:bg-green-50 text-sm' onClick={() => setMenuOpen(false)}>Edit Profile</Link>
                  <hr className='my-1 border-green-100' />
                  <button onClick={() => { signOut(); setMenuOpen(false); }} className='w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600'>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <Link href='/login' className='bg-green-600 hover:bg-green-500 px-4 py-2 rounded-xl text-sm font-semibold transition'>Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
