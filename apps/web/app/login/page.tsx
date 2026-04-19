'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push('/');
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleFacebook = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-green-50 px-4'>
      <div className='bg-white rounded-3xl shadow-lg p-8 w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-green-900'>🌿 PhytoScan</h1>
          <p className='text-green-700 mt-1'>Sign in to the community</p>
        </div>

        {error && <div className='bg-red-50 text-red-700 rounded-xl p-3 mb-4 text-sm'>{error}</div>}

        <form onSubmit={handleEmail} className='space-y-4'>
          <input type='email' placeholder='Email address' value={email}
            onChange={e => setEmail(e.target.value)} required
            className='w-full px-4 py-3 rounded-xl border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-900 placeholder-gray-400' />
          <input type='password' placeholder='Password' value={password}
            onChange={e => setPassword(e.target.value)} required
            className='w-full px-4 py-3 rounded-xl border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-900 placeholder-gray-400' />
          <button type='submit' disabled={loading}
            className='w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition disabled:opacity-50'>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className='flex items-center gap-3 my-6'>
          <div className='flex-1 h-px bg-green-100'/><span className='text-sm text-gray-400'>or</span><div className='flex-1 h-px bg-green-100'/>
        </div>

        <div className='space-y-3'>
          <button onClick={handleGoogle}
            className='w-full py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition font-medium text-gray-700'>
            <span className='text-xl'>G</span> Continue with Google
          </button>
          <button onClick={handleFacebook}
            className='w-full py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition font-medium'>
            <span className='text-xl'>f</span> Continue with Facebook
          </button>
        </div>

        <p className='text-center text-sm text-gray-500 mt-6'>
          No account? <Link href='/signup' className='text-green-700 font-semibold hover:underline'>Create one</Link>
        </p>
      </div>
    </div>
  );
}
