'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name: username } },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setDone(true);
  };

  if (done) return (
    <div className='min-h-screen flex items-center justify-center bg-green-50 px-4'>
      <div className='bg-white rounded-3xl shadow-lg p-8 w-full max-w-md text-center'>
        <div className='text-5xl mb-4'>🌱</div>
        <h2 className='text-2xl font-bold text-green-900 mb-2'>Check your email!</h2>
        <p className='text-gray-600'>We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
        <Link href='/login' className='mt-6 inline-block text-green-700 font-semibold hover:underline'>Back to login</Link>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen flex items-center justify-center bg-green-50 px-4'>
      <div className='bg-white rounded-3xl shadow-lg p-8 w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-green-900'>🌿 Join PhytoScan</h1>
          <p className='text-green-700 mt-1'>Start your botanical journey</p>
        </div>
        {error && <div className='bg-red-50 text-red-700 rounded-xl p-3 mb-4 text-sm'>{error}</div>}
        <form onSubmit={handleSignup} className='space-y-4'>
          <input type='text' placeholder='Username' value={username}
            onChange={e => setUsername(e.target.value)} required
            className='w-full px-4 py-3 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-900' />
          <input type='email' placeholder='Email address' value={email}
            onChange={e => setEmail(e.target.value)} required
            className='w-full px-4 py-3 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-900' />
          <input type='password' placeholder='Password (min 6 characters)' value={password}
            onChange={e => setPassword(e.target.value)} required minLength={6}
            className='w-full px-4 py-3 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-900' />
          <button type='submit' disabled={loading}
            className='w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition disabled:opacity-50'>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className='text-center text-sm text-gray-500 mt-6'>
          Already have an account? <Link href='/login' className='text-green-700 font-semibold hover:underline'>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
